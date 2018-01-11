<template>
    <div>
        <b-list-group-item>
            <span>{{tag}}</span>
            <span class="float-right mr-0 mr-sm-5" @click="deleteTag(tag)">
                <icon name="trash"></icon>
                <b-modal :id="tag" title="Delete Tag" size="sm" @ok="deleteTagConfirmed(tag)" >
                        <p class="my-4">Are you sure you want to delete this item?</p>
                </b-modal>
            </span>
            <span class="float-right mr-4 mr-sm-5" @click="showForm(tag)"><icon name="pencil"></icon></span>
        </b-list-group-item>
        <div v-show="isEditing">
            <input type="text" v-model="payload.newTag">
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
            payload : {
                oldTag:'',
                newTag:''
            }
        }
    },
    components:{
        Icon
    },
    methods:{
        deleteTag(tag){
            this.$root.$emit('bv::show::modal',tag);
        },
        deleteTagConfirmed(tag){
            this.$store.dispatch('deleteTag',tag);
        },
        showForm(tag){
            this.isEditing = true;
            this.payload = { oldTag: tag, newTag : tag};
        },
        cancelEdit(){
            this.isEditing=false;
        },
        saveTag(tag){
            this.isEditing=false;
            this.$store.dispatch('saveTag', this.payload);
        }
    }
}
</script>

