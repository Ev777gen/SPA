<template>
  <div class="breadcrumbs">
    <ul v-if="!isHomePage">
      <li
        v-for="(breadcrumb, idx) in breadcrumbs"
        :key="breadcrumb.name"
        @click="changeRoute(breadcrumb)"
        :class="{'clickable': idx < breadcrumbs.length - 1}"
      >
        {{ breadcrumb.nameToDisplay }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      breadcrumbs: this.$store.state.breadcrumbs.breadcrumbs
    }
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/';
    }
  },
  watch: { 
    '$route'() {
      this.updateBreadcrumbs(this.$route);
    },
    'breadcrumbs.length'(newValue) {
      if (newValue === 0) {
        this.initialiseBreadcrumbs; 
      }
    }
  },
  methods: {
    ...mapActions(['changeRoute', 'initialiseBreadcrumbs', 'updateBreadcrumbs']),
  },
}
</script>

<style scoped>
  .breadcrumbs {
    margin-top: 20px;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    list-style-type: none;
    margin: 0;
  }
  ul > li {
    display: flex;
    float: left;
    width: auto;
    font-weight: bold;
    font-size: .8em;
    line-height: 1.3em;
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
