<template>
  <div class="form_narrow">
    <form @submit.prevent="signIn">
      <h1 class="form__title title">Войти</h1>

      <div class="form__input-group">
        <label for="email">E-mail</label>
        <input v-model="form.email" id="email" type="text" class="form__input" />
      </div>
      <div class="form__input-group">
        <label for="password">Пароль</label>
        <input v-model="form.password" id="password" type="password" class="form__input" />
      </div>

      <div class="form__btn-group">
        <p>Еще не зарегистрированы? &nbsp;<router-link :to="{name: 'RegisterForm'}">Создайте аккаунт</router-link></p>
        <button type="submit" class="btn btn_blue" :disabled="!(form.email && form.password)">Войти</button>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        await this.$store.dispatch('signInWithEmailAndPassword', { ...this.form })
        this.successRedirect()
      } catch (error) {
        alert(error.message)
      }
    },
    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
<style lang="scss" scoped>
.form__btn-group {
  justify-content: space-between;
  align-items: first baseline;
}
</style>