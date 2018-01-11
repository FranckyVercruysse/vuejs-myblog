<template>
    <b-list-group flush>
        <category v-for="(category,index) in categories" :key="`category-${index}`" :category.sync="category"></category>
    </b-list-group>
</template>
<script>
import Category from './category';

export default {
  props: ['categories'],
  components: {
    Category,
  },
}
</script>

