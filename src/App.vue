<template>
  <div>
     <router-view></router-view>
  </div>
</template>

<script>
import AddBlog from './components/addBlog.vue';
import ShowBlogs from './components/showBlogs.vue';

export default {
  components : {
    'add-blog':AddBlog,
    'show-blogs':ShowBlogs
  },
  data () {
    return {
      
    }
  }
}
</script>

<style>
</style>
