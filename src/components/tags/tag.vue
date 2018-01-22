<template>
    <div>
        <b-list-group-item>
            <span>{{tag.name}}</span>
            <span class="float-right mr-0 mr-sm-5" @click="deleteTag(tag)">
                <icon name="trash"></icon>
                <b-modal :id="tag.id" title="Delete Tag" size="sm" ok-title="confirm delete" @ok="deleteTagConfirmed(tag)" >
                        <p class="my-4">Are you sure you want to delete this item?</p>
                </b-modal>
                <b-modal :id="'not-allowed'+tag.id" title="Delete Tag not allowed" size="sm" ok-only>
                        {{message}}
                        <ul>
                            <li v-for="(title,index) in postTitles" :key="`title-${index}`">{{title}}</li>
                        </ul>
                </b-modal>
            </span>
            <span class="float-right mr-4 mr-sm-5" @click="showForm(tag)"><icon name="pencil"></icon></span>
        </b-list-group-item>
        <div v-show="isEditing">
            <input type="text" v-model="newTag">
            <b-button variant="primary" size="sm" class="mr-3" @click="saveTag(tag)">save</b-button>
            <b-button variant="primary" size="sm" @click="cancelEdit">cancel</b-button>
        </div>
    </div>    
</template> 
<script>
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/trash';
import Icon from 'vue-awesome/components/Icon';

export default {
    props: ['tag'],
    data(){
        return {
            isEditing : false,
            newTag:'',
            payload : {
                oldTag:{},
                newTag:{}
            },
            message:'',
            postTitles : [],
        }
    },
    components:{
        Icon
    },
    methods:{
        deleteTag(tag){
             this.$store.dispatch('checkDeleteTagConsistency',tag.id)
                .then(data =>{
                    if(data.length==0){
                        this.$root.$emit('bv::show::modal',tag.id);
                    }
                    else{
                        if (data.length==1){
                            this.message = 'there is '+ data.length +' blog post that belongs to this tag :'
                        }
                        else {
                            this.message = 'there are '+ data.length +' blog posts belonging to this tag :'
                        }
                        this.postTitles = data;
                        this.$root.$emit('bv::show::modal','not-allowed'+tag.id);
                    }
                })
        },
        deleteTagConfirmed(tag){
            this.$store.dispatch('deleteTag',tag);
        },
        showForm(tag){
            this.isEditing = true;
            this.payload = { oldTag: tag, newTag : { id: tag.id, name:tag.name,posts:tag.posts}};
            this.newTag = this.payload.oldTag.name;
        },
        cancelEdit(){
            this.isEditing=false;
        },
        saveTag(tag){
            this.isEditing=false;
            this.payload.newTag.name=this.newTag.replace(/^\s+|\s+$/gm,''); //remove whitespaces from both sides of a string
            if(this.payload.newTag.name!==this.payload.oldTag.name){
                this.$store.dispatch('saveTag', this.payload);
            }
            this.newTag='';
        }
    }
}
</script>

