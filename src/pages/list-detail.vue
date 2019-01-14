<template>
  <div class="detail">
    <p>Detail: {{id}}</p>
    <p @click="$router.go(-1)">返回</p>
  </div>
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
  height: 100vh
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
</style>
