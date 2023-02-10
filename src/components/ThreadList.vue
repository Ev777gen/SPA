<template>
  <h2 class="list__title">Список тем</h2>
  <div v-if="threads.length" class="list">
    <div v-for="thread in threads" :key="thread.id" class="list__item thread">
      <div>
        <p class="thread__title">
          <router-link :to="{name: 'ThreadView', params: {id: thread.id}}">{{ thread.title }}</router-link>
        </p>
        <p class="thread__info">
          Тема начата пользователем  
          <a href="#">{{ userById(thread.userId).name }}</a>, 
          {{ localeDate(thread.publishedAt) }}
        </p>
      </div>
      <div class="thread__activity">
        <p class="thread__replies-count">
        {{ thread.repliesCount > 0 ? thread.repliesCount : '' }}
        {{ repliesCountWording(thread.repliesCount) }}
        </p>
        <AppAvatar class="thread__avatar avatar_small" :src="userById(thread.userId).avatar" />
        <div>
          <p class="thread__user">
            <a href="#">{{ userById(thread.userId).name }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="no-threads">
    <em>Здесь пока нет тем. Создайте первую!</em>
  </div>
</template>

<script>
import { localeDate, findItemById, repliesCountWording } from '@/helpers'
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
      return findItemById(this.posts, postId)
    },
    userById (userId) {
      return findItemById(this.users, userId) || {}
    }
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
.thread__avatar {
  margin-right: 10px;
}
.no-threads {
  padding: 10px;
  text-align: center;
}
</style>
