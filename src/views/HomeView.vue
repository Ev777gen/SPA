<template>
  <div v-if="isAsyncDataLoaded" class="home">
    <h1 class="title">Добро пожаловать на форум!</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList';
import { mapActions } from 'vuex';
export default {
  name: 'HomeView',
  components: { CategoryList },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    isAsyncDataLoaded() {
      return this.$store.state.isLoaded;
    },
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums', 'startLoadingIndicator', 'stopLoadingIndicator'])
  },
  async created () {
    this.startLoadingIndicator();
    const categories = await this.fetchAllCategories();
    const forumIds = categories.map(category => category.forumIds).flat();
    await this.fetchForums({ ids: forumIds });
    this.stopLoadingIndicator();
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
</style>