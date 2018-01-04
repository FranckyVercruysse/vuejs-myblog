<template>
<div>
  <b-navbar toggleable="md" type="dark" variant="info" fixed="top">
    <b-navbar-brand href="#">NavBar</b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav >
        <b-nav-item to="/" exact>List Blogs</b-nav-item>
        <b-nav-item to="/add" exact>Add New Blog</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
        <b-nav-item href="#">
            <icon name="sign-in" scale="2" hcenter="true" style="vertical-align:middle" ></icon>
            Signin
        </b-nav-item>
        <b-nav-item href="#">
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
import Icon from 'vue-awesome/components/Icon';

export default {
    components: {
    Icon
  }
}
</script>

<style>
.fa-icon {
    margin-left: 10px;
    font-size: 300px;
    height: 30px;
    vertical-align: middle;
}
i {
    margin-left: 10px;
    font-size: 30px;
    height: 30px;
    vertical-align: middle;
}
</style>
