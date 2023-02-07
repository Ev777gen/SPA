import { createStore } from 'vuex';
import testData from "@/data.json";

export default createStore({
  state: {
    categories: testData.categories,
    forums: testData.forums,
    threads: testData.threads,
    posts: testData.posts,
    users: testData.users,
  },
  getters: {
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.postIds.length - 1
          },
          get contributorsCount () {
            if (!thread.contributorIds) return 0
            return thread.contributorIds.length
          }
        }
      }
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

const findById = (resources, id) => {
  if (!resources) return null
  return resources.find(r => r.id === id)
}