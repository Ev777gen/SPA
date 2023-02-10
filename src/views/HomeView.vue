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
  data() {
    return { isAsyncDataLoaded: false };
  },
  computed: {
    categories () {
      return this.$store.state.categories;
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  async created () {
    const categories = await this.fetchAllCategories();
    const forumIds = categories.map(category => category.forumIds).flat();
    await this.fetchForums({ ids: forumIds });
    this.isAsyncDataLoaded = true;
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
</style>