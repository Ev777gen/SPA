<template>
  <div class="form_narrow">

    <form @submit.prevent="register">
      <h1 class="form__title title">Форма регистрации</h1>

      <div class="form__input-group">
        <label for="name" class="form__label">Полное имя</label>
        <input v-model="form.name" id="name" type="text" class="form__input" />
      </div>

      <div class="form__input-group">
        <label for="username" class="form__label">Логин</label>
        <input v-model="form.username" id="username" type="text" class="form__input" />
      </div>

      <div class="form__input-group">
        <label for="email" class="form__label">e-mail</label>
        <input v-model="form.email" id="email" type="email" class="form__input" />
      </div>

      <div class="form__input-group">
        <label for="password" class="form__label">Пароль</label>
        <input v-model="form.password" id="password" type="password" class="form__input" />
      </div>

      <div class="form__btn-group">
        <button type="submit" class="btn_blue">Зарегистрироваться</button>
      </div>
    </form>

  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async register () {
      try {
        await this.$store.dispatch('registerUserWithEmailAndPassword', this.form);
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      }
    }
  },
}
</script>