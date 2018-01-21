<template>
    <div>
        <b-card class="mx-auto" 
            style="max-width: 60rem;"
            title="Add a new blog post"
            v-if="!submitted"
            >
        <div class="card-body">
            <b-form @reset.prevent="onReset" v-if="show">
            <b-form-group id="exampleInputGroup1"
                            label="Blog Title"
                            label-for="exampleInput1">
                <b-form-input id="exampleInput1"
                            type="text"
                            v-model.lazy="blog.title" 
                            required
                            placeholder="Enter title">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroupX"
                            label="Add a new blog content :"
                            label-for="textarea1">
                    <b-form-textarea id="textarea1"
                            v-model.lazy="blog.content"
                            placeholder="Enter something"
                            :rows="3"
                            :max-rows="6">
                    </b-form-textarea> 
            </b-form-group>
            <b-row>
                    <b-col>
                        <b-form-group id="exampleInputGroup3"
                                        label="Category :"
                                        label-for="exampleInput3">
                            <b-form-select id="exampleInput3"
                                        required
                                        v-model="blog.category"
                                        :options="categories"
                                        text-field="name"
                                        value-field="id"
                                        >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                            <router-link to="/editCategory">
                                <icon name='pencil' scale="1"></icon>
                            </router-link>
                    </b-col>
            </b-row>
            <b-row>
                    <b-col>
                        <b-form-group label="Tags :">
                            <b-form-checkbox-group id="checkboxes1" name="flavour1" v-model="blog.tags" :options="tags" text-field="name" value-field="id">
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <router-link to="/editTag">
                                <icon name='pencil' scale="1"></icon>
                        </router-link>
                    </b-col>
            </b-row>
            <b-button v-on:click.prevent="createBlog" variant="primary">Add Blog</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
        </div>
        <div id="preview" class="card-body">
                <h3>Preview Blog</h3>
                <p>Blog Title : {{blog.title}}</p>
                <p>Blog Content</p>
                <p>{{blog.content}} </p>
                <p>Category : <span v-if="this.blog.category">{{getCategory(this.blog.category).name}} id= {{getCategory(this.blog.category).id}} </span> </p> 
                <p>Blog Tags :</p>
                <ul>
                    <li v-for="(tag,index) in blog.tags" :key="`tag-${index}`">{{getTag(tag).name}} </li>
                </ul>
            </div>
        </b-card>
        <div v-if="submitted">
            <b-alert variant="success"> Blog post successfully added
            </b-alert>
            <b-btn @click="addAnotherBlogpost" variant="info" class="m-1">
                Add Another Blogpost
            </b-btn>
        </div>
    </div>
</template>

<script>
import 'vue-awesome/icons/pencil';
import Icon from 'vue-awesome/components/Icon';

export default {
  components: {
    Icon
  },
  data () {
    return {
      show: true,
      blog:{
          title:'',
          content:'',
          tags:[],
          category:'',
      },
      click_counts:1,
    }
  },
  computed:{
      categories(){
          return this.$store.getters.categories;
      },
      tags(){
          return this.$store.getters.tags;
      },
      submitted(){
          return this.$store.getters.submitted;
      }
  },
  methods : {
    onReset () {
      /* Reset our form values */
      this.blog.title = '';
      this.blog.content = '';
      this.blog.tags = [];
      this.blog.category = '';
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.click_counts=1;
      this.$nextTick(() => { this.show = true });
    },
    addAnotherBlogpost(){
          this.onReset();
          this.$store.dispatch('setSubmitted',false);
    },
    createBlog(){
        // prevent double clicking a button
        // terminate the function
        // if an async request is processing
        if (this.click_counts++ > 1) {
            console.log('return : '+this.click_counts);
            return;
        }
        console.log('before create Blog (payload) :')
        console.log(this.blog);
        this.$store.dispatch('createBlog',this.blog);

    },
    getTag(id){
        return this.tags.filter(tag=>tag.id ==id )[0] //tags is the computed property
    },
    getCategory(id){
        return this.categories.filter(category=>category.id==id)[0]; // categories is the computed property
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