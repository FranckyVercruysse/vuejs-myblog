import Vue from 'vue';
import Vuex, { mapGetters } from 'vuex';
// import Firebase from 'firebase';
import 'babel-polyfill'



import { firebase } from '@firebase/app';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    categories:[],
    tags:[],
    blogs:[],
    blog:{},
    blogToEdit:{ id:'', oldBlog : { title : '', content : '', category : '', tags : []},
                        newBlog : { title : '', content : '', category : '', tags : []}},
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
    setNewBlogToEdit(state,payload){
      state.blogToEdit.newBlog =payload;
    },
    newCategoryToOldCategory(state){
      state.categories.find(category => category.id === state.blogToEdit.oldBlog.category).posts
          =state.categories.find(category => category.id === state.blogToEdit.oldBlog.category)
            .posts.filter(post => post !== state.blogToEdit.id );
      
      state.categories
          .find(category => category.id === state.blogToEdit.newBlog.category)
          .posts.push(state.blogToEdit.id);
      state.blogToEdit.oldBlog.category = state.blogToEdit.newBlog.category;
    },
    newTagsToOldTags(state){    
      // remove the post blog ID from the tags array in the vuex-store for the previously selected tags
      let allTags = state.tags;
      allTags.forEach(allTag=>{
        state.tags.find(tag=> tag.id === allTag.id).posts
          = state.tags.find(tag => tag.id === allTag.id).posts.filter(post=>post!== state.blogToEdit.id); 
      });
      //  the postID may only appear in the posts array of the tags selected for this blog post
      state.blogToEdit.newBlog.tags.forEach(newTag =>{
        state.tags.find(tag => tag.id === newTag).posts.push(state.blogToEdit.id);
      });
      state.blogToEdit.oldBlog.tags = state.blogToEdit.newBlog.tags;
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
        oldBlog : {
          title : payload.data.title,
          content : payload.data.content,
          category : payload.data.category,
          tags: payload.data.tags ? payload.data.tags : []
        },
        newBlog :{
          title : payload.data.title,
          content : payload.data.content,
          category : payload.data.category,
          tags: payload.data.tags ? payload.data.tags : []
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
    updateBlog({getters,commit, dispatch}){
      const newBlogPost = {
        title: getters.blogToEdit.newBlog.title,
        content : getters.blogToEdit.newBlog.content,
        tags : getters.blogToEdit.newBlog.tags,
        category : getters.blogToEdit.newBlog.category
        }
      firebase.database().ref('posts/'+getters.blogToEdit.id).set(newBlogPost)
        .then(()=>{
            commit('setNewBlogToEdit',newBlogPost);
            dispatch('updateChangesToCategory');

            dispatch('updateChangesToTags');
          })
        .catch(error=>console.log(error));
    },
    //https://vuex.vuejs.org/en/actions.html
    updateChangesToCategory({getters,commit,dispatch}){
      // https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
      // Loop through posts in order with the forEach() method. The callback
      // provided to forEach() will be called synchronously with a DataSnapshot
      // for each child:

      const oldCategory = getters.blogToEdit.oldBlog.category;
      const newCategory = getters.blogToEdit.newBlog.category;
      if(oldCategory !== newCategory){
          firebase.database()
            .ref('categories/'+oldCategory+'/posts')
            .orderByKey()
            .once("value")
            .then(function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    if (childData === getters.blogToEdit.id){
                      firebase.database().ref('categories/' + oldCategory + '/posts/' + key).remove();
                    }
                });
              })
            .then(()=>{
                
                firebase.database()
                    .ref('categories/'+newCategory+'/posts')
                    .push(getters.blogToEdit.id);
                commit('newCategoryToOldCategory');
              })
        }
    },
    async checkDeleteCategoryConsistency({getters}, payload){
      let posts =[];
      getters.categories.find(category =>category.id==payload)
        .posts.forEach(post=>{
          posts.push(getters.blogs.find(blog=>blog.id==post).title);
        });
      return posts;
    },
    async checkDeleteTagConsistency({getters},payload){
      let posts = [];
      getters.tags.find(tag=>tag.id==payload)
        .posts.forEach(post=>{
          posts.push(getters.blogs.find(blog=>blog.id==post).title);
        });
      return posts;        
    },
    updateChangesToTags({getters,commit,dispatch}){
      let newTags = getters.blogToEdit.newBlog.tags;  //new selected tags
      let allTags = getters.tags;
      
      allTags.forEach((tag) => { 
          firebase.database()
                .ref('tags/' + tag.id +'/posts')
                .orderByKey()
                .once("value")
                .then(snapshot => {
                  let returnValues = [];
                  let returnValue = { tag : tag.id, blogID : '', blogIDinPostsArrayOfTag : false}
                  snapshot.forEach(childSnapshot => {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    returnValue.blogID = childData
                    returnValue.blogIDinPostsArrayOfTag = true;
                    if (childData === getters.blogToEdit.id){
                      if (newTags.indexOf(tag.id)==-1){ //if this tag is not selected for this BlogID
                        firebase.database().ref('tags/' + tag.id + '/posts/' + key).remove();
                      }
                    } 
                    returnValues.push(returnValue);
                  })
                  return returnValues;   //  Now, we know if the blogpost ID is in the posts array of this tag
                })
                .then((data)=>{
                  let blogIDinPostsArrayOfTag=false;
                  if (data.length >0){
                        let findInfo = data.find(item =>item.blogIDinPostsArrayOfTag && item.blogID==getters.blogToEdit.id && item.tag==tag.id);
                        blogIDinPostsArrayOfTag= findInfo === undefined ? false: findInfo.blogIDinPostsArrayOfTag;
                      }
                  if (newTags.indexOf(tag.id)!==-1 && !blogIDinPostsArrayOfTag ){
                      firebase.database().ref('tags/'+tag.id+'/posts').push(getters.blogToEdit.id);
                    }
                });
          })
          commit('newTagsToOldTags');
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
          if(obj.tags){
              obj.tags.forEach(tag => {
                const tagPost = {
                  tag: tag,
                  post: payload
                }
                context.dispatch('insertPostInTag',tagPost);  
              });
          } 
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
          const objCategories = data.val();
          for(let key in objCategories){
            const postarray=[];
            let objPostsOfACategory = objCategories[key].posts
            for(let keyPost in objPostsOfACategory ){
              postarray.push(objPostsOfACategory[keyPost]);
            }
            categories.push({
              id : key,   // id of the category
              name : objCategories[key].name,
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
          const objTags = data.val();
          for(let key in objTags){
            const postArray=[];
            let objPostsOfaTag = objTags[key].posts
            for(let postKey in objPostsOfaTag){
              postArray.push(objPostsOfaTag[postKey]);
            }
            tags.push({
              id:key,
              name:objTags[key].name,
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