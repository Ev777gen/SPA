<template>
  <header class="header">
    <div class="header__body container">
      <router-link :to="{name: 'HomeView'}" v-if="!isMobile || (authUser && isMobile)" class="header__logo">Logo</router-link>
      <a
        v-if="authUser && !isMobile"
        @click.prevent="isDropdownOpen = !isDropdownOpen"
        v-click-outside="onClickOutside"
        class="header__user-avatar"
      >
        <AppAvatar class="header__avatar avatar_small" :src="authUser?.avatar" :alt="`${authUser.name} profile image`"/>
        <font-awesome-icon icon="fa-solid fa-angle-down" class="header__arrow" :class="{'header__arrow_up': isDropdownOpen}" />
      </a>
      
      <div 
        v-else-if="authUser && isMobile" 
        @click="isDropdownOpen = !isDropdownOpen"
        v-click-outside="onClickOutside"
        class="burger"
      >
        <div class="burger__top-bar"></div>
        <div class="burger__middle-bar"></div>
        <div class="burger__bottom-bar"></div>
      </div>

      <div v-else class="header__not-auth-user">
        <router-link :to="{name: 'RegisterForm'}" class="header__link">Зарегистрироваться</router-link>
        <router-link :to="{name: 'SignIn'}" class="header__link">
          <font-awesome-icon icon="fa-solid fa-right-to-bracket" /> Войти
        </router-link>
      </div>

      <div class="dropdown" :class="{'dropdown_open': isDropdownOpen}">
        <router-link :to="{name: 'ProfileView'}" class="dropdown__link">Мой профиль</router-link>
        <!--<p class="dropdown__link">Настройки</p>-->
        <router-link :to="{name: 'HomeView'}" class="dropdown__link mobile-only">На главную</router-link>
        <router-link :to="{name: 'HomeView'}" class="dropdown__link mobile-only">Форум</router-link>
        <a href="" class="dropdown__link" @click.prevent="signOut">Выйти <font-awesome-icon icon="fa-solid fa-right-from-bracket" /></a>
      </div>
      
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import vClickOutside from 'click-outside-vue3';
export default {
  data () {
    return {
      isDropdownOpen: false,
      isMobile: false
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  computed: {
    ...mapGetters(['authUser'])
  },
  methods: {
    signOut () {
      this.$store.dispatch('signOut');
      this.isDropdownOpen = false;
    },
    onClickOutside () {
      this.isDropdownOpen = false;
    }
  },
  created () {
    this.$router.beforeEach(() => {
      this.isDropdownOpen = false;
    });
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
}
</script>

<style lang="scss" scoped>
$burger-size: 35px;
$dropdown-color: #fff;
$dropdown-link-color: #444;
$triangle-size: 8px;

.header {
  padding: 20px 0;
  background-color: #23374d;
}
.header__body {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 35px;
}
.header__logo {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}
.header__not-auth-user {
  margin-left: auto;
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

.burger {
  width: $burger-size;
  height: $burger-size;
  margin: 0 10px;
  cursor: pointer;
}
.burger__top-bar,
.burger__middle-bar,
.burger__bottom-bar {
  width: $burger-size;
  height: 3px;
  background: white;
  position: absolute;
  border-radius: 10px;
  transition: all 0.5s;
}
.burger__top-bar {
  top: 15%;
}
.burger__middle-bar {
  top: 50%;
}
.burger__bottom-bar {
  top: 85%;
}

.dropdown {
  position: absolute;
  display: block;
  top: 100%;
  right: 15px;
  margin-top: 10px;
  padding: 20px 40px;
  background-color: $dropdown-color;
  box-shadow: 1px 15px 15px rgba(1, 1, 1, 0.1);
  opacity: 1;
  visibility: visible;
  z-index: 1000;
  & .dropdown__link {
    display: block;
    font-size: 18px;
    line-height: 2;
    color: $dropdown-link-color;
    @media (max-width: 720px) {
      & {
        font-size: 24px;
      }
    }
  }
  &::after {
    content: ''; 
    position: absolute;
    right: 25px; 
    top: -2 * $triangle-size;
    border: $triangle-size solid transparent;
    border-bottom: $triangle-size solid $dropdown-color;
    @media (max-width: 720px) {
      & {
        right: 20px;
      }
    }
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
