<template>
  <div id="show-blogs">
    <h1>All Blog Articles</h1>
    <input type="text" v-model="search" placeholder="search blog" />
    <div v-for="blog in filteredBlogs" :key="blog.id" id="single-blog">
        <router-link v-bind:to="'/blog/'+blog.id"><h2>{{blog.title}}</h2></router-link>
        <div>{{blog.body}}</div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      blogs:[],
      search:''
    }
  },
  created(){
      this.$http.get('https://jsonplaceholder.typicode.com/posts')
        .then(function(data){
            console.log(data.body);
            this.blogs=data.body.slice(0,10);
      })
  },
  computed : {
      filteredBlogs : function(){
      return this.blogs.filter((blog) => {
          return blog.title.match(this.search);
        });
    } 
  }
  
}
</script>

<style>
#show-blogs{
    max-width: 800px;
    margin:0 auto;
}
#single-blog{
    padding: 20px;
    margin: 20px 0;
    box-sizing: border-box;
    background:#eee;
}
</style>
