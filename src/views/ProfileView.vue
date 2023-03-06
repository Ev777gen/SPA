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
  & input.card__name {
    height: 40px;
    margin: auto 0;
    margin-right: 35px;
    @media (max-width: 720px) {
      & {
        margin-right: 0px;
      }
    }
  }
  @media (max-width: 720px) {
    & {
      flex-wrap: wrap;
      padding: 10px 15px 0px 15px;
      justify-content: center;
    }
    & p {
      padding-right: 0px;
    }
  }
}
.card__avatar {
  position: absolute;
  bottom: 7%;
  left: 8%;
  border: 4px solid #fff;
  border-radius: 50%;
  @media (max-width: 720px) {
    & {
      bottom: 50%;
      left: 50%;
      transform: translate(-50%, 20%);
    }
  }
}
</style>