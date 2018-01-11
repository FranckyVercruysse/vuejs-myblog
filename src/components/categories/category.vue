<template>
    <div>
        <b-list-group-item>
            <span>{{category}}</span>
            <span class="float-right mr-0 mr-sm-5" @click="deleteCategory(category)">
                <icon name="trash"></icon>
                <b-modal :id="category" title="Delete Category" size="sm" @ok="deleteCategoryConfirmed(category)" >
                        <p class="my-4">Are you sure you want to delete this item?</p>
                </b-modal>
            </span>
            <span class="float-right mr-4 mr-sm-5" @click="showForm(category)"><icon name="pencil"></icon></span>
        </b-list-group-item>
        <div v-show="isEditing">
            <input type="text" v-model="payload.newCategory">
            <b-button variant="primary" size="sm" class="mr-3" @click="saveCategory(category)">save</b-button>
            <b-button variant="primary" size="sm" @click="cancelEdit">cancel</b-button>
        </div>
        
    </div>    
</template> 
<script>
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/trash';
import Icon from 'vue-awesome/components/Icon';

export default {
    props: ['category'],
    data(){
        return {
            isEditing : false,
            payload : {
                oldCategory:'',
                newCategory:''
            }
        }
    },
    components:{
        Icon
    },
    methods:{
        deleteCategory(category){
            this.$root.$emit('bv::show::modal',category);
        },
        deleteCategoryConfirmed(category){
            this.$store.dispatch('deleteCategory',category);
        },
        showForm(category){
            this.isEditing = true;
            this.payload = { oldCategory: category, newCategory:category};
        },
        cancelEdit(){
            this.isEditing=false;
        },
        saveCategory(category){
            this.isEditing=false;
            this.$store.dispatch('saveCategory', this.payload);
        }
    }
}
</script>

