import Vue from 'vue';
import Vuex from 'vuex';
import Firebase from 'firebase';
import { firebase } from '@firebase/app';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    categories:[],
    // categories : [{id:"1",name:'Web Development',posts:["1","3"]}
    //               ,{id:"2", name:'Gaming',posts:["2","4"]},
    //               {id:"3",name:'Travelling',posts:["5"]},
    //               {id:"4",name:'Science'}],
    tags:[],
    // tags:[{id:"1",name:'Angular', posts:["1","2"]},{id:"2",name:'Vue.js'},{id:"3",name:'ASP.NET'},
    //             {id:"4",name:'MongoDB'},{id:"5",name:'Firebase'}],
    blogs:[],
    submitted:false,
  },
  getters: {
    getUser: state => state.user,
    submitted: state => state.submitted,
    categories: state=> state.categories,
    tags: state=> state.tags,
    blogs : state=> state.blogs,
  },
  mutations: {
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoadedCategories(state,payload){
      state.categories=payload;
    },
    insertPostInCategory(state,payload){
      // state.categories.filter(category=>category.id==payload.cat)[0].posts.push(payload.post);
      console.log('cat posts');
      if((state.categories.find(category=>category.id == payload.cat)).posts===undefined){
        console.log('undefined');
        (state.categories.find(category=>category.id == payload.cat)).posts=[];
      }
      (state.categories.find(category=>category.id==payload.cat)).posts.push(payload.post);
      // console.log(state.categories.find(category=>category.id==payload.cat)[0]);
    },
    insertPostInTag(state,payload){
      // state.tags.filter(tag=>tag.id == payload.tag)[0].posts.push(payload.post);
      console.log('tag posts');
      if((state.tags.find(tag=>tag.id == payload.tag)).posts===undefined){
        console.log('undefined');
        (state.tags.find(tag=>tag.id == payload.tag)).posts=[];
      }
      
      (state.tags.find(tag=>tag.id == payload.tag)).posts.push(payload.post);
      // console.log(state.tags.find(tag=>tag.id == payload.tag)[0])
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
    blogs : context =>{
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
            console.log('postarray :');
            console.log(postarray);
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
      console.log('loadTags');
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