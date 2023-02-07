import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue')
  },
  {
    path: '/forum/:id',
    name: 'Forum',
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
    //meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
