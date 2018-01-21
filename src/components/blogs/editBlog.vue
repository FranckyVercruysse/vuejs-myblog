<template>
    <div>
        <b-card class="mx-auto" 
            style="max-width: 60rem;"
            title="Update blog post">
            <div class="card-body">
                <b-form>
                    <b-form-group id="exampleInputGroup1"
                                    label="Title :"
                                    label-for="exampleInput1">
                        <b-form-input id="exampleInput1"
                                    v-model="blogToEdit.newBlog.title"
                                    required
                                    placeholder="Title">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group id="exampleInputGroup2"
                                    label="Content:"
                                    label-for="exampleInput2">
                        <b-form-textarea id="exampleInput2"
                                    v-model="blogToEdit.newBlog.content"
                                    required
                                    placeholder="Content"
                                    :rows="6"
                                    :max-rows="9">
                        </b-form-textarea>
                    </b-form-group>
                    <b-form-group id="exampleInputGroup3"
                                                label="Category :"
                                                label-for="exampleInput3">
                                    <b-form-select id="exampleInput3"
                                                required
                                                v-model="blogToEdit.newBlog.category"
                                                :options="categories"
                                                text-field="name"
                                                value-field="id"
                                                >
                                    </b-form-select>
                    </b-form-group>
                    <b-form-group label="Tags :">
                                    <b-form-checkbox-group id="checkboxes1" 
                                            name="flavour1" 
                                            v-model="blogToEdit.newBlog.tags" 
                                            :options="tags" 
                                            text-field="name" 
                                            value-field="id">
                                    </b-form-checkbox-group>
                    </b-form-group>
                    <b-button v-on:click.prevent="updateBlog" variant="primary">Update</b-button>
                    <b-button @click="goback" variant="danger">Cancel</b-button>
                </b-form>
            </div>
        </b-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      id:this.$route.params.id,
    }
  },
  computed : {
      blogToEdit(){
          return this.$store.getters.blogToEdit;
      },
      categories(){
          return this.$store.getters.categories;
      },
      tags(){
          return this.$store.getters.tags;
      },
  },
  methods:{
      updateBlog(){
          this.$store.dispatch('updateBlog');
      },
      goback: function(){
            this.$router.go(-1);
      }
  },
  created(){
      this.$store.dispatch('blogToEdit',this.id);
  }
}
</script>
