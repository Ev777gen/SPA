<template>
  <TheNavbar/>
  <div class="container">
    <div class="sidebar">Sidebar</div>
    <div class="content">
      <router-view v-show="isLoaded" :key="`${$route.path}${JSON.stringify($route.query)}`" />
      <AppSpinner v-show="!isLoaded" />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar';
import { mapActions } from 'vuex';
import NProgress from 'nprogress';
export default {
  name: 'App',
  components: { TheNavbar },
  computed: {
    isLoaded() {
      return this.$store.state.isLoaded;
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
  },
  /*watch: {
    isLoaded(newValue) {
      if (newValue === true) {
        NProgress.done();
      }
    }
  },*/
  created () {
    this.fetchAuthUser();
    NProgress.configure({
      speed: 200,
      showSpinner: false
    });
    this.$router.beforeEach(() => {
      //this.isLoaded = false;
      NProgress.start();
    });
    this.$router.afterEach(() => {
      setTimeout(() => NProgress.done(), 500);
    });
  },
}
</script>

<style lang="scss">
@import '@/assets/reset.css';
@import '@/assets/global.scss';
@import "~nprogress/nprogress.css";
#nprogress .bar{
  background: #5ce0b0 !important;
}
</style>