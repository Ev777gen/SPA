<template>
  <TheNavbar/>
  <div class="container">
    <div class="sidebar">Sidebar</div>
    <div class="content">
      <router-view v-show="isLoaded" />
      <!--<router-view v-show="isReady" @ready="onPageReady"/>-->
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
  data () {
    return {
      //isLoaded: false
    }
  },
  computed: {
    isLoaded() {
      return this.$store.state.isLoaded;
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
    /*onPageReady() {
      //this.isLoaded = true;
      NProgress.done();
    }*/
  },
  watch: {
    isLoaded(newValue) {
      if (newValue === true) {
        NProgress.done();
      }
    }
  },
  created () {
    this.fetchAuthUser();
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      //this.isLoaded = false;
      NProgress.start();
    });
  }
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