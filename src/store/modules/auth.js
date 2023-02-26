import { auth } from "@/main.js";
//import { doc, collection, getDocs, getDoc, query, where, orderBy, limit, startAfter} from 'firebase/firestore';
//import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider} from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


// Последняя версия

export default {
  state: {
    authId: null,
    authUserUnsubscribe: null,
    //authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      //console.log('auth.js -> authUser ', rootGetters.user(state.authId))
      return rootGetters.user(state.authId);
    }
    /*authUser: (state, getters) => {
      return getters.user(state.authId)
    }*/
  },
  actions: {
    async registerUserWithEmailAndPassword({ dispatch }, { name, username, email, password }) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await dispatch('createUser', { id: result.user.uid, name, username, email }, { root: true });
    },
    signInWithEmailAndPassword(context, { email, password }) {
      return signInWithEmailAndPassword(auth, email, password);
    },
    async signOut({ commit }) {
      await auth.signOut();
      commit('setAuthId', null);
    },
    // Пробую поменять
    async fetchAuthUser({ dispatch, commit }) {
      const userId = auth.currentUser?.uid;
      //console.log('auth.js -> fetchAuthUser ', 'auth', auth, 'userId', userId)
      if (!userId) return;
      await dispatch(
        'fetchItem',
        {
          resource: 'users',
          id: userId,
          handleUnsubscribe: unsubscribe => {
            commit('setAuthUserUnsubscribe', unsubscribe)
          }
        },
        { root: true }
      )
      
      //localStorage.setItem("uid", userId);
      commit('setAuthId', userId)
    },
    /*async updateEmail({ state }, { email }) {
      return updateEmail(auth.currentUser, email)
    },*/
    /*async reauthenticate({ state }, { email, password }) {
      try {
        const credential = EmailAuthProvider.credential(email, password)
        const user = auth.currentUser
        await reauthenticateWithCredential(user, credential)
      } catch (error) {
        console.log({ error })
      }
    },*/
    /*initAuthentication({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
          this.dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await this.dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },*/

    /*async uploadAvatar({ state }, { authId, file, filename }) {
      if (!file) return null
      authId = authId || state.authId
      filename = filename || file.name
      try {
        const storageRef = ref(
          storage,
          `uploads/${authId}/images/${Date.now()}-${filename}`
        )
        return uploadBytes(storageRef, file).then(snapshot => {
          return getDownloadURL(storageRef)
        })
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({
          message: 'Error uploading avatar image',
          type: 'error'
        })
      }
    },*/
    // Дублируется:
    /*fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = auth.currentUser?.uid;
      console.log('auth.js -> fetchAuthUser ', 'auth', auth, 'userId', userId)
      if (!userId) return;
      await dispatch(
        'fetchItem',
        {
          resource: 'users',
          id: userId,
          handleUnsubscribe: unsubscribe => {
            commit('setAuthUserUnsubscribe', unsubscribe)
          }
        },
        { root: true }
      )
      
      //localStorage.setItem("uid", userId);
      commit('setAuthId', userId)
    },*/
    /*async fetchAuthUsersPosts({ commit, state }, { lastPost }) {
      const queryArgs = [
        collection(db, 'posts'),
        where('userId', '==', state.authId),
        orderBy('publishedAt', 'desc'),
        lastPost
          ? startAfter(await getDoc(doc(db, 'posts', lastPost.id)))
          : null,
        limit(10)
      ].filter(param => param !== null)

      const postsQuery = query(...queryArgs)
      const querySnapshot = await getDocs(postsQuery)

      querySnapshot.forEach(item => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    },*/
    async unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
        commit('setAuthUserUnsubscribe', null);
      }
    }
  },
  mutations: {
    setAuthId(state, id) {
      //localStorage.getItem("uid");
      state.authId = id;
    },
    setAuthUserUnsubscribe(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe;
    },
    /*setAuthObserverUnsubscribe(state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }*/
  }
}











// Вторая версия
/*
export default {
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    }
  },
  actions: {
    async updateEmail({ state }, { email }) {
      return updateEmail(auth.currentUser, email)
    },
    async reauthenticate({ state }, { email, password }) {
      try {
        const credential = EmailAuthProvider.credential(email, password)
        const user = auth.currentUser
        await reauthenticateWithCredential(user, credential)
      } catch (error) {
        console.log({ error })
      }
    },
    initAuthentication({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
          this.dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await this.dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },
    async registerUserWithEmailAndPassword({ dispatch }, { name, username, email, password }) {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await dispatch('createUser', { id: result.user.uid, name, username, email }, { root: true })
    },
    async uploadAvatar({ state }, { authId, file, filename }) {
      if (!file) return null
      authId = authId || state.authId
      filename = filename || file.name
      try {
        const storageRef = ref(
          storage,
          `uploads/${authId}/images/${Date.now()}-${filename}`
        )
        return uploadBytes(storageRef, file).then(snapshot => {
          return getDownloadURL(storageRef)
        })
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({
          message: 'Error uploading avatar image',
          type: 'error'
        })
      }
    },
    signInWithEmailAndPassword(context, { email, password }) {
      return signInWithEmailAndPassword(auth, email, password)
    },
    async signOut({ commit }) {
      await auth.signOut()
      commit('setAuthId', null)
    },
    fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = auth.currentUser?.uid
      if (!userId) return
      await dispatch(
        'fetchItem',
        {
          resource: 'users',
          id: userId,
          handleUnsubscribe: unsubscribe => {
            commit('setAuthUserUnsubscribe', unsubscribe)
          }
        },
        { root: true }
      )

      commit('setAuthId', userId)
    },
    async fetchAuthUsersPosts({ commit, state }, { lastPost }) {
      const queryArgs = [
        collection(db, 'posts'),
        where('userId', '==', state.authId),
        orderBy('publishedAt', 'desc'),
        lastPost
          ? startAfter(await getDoc(doc(db, 'posts', lastPost.id)))
          : null,
        limit(10)
      ].filter(param => param !== null)

      const postsQuery = query(...queryArgs)
      const querySnapshot = await getDocs(postsQuery)

      querySnapshot.forEach(item => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    },
    async unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId(state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe(state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
*/






// Первая версия
/*
export default {
  state: {
    authId: null,
    //authUserUnsubscribe: null,
    //authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
    authUser: (state, getters) => {
      return getters.user(state.authId)
    }
  },
  actions: {
    async updateEmail ({ state }, { email }) {
      return firebase.auth().currentUser.updateEmail(email)
    },
    async reauthenticate ({ state }, { email, password }) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password)
      await firebase.auth().currentUser.reauthenticateWithCredential(credential)
    },
    initAuthentication ({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },
    async registerUserWithEmailAndPassword ({ dispatch }, { name, username, email, password }) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await dispatch('createUser', { id: result.user.uid, name, username, email });
      await dispatch('fetchAuthUser');
    },
    async uploadAvatar ({ state }, { authId, file, filename }) {
      if (!file) return null
      authId = authId || state.authId
      filename = filename || file.name
      try {
        const storageBucket = firebase.storage().ref().child(`uploads/${authId}/images/${Date.now()}-${filename}`)
        const snapshot = await storageBucket.put(file)
        const url = await snapshot.ref.getDownloadURL()
        return url
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({ message: 'Error uploading avatar image', type: 'error' })
      }
    },
    signInWithEmailAndPassword (context, { email, password }) {
      return signInWithEmailAndPassword(auth, email, password);
    },
    async signInWithGoogle ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = firebase.firestore().collection('users').doc(user.uid)
      const userDoc = await userRef.get()
      if (!userDoc.exists) {
        return dispatch('users/createUser',
          { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL },
          { root: true }
        )
      }
    },
    async signOut ({ commit }) {
      await firebase.auth().signOut()

      commit('setAuthId', null)
    },
    fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await dispatch('fetchItem', {
          resource: 'users',
          id: userId/*,
          handleUnsubscribe: unsubscribe => {
            commit('setAuthUserUnsubscribe', unsubscribe)
          }
        }
      )

      commit('setAuthId', userId);
    },
    async fetchAuthUsersPosts ({ commit, state }, { startAfter }) {
      // limit(10)
      // startAfter(doc)
      // orderBy()
      let query = await firebase.firestore().collection('posts')
        .where('userId', '==', state.authId)
        .orderBy('publishedAt', 'desc')
        .limit(10)
      if (startAfter) {
        const doc = await firebase.firestore().collection('posts').doc(startAfter.id).get()
        query = query.startAfter(doc)
      }
      const posts = await query.get()
      posts.forEach(item => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    },
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },
    /*setAuthUserUnsubscribe (state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
*/