<template>
<div>
  <b-navbar toggleable="md" type="dark" variant="info" fixed="top">
    <b-navbar-brand href="#">NavBar</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav >
        <b-nav-item to="/" exact>List Blogs</b-nav-item>
        <b-nav-item to="/add" exact v-if="user">Add New Blog</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
        <b-nav-item to="/signin" v-if="!user">
            <icon name="sign-in" scale="2" hcenter="true"></icon>
            Signin
        </b-nav-item>
        <b-nav-item href="/signup" v-if="!user">
            <icon name="angle-up" scale="2" hcenter="true"></icon>
            Signup
        </b-nav-item>
        <b-nav-item v-on:click="signOut" v-if="user">
            <icon name="sign-out" scale="2"></icon>
            Signout</b-nav-item>
        </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import 'vue-awesome/icons/sign-out';
import 'vue-awesome/icons/sign-in';
import 'vue-awesome/icons/angle-up';
import Icon from 'vue-awesome/components/Icon';
import Firebase from "firebase";

export default {
  components: {
    Icon
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    signOut: function() {
      Firebase.auth()
        .signOut()
        .then(() => {
          this.$router.replace('signin');
        });
    }
  }
}
</script>

<style scoped>
.fa-icon {
    margin-left: 10px;
    font-size: 300px;
    height: 30px;
    vertical-align: middle;
}
</style>
