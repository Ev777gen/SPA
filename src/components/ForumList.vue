<template>
  <div>
    <div class="forums">
      <div class="forums__list forum" v-for="forum in forums" :key="forum.id">
        <div class="forum__details">
          <router-link
            :to="{name: 'Forum', params: {id: forum.id}}"
            class="forum__title link"
          >
            {{ forum.name }}
          </router-link>
          <p>{{ forum.description }}</p>
        </div>

        <div class="forum__threads-count">
          {{ forum.threadIds?.length }}
          {{ forumThreadsWord(forum) }}
        </div>
        <!-- на будущее -->
        <div class="forum__last-thread">???</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    forums: {
      required: true,
      type: Array
    }
  },
  methods: {
    forumThreadsWord (forum) {
      console.log(forum.id)
      console.log(typeof forum.id)
      const threadsCount = forum.threadIds?.length;
      if (threadsCount) {
        if (threadsCount === 1) {
          return ' тема';
        } else if (threadsCount > 1 && threadsCount < 5) {
          return ' темы';
        } else {
          return ' тем';
        }
      }
      return 'нет тем';
    }
  }
}
</script>

<style lang="scss" scoped>
.forums {
  padding: 0;
  background: white;
  /*margin: 20px 0;*/
}
.forums__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px 15px 30px;
  &:nth-child(odd) {
    background: #eee;
  }
}
.forum__details {
  flex-basis: 50%;
}
@media (max-width: 720px) {
  .forum__details {
      flex-basis: 100%;
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
