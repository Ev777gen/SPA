<template>
  <div class="wrapper">
    <div class="post"
         v-for="post in posts"
         :key="post.id"
    >
      <div v-if="getUserById(post.userId)" class="post__user-info">
        <a href="#" class="post__user-name">{{ getUserById(post.userId).name }}</a>
        <a href="#"><AppAvatar class="post__avatar avatar_large" :src="getUserById(post.userId).avatar" /></a>
        <p class="desktop-only text_gray">
          {{ getUserById(post.userId).postsCount }} 
          {{ userPostsCountWording(getUserById(post.userId).postsCount) }}
        </p>
        <p class="desktop-only text_gray">
          {{ getUserById(post.userId).threadsCount }} 
          {{ userThreadsCountWording(getUserById(post.userId).threadsCount) }}
        </p>
      </div>

      <div class="post__content">
        <div class="post__body">
          <PostEditor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
            @cancel="hidePostEditor"
          />
          <p v-else>
            {{post.text}}
          </p>
        </div>
        <a
          v-if="post.userId === $store.state.auth.authId"
          @click.prevent="toggleEditMode(post.id)"
          href="#"
          class="post__edit-icon"
          title="Редактировать пост"
        >
          <font-awesome-icon icon="fa-solid fa-pencil" v-if="!editing" />
        </a>
      </div>

      <div class="post__date text_gray text_small">
        <div v-if="post.edited?.at" class="edition-info"><i>изменено</i></div>
        <div>{{ localeDate(post.edited?.at || post.publishedAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PostEditor from '@/components/PostEditor'
import { mapActions } from 'vuex'
import { localeDate, userPostsCountWording, userThreadsCountWording } from '@/helpers'
export default {
  components: { PostEditor },
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      editing: null
    }
  },
  computed: {
    users() {
      return this.$store.state.users
    }
  },
  methods: {
    ...mapActions(['updatePost']),
    localeDate,
    userPostsCountWording,
    userThreadsCountWording,
    getUserById(userId) {
      return this.$store.getters.user(userId);
    },
    toggleEditMode(id) {
      this.editing = id === this.editing ? null : id;
    },
    handleUpdate(event) {
      this.updatePost(event.post);
      this.editing = null;
    },
    hidePostEditor() {
      this.editing = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-top: 10px;
}

.post {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f6f6f6;
  padding: 20px 10px;
  padding-bottom: 7px;
  box-shadow: 2px 2px 1px rgba(136, 136, 136, 0.09);
  margin-bottom: 3px;
  &:nth-child(odd) {
    background: #eee;
  }
  @media (max-width: 720px) {
    & {
      padding: 0;
    }
  }
}
.post__user-name {
  font-size: 18px;
  @media (max-width: 720px) {
    & {
      font-size: 16px;
    }
  }
}
.post__user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  flex: 1 1 15%;
  margin-right: 5px;
  & > * {
    margin-bottom: 10px;
  }
  @media (max-width: 820px) {
    & {
      order: -2;
      flex-direction: row;
      justify-content: flex-start;
      background: rgba(73, 89, 96, 0.06);
      margin-right: 0;
      padding: 10px;
      .post__avatar {
        height: 35px;
        width: 35px;
        margin-right: 5px;
        order: 1;
      }
      .post__user-name {
        order: 2;
      }
      & > * {
        margin-right: 5px;
        margin-bottom: 0;
      }
    }
  }
}
.post__content {
  display: flex;
  flex: 1 0 83%;
  padding-left: 15px;
  padding-right: 10px;
  font-size: 16px;
  text-align: justify;
  line-height: 1.5;
  word-break: break-word;
  & p {
    margin-bottom: 20px;
  } 
}
.post__body {
  width: 100%;
}
.post__date {
  flex-basis: 100%;
  font-size: 14px;
  text-align: right;
  margin-bottom: 5px;
  padding-right: 7px;
  @media (max-width: 820px) {
    & {
      box-sizing: content-box;
      order: -1;
      flex-basis: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      padding-right: 10px;
      margin-bottom: 0px;
      height: 55px;
      background: rgba(73, 89, 96, 0.06);
    }
  }
}
.post__edit-icon {
  margin-left: auto;
  padding-left: 10px;
  color: #777;
}
</style>
