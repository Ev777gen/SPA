import { createStore } from 'vuex';
import { findItemById } from '@/helpers';
//import testData from "@/data.json";
import { db } from "@/main.js";
//import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion, writeBatch, serverTimestamp } from "firebase/firestore/lite";
import { collection, getDocs, onSnapshot, doc, arrayUnion, writeBatch, serverTimestamp, increment } from "firebase/firestore";

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
    users: [
      {
        "avatar": "https://icons.iconarchive.com/icons/iconka/meow/128/cat-eyes-icon.png",
        "email": "email@mail.ru",
        "name": "Мистер Кэт",
        "username": "username1",
        "usernameLower": "username1",
        "id": "1",
        "bio": "Обожаю программировать",
        "registeredAt": 1594632260,
        "lastVisitAt": 1594772078,
        "postsCount": 1,
        "threadsStarted": ["1"]
      }
    ],
    unsubscribes: [],
    isLoaded: true,
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
          get threadsStarted () {
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
    /*setThread(state, {thread}) {
      pushItemToStore(state.threads, thread)
    },
    setPost(state, {post}) {
      pushItemToStore(state.posts, post)
    },
    setUser(state, {user}) {
      pushItemToStore(state.users, user)
    },*/
    setItem(state, { resource, item }) {
      pushItemToStore(state[resource], item);
    },
    appendPostToThread: makeAppendChildToParentMutation({child: 'postIds', parent: 'threads'}),
    appendContributorToThread: makeAppendChildToParentMutation({child: 'contributorIds', parent: 'threads'}),
    appendThreadToForum: makeAppendChildToParentMutation({child: 'threadIds', parent: 'forums'}),
    appendThreadToUser: makeAppendChildToParentMutation({child: 'threadsStarted', parent: 'users'}),
    // Мутации для работы с обновлением в реальном времени из БД
    appendUnsubscribe (state, { unsubscribe }) {
      state.unsubscribes.push(unsubscribe);
    },
    clearAllUnsubscribes (state) {
      state.unsubscribes = [];
    },
    setIsLoadedStatus(state, status) {
      state.isLoaded = status;
    }
  },
  actions: {
    /*
    //------------------------------------------------------------
    // На тестовых данных:
    //------------------------------------------------------------
    async createThread({commit, state, dispatch}, {title, text, forumId}) {
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
    },
    async createPost({state, commit}, post) {
      post.id = 'p' + Math.random();  // Здесь должна быть функция генерации id
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      // Добавляем пост в store, чтобы он сразу отобразился на странице
      commit('setItem', { resource: 'posts', item: { ...post, id: post.id } });
      commit('appendPostToThread', {childId: post.id, parentId: post.threadId});
      commit('appendContributorToThread', {childId: post.userId, parentId: post.threadId});
    },
    */
    //------------------------------------------------------------
    // На Firebase:
    //------------------------------------------------------------
    // Запись в Cloud Firestore
    //------------------------------------------------------------
    async createThread({commit, state, dispatch}, {title, text, forumId}) {
      //const id = 't' + Math.random();  // Здесь должна быть функция генерации id
      const userId = state.authId;
      //const publishedAt = Math.floor(Date.now() / 1000);
      //const thread = { forumId, title, publishedAt, userId }; // Убрал отсюда id
      const thread = { forumId, title, userId }; // Убрал отсюда id и publishedAt
      // Добавляем thread в базу данных Cloud Firestore: 
      // - сам thread добавляем в коллекцию threads
      // - его id добавляем в соответствующий форум
      // - его id добавляем пользователю, который его создал
      
      // Это последняя версия, с batch:
      const batch = writeBatch(db);
      const threadRef = doc(collection(db, "threads")); // Создает новый thread с id 
      const forumRef = doc(db, "forums", thread.forumId);
      const userRef = doc(db, "users", thread.userId);
      batch.set(threadRef, thread);
      batch.update(threadRef, {
        publishedAt: serverTimestamp()
      });
      batch.update(forumRef, {
        threadIds: arrayUnion(threadRef.id),
      });
      batch.update(userRef, {
        threadsStarted: arrayUnion(threadRef.id),
      });
      await batch.commit();
      // Делаем то же самое в store, чтобы созданная тема сразу отобразилась на странице
      const newThread = await dispatch("fetchThread", { id: threadRef.id });
      console.log(newThread)
      commit('setItem', { resource: 'threads', item: { ...newThread, id: newThread.id } });
      commit('appendThreadToForum', {forumId, threadId: newThread.id});
      commit('appendThreadToUser', {userId, threadId: newThread.id});
      await dispatch('createPost', {text, threadId: newThread.id});
      return findItemById(state.threads, newThread.id);
      /*
      // Это первая версия, без batch:
      const newThread = await addDoc(collection(db, "threads"), thread);
      await updateDoc(doc(db, "forums", thread.forumId), {
        threadIds: arrayUnion(newThread.id),
      });
      await updateDoc(doc(db, "users", thread.userId), {
        threadsStarted: arrayUnion(newThread.id),
      });
      // Делаем то же самое в store, чтобы созданная тема сразу отобразилась на странице
      commit('setItem', { resource: 'threads', item: { ...thread, id: newThread.id } });
      commit('appendThreadToForum', {forumId, threadId: newThread.id});
      commit('appendThreadToUser', {userId, threadId: newThread.id});
      dispatch('createPost', {text, threadId: newThread.id});
      return state.threads.find(thread => thread.id === newThread.id);
      */
    },
    async updateThread({commit, state, dispatch}, {title, text, id}) {
      const thread = findItemById(state.threads, id);
      const post = findItemById(state.posts, thread.postIds[0]);
      let newThread = { ...thread, title };
      let newPost = { ...post, text };
      // Изменяем thread в базе данных Cloud Firestore:
      // Это последняя версия, с batch:
      const batch = writeBatch(db);
      const threadRef = doc(db, "threads", id);
      const postRef = doc(db, "posts", thread.postIds[0]);
      batch.update(threadRef, { title });
      batch.update(postRef, { text });
      await batch.commit();
      // Делаем то же самое в store, чтобы измененная тема сразу отобразилась на странице
      // Сначала загружаем посты из БД, чтобы точно работать со свежими данными
      newThread = await dispatch("fetchThread", { id: threadRef.id });
      newPost = await dispatch("fetchPost", { id: postRef.id });
      // И выполняем мутации
      commit('setItem', { resource: 'threads', item: { ...newThread, id: newThread.id } });
      commit('setItem', { resource: 'posts', item: { ...newPost, id: newPost.id } });
      //commit('setItem', { resource: 'threads', item: { thread: newThread } });
      //commit('setItem', { resource: 'posts', item: { post: newPost } });
      return newThread;
      /*
      // Это первая версия, без batch:
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
      */
    },
    // На Firebase:
    async createPost({state, commit, dispatch}, post) {
      //post.id = 'qqqq' + Math.random();  // Здесь должна быть функция генерации id
      post.userId = state.authId;
      //post.publishedAt = Math.floor(Date.now() / 1000);
      // Добавляем пост в базу данных Cloud Firebase: 
      // - сам пост добавляем в коллекцию постов posts
      // - id поста добавляем в соответствующий thread
      // - id пользователя, написавшего пост, тоже добавлям в этот же thread
      // Это последняя версия, с batch:
      const batch = writeBatch(db);
      const postRef = doc(collection(db, "posts"));
      const threadRef = doc(db, "threads", post.threadId);
      const userRef = doc(db, "users", post.userId);

      batch.set(postRef, post);
      batch.update(postRef, {
        publishedAt: serverTimestamp()
      });
      batch.update(threadRef, {
        postIds: arrayUnion(postRef.id),
        contributorIds: arrayUnion(state.authId)
      });
      batch.update(userRef, {
        postsCount: increment(1)
      });
      await batch.commit();
      // Делаем то же самое в store, чтобы пост сразу отобразился на странице
      const newPost = await dispatch("fetchPost", { id: postRef.id });
      commit('setItem', { resource: 'posts', item: { ...newPost, id: postRef.id } });
      commit('appendPostToThread', {childId: postRef.id, parentId: post.threadId});
      commit('appendContributorToThread', {childId: post.userId, parentId: post.threadId});
      /*
      // Это первая версия, без batch:
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
      */
    },
    async updatePost ({ commit, state, dispatch }, { text, id }) {
      const batch = writeBatch(db);
      const postRef = doc(db, "posts", id);
      batch.update(postRef, {
        text,
        edited: {
          at: serverTimestamp(),
          by: state.authId,
          moderated: false
        }
      });
      await batch.commit();
      const updatedPost = await dispatch("fetchPost", { id });
      commit('setItem', { resource: 'posts', item: updatedPost });
    },
    updateUser({commit}, user) {
      commit('setUser', {user, userId: user.id});
    },
    //------------------------------------------------------------
    // Чтение из Cloud Firestore
    //------------------------------------------------------------
    // Создаем два универсальных метода для чтения из базы данных: 
    //------------------------------------------------------------
    // Первый – для получения одного документа
    async fetchItem({ commit }, { resource, id }) {
      
      // Первый вариант - обновление данных в реальном времени
      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(doc(db, resource, id), (doc) => {
          //console.log('snapshot', id);
          // Восстанавливаем полный документ = данные + id
          const item = { ...doc.data(), id: doc.id };
          // Добавляем документ в state
          commit('setItem', { resource, item });
          resolve(item);
        });
        commit('appendUnsubscribe', { unsubscribe });
      });
      
      /*
      // Второй вариант - одиночный запрос
      const docRef = doc(db, resource, id);
      const docSnap = await getDoc(docRef);
      console.log('snapshot', id)
      // Восстанавливаем полный документ = данные + id
      const item = { ...docSnap.data(), id: docSnap.id };
      // Добавляем документ в state
      commit('setItem', { resource, item });
      // Дополнительно возвращаем промис, чтобы результат вызова этой функции не был  
      // равен undefined и его можно было бы использовать в Компонентах.vue
      return Promise.resolve(item);
      */
    },
    // Второй – для получения нескольких документов из коллекции
    fetchItems({dispatch}, { resource, ids }) {
      //console.log('fetchItems', ids, resource)
      return Promise.all(ids.map(id => dispatch('fetchItem', { resource, id })));
    },
    // Вспомогательный метод для работы с обновлением в реальном времени
    // Удаляем все onSnapshot listeners
    // Вызываем эту функцию в глобальном Navigation Guard (src/router/index.js)
    async unsubscribeAllSnapshots ({ state, commit }) {
      //console.log('state.unsubscribes', state.unsubscribes)
      state.unsubscribes.forEach(unsubscribe => unsubscribe());
      commit('clearAllUnsubscribes');
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
    // Установка и сброс переменной для индикатора загрузки
    startLoadingIndicator({commit}) {
      commit('setIsLoadedStatus', false);
    },
    stopLoadingIndicator({commit}) {
      commit('setIsLoadedStatus', true);
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