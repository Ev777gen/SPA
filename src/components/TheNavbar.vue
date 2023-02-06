<template>
  <header class="header" id="header">
    <div class="container">
      <router-link :to="{name: 'Home'}" class="header__link"><span class="header__logo">Logo</span></router-link>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.header {
  padding: 20px 0;
  background-color: #23374d;
}
.header__logo {
  font-size: 24px;
  font-weight: bold;
}
.header__link {
  color: #fff;
}
.nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #2ab476;
    }
  }
}
</style>
