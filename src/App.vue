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

$container-width: 1100px;
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
  max-width: $container-width;
  margin: 0px auto;
  padding: 0 15px;
  border: 1px solid red;
}
.sidebar {
  width: $container-width - $content-width;
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

/* Текст */
.gray-text {
  color: red;
}
.text_gray {
  color: #777;
}
.text_small {
  font-size: 12px;
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

/* Аватар */
$avatar: 50px;
$avatar-xlarge: 200px;
$avatar-large: 95px;
$avatar-medium: 50px;
$avatar-small: 35px;
.avatar {
  width: $avatar;
  max-width: $avatar;
  height: $avatar;
  max-height: $avatar;
  border-radius: 50%;
}
.avatar-xlarge {
  width: $avatar-xlarge;
  max-width: $avatar-xlarge;
  height: $avatar-xlarge;
  max-height: $avatar-xlarge;
  border-radius: 50%;
}
.avatar-large {
  width: $avatar-large;
  max-width: $avatar-large;
  height: $avatar-large;
  max-height: $avatar-large;
  border-radius: 50%;
}
.avatar-medium {
  width: $avatar-medium;
  max-width: $avatar-medium;
  height: $avatar-medium;
  max-height: $avatar-medium;
  border-radius: 50%;
}
.avatar-small {
  width: $avatar-small;
  max-width: $avatar-small;
  height: $avatar-small;
  max-height: $avatar-small;
  border-radius: 50%;
}

/* Формы */
textarea {
  resize: none;
}

/* Адаптив */
@media (max-width: 820px) {
    .desktop-only, .navbar-user {
        display: none;
    }
}
</style>
