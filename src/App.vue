<template>
  <TheNavbar/>
  <div class="container">
    <div class="sidebar">Sidebar</div>
    <div class="content">
      <router-view/>
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
    return {}
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<style lang="scss">
@import '@/assets/reset.css';
@import '@/assets/globalstyles.scss';
</style>
