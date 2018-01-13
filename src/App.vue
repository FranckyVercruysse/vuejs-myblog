<template>
  <div>
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import addBlog from './components/addBlog.vue';
import showBlogs from './components/showBlogs.vue';
import header from './components/header.vue';


export default {
  components : {
    'add-blog':addBlog,
    'show-blogs':showBlogs,
    'app-header': header
  },
  data () {
    return {
      
    }
  },
  methods:{
    // setUser: function() {
    //   console.log('setUser');
    //   this.$store.dispatch('setUser');
    // },
    validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
    },
    checkPassword(password) {  
            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;  
            return re.test(password)
    },
    invalidFeedbackPassword(password){
            if (password.length >0){
                if (this.checkPassword(password)){
                    return '';
                }
                else {
                    return 'Password not valid, keep trying .../password must be at least 8 characters long, must contain a lowercase letter, a capital letter and a number.'
                }
            }
        },
    invalidFeedbackEmail (email) {
            return email.length == 0 ? '' : this.validateEmail(email) ? '':'Email not valid, keep trying ...'       
    }
  },
  // created(){
  //   // when the app is created run the set user method
  //   // this uses Vuex to check if a user is signed in
  //   // check out mutations in the store.js file
  //   this.setUser();
  // }
}
</script>

<style>
body {
  margin-top: 5em
}
.valid-feedback {
    color:yellow!important;
    background-color: seagreen;
}
.invalid-feedback {
    color: white!important;
    background-color: darkred;
} 
</style>
