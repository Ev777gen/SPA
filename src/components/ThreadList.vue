<template>
  <div>
    <div class="list">

      <!--<h2 class="threads__title subtitle">Список тем</h2>-->
      <h2 class="list__title">Список тем</h2>

      <div v-if="threads.length">
        <div v-for="thread in threads" :key="thread.id" class="list__item thread">
          <div>
            <p class="thread__title">
              <router-link :to="{name: 'ThreadView', params: {id: thread.id}}">{{ thread.title }}</router-link>
            </p>
            <p class="thread__info">
              Опубликовано пользователем 
              <a href="#">{{ userById(thread.userId).name }}</a>, 
              {{ localeDate(thread.publishedAt) }}
            </p>
          </div>

          <div class="thread__activity">
            <p class="thread__replies-count">
            {{ thread.repliesCount > 0 ? thread.repliesCount : '' }}
            {{ repliesCountWording(thread.repliesCount) }}
            </p>

            <AppAvatarImg class="thread__avatar avatar_medium" :src="userById(thread.userId).avatar" />

            <div>
              <p class="thread__user">
                <a href="#">{{ userById(thread.userId).name }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!threads.length" class="no-threads">
      <em>Здесь пока нет тем. Создайте первую!</em>
    </div>
  </div>
</template>

<script>
//import { findById } from '@/helpers'
import { localeDate, repliesCountWording } from '@/helpers'
export default {
  props: {
    threads: {
      type: Array,
      required: true
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts;
    },
    users () {
      return this.$store.state.users;
    },
  },
  methods: {
    localeDate,
    repliesCountWording,
    postById (postId) {
      //return findById(this.posts, postId)
      return this.posts.find(post => post.id === postId);
    },
    userById (userId) {
      //return findById(this.users, userId) || {}
      return this.users.find(user => user.id === userId) || {};
    },
    /*localeDate(timestamp) {
      // Конвертируем временную метку в строку:
      // toLocaleString() - дата + время
      // toLocaleDateString() - дата 
      // toLocaleTimeString() - время
      const isTimestampInSeconds = timestamp < 10000000000;
      if (isTimestampInSeconds) {
        timestamp *= 1000;
      }
      return (new Date(timestamp)).toLocaleDateString();
    },*/
  }
}
</script>

<style lang="scss" scoped>
.thread {
  flex-wrap: wrap;
  padding: 5px 0 5px 20px;
  min-height: 45px;
}
.thread__title {
  font-size: 18px;
}
.thread__info {
  color: #777;
}
.thread__activity {
  flex-basis: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.thread__replies-count {
  flex-basis: 35%;
}
.avatar_medium {
  margin-right: 10px;
}
.no-threads {
  padding: 10px;
  text-align: center;
}
</style>
