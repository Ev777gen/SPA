import { createStore } from 'vuex';
import { findItemById } from '@/helpers';
//import testData from "@/data.json";
import { db } from "@/main.js";
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore/lite";

export default createStore({
  state: {
    // На тестовых данных:
    /*categories: testData.categories,
    forums: testData.forums,
    threads: testData.threads,
    posts: testData.posts,
    users: testData.users,*/
    // На Firebase:
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: '1',
  },
  getters: {
    user: (state) => {
      return (id) => {
        const user = findItemById(state.users, id)
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
          get threadIds () { // Может быть переименовать в threadsStarted ???????????????????????
            return user.threadsStarted
          },
          get threadsCount () {
            return user.threadsStarted?.length || 0
          }
        }
      }
    },
    authUser: (state, getters) => {
      //console.log(getters.user(state.authId))
      return getters.user(state.authId)
    },
    thread: (state) => {
      return (id) => {
        const thread = findItemById(state.threads, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
            return findItemById(state.users, thread.userId)
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
    setThread(state, {thread}) {
      pushItemToStore(state.threads, thread)
    },
    setPost(state, {post}) {
      pushItemToStore(state.posts, post)
    },
    setUser(state, {user}) {
      pushItemToStore(state.users, user)
    },
    setItem(state, { resource, item }) {
      pushItemToStore(state[resource], item);
    },
    appendPostToThread: makeAppendChildToParentMutation({child: 'postIds', parent: 'threads'}),
    appendContributorToThread: makeAppendChildToParentMutation({child: 'contributorIds', parent: 'threads'}),
    appendThreadToForum: makeAppendChildToParentMutation({child: 'threadIds', parent: 'forums'}),
    appendThreadToUser: makeAppendChildToParentMutation({child: 'threadsStarted', parent: 'users'}),
  },
  actions: {
    // На тестовых данных:
    /*async createThread({commit, state, dispatch}, {title, text, forumId}) {
      const id = 't' + Math.random();  // Здесь должна быть функция генерации id
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId, id };
      commit('setThread', {thread});
      commit('appendThreadToForum', {forumId, threadId: id});
      commit('appendThreadToUser', {userId, threadId: id});
      dispatch('createPost', {text, threadId: id});
      return state.threads.find(thread => thread.id === id)
    },
    async updateThread({commit, state}, {title, text, id}) {
      const thread = state.threads.find(thread => thread.id === id);
      const post = state.posts.find(post => post.id === thread.postIds[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };
      commit('setThread', { thread: newThread });
      commit('setPost', { post: newPost });
      return newThread;
    },*/
    // На Firebase:
    async createThread({commit, state, dispatch}, {title, text, forumId}) {
      //const id = 't' + Math.random();  // Здесь должна быть функция генерации id
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId }; // Убрал отсюда id
      // Добавляем thread в базу данных Cloud Firestore: 
      // - сам thread добавляем в коллекцию threads
      // - его id добавляем в соответствующий форум
      // - его id добавляем пользователю, который его создал
      const newThread = await addDoc(collection(db, "threads"), thread);
      await updateDoc(doc(db, "forums", thread.forumId), {
        threadIds: arrayUnion(newThread.id),
      });
      await updateDoc(doc(db, "users", thread.userId), {
        threadsStarted: arrayUnion(newThread.id),
      });
      // Делаем то же самое в store, чтобы созданная тема сразу отобразилась на странице
      //console.log({ ...thread, id: newThread.id })
      commit('setItem', { resource: 'threads', item: { ...thread, id: newThread.id } });
      commit('appendThreadToForum', {forumId, threadId: newThread.id});
      commit('appendThreadToUser', {userId, threadId: newThread.id});
      dispatch('createPost', {text, threadId: newThread.id});
      return state.threads.find(thread => thread.id === newThread.id)
    },
    async updateThread({commit, state}, {title, text, id}) {
      const thread = findItemById(state.threads, id);
      const post = findItemById(state.posts, thread.postIds[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };
      // Изменяем thread в базе данных Cloud Firestore:
      await updateDoc(doc(db, "threads", id), {
        title
      });
      await updateDoc(doc(db, "posts", thread.postIds[0]), {
        text
      });
      // Делаем то же самое в store, чтобы измененная тема сразу отобразилась на странице
      commit('setThread', { thread: newThread });
      commit('setPost', { post: newPost });
      return newThread;
    },
    // На тестовых данных:
    /*async createPost({state, commit}, post) {
      post.id = 'p' + Math.random();  // Здесь должна быть функция генерации id
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      // Добавляем пост в store, чтобы он сразу отобразился на странице
      commit('setItem', { resource: 'posts', item: { ...post, id: post.id } });
      commit('appendPostToThread', {childId: post.id, parentId: post.threadId});
      commit('appendContributorToThread', {childId: post.userId, parentId: post.threadId});
    },*/
    // На Firebase:
    async createPost({state, commit}, post) {
      //post.id = 'qqqq' + Math.random();  // Здесь должна быть функция генерации id
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      // Добавляем пост в базу данных Cloud Firebase: 
      // - сам пост добавляем в коллекцию постов posts
      // - id поста добавляем в соответствующий thread
      // - id пользователя, написавшего пост, тоже добавлям в этот же thread
      const newPost = await addDoc(collection(db, "posts"), post);
      //console.log(newPost);
      //console.log(newPost.data());
      await updateDoc(doc(db, "threads", post.threadId), {
        postIds: arrayUnion(newPost.id),
        contributorIds: arrayUnion(state.authId)
      });
      // Делаем то же самое в store, чтобы пост сразу отобразился на странице
      commit('setItem', { resource: 'posts', item: { ...post, id: newPost.id } });
      commit('appendPostToThread', {childId: newPost.id, parentId: post.threadId});
      commit('appendContributorToThread', {childId: post.userId, parentId: post.threadId});
    },
    updateUser({commit}, user) {
      commit('setUser', {user, userId: user.id});
    },
    //------------------------------------------------------------
    // Firebase
    //------------------------------------------------------------
    // Создаем два универсальных метода для чтения из базы данных: 
    //------------------------------------------------------------
    // Первый – для получения одного документа
    async fetchItem({ commit }, {id, resource}) {
      let item = {};
      // Запрашиваем коллекцию
      const querySnapshot = await getDocs(collection(db, resource));
      // Выбираем из нее нужный документ по какому-то условию
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          // Восстанавливаем полный документ = данные + id
          item = { ...doc.data(), id: doc.id };
          // Добавляем документ в state с помощью мутации
          commit('setItem', { resource, item });
        }
      });
      // Дополнительно возвращаем промис, чтобы результат вызова этой функции не был  
      // равен undefined и его можно было бы использовать в Компонентах.vue
      //console.log('fetchItem', id, resource)
      return Promise.resolve(item);
    },
    // Второй – для получения нескольких документов из коллекции
    fetchItems({dispatch}, { ids, resource }) {
      //console.log('fetchItems', ids, resource)
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })));
    },
    //-------------------------------------------------------------
    // Создаем на их основе методы чтения из базы данных
    //-------------------------------------------------------------
    // Для одного item
    fetchCategory({ dispatch }, {id}) {
      return dispatch('fetchItem', { resource: 'categories', id });
    },
    fetchForum({ dispatch }, {id}) {
      return dispatch('fetchItem', { resource: 'forums', id });
    },
    fetchThread({ dispatch }, {id}) {
      return dispatch('fetchItem', { resource: 'threads', id });
    },
    fetchPost({ dispatch }, {id}) {
      return dispatch('fetchItem', { resource: 'posts', id });
    },
    fetchUser({ dispatch }, {id}) {
      return dispatch('fetchItem', { resource: 'users', id });
    },
    fetchAuthUser({ state, dispatch }) {
      return dispatch('fetchItem', { resource: 'users', id: state.authId });
    },
    // Для нескольких items
    async fetchAllCategories({ commit }) {
      let categories = [];
      const querySnapshot = await getDocs(collection(db, 'categories'));
      querySnapshot.forEach((doc) => {
        const item = { ...doc.data(), id: doc.id };
        categories.push(item);
        commit('setItem', { resource: 'categories', item });
      });
      return Promise.resolve(categories);
    },
    fetchForums({ dispatch }, {ids}) {
      return dispatch('fetchItems', { resource: 'forums', ids });
    },
    fetchThreads({ dispatch }, {ids}) {
      return dispatch('fetchItems', { resource: 'threads', ids });
    },
    fetchPosts({ dispatch }, {ids}) {
      return dispatch('fetchItems', { resource: 'posts', ids });
    },
    fetchUsers({ dispatch }, {ids}) {
      return dispatch('fetchItems', { resource: 'users', ids });
    },
  },
  modules: {
  }
})

// Вспомогательные функции
function makeAppendChildToParentMutation({child, parent}) {
  return (state, { childId, parentId }) => {
    const resource = state[parent].find(r => r.id === parentId)
    if (!resource) {
      console.warn(`Не удалось добавить ${child} ${childId} к ${parent} ${parentId} т.к. родитель не существует.`);
      return;
    }
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) { // Чтобы добавить пользователя в список только один раз (т.к. они могут по много раз отвечать на одной ветке / форуме и т.д.)
      resource[child].push(childId)
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