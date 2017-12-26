<template>
  <div>
    <show-blogs></show-blogs>
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
