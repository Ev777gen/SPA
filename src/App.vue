<template>
  <TheNavbar/>
  <div class="container">
    <div class="sidebar">Sidebar</div>
    <div class="content">
      <router-view v-show="isReady" @ready="isReady = true"/>
      <div v-show="!isReady" class="spinner">
        <AppSpinner />
      </div>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar';
import { mapActions } from 'vuex';
export default {
  name: 'App',
  components: { TheNavbar },
  data () {
    return {
      isReady: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
  },
  created () {
    this.fetchAuthUser();
    this.$router.beforeEach(() => {
      this.isReady = false;
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/reset.css';
@import '@/assets/globalstyles.scss';
</style>

<style scoped>
.spinner {
  margin-top: 30px;
  text-align: center;
}
</style>
