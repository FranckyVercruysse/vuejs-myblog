import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import * as firebase from 'firebase';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import { store } from './store/store';
import Routes from './routes';
import BootstrapVue from 'bootstrap-vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.use(VueResource);


// Firebase config - this is provided when you create your app
// Swap out these settings for your project settings
var config = {
  apiKey: "AIzaSyAjuD6_Ebg4wcDsfgYqQaI6MP_s68ctKdU",
  authDomain: "my-blog-vue.firebaseapp.com",
  databaseURL: "https://my-blog-vue.firebaseio.com",
  projectId: "my-blog-vue",
  storageBucket: "my-blog-vue.appspot.com",
  messagingSenderId: "882331316796"
};

// Initialize Firebase
firebase.initializeApp(config);

// Set-up and use the Vue Router
// Pass in your routes and then
// Set the mode to use history
// removes # from the URL
Vue.use(VueRouter);

const router = new VueRouter(
  { 
    mode: 'history',
    routes: Routes
})

// Check before each page load whether the page requires authentication/
// if it does check whether the user is signed into the web app or
// redirect to the sign-in page to enable them to sign-in
router.beforeEach((to, from, next) => {

  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/sign-in');
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }

});

// Wrap the vue instance in a Firebase onAuthStateChanged method
// This stops the execution of the navigation guard 'beforeEach'
// method until the Firebase initialization ends
firebase.auth().onAuthStateChanged(function (user) {

  new Vue({
    el: '#app',
    store: store,
    router: router,         //router : router
    render: h => h(App)
  });
});

