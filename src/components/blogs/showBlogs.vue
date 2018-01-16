<template>
  <div id="show-blogs">
    <h1>All Blog Articles</h1>
    <input type="text" v-model="search" placeholder="search blog" />
    <div v-for="blog in filteredBlogs" :key="blog.id" id="single-blog">
        <b-row>
            <b-col>
                <router-link :to="'/blog/'+blog.id"><h2>{{blog.title}}</h2></router-link>
            </b-col>
            <b-col>
                <router-link :to="'/edit/' + blog.id">
                    <icon name='pencil' scale="1"></icon>
                </router-link>
            </b-col>
        </b-row>
        <div>{{blog.content}}</div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons/pencil';
import Icon from 'vue-awesome/components/Icon';

export default {
  data () {
    return {
      search:''
    }
  },
  components:{
      Icon
  },
  created(){
      this.$store.dispatch('blogs')
  },
  computed : {
      filteredBlogs(){
          return this.$store.getters.blogs.filter((blog)=>blog.title.match(this.search));
      },
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
