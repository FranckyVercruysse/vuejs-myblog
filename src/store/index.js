import Vue from 'vue';
import Vuex from 'vuex';
// import Firebase from 'firebase';
import { firebase } from '@firebase/app';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    categories:[],
    tags:[],
    blogs:[],
    blog:{},
    blogToEdit:{
      id:'',
      oldBlog : {},
      newBlog : {
        title : '',
        content : '',
        category : '',
        tags : []
      }
    },
    submitted:false,
  },
  getters: {
    getUser: state => state.user,
    blog: state => state.blog,
    blogToEdit : state => state.blogToEdit,
    submitted: state => state.submitted,
    categories: state=> state.categories,
    tags: state=> state.tags,
    blogs : state=> state.blogs,
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLoadedCategories(state,payload){
      state.categories=payload;
    },
    insertPostInCategory(state,payload){
      if((state.categories.find(category=>category.id == payload.cat)).posts===undefined){
        (state.categories.find(category=>category.id == payload.cat)).posts=[];
      }
      (state.categories.find(category=>category.id==payload.cat)).posts.push(payload.post);
    },
    insertPostInTag(state,payload){
      if((state.tags.find(tag=>tag.id == payload.tag)).posts===undefined){
        (state.tags.find(tag=>tag.id == payload.tag)).posts=[];
      }
      (state.tags.find(tag=>tag.id == payload.tag)).posts.push(payload.post);
    },
    setSubmitted(state,payload){
      state.submitted=payload;
    },
    setLoadedTags(state,payload){
      state.tags=payload;
    },
    blogs: (state, payload) =>{
      state.blogs = payload;
    },
    blog(state, payload){
      state.blog =payload;
    },
    blogToEdit(state, payload){
      state.blogToEdit = {
        id : payload.id,
        oldBlog : payload.data,
        newBlog :{
          title : payload.data.title,
          content : payload.data.content,
          category : payload.data.category,
          tags: payload.data.tags
        }
      }
    },
    createCategory: (state,payload)=>{
      state.categories.push(payload);
    },
    deleteCategory: (state,payload)=>{
      let index = state.categories.indexOf(payload);
      state.categories.splice(index,1);
    },
    saveCategory : (state, payload) =>{
      let index = state.categories.indexOf(payload.oldCategory);
      state.categories.splice(index,1, payload.newCategory);
    },
    createTag: (state,payload)=>{
      state.tags.push(payload);
    },
    deleteTag: (state,payload)=>{
      let index = state.tags.indexOf(payload);
      state.tags.splice(index,1);
    },
    saveTag : (state, payload) =>{
      let index = state.tags.indexOf(payload.oldTag);
      state.tags.splice(index, 1, payload.newTag);
    },
  },
  actions: {
    setUser : context => {
      const user = Firebase.auth().currentUser;
      context.commit('setUser',user);
    },
    autoSignIn (context, payload) {
      context.commit('setUser', {
        id: payload.uid,
        name: payload.displayName,
        email: payload.email,
        photoUrl: payload.photoURL
      })
    },
    signOut (context) {
      firebase.auth().signOut()
        .then(()=>{ 
          context.commit('setUser',null);
        })
    },
    blogs(context) {
        Vue.http.get('https://my-blog-vue.firebaseio.com/posts.json')
        .then(data =>  data.json())
        .then(data => {
            var blogsArray=[];
            for(let key in data){ //data is the global (overall) object
              data[key].id=key;
              blogsArray.push(data[key]);
            }
            context.commit('blogs',blogsArray);
          })
    },
    blog(context, payload) {
      Vue.http.get('https://my-blog-vue.firebaseio.com/posts/'+ payload +'.json')
        .then(function(data){
            return data.json();   // returns a promise object
        })
        .then(function(data){
          context.commit('blog',data)
        })
    },
    blogToEdit(context, payload) {
      Vue.http.get('https://my-blog-vue.firebaseio.com/posts/'+ payload +'.json')
        .then(function(data){
            return data.json();   // returns a promise object
        })
        .then(function(data){
          context.commit('blogToEdit',{data :data, id:payload})
        })
    },
    updateBlog({context,getters}){
      // console.log('TEST')
      // console.log(getters.blogToEdit.id);
      
      var db = firebase.database();   //state.blogToEdit
      var ref = db.ref('posts/'+getters.blogToEdit.id);
      ref.set({
        title: 'xxxxx',
      });

      var db = firebase.database().ref('posts/'+getters.blogToEdit.id).set({
        title: getters.blogToEdit.newBlog.title,
        content : getters.blogToEdit.newBlog.content,
        tags : getters.blogToEdit.newBlog.tags,
        category : getters.blogToEdit.newBlog.category
        })
        .then((data)=>{
            console.log('success');
          })
        .catch(error=>console.log(error));
    },
    createBlog(context, payload){
      Vue.http.post('https://my-blog-vue.firebaseio.com/posts.json', payload)
                .then(data => {
                    context.dispatch('setSubmitted',true);
                    context.dispatch('addPostToCategoryToTag',data.body.name)
                });
    },
    addPostToCategoryToTag(context,payload){ 
      firebase.database().ref('posts/'+payload).once('value')
        .then(data=>{
          const obj = data.val();
          const catPost = {
            cat: obj.category,
            post : payload
          }
          context.dispatch('insertPostInCategory',catPost);
          obj.tags.forEach(tag => {
            const tagPost = {
              tag: tag,
              post: payload
            }
            context.dispatch('insertPostInTag',tagPost);  
          });
        })
    },
    insertPostInTag(context,payload){
      firebase.database().ref('tags/'+payload.tag+'/posts').push(payload.post)
        .then(data=>{
          context.commit('insertPostInTag',payload);
        })
    },
    insertPostInCategory(context,payload){
      firebase.database().ref('categories/'+payload.cat+'/posts').push(payload.post)
        .then(data=>{
          context.commit('insertPostInCategory',payload);
        })
    },
    setSubmitted(context,payload){
      context.commit('setSubmitted',payload);
    },
    createCategory(context, payload) {
      firebase.database().ref('categories').push(payload)
        .then(data=>{
          const key = data.key;
          context.commit('createCategory',{
            ...payload,
            id : key
          })
        })
        .catch(error=>console.log(error))
    },
    createTag(context, payload) {
      firebase.database().ref('tags').push(payload)
        .then(data=>{
          const key = data.key;
          context.commit('createTag',{
            ...payload,
            id : key,
          })
        })
        .catch(error=>console.log(error))
    },
    loadCategories(context){
      firebase.database().ref('categories').once('value')
        .then(data=>{
          const categories=[];
          const obj = data.val();
          for(let key in obj){
            const postarray=[]
            for(let post in obj[key].posts ){
              postarray.push(post);
            }
            categories.push({
              id : key,
              name : obj[key].name,
              posts : postarray
            })
          }
          context.commit('setLoadedCategories', categories);
        })
        .catch(error=>{console.log(error)})
    }, 
    loadTags(context){
      firebase.database().ref('tags').once('value')
        .then(data=>{
          const tags=[];
          const obj = data.val();
          for(let key in obj){
            const postArray=[];
            for(let post in obj[key].posts){
              postArray.push(post);
            }
            tags.push({
              id:key,
              name:obj[key].name,
              posts: postArray
            })
          }
          context.commit('setLoadedTags', tags);
        })
        .catch(error=>{console.log(error)})
    }, 
    deleteCategory: (context,payload)=>{
      firebase.database().ref('categories/'+ payload.id).remove()
        .then(()=>{context.commit('deleteCategory',payload);})
        .catch(error=>{console.log(error)})
    },
    saveCategory : (context, payload)=>{
      let catToUpdate = { 
          name: payload.newCategory.name, 
          posts: payload.newCategory.posts !== undefined? payload.newCategory.posts : []
         }
      firebase.database().ref('categories/'+ payload.newCategory.id).update(catToUpdate)
        .then(()=>{context.commit('saveCategory', payload);})
        .catch(error=>{console.log(error)})
    },
    deleteTag: (context,payload)=>{
      firebase.database().ref('tags/'+ payload.id).remove()
        .then(()=>{context.commit('deleteTag',payload);})
        .catch(error=>{console.log(error)})
    },
    saveTag : (context, payload)=>{
      let tagToUpdate = {
        name: payload.newTag.name,
        posts: payload.newTag.posts !== undefined ? payload.newTag.posts : []
      }
      firebase.database().ref('tags/'+ payload.newTag.id).update(tagToUpdate)
        .then(()=>{context.commit('saveTag', payload);})
        .catch(error=>{console.log(error)})
    }
  }
});