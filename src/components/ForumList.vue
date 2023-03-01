<template>
  <div class="list">
    <div class="list__item forum" v-for="forum in forums" :key="forum.id">
      <div class="forum__details">
        <router-link
          :to="{name: 'ForumView', params: {id: forum.id}}"
          class="forum__title link"
        >
          {{ forum.name }}
        </router-link>
        <p>{{ forum.description }}</p>
      </div>

      <div class="forum__threads-count desktop-only">
        {{ forum.threadIds?.length }}
        {{ forumThreadsCountWording(forum.threadIds?.length) }}
      </div>
      <!-- на будущее 
      <div class="forum__last-thread">???</div>-->
    </div>
  </div>
</template>

<script>
import { forumThreadsCountWording } from '@/helpers';
export default {
  props: {
    forums: {
      type: Array,
      required: true
    }
  },
  methods: {
    forumThreadsCountWording
  }
}
</script>

<style lang="scss" scoped>
.forum__details {
  flex-basis: 50%;
  @media (max-width: 720px) {
    & {
      flex-basis: 100%;
    }
  }
}
.forum__title {
  font-size: 18px;
}
.forum__threads-count {
  flex-basis: 12%;
  text-align: center;
  font-weight: 100;
}

/* на будущее */
.forum__last-thread {
  flex-basis: 32%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
