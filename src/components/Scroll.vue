<template>
  <div class="scroll-wrapper" ref="scrollWrapper">
    <div class="scroll-content" :style="horizontalBox">
      <div ref="listWrapper">
        <slot></slot>
      </div>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{formatPullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown" :pullDownRefresh="pullDownRefresh" :pullDownStyle="pullDownStyle" :isPullingDown="isPullingDown">
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="after-trigger" v-if="!beforePullDown">
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>刷新成功</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Loading from '@/components/Loading'
import { getRect } from '@/utils'

const COMPONENT_NAME = 'scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  name: COMPONENT_NAME,
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 滚动的方向
     */
    direction: {
      type: String,
      default: DIRECTION_V
    },
    /**
     * 纵轴方向初始化位置
     */
    startY: {
      type: Number,
      default: 0
    },
    /**
     * 是否开启自由滚动
     */
    freeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pullDownRefresh: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发底部上拉的事件，用于上拉加载
     */
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    },
    /**
     * 上拉加载没有数据时的提示文本
     */
    pullUpTxt: {
      type: String,
      default: '没有更多数据'
    }
  },
  data() {
    return {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: true,
      pullDownStyle: '',
      pullDownInitTop: -50
    }
  },
  computed: {
    horizontalBox() {
      if (this.direction === DIRECTION_H) {
        return {
          display: 'inline-block'
        }
      }
    },
    formatPullUpTxt() {
      const moreTxt = '加载中...'
      const noMoreTxt = this.pullUpTxt
      return this.pullUpDirty ? moreTxt : noMoreTxt
    }
  },
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  destroyed() {
    this.$refs.scrollWrapper && this.$refs.scrollWrapper.destroy()
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scrollWrapper) {
        return
      }
      // 若初始时内容的高度小于等于父容器的高度，
      // 则内容不会滚动，便不会触发上拉加载、下拉刷新事件
      // 让内容的高度始终比父容器的高度大 1px 便能保证内容始终可以滚动
      if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        this.$refs.listWrapper.style.minHeight = `${getRect(
          this.$refs.scrollWrapper
        ).height + 1}px`
      }

      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        pullDownRefresh: this.pullDownRefresh
          ? { threshold: 50, stop: 40 }
          : false,
        pullUpLoad: this.pullUpLoad ? { threshold: 0 } : false,
        freeScroll: this.freeScroll,
        startY: this.startY
      })

      // 是否派发滚动事件
      if (!this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }

      // 是否派发列表滚动开始的事件
      if (this.listenBeforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScrollStart')
        })
      }

      // 是否派发底部上拉的事件，用于上拉加载
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          // 采用闭包的形式暴露出 forceUpdate 强制刷新
          this.$emit('pullingUp', (() => this.forceUpdate)(this))
        })
      }

      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pullDownRefresh) {
        this._initPullDownRefresh()
      }
    },
    disable() {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable()
    },
    destroy() {
      this.scroll.destroy()
    },
    enable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable()
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    forceUpdate(dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false
        this._reboundPullDown().then(() => {
          this._afterPullDown()
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.pullUpDirty = dirty
        this.refresh()
      } else {
        this.refresh()
      }
    },
    _initPullDownRefresh() {
      this.scroll.on('pullingDown', () => {
        this.beforePullDown = false
        this.isPullingDown = true
        this.$emit('pullingDown', (() => this.forceUpdate)(this))
      })

      this.scroll.on('scroll', (pos) => {
        if (!this.pullDownRefresh) {
          return
        }
        if (this.beforePullDown) {
          this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
        }

        if (this.isRebounding) {
          this.pullDownStyle = `top:${10 - (40 - pos.y)}px`
        }
      })
    },
    _reboundPullDown() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isRebounding = true
          this.scroll.finishPullDown()
          resolve()
        }, 600)
      })
    },
    _afterPullDown() {
      setTimeout(() => {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`
        this.beforePullDown = true
        this.isRebounding = false
        this.refresh()
      }, this.scroll.options.bounceTime)
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    }
  },
  components: { Loading }
}
</script>

<style lang="stylus" scoped>
.scroll-wrapper
  position: relative
  height: 100%
  overflow: hidden
  .pullup-wrapper
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    padding: 16px 0
    font-size: 16px
    color: rgba(16, 16, 16, 0.5)

  .pulldown-wrapper
    position: absolute
    width: 100%
    left: 0
    display: flex
    justify-content: center
    align-items: center
    font-size: 16px
    color: rgba(16, 16, 16, 0.5)
</style>
