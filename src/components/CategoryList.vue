<template>
  <div class="category"
    v-for="category in categories"
    :key="category.id"
  >
    <h2 class="category__title subtitle">{{ category.name }}</h2>
    <ForumList :forums="getForumsForCategory(category)" />
  </div>
</template>

<script>
import ForumList from '@/components/ForumList'

export default {
  components: { ForumList },
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.category__title {
  width: 100%;
  padding: 10px 5px;
  margin: 0;
  background-color: #23374d;
  color: #fefefe;
  font-weight: 100;
  a:hover {
    color: #89c6af;
  }
}
</style>
