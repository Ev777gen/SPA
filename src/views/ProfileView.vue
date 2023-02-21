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