<template>
  <header class="header">
    <div class="header__body container">
      <router-link :to="{name: 'HomeView'}" class="header__logo">Logo</router-link>
      <a
        v-if="authUser"
        @click.prevent="isDropdownOpen = !isDropdownOpen"
        v-click-outside="()=> isDropdownOpen = false"
        class="header__user-avatar"
      >
        <AppAvatar class="header__avatar avatar_small" :src="authUser?.avatar" :alt="`${authUser.name} profile image`"/>
        <font-awesome-icon icon="fa-solid fa-angle-down" class="header__arrow" :class="{'header__arrow_up': isDropdownOpen}" />
      </a>

      <div v-else class="header__not-auth-user">
        <router-link :to="{name: 'RegisterPage'}" class="header__link">Зарегистрироваться</router-link>
        <router-link :to="{name: 'SignIn'}" class="header__link">
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" /> Войти
        </router-link>
      </div>

      <div class="dropdown" :class="{'dropdown_open': isDropdownOpen}">
        <router-link :to="{name: 'ProfileView'}" class="dropdown__link">Мой профиль</router-link>
        <a href="" class="dropdown__link">Настройки</a>
        <a href="" class="dropdown__link">Выйти <font-awesome-icon icon="fa-solid fa-right-from-bracket" /></a>
      </div>
      
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      isDropdownOpen: false
    }
  },
  computed: {
    ...mapGetters(['authUser'])
  },
  created () {
    this.$router.beforeEach((to, from) => {
      this.isDropdownOpen = false;
    })
  }
}
</script>

<style lang="scss" scoped>
$dropdown-color: #f6f6f6;
$triangle-size: 10px;

.header {
  padding: 20px 0;
  background-color: #23374d;
}
.header__body {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.header__logo {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}
.header__user-avatar {
  cursor: pointer;
}
.header__arrow {
  margin-left: 5px;
  margin-top: 10px;
  vertical-align: middle;
  color: #fff;
  transition: all 0.3s;
}
.header__arrow_up {
  transform: rotate(-180deg);
}

.header__link {
  margin-left: 15px;
  font-size: 16px;
  font-weight: 700;
  color: #ffb579;
  &:last-child {
    color: #fff;
  }
}

.dropdown {
  position: absolute;
  display: block;
  opacity: 1;
  visibility: visible;
  display: none;
  top: 100%;
  right: 15px;
  display: block;
  margin-top: 20px;
  padding: 20px 40px;
  background-color: $dropdown-color;
  & .dropdown__link {
    display: block;
    font-size: 18px;
    line-height: 2;
  }
  &::after {
    content: ''; 
    position: absolute;
    right: 23px; 
    top: -2 * $triangle-size;
    border: $triangle-size solid transparent;
    border-bottom: $triangle-size solid $dropdown-color;
  }
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}
.dropdown_open {
  opacity: 1;
  visibility: visible;
}
</style>
