<template>
  <TheNavbar/>
  <div class="container">
    <div class="sidebar">Sidebar</div>
    <div class="content">
      <router-view v-show="isReady" @ready="onPageReady"/>
      <AppSpinner v-show="!isReady" />
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
  data () {
    return {
      isReady: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
    onPageReady() {
      this.isReady = true;
      NProgress.done();
    }
  },
  created () {
    this.fetchAuthUser();
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.isReady = false;
      NProgress.start();
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/reset.css';
@import '@/assets/globalstyles.scss';
@import "~nprogress/nprogress.css";
</style>