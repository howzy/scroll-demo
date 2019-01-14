<template>
  <div class="list">
    <scroll ref="scroll" :data="list" :pullUpLoad="true" @pullingUp="loadMore" :pullDownRefresh="true" @pullingDown="pullingDown">
      <p v-for="(item, index) in list" :key="index" @click="selectItem(item)" class="item">home - {{item}}</p>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '@/components/Scroll'

export default {
  components: { Scroll },
  data() {
    return {
      list: [],
      hasMore: true
    }
  },
  created() {
    let arr = new Array(10)
    for (let i = 0; i < 10; i++) {
      arr[i] = i + 1
    }
    setTimeout(() => {
      this.list = arr
    }, 0)
  },
  methods: {
    loadMore(func) {
      if (!this.hasMore) return func && func()
      console.log('loading')
      this.loadData().then(res => {
        this.list = [...this.list, ...res]
        if (this.list.length >= 20) {
          this.hasMore = false
        }
      })
    },
    loadData() {
      return new Promise(resolve => {
        setTimeout(() => {
          let l = this.list.length
          let arr = new Array(10)
          for (let i = 0; i < 10; i++) {
            arr[i] = l + i + 1
          }
          resolve(arr)
        }, 1000)
      })
    },
    pullingDown() {
      setTimeout(() => {
        this.list = this.list.splice(0, 10)
      }, 1000)
    },
    selectItem(id) {
      this.$router.push({
        path: `/home/${id}`
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.list
  position: fixed
  z-index: 100
  width: 100%
  top: 0
  bottom: 49px
  .item
    display: block
    height: 40px
    line-height: 40px
    text-align: center
    margin: 0 0 20px 0
    padding: 30px
    background: #ccc;
    &:last-of-type
      margin-bottom: 0
</style>
