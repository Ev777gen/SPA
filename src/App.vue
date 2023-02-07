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

/* Заголовки */
.title {
  font-size: 32px;
}

/* Списки */
.list__title {
  width: 100%;
  padding: 10px 5px;
  margin: 0;
  font-size: 20px;
  font-weight: 100;
  color: #fefefe;
  background-color: #23374d;
  a:hover {
    color: #89c6af;
  }
}
.list__item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px 15px 30px;
  &:nth-child(odd) {
    background: #eee;
  }
}

/* кнопки */
.btn, .btn-blue, .btn-red, .btn-ghost {
  display: inline-block;
  padding: 15px 30px;
  border-radius: 5px;
  border: none;
  outline: 0;
  color: white;
  &:hover {
    transition: all 0.4s ease;
  }
  &:disabled {
    cursor: default;
    &:hover {
      cursor: default;
      color: white;
    }
  }
}
.btn-blue {
  background: #263959;
  &:hover:not(:disabled) {
    background: #1d2b43;
  }
}
.btn-red {
  background: #C82543;
  &:hover:not(:disabled) {
    background: #b4213c;
  }
}
.btn-ghost {
  flex-grow: 0;
  &:hover:not(:disabled) {
    background-color: rgba(150, 150, 150, 0.31);
  }
}

/* Ссылки */
a,
.link {
  color: #1f9b80;
  transition: all ease 0.3s;
  &:hover {
    color: #5bc4ad;
  }
}
</style>
