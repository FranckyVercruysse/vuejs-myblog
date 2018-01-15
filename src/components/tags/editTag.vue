<template>
    <div>
        <div class="mx-auto" style="max-width: 40rem;">
            <b-card title="Edit Tags">
                <create-tag></create-tag>
                <tag-list :tags="tags"></tag-list>
            </b-card> 
            <b-card-footer>
                <b-button @click="goback" variant="primary">go back</b-button>
            </b-card-footer>  
        </div>
    </div>
</template>
<script>
import TagList from './tagList';
import CreateTag from './createTag';

export default {
    components: {
        TagList,
        CreateTag,
    },
    methods:{
        goback: function(){
            this.$router.go(-1);
        }
    },
    computed: {
        tags(){
            return this.$store.getters.tags;
        },
    },
}
</script>

