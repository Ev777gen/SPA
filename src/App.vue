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
  margin-right: 15px;
  border: 1px solid blue;
}
.content {
  width: $content-width;
  border: 1px solid blue;
}
.title {
  font-size: 32px;
  font-weight: 400;
}
.subtitle {
  font-size: 20px;
  font-weight: 400;
}


/* кнопки */

.btn, .btn-blue, .btn-red, .btn-ghost {
    padding: 15px 30px;
    border-radius: 5px;
    border: none;
    display: inline-block;
    outline: 0;
}
.btn:hover, .btn-blue:hover, .btn-red:hover, .btn-ghost:hover {
    transition: all 0.4s ease;
}
.btn:disabled, .btn-blue:disabled, .btn-red:disabled, .btn-ghost:disabled, .btn-disabled {
    cursor: default;
}
.btn:disabled:hover, .btn-blue:disabled:hover, .btn-red:disabled:hover, .btn-ghost:disabled:hover, .btn-disabled:hover {
    cursor: default;
    color: white;
}
.btn-blue {
    color: white;
    background: #263959;
}
.btn-blue:hover:not(:disabled):not(.btn-disabled) {
    color: white;
    background: #1d2b43;
}
.btn-red {
    color: white;
    background: #C82543;
}
.btn-red:hover:not(:disabled):not(.btn-disabled) {
    color: white;
    background: #b4213c;
}
.btn-ghost {
    flex-grow: 0;
}
.btn-ghost:hover:not(:disabled):not(.btn-disabled) {
    color: white;
    background-color: rgba(150, 150, 150, 0.31);
}


/* еще стили */
.link {
    color: #1f9b80;
    transition: all ease 0.3s;
}
.link:hover {
    color: #5bc4ad;
}
</style>
