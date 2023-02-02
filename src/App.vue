<template>
  <TheNavbar/>
  <div class="container">
    <div class="sidebar">Sidebar</div>
    <div class="content">
      Content
      <router-view/>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
export default {
  name: 'App',
  components: { TheNavbar },
  data () {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss">
@import '@/assets/reset.css';

$max-width: 1100px;
$content-width: 900px;

html,
body {
  min-height: 100vh;
  background-color: #fff;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a1a1a;
}
.container {
  display: flex;
  justify-content: space-between;
  max-width: $max-width;
  margin: 0px auto;
  padding: 0 15px;
  border: 1px solid red;
}
.sidebar {
  width: $max-width - $content-width;
  border: 1px solid blue;
}
.content {
  width: $content-width;
  border: 1px solid blue;
}
</style>
