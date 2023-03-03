<template>
  <header class="header">
    <TheNavbar/>
  </header>
  <hr>
  <div class="container">
    <aside class="sidebar desktop-only">
      <TheSidebar />
    </aside>
    <main class="content">
      <router-view v-show="isLoaded" :key="`${$route.path}${JSON.stringify($route.query)}`" />
      <AppSpinner v-show="!isLoaded" />
    </main>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar';
import TheSidebar from '@/components/TheSidebar';
import { mapActions } from 'vuex';
import NProgress from 'nprogress';
export default {
  name: 'App',
  components: { TheNavbar, TheSidebar },
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

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  z-index: 999;
}
hr {
  height: 1px;
}
.container {
  margin-top: 75px;
}
</style>