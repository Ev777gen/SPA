<template>
  <div v-if="asyncDataStatus_isReady">
    <h1 class="title">
      Создать новую тему в форуме <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false"/>
  </div>
</template>
<script>
import ThreadEditor from '@/components/ThreadEditor'
import { findItemById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
  props: {
    forumId: { 
      type: String, 
      required: true 
    }
  },
  data () {
    return {
      formIsDirty: false
    }
  },
  computed: {
    forum () {
      return findItemById(this.$store.state.forums, this.forumId)
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'createThread']),
    async save ({ title, text }) {
      const thread = await this.createThread({
        title,
        text,
        forumId: this.forum.id
        //forumId
      });
      //console.log('thread', thread, 'thread.id', thread.id)
      this.$router.push({ name: 'ThreadView', params: { id: thread.id } });
    },
    cancel () {
      this.$router.push({ name: 'ForumView', params: { id: this.forum.id } });
    }
  },
  async created () {
    await this.fetchForum({ id: this.forumId });
    this.asyncDataStatus_loaded();
  },
  beforeRouteLeave () {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost!');
      if (!confirmed) return false;
    }
  }
}
</script>

<style scoped>
.title {
  margin: 35px 0;
}
</style>