<template>
    <div class="mx-auto" style="max-width: 40rem;">
        <b-card no-body v-show="!isCreating">
            <div class="float-right">
                <div v-on:click="openform" class="float-right mr-1 mr-sm-5 pr-1 pr-sm-2">
                    <icon name="plus" id="plus" scale="2" v-on:click="openform"></icon>
                </div>
            </div>
        </b-card>   
        <b-card v-show="isCreating" title="Create Category" class="text-center">
            <b-card-body>
                <input type="text" v-model="newCategory.name">
            </b-card-body>
            <b-card-footer>
                <b-button variant="primary" @click="sendform">Create</b-button>
                <b-button variant="primary" @click="closeform">Cancel</b-button>
            </b-card-footer>
        </b-card>
    </div>
</template>

<script>
import 'vue-awesome/icons/plus';
import Icon from 'vue-awesome/components/Icon';

export default {
    components:{
        Icon
    },
    data(){
        return {
            newCategory:{},
            isCreating: false,
        }
    },
    methods:{
        openform(){
            this.isCreating=true;
        },
        closeform(){
            this.isCreating=false;
        },
        sendform(){
            this.$store.dispatch('createCategory',this.newCategory);
            this.newCategory={};
            this.isCreating=false;
        }
    }
  
}
</script>
<style>
.fa-icon#plus {
    width: auto;
    height: 3rem; /* or any other relative font sizes */

    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
}
</style>



