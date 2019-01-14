<template>
  <transition name="slide">
    <div class="detail">
      <p>Detail: {{id}}</p>
      <p @click="$router.go(-1)">返回</p>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params['id']
    }
  }
}
</script>

<style lang="stylus" scoped>
.detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: #fff
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
