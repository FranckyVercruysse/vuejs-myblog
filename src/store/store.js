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
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    categories: state=>{
      return state.categories;
    },
    tags: state=>{
      return state.tags;
    },
    blogs : state=>{
      return state.blogs;
    },
  },
  mutations: {
    setUser: (state, payload) => {
      console.log('mutations set user !')
      state.user = payload;
    },
    setLoadedCategories(state,payload){
      state.categories=payload;
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
    }
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
            id : key
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
            categories.push({
              id:key,
              name:obj[key].name,
              posts: obj[key].posts
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
            tags.push({
              id:key,
              name:obj[key].name,
              posts: obj[key].posts
            })
          }
          context.commit('setLoadedTags', tags);
        })
        .catch(error=>{console.log(error)})
    }, 
    deleteCategory: (context,payload)=>{
      context.commit('deleteCategory',payload);
    },
    saveCategory : (context, payload)=>{
      context.commit('saveCategory', payload);
    },
    deleteTag: (context,payload)=>{
      context.commit('deleteTag',payload);
    },
    saveTag : (context, payload)=>{
      context.commit('saveTag', payload);
    }
  }
});