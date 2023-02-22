<template>
  <div class="registration-form">

    <form @submit.prevent="register">
      <h1 class="registration-form__title title">Форма регистрации</h1>

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
    register () {
      console.log('Отправка формы', this.form)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>
.registration-form {
  max-width: 500px;
  margin: 0 auto;
}
.registration-form__title {
  margin: 50px 0;
  text-align: center;
}
.form__btn-group {
  margin-top: 25px;
}
</style>