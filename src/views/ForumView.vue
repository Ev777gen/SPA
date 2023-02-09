<template>
<div v-if="forum" class="forum">
  <div class="forum__header">
    <div class="forum__details">
      <h1 class="forum__title title">{{ forum.name }}</h1>
      <p class="forum__description">{{ forum.description }}</p>
    </div>
    <router-link
      :to="{name:'ThreadCreate', params: {forumId: forum.id}}"
      class="forum__button btn_orange btn_small"
    >
      Начать новую тему
    </router-link>
  </div>

  <div class="forum__thread-list">
    <ThreadList :threads="threads"/>
  </div>
</div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
//import { findById } from '@/helpers'
//import { mapActions } from 'vuex'
//import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: { ThreadList },
  //mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    }
  },
  /*data () {
    return {
      page: parseInt(this.$route.query.page) || 1,
      perPage: 10
    }
  },*/
  computed: {
    forum () {
      //return findById(this.$store.state.forums.items, this.id)
      //console.log('this.id', this.id)
      return this.$store.state.forums.find(forum => forum.id === this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.$store.state.threads
        .filter(thread => thread.forumId === this.forum.id)
        .map(thread => this.$store.getters.thread(thread.id))
    },
    /*threadCount () {
      return this.forum.threads?.length || 0
    },
    totalPages () {
      if (!this.threadCount) return 0
      return Math.ceil(this.threadCount / this.perPage)
    }*/
  },
  /*methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreadsByPage({ ids: forum.threads, page: this.page, perPage: this.perPage })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.asyncDataStatus_fetched()
  },
  watch: {
    async page (page) {
      this.$router.push({ query: { page: this.page } })
    }
  }*/
}
</script>

<style lang="scss" scoped>
.forum__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 30px;
}
.forum__details {
  flex-basis: 50%;
  @media (max-width: 720px) {
    & {
        flex-basis: 100%;
    }
  }
}
.forum__description {
  margin: 10px 0 15px 0;
  font-size: 16px;
}
.forum__button {
  align-self: flex-start;
}
</style>
