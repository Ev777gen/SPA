<template>
  <div class="breadcrumb">
    <ul v-if="breadcrumbs.length > 1">
      <li
        v-for="(breadcrumb, idx) in breadcrumbs"
        :key="breadcrumb.name"
        @click="changeRoute(breadcrumb, idx)"
        :class="{'clickable': idx < breadcrumbs.length - 1}"
      >
        {{ breadcrumb.nameToDisplay }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbs: []
    }
  },
  methods: {
    changeRoute (breadcrumb, idx) {
      if (idx < this.breadcrumbs.length - 1) {
        this.$router.push({ 
          name: breadcrumb.name,
          params: breadcrumb.params,
          query: breadcrumb.query
        });
        this.deleteBreadcrumbs(idx + 1);
      }
      if (this.breadcrumbs.length === 0) {
        console.log('ini')
        this.initialiseBreadcrumbs();
      }
    },
    addBreadcrumb () {
      const currentRoute = {
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query,
        nameToDisplay: this.$route.meta.breadcrumb
      };
      this.breadcrumbs.push(currentRoute);
    },
    deleteBreadcrumbs(idx) {
      this.breadcrumbs.splice(idx);
    },
    replaceLastBreadcrumb() {
      this.breadcrumbs.pop();
      this.addBreadcrumb();
    },
    initialiseBreadcrumbs() {
      if (this.breadcrumbs.length > 0) {
        this.deleteBreadcrumbs(1);
      } else {
        this.breadcrumbs.push({ name: 'HomeView', nameToDisplay: 'Главная' });
      }
    }
  },
  watch: { 
    '$route'() {
      if (this.$route.meta.breadcrumb) {
        const lastIndex = this.breadcrumbs.length - 1;
        const currentIndex = this.breadcrumbs.findIndex(breadcrumb => breadcrumb.name === this.$route.name);
        const hasSameName = this.breadcrumbs[lastIndex].name === this.$route.name;
        const isPaginatedPage = !!this.$route.query.page && hasSameName;
        const isHomePage = this.$route.path === '/';
        const isPageAdded = currentIndex > 0 && currentIndex <= lastIndex;
        
        if (!isPageAdded && !isHomePage) {
          this.addBreadcrumb();
        } else if (isPageAdded && isPaginatedPage) {
          this.replaceLastBreadcrumb();
        } else {
          this.deleteBreadcrumbs(currentIndex + 1);
        }
        
      } else {
        this.initialiseBreadcrumbs();
      }
    }
  },
  mounted () { 
    this.initialiseBreadcrumbs();
  }
}
</script>

<style scoped>
  .breadcrumb {
    margin-top: 20px;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  ul > li {
    display: flex;
    float: left;
    height: 10px;
    width: auto;
    font-weight: bold;
    font-size: .8em;
    cursor: default;
    align-items: center;
  }
  ul > li:not(:last-child)::after {
    content: '/';
    float: right;
    font-size: .8em;
    margin: 0 .5em;
    cursor: default;
  }
  .clickable {
    cursor: pointer;
    font-size: 1em;
    font-weight: normal;
  }
</style>
