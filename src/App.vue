<template>
  <div class="app-container">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <footer class="footer-wrapper">
      <div class="footer-item" @click="goPage('home')">Home</div>
      <div class="footer-item" @click="goPage('list')">List</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goPage(path) {
      this.$router.push({
        name: path
      })
    }
  }
}
</script>

<style>
body, html {
  padding: 0;
  margin: 0;
}
</style>

<style lang="stylus" scoped>
.app-container
  width: 100%

.footer-wrapper
  position: fixed
  z-index: 99
  left: 0
  right: 0
  bottom: 0
  display: flex
  background: #fff
  box-shadow: 0 0px 2px 0 #ddd
  .footer-item
    display: flex
    justify-content: space-around
    align-items: center
    flex: 1
    height: 49px
    line-height: 49px
</style>
