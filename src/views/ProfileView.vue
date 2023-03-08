<template>
  <div class="profile">
    <div class="profile__card">
      <UserProfileCard v-if="!edit" :user="user"/>
      <UserProfileCardEditor v-else :user="user"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
export default {
  props: {
    edit: {
      type: Boolean,
      required: true
    }
  },
  components: {
    UserProfileCard,
    UserProfileCardEditor
  },
  computed: {
    ...mapGetters({ user: 'authUser' }),
  },
}
</script>

<style lang="scss">
/* 
  Карточка пользователя (шапка).
  Это общие стили для компонентов 
  UserProfileCard и UserProfileCardEditor.
*/
$card-header-height: 320px;
$card-background-cover-height: $card-header-height * 0.65;
$card-background-footer-height: $card-header-height - $card-background-cover-height - 4px;

.card__header {
  position: relative;
  margin: 15px 0;
  height: $card-header-height;
  border: 2px solid #eee;
  border-radius: 5px;
}
.card__background_cover {
  height: $card-background-cover-height;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#c4b7b2+0,b8a9a3+0,fff9f9+100 */
  background: #c4b7b2; /* Old browsers */
  background: -moz-linear-gradient(left,  #c4b7b2 0%, #b8a9a3 0%, #fff9f9 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left,  #c4b7b2 0%,#b8a9a3 0%,#fff9f9 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right,  #c4b7b2 0%,#b8a9a3 0%,#fff9f9 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#c4b7b2', endColorstr='#fff9f9',GradientType=1 ); /* IE6-9 */
  @media (max-width: 720px) {
    height: $card-background-cover-height * 1.1;
  }
}
.card__background_footer {
  display: flex;
  justify-content: space-between;
  height: $card-background-footer-height;
  padding-left: 33%;
  background-color: #fff;
  & .card__name {
    font-size: 28px;
    font-weight: 700;
  }
  & p {
    padding-right: 25px;
    line-height: $card-background-footer-height;
  }
  @media (max-width: 720px) {
    & {
      flex-wrap: wrap;
      justify-content: center;
      padding: 0px 15px 0px 15px;
      height: $card-background-footer-height * 0.8;
    }
    & p {
      padding-right: 0px;
      line-height: $card-background-footer-height * 0.8;
    }
  }
}
.card__avatar {
  position: absolute;
  bottom: 9%;
  left: 8%;
  border: 4px solid #fff;
  border-radius: 50%;
  @media (max-width: 720px) {
    & {
      bottom: 50%;
      left: 50%;
      transform: translate(-50%, 24%);
    }
  }
}
</style>