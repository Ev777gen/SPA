<template>
  <div class="settings form_narrow">

    <h2 class="settings__title form__title title">Редактировать настройки</h2>

    <div class="settings__body">
      <div class="settings__email">
        <span>Почта: </span>
        <span>{{ activeUser.email }}</span>
      </div>

      <div class="settings__buttons">
        <button v-if="!isChanging" class="settings__button btn btn_orange" @click="isChangingEmail = true">Изменить e-mail</button>
        <button v-if="!isChanging" class="settings__button btn btn_orange" @click="isChangingPassword = true">Изменить пароль</button>
      </div>
            
      <div v-if="isChangingEmail" class="settings__email_edit">
        <h3 class="settings__subtitle">Введите новый e-mail и пароль</h3>
        <VeeForm @submit="changeEmail">
          <AppFormField name="reauth-email" label="Новый e-mail" v-model="newEmail" rules="required|email" />
          <AppFormField name="reauth-password" label="Пароль" v-model="password" type="password" rules="required" />
          <div class="form__btn-group">
            <button class="btn btn_ghost" @click.prevent="cancel">Отмена</button>
            <button class="btn btn_blue">Изменить e-mail</button>
          </div>
        </VeeForm>
      </div>

      <div v-if="isChangingPassword" class="settings__password_edit">
        <h3 class="settings__subtitle">Введите данные</h3>
        <VeeForm @submit="changePassword">
          <AppFormField name="reauth-email" label="e-mail" v-model="newEmail" rules="required|email" />
          <AppFormField name="password" label="Старый пароль" v-model="password" type="password" rules="required" />
          <AppFormField name="reauth-password" label="Новый пароль" v-model="newPassword" type="password" rules="required|min:6" />
          <div class="form__btn-group">
            <button class="btn btn_ghost" @click.prevent="cancel">Отмена</button>
            <button class="btn btn_blue">Изменить e-mail</button>
          </div>
        </VeeForm>
      </div>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      isChangingEmail: false,
      isChangingPassword: false,
      newEmail: '',
      password: '',
      newPassword: '',
    }
  },
  computed: {
    ...mapGetters({ activeUser: 'authUser' }),
    isChanging() {
      return (this.isChangingEmail && !this.isChangingPassword) || (!this.isChangingEmail && this.isChangingPassword)
    }
  },
  methods: {
    ...mapActions(['reauthenticate', 'updateEmail', 'updateUser', 'startLoadingIndicator', 'stopLoadingIndicator']),
    async changeEmail() {
      try {
        this.startLoadingIndicator();
        await this.reauthenticate({ email: this.activeUser.email, password: this.password });
        await this.updateEmail({ email: this.newEmail });
        await this.updateUser({ ...this.activeUser, email: this.newEmail });
        this.clearForm();
        this.isChangingEmail = false;
        this.stpoLoadingIndicator();
      } catch (error) {
        alert('Возникла ошибка при обновлении данных пользователя. Попробуйте повторить еще раз.');
        // Если произошла ошибка при записи нового e-mail в БД,
        // то возвращаем обратно исходный e-mail
        if (this.activeUser.email !== this.newEmail) {
          await this.reauthenticate({ email: this.newEmail, password: this.password });
          await this.updateEmail({ email: this.activeUser.email });
        }
        this.clearForm();
        this.isChangingEmail = false;
      }
    },
    async changePassword() {
      alert('Я специально не реализовал этот функционал, чтобы избежать случайных проблем.');
      // try {
      //   this.startLoadingIndicator();
      //   await this.reauthenticate({ email: this.activeUser.email, password: this.password });
      //   await this.updatePassword({ password: this.newPassword });
      //   this.clearForm();
      //   this.isChangingPassword = false;
      //   this.stpoLoadingIndicator();
      // } catch (error) {
      //   alert('Возникла ошибка при обновлении данных пользователя. Попробуйте повторить еще раз.');
      //   this.clearForm();
      //   this.isChangingPassword = false;
      // }

      // Если раскомментировать то, что выше,
      // то следующие две строки надо удалить
      this.clearForm();
      this.isChangingPassword = false;
    },
    cancel() {
      this.isChangingEmail = false;
      this.isChangingPassword = false;
      this.clearForm();
    },
    clearForm() {
      this.newEmail = '';
      this.password = '';
      this.newPassword = '';
    }
  },
}
</script>

<style lang="scss" scoped>
.settings__subtitle {
  margin: 35px 0 10px 0;
  text-align: center;
  font-size: 18px;
}
.settings__email {
  font-size: 20px;
  & span:first-child {
    margin-right: 30px;
  }
}
.settings__buttons {
  margin-top: 35px;
  & .settings__button {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>