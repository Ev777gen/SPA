<template>
  <div v-if="asyncDataStatus_isReady" >
    <h1 class="title">
      Редактирование темы <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
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
    id: { type: String, required: true }
  },
  data () {
    return {
      formIsDirty: false
    }
  },
  computed: {
    thread () {
      return findItemById(this.$store.state.threads, this.id);
    },
    text () {
      const post = findItemById(this.$store.state.posts, this.thread.postIds[0]);
      return post ? post.text : '';
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'updateThread', 'fetchPost']),
    async save ({ title, text }) {
      const thread = await this.updateThread({
        id: this.id,
        title,
        text
      });
      //console.log('thread', thread)
      this.$router.push({ name: 'ThreadView', params: { id: thread.id } });
    },
    cancel () {
      //console.log(this.id)
      this.$router.push({ name: 'ThreadView', params: { id: this.id } });
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.id });
    await this.fetchPost({ id: thread.postIds[0] });
    this.asyncDataStatus_loaded();
  },
  beforeRouteLeave () {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Вы уверены, что хотите покинуть страницу? Все несохраненные изменения будут потеряны.');
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