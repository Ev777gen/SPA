<template>
  <div v-if="isAsyncDataLoaded" class="thread">
    <h1 class="thread__title title">
      <p>{{ thread.title }}</p>
      <router-link
        v-if="thread.userId === authUser?.id"
        :to="{ name: 'ThreadEdit', id: this.id }"
      >
        <button class="thread__button btn_small btn_green">Редактировать тему</button>
      </router-link>
    </h1>
    <p class="thread__info text_gray">
      <span class="thread__info_user desktop-only">
        Тема начата пользователем 
        <a href="#">{{thread.author?.name}}</a>, 
        {{ localeDate(thread.publishedAt) }}
      </span>
      <span v-if="thread.repliesCount" class="thread__replies">
        {{ thread.repliesCount }}
        {{ repliesCountWording(thread.repliesCount) }}
        от {{ thread.contributorsCount - 1 <= 1 ? 1 : thread.contributorsCount - 1 }}
        {{ thread.contributorsCount - 1 <= 1 ? 'пользователя' : 'пользователей' }}
      </span>
      <span v-else class="thread__replies">Нет ответов</span>
    </p>

    <PostList :posts="threadPosts" />

    <PostEditor v-if="authUser" @save="addPost" />
    <div v-else class="thread__no-auth-user">
      Чтобы написать пост, нужно 
      <router-link :to="{name: 'SignIn', query:{redirectTo: $route.path}}">Войти</router-link> 
      или 
      <router-link :to="{name: 'RegisterForm',  query:{redirectTo: $route.path}}">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor';
import { mapActions, mapGetters } from 'vuex';
//import useNotifications from '@/composables/useNotifications';
//import difference from 'lodash/difference';
import { localeDate, repliesCountWording } from '@/helpers';
export default {
  name: 'ThreadView',
  components: {
    PostList,
    PostEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  /*setup () {
    const { addNotification } = useNotifications()
    return { addNotification }
  },*/
  computed: {
    ...mapGetters(['authUser']),
    threads() {
      return this.$store.state.threads
    },
    posts() {
      return this.$store.state.posts
    },
    thread() {
      return this.$store.getters.thread(this.id)
    },
    threadPosts() {
      return this.posts.filter(post => post.threadId === this.id)
    },
    isAsyncDataLoaded() {
      return this.$store.state.isLoaded;
    },
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchUsers', 'fetchPosts', 'createPost', 'startLoadingIndicator', 'stopLoadingIndicator']),
    localeDate,
    repliesCountWording,
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    },
    async fetchPostsWithUsers (ids) {
      // Загружаем из базы данных посты
      const posts = await this.fetchPosts({
        ids,
        /*onSnapshot: ({ isLocal, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }*/
      })
      // Загружаем пользователей, написавших эти посты
      const users = posts.map(post => post.userId).concat(this.thread.userId)
      await this.fetchUsers({ ids: users })
    }
  },
  /*async created() {
    // fetch the thread
    //console.log('1. fetching the thread inside created hook', this.id);
    // Из store (временно!!!) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //const thread = this.$store.state.threads.find(t => t.id == this.id);
    // Из Firebase
    const thread = await this.fetchThread({ id: this.id });
    //console.log('7. thread inside created hook', thread);
    // fetch the user
    this.fetchUser({ id: thread.userId });
    // fetch the posts
    // Из store (временно!!!)
    //const posts = this.$store.state.posts.filter(p => p.id == thread.postIds);
    // Из Firebase
    const posts = await this.fetchPosts({ ids: thread.postIds });
    //console.log('posts', posts)
    // fetch the users associated with the posts
    const users = posts.map(post => post.userId);
    //console.log('users', users)
    this.fetchUsers({ ids: users });
    //thread.posts.forEach( async (postId) => {
    //  const post = await this.$store.dispatch('fetchPost', {id: postId});
    //  //console.log('post inside created hook ', post);
    //  this.$store.dispatch('fetchUser', {id: post.userId});
    //});
    this.isAsyncDataLoaded = true;
  },*/
  async created () {
    // fetch the thread
    this.startLoadingIndicator();
    const thread = await this.fetchThread({
      id: this.id,
      /*onSnapshot: async ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return;
        const newPosts = difference(item.posts, previousItem.posts);
        const hasNewPosts = newPosts.length > 0;
        if (hasNewPosts) {
          await this.fetchPostsWithUsers(newPosts);
        } else {
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 });
        }
      }*/
    })
    await this.fetchPostsWithUsers(thread.postIds);
    this.stopLoadingIndicator();
  }
}
</script>

<style lang="scss" scoped>
.thread__title {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.thread__info {
  display: flex;
  justify-content: space-between;
}
.thread__replies {
  justify-self: flex-end;
  text-align: right;
}
.thread__no-auth-user {
  margin: 30px 0;
  text-align: center;
  font-size: 16px;
}
</style>