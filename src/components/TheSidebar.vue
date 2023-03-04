<template>
  <div class="sidebar">
    <nav class="sidebar__nav">
      <router-link :to="{name: 'HomeView'}" class="sidebar__link">На главную</router-link>
      <router-link :to="{name: 'HomeView'}" class="sidebar__link">Форум</router-link>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  margin-top: 15px;
  padding: 15px;
  background-color: #f6f6f6;
}
.sidebar__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 5px;
  background-color: #fff;
}
.sidebar__link {
  padding: 10px 20px;
  width: 100%;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  color: #555;
  &:hover {
    color: #222;
    background-color: #eee;
    &:first-child {
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
    }
    &:last-child {
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
    }
  }
  &:last-child {
    border-bottom: none;
  }
}
</style>
