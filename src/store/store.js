import Vue from 'vue';
import Vuex from 'vuex';
import Firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    categories : ['Web Development','Gaming','Travelling','Science'],
    tags:['Angular','Vue.js','ASP.NET','MongoDB','Firebase'],
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
    setUser: state => {
      state.user = Firebase.auth().currentUser;
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
      context.commit('setUser');
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
    createCategory: (context, payload) => {
      context.commit('createCategory', payload)
    },
    deleteCategory: (context,payload)=>{
      context.commit('deleteCategory',payload);
    },
    saveCategory : (context, payload)=>{
      context.commit('saveCategory', payload);
    },
    createTag: (context, payload) => {
      context.commit('createTag', payload)
    },
    deleteTag: (context,payload)=>{
      context.commit('deleteTag',payload);
    },
    saveTag : (context, payload)=>{
      context.commit('saveTag', payload);
    }
  }
});