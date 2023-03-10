import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import { findItemById } from '@/helpers';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue'),
    meta: { toTop: true, smoothScroll: true }
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: () => import(/* webpackChunkName: "ProfileView" */'@/views/ProfileView.vue'),
    props: { edit: false },
    meta: { isAuthRequired: true, toTop: true, smoothScroll: true }
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import(/* webpackChunkName: "ProfileEdit" */'@/views/ProfileView.vue'),
    props: { edit: true },
    meta: { isAuthRequired: true }
  },
  {
    path: '/profile/:userId',
    name: 'ProfileOfAnyUser',
    component: () => import(/* webpackChunkName: "ProfileOfAnyUser" */'@/views/ProfileView.vue'),
    props: true,
    meta: { toTop: true, smoothScroll: true }
  },
  {
    path: '/settings',
    name: 'SettingsView',
    component: () => import(/* webpackChunkName: "SettingsView" */'@/views/SettingsView.vue'),
    meta: { isAuthRequired: true, toTop: true, smoothScroll: true }
  },
  {
    path: '/register',
    name: 'RegisterForm',
    component: () => import(/* webpackChunkName: "RegisterForm" */'@/views/RegisterForm.vue'),
    meta: { isForGuests: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import(/* webpackChunkName: "SignIn" */'@/views/SignIn.vue'),
    meta: { isForGuests: true }
  },
  {
    path: '/forum',
    name: 'ForumMainPage',
    component: () => import(/* webpackChunkName: "ForumMainPage" */ '@/views/ForumMainPage.vue')
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
    async beforeEnter (to, from, next) {
      await store.dispatch('fetchThread', { id: to.params.id, once: true });
      // ??????????????????, ???????? ???? ?????????? ????????
      const threadExists = findItemById(store.state.threads, to.params.id);
      // ???????? ???????? - ????????????????????
      if (threadExists) {
        return next();
      } else {
        // ???????? ?????????? ???????? ?????? - ?????????????????? ???? ???????????????? 404
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          // ?????????????????? ?????????????? ???????????????? query ?? hash
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: () => import(/* webpackChunkName: "ThreadCreate" */ '@/views/ThreadCreate.vue'),
    props: true,
    meta: { isAuthRequired: true }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import(/* webpackChunkName: "ThreadEdit" */'@/views/ThreadEdit.vue'),
    props: true,
    meta: { isAuthRequired: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */'@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to) => {
  await store.dispatch('initAuthentication');
  store.dispatch('unsubscribeAllSnapshots');
  if (to.meta.isAuthRequired && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } };
  }
  if (to.meta.isForGuests && store.state.auth.authId) {
    return { name: 'HomeView' };
  }
});

export default router;
