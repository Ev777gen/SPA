<template>
  <div class="card">
    <div class="card__header">
      <div class="card__background_cover"></div>
      <div class="card__background_footer">
        <p class="card__name">{{ user.name }}</p>
        <p class="card__date text_gray">Зарегистрирован {{ localeDate(user.registeredAt) }}</p>
      </div>
      <div class="card__avatar">
        <AppAvatar :src="user.avatar" class="avatar_xlarge" />
      </div>
    </div>
    <div class="card__info card__info_show">
      <div class="card__username">
        <span>Имя пользователя: </span>
        <span>{{ user.username }}</span>
      </div>
      <div class="card__email">
        <span>Почта: </span>
        <span>{{ user.email }}</span>
      </div>
      <div class="card__bio">
        <span>Обо мне: </span>
        <span>{{ user.bio || '---' }}</span>
      </div>
      <div class="card__website">
        <span>Вебсайт: </span>
        <span>
          <a v-if="user.website" :href="user.website">{{ user.website }}</a>
          <span v-else>не указан</span>
        </span>
      </div>
      <div class="card__posts-count">
        <span>Постов на форуме: </span>
        <span>{{ user.postsCount }}</span>
      </div>
      <div class="card__threads-count">
        <span>Начатых тем на форуме: </span>
        <span>{{ user.threadsCount }}</span>
      </div>
    </div>
    <div class="card__button">
      <router-link :to="{name: 'ProfileEdit'}" class="btn btn_orange">Редактировать профиль</router-link>
    </div>
  </div>
</template>

<script>
import { localeDate } from '@/helpers';
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    localeDate,
  },
}
</script>

<style lang="scss" scoped>
$card-header-height: 300px;
.card__header {
  position: relative;
  box-sizing: content-box;
  margin: 15px 0;
  height: $card-header-height;
  border: 2px solid #eee;
  border-radius: 5px;
}
.card__background_cover {
  height: $card-header-height * 0.65;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#c4b7b2+0,b8a9a3+0,fff9f9+100 */
  background: #c4b7b2; /* Old browsers */
  background: -moz-linear-gradient(left,  #c4b7b2 0%, #b8a9a3 0%, #fff9f9 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left,  #c4b7b2 0%,#b8a9a3 0%,#fff9f9 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right,  #c4b7b2 0%,#b8a9a3 0%,#fff9f9 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#c4b7b2', endColorstr='#fff9f9',GradientType=1 ); /* IE6-9 */
}
.card__background_footer {
  display: flex;
  justify-content: space-between;
  height: $card-header-height * 0.35;
  padding-left: 33%;
  background-color: #fff;
  & .card__name {
    font-size: 28px;
    font-weight: 700;
  }
  & p {
    padding-right: 25px;
    line-height: $card-header-height * 0.35;
  }
}
.card__avatar {
  position: absolute;
  bottom: 7%;
  left: 8%;
  border: 4px solid #fff;
  border-radius: 50%;
}
.card__info {
  margin: 15px 0;
  padding: 15px 25px;
  border: 2px solid #eee;
  border-radius: 5px;
  font-size: 18px;
  & div {
    padding: 10px;
    & > span:first-child {
      display: inline-block;
      width: 250px;
    }
  }
}
.card__button {
  margin-bottom: 30px;
  text-align: right;
}
</style>