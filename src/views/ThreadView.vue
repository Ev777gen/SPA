<template>
  <div class="thread">
    <h1 class="thread__title title">
      {{ thread.title }}
      <!--<router-link
        v-if="thread.userId === authUser?.id"
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
      >
        Редактировать тему
      </router-link>-->
    </h1>
    <p class="thread__info text_gray">
      Тема начата пользователем <a href="#">{{thread.author?.name}}</a>, {{ localeDate(thread.publishedAt) }}
      <span v-if="thread.repliesCount" class="thread__replies">
        {{ thread.repliesCount }}
        {{ repliesCountWording(thread.repliesCount) }}
        от {{thread.contributorsCount - 1}}
        {{thread.contributorsCount - 1 === 1 ? 'пользователя' : 'пользователей'}}
      </span>
      <span v-else class="thread__replies">Нет ответов</span>
    </p>

    <PostList :posts="threadPosts" />

    <PostEditor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      Чтобы написать пост, нужно 
      <router-link :to="{name: 'SignIn', query:{redirectTo: $route.path}}">Войти</router-link> 
      или 
      <router-link :to="{name: 'Register',  query:{redirectTo: $route.path}}">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { mapActions, mapGetters } from 'vuex'
//import asyncDataStatus from '@/mixins/asyncDataStatus'
//import useNotifications from '@/composables/useNotifications'
//import difference from 'lodash/difference'
import { localeDate, repliesCountWording } from '@/helpers'
export default {
  name: 'ThreadView',
  components: {
    PostList,
    PostEditor
  },
  /*mixins: [asyncDataStatus],*/
  props: {
    id: {
      required: true,
      type: String
    }
  },
  /*setup () {
    const { addNotification } = useNotifications()
    return { addNotification }
  },*/
  computed: {
    ...mapGetters(['authUser']),
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUsers', 'fetchPosts', 'createPost']),
    /*...mapActions('users', ['fetchUsers']),
    ...mapActions('posts', ['fetchPosts', 'createPost']),*/
    localeDate,
    repliesCountWording,
    /*async fetchPostsWithUsers (ids) {
      // fetch the posts
      const posts = await this.fetchPosts({
        ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      })
      // fetch the users associated with the posts
      const users = posts.map(post => post.userId).concat(this.thread.userId)
      await this.fetchUsers({ ids: users })
    },*/
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    }
  },/*
  async created () {
    // fetch the thread
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return
        const newPosts = difference(item.posts, previousItem.posts)
        const hasNewPosts = newPosts.length > 0
        if (hasNewPosts) {
          await this.fetchPostsWithUsers(newPosts)
        } else {
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      }
    })
    await this.fetchPostsWithUsers(thread.posts)
    this.asyncDataStatus_fetched()
  }*/
}
</script>

<style lang="scss" scoped>
.thread__title {
  margin: 20px 0;
}
.thread__replies {
  float: right;
}
</style>