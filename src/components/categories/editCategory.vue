<template>
    <div>
        <div class="mx-auto" style="max-width: 40rem;">
            <b-card title="Edit Categories">
                <create-category></create-category>
                <category-list v-bind:categories="categories"></category-list>
            </b-card> 
            <b-card-footer>
                <b-button @click="goback" variant="primary">go back</b-button>
            </b-card-footer>  
        </div>
    </div>
</template>
<script>
import CategoryList from './categoryList';
import CreateCategory from './createCategory';

export default {
    components: {
        CategoryList,
        CreateCategory,
    },
    methods:{
        goback: function(){
            this.$router.go(-1);
        }
    },
    computed: {
        categories(){
            return this.$store.getters.categories;
        },
    },
}
</script>

