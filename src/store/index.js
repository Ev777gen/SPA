import { createStore } from 'vuex';
import testData from "@/data.json";

export default createStore({
  state: {
    categories: testData.categories,
    forums: testData.forums,
    threads: testData.threads,
    posts: testData.posts,
    users: testData.users,
    authId: '1',
  },
  getters: {
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return state.threads.filter(post => post.userId === user.id)
          },
          get threadIds () {
            return user.threadsStarted
          },
          get threadsCount () {
            return user.threadsStarted?.length || 0
          }
        }
      }
    },
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
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
    },
  },
  mutations: {
    setPost(state, {post}) {
      pushItemToStore(state.posts, post)
    },
    setThread(state, {thread}) {
      pushItemToStore(state.threads, thread)
    },
    setUser(state, {user}) {
      pushItemToStore(state.users, user)
    },
    setItem(state, { resource, item }) {
      pushItemToStore(state[resource], item);
    },
    appendPostToThread: makeAppendChildToParentMutation({child: 'posts', parent: 'threads'}),
    appendThreadToForum: makeAppendChildToParentMutation({child: 'threads', parent: 'forums'}),
    appendThreadToUser: makeAppendChildToParentMutation({child: 'threads', parent: 'users'}),
    appendContributorToThread: makeAppendChildToParentMutation({child: 'contributors', parent: 'threads'}),
  },
  actions: {
    async createPost({state, commit}, post) {
      post.id = 'a' + Math.random();  // Здесь должна быть функция генерации id
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      // Добавляем пост в store, чтобы он сразу отобразился на странице
      commit('setItem', { resource: 'posts', item: { ...post, id: post.id } });
      commit('appendPostToThread', {childId: post.id, parentId: post.threadId});
      commit('appendContributorToThread', {childId: post.userId, parentId: post.threadId});
    },
    /*async createPost({state, commit}, post) {
      //post.id = 'qqqq' + Math.random();  // Здесь должна быть функция генерации id
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      // Добавляем пост в базу данных: 
      // - сам пост добавляем в коллекцию постов posts
      // - id поста добавляем в соответствующий thread
      // - id пользователя, написавшего пост, добавлям во thread
      const newPost = await addDoc(collection(db, "posts"), post);
      //console.log(newPost);
      //console.log(newPost.data());
      await updateDoc(doc(db, "threads", post.threadId), {
        posts: arrayUnion(newPost.id),
        contributors: arrayUnion(state.authId)
      });
      // Делаем то же самое в store, чтобы пост сразу отобразился на странице
      commit('setItem', { resorce: 'posts', item: { ...post, id: newPost.id } });
      commit('appendPostToThread', {childId: newPost.id, parentId: post.threadId});
      commit('appendContributorToThread', {childId: post.userId, parentId: post.threadId});
      // Hello! This is the first post to be loaded to the Cloud Firestore database!
    },*/
  },
  modules: {
  }
})

// Вспомогательные функции
function findById(resources, id) {
  if (!resources) return null
  return resources.find(r => r.id === id)
}
function makeAppendChildToParentMutation({child, parent}) {
  return (state, { childId, parentId }) => {
    const resorce = state[parent].find(r => r.id === parentId)
    if (!resorce) {
      console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because parent did't exist`);
      return;
    }
    resorce[child] = resorce[child] || []
    if (!resorce[child].includes(childId)) { // Чтобы добавить пользователя в список только один раз (т.к. они могут по много раз отвечать на одной ветке / форуме и т.д.)
      resorce[child].push(childId)
    }
  }
}
function pushItemToStore(resources, item) {
  const index = resources.findIndex(r => r.id === item.id);
  if (item.id && index !== -1) {
    resources[index] = item;
  } else {
    resources.push(item);
  }
}