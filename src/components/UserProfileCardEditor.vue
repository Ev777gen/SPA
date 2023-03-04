<template>
  <div class="card">
    <form @submit.prevent="save">
      <div class="card__header">
        <div class="card__background_cover"></div>
        <div class="card__background_footer">
          <input v-model="activeUser.name" type="text" placeholder="Имя" class="card__name form__input">
        </div>
        <div class="card__avatar">
          <div v-if="avatarPreview">
            <img :src="avatarPreview" class="avatar_xlarge">
          </div>
          <AppAvatar v-else :src="activeUser.avatar" class="avatar_xlarge" />
          <div class="card__avatar-cover">
            <font-awesome-icon icon="fa-solid fa-camera" class="card__camera-icon" />
            <input type="file" title="Изменить аватар" accept="image/*" @change="onAvatarChange">
            <button class="card__avatar-button btn btn_red" @click.prevent="deleteAvatar">Удалить</button>
          </div>
        </div>
      </div>

      <div class="card__info card__info_edit">
        <div class="card__username">
          <span>Имя пользователя: </span>
          <input v-model="activeUser.username" type="text" placeholder="Имя пользователя" class="form__input">
        </div>
        <div class="card__email">
          <span>Почта: </span>
          <input v-model="activeUser.email" type="text" placeholder="E-mail" class="form__input">
        </div>
        <div class="card__bio">
          <span>Обо мне: </span>
          <textarea v-model="activeUser.bio" rows="5" placeholder="Расскажите коротко о себе" class="form__input"></textarea>
        </div>
        <div class="card__website">
          <span>Вебсайт: </span>
          <input v-model="activeUser.website" type="text" placeholder="Добавьте ссылку на Ваш вебсайт" class="form__input">
        </div>
      </div>
      <div class="card__buttons form__btn-group">
        <button @click.prevent="cancel" class="btn btn_ghost">Отмена</button>
        <button type="submit" class="btn btn_blue">Сохранить</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      activeUser: { ...this.user },
      avatar: null,
      avatarPreview: null
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['uploadAvatar']),
    onAvatarChange (e) {
      this.avatar = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        this.avatarPreview = event.target.result;
      }
      reader.readAsDataURL(this.avatar);
    },
    async save() {
      // Загружаем аватар в Firebase Storage и получаем его URL
      const uploadedImageURL = await this.uploadAvatar({ file: this.avatar });
      this.activeUser.avatar = uploadedImageURL || this.activeUser.avatar;
      // Надо клонировать объект, прежде чем посылать его в store
      // Если этого не сделать, получается мы создаем реактивную привязку данных
      this.$store.dispatch('updateUser', {...this.activeUser});
      // Выходим из редактирования и возвращаемся к отображению информации
      this.$router.push({name: 'ProfileView'});
    },
    cancel() {
      this.$router.push({name: 'ProfileView'});
    },
    deleteAvatar() {
      this.activeUser.avatar = '';
    },
  },
}
</script>

<style lang="scss" scoped>
/* 
  Общую часть стилей компонентов 
  UserProfileCard.vue и UserProfileCardEditor.vue 
  я поместил в файл ProfileView.vue. 
*/
.card__avatar-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: all 0.3s;
  & .card__camera-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 60px;
    border-radius: 50%;
    font-size: 40px;
    color: #fff;
    transform: translate(-50%, -50%);
  }
  & input {
    position: absolute;
    display: block;
    top: 50%;
    left: 50%;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    cursor: pointer;
  }
  & .card__avatar-button {
    position: absolute;
    top: 80%;
    left: 50%;
    padding: 5px;
    font-size: 12px;
    transform: translate(-50%, -50%);
  }
  &:hover {
    opacity: 1;
  }
}
.card__info {
  margin: 15px 0;
  padding: 15px 25px;
  border: 2px solid #eee;
  border-radius: 5px;
  font-size: 18px;
  & div {
    padding: 10px;
    & span:first-child {
      display: inline-block;
      width: 250px;
      padding-top: 10px;
      vertical-align: top;
    }
  }
  @media (max-width: 720px) {
    & {
      padding: 10px;
    }
  }
}
.form__input {
  width: 100%;
  margin: 0;
}
.card__buttons {
  display: flex;
  margin-bottom: 30px;
  text-align: right;
  @media (max-width: 720px) {
    & {
      justify-content: space-between;
    }
    & .btn {
      margin: 0;
    }
  }
}
</style>