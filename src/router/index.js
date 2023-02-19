import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue')
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: () => import(/* webpackChunkName: "ProfileView" */'@/views/ProfileView.vue'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "SignIn" */'@/views/SignIn.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import(/* webpackChunkName: "RegisterPage" */'@/views/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forum/:id',
    name: 'ForumView',
    component: () => import(/* webpackChunkName: "Forum" */ '@/views/ForumView.vue'),
    props: true
  },
  {
    path: '/thread/:id',
    name: 'ThreadView',
    component: () => import(/* webpackChunkName: "ThreadView" */ '@/views/ThreadView.vue'),
    props: true,
    /*async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
      // check if thread exists
      const threadExists = findById(store.state.threads.items, to.params.id)
      // if exists continue
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          // preserve existing query and hash
          query: to.query,
          hash: to.hash
        })
      }
      // if doesnt exist redirect to not found
    }*/
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: () => import(/* webpackChunkName: "ThreadCreate" */ '@/views/ThreadCreate.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import(/* webpackChunkName: "ThreadEdit" */'@/views/ThreadEdit.vue'),
    props: true,
    meta: { requiresAuth: true }
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from) => {
  //await store.dispatch('auth/initAuthentication');
  store.dispatch('unsubscribeAllSnapshots');
  /*if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } };
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' };
  }*/
});

export default router;
