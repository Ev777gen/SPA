<template>
  <div v-if="asyncDataStatus_isReady" class="home">
    <h1 class="title">Добро пожаловать на форум!</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList';
import { mapActions } from 'vuex';
import asyncDataStatus from '@/mixins/asyncDataStatus';
export default {
  name: 'HomeView',
  components: { CategoryList },
  mixins: [asyncDataStatus],
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
    this.asyncDataStatus_loaded();
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 30px 0;
}
</style>