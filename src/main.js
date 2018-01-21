import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import * as firebase from 'firebase';
import config from './config'
import VueResource from 'vue-resource';
import { store } from './store';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(Vuex)
Vue.use(BootstrapVue);
Vue.use(VueResource);

new Vue({
      el: '#app',
      store,
      router,         
      render: h => h(App),
      created () {
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.$store.dispatch('autoSignIn', user);
            }
        })
      },
});
