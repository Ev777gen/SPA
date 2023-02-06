<template>
  <div class="home">
    <h1 class="title">Добро пожаловать на форум!</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'

export default {
  name: 'HomeView',
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories;
    }
  },
}
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
</style>