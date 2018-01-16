import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import * as firebase from 'firebase';
import VueResource from 'vue-resource';
import { store } from './store';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.use(VueResource);

// Firebase config - this is provided when you create your app
var config = {
  apiKey: "AIzaSyAjuD6_Ebg4wcDsfgYqQaI6MP_s68ctKdU",
  authDomain: "my-blog-vue.firebaseapp.com",
  databaseURL: "https://my-blog-vue.firebaseio.com",
  projectId: "my-blog-vue",
  storageBucket: "my-blog-vue.appspot.com",
  messagingSenderId: "882331316796"
};

new Vue({
      el: '#app',
      store,
      router,         
      render: h => h(App),
      created () {
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            console.log('main.js created onAuthStateChanged :');
            console.log(user);
            if (user) {
              this.$store.dispatch('autoSignIn', user);
            }
        })
      },
});
