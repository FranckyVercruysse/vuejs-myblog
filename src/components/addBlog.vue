<template>
  <div id="add-blog">
    <h2>Add a new blog post</h2>
    <form>
        <label>Blog Title</label>
        <input type="text" v-model.lazy="blog.title" required />
        <label>Blog Content</label>
        <textarea v-model.lazy="blog.content"></textarea>
        <label>Category :</label>
        <select v-model="blog.category">
            <option v-for="category in categories">{{category}}</option>
        </select>
        <div id="checkboxes">
            <label>Angular</label>
            <input type="checkbox" value="Angula" v-model="blog.tags" />
            <label>Vue.js</label>
            <input type="checkbox" value="Vue.js" v-model="blog.tags" />
            <label>Asp.NET</label>
            <input type="checkbox" value="Asp.NET" v-model="blog.tags" />
            <label>MongoDB</label>
            <input type="checkbox" value="MongoDB" v-model="blog.tags" />
            <label>Firebase</label>
            <input type="checkbox" value="Firebase" v-model="blog.tags" />
        </div>
    </form>
    <div id="preview">
        <h3>Preview Blog</h3>
        <p>Blog Title : {{blog.title}}</p>
        <p>Blog Content</p>
        <p>{{blog.content}}</p>
        <p>Category : {{blog.category}}</p>
        <p>Blog Tags :</p>
        <ul>
            <li v-for="tag in blog.tags">{{tag}}</li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      blog:{
          title:'',
          content:'',
          tags:[],
          category:''
      },
      categories : ['Web Development','Gaming','Travelling','Science']
    }
  }
}
</script>

<style>
#add-blog *{
    box-sizing: border-box;
}
#add-blog{
    margin: 20px auto;
    max-width: 500px;
}
label{
    display: block;
    margin: 20px 0 10px;
}
input[type="text"], textarea{
    display: block;
    width: 100%;
    padding: 8px;
}
#preview{
    padding: 10px 20px;
    border: 1px dotted #ccc;
    margin: 30px 0;
}
h3{
    margin-top: 10px;
}

#checkboxes input{
    display: inline-block;
    margin-right: 10px;
}

#checkboxes label{
    display:inline-block;
}
</style>
