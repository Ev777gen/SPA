import router from '@/router';

export default {
  state: {
    breadcrumbs: [{ name: 'HomeView', nameToDisplay: 'Главная' }]
  },
  actions: {
    updateBreadcrumbs({state, dispatch}, route) {
      if (!route) return;
      if (route.meta.breadcrumb) {
        const lastIndex = state.breadcrumbs.length - 1;
        const currentIndex = state.breadcrumbs.findIndex(breadcrumb => breadcrumb.name === route.name);
        const hasSameNameAsLast = state.breadcrumbs[lastIndex].name === route.name;
        const isHomePage = route.path === '/';
        const isPageAdded = currentIndex > 0 && currentIndex <= lastIndex;
        
        if (!isPageAdded && !isHomePage) {
          dispatch('addBreadcrumb', route);
        } else if (isPageAdded && hasSameNameAsLast) {
          dispatch('replaceLastBreadcrumbWith', route);
        } else {
          dispatch('deleteNextBreadcrumbs', currentIndex);
        }
      } else {
        dispatch('initialiseBreadcrumbs');
      }
    },
    changeRoute (context, breadcrumb) {
      router.push({ 
        name: breadcrumb.name,
        params: breadcrumb.params,
        query: breadcrumb.query
      });
    },
    addBreadcrumb ({state}, route) {
      if (route) {
        const currentRoute = {
          name: route.name,
          params: route.params,
          query: route.query,
          nameToDisplay: route.meta.breadcrumb
        };
        state.breadcrumbs.push(currentRoute);
      }
    },
    deleteNextBreadcrumbs({state}, idx) {
      state.breadcrumbs.splice(idx + 1);
    },
    replaceLastBreadcrumbWith({state, dispatch}, route) {
      state.breadcrumbs.pop();
      dispatch('addBreadcrumb', route);
    },
    initialiseBreadcrumbs({state, dispatch}) {
      if (state.breadcrumbs.length > 0) {
        dispatch('deleteNextBreadcrumbs', 0);
      } else {
        state.breadcrumbs.push({ name: 'HomeView', nameToDisplay: 'Главная' });
      }
    }
  },
}