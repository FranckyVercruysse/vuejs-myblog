<template>
  <div id="single-blog">
     <h1>{{blog.title}}</h1>
     <article>{{blog.content}}</article>
     <p>Category : {{blog.category}}</p>
     <ul>
       <li v-for="tag in blog.tags" :key="tag">
         {{tag}}
       </li>
     </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id:this.$route.params.id,
      blog:{}
    }
  },
  created(){
      this.$http.get('https://my-blog-vue.firebaseio.com/posts/'+ this.id +'.json')
        .then(function(data){
            return data.json();   // returns a promise object
        })
        .then(function(data){
          this.blog=data;
        })
  }
}
</script>

<style>
#single-blog{
  max-width: 960px;
  margin:0 auto;
}
</style>
