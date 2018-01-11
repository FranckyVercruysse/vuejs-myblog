<template>
    <b-list-group flush>
        <tag v-for="(tag,index) in tags" :key="`tag-${index}`" :tag.sync="tag"></tag>
    </b-list-group>
</template>
<script>
import Tag from './tag';

export default {
  props: ['tags'],
  components: {
    Tag,
  },
}
</script>

