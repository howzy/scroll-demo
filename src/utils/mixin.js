export const scrollMixin = {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.scrollTop) {
        vm._initPosition(to.meta.scrollTop)
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs.scroll && this.$refs.scroll.scroll) {
      from.meta.scrollTop = this.$refs.scroll.scroll.absStartY
    }
    next()
  },
  activated() {
    this.$refs.scroll.refresh()
  },
  methods: {
    _initPosition(scrollTop) {
      let scroll = this.$refs.scroll
      scroll.scrollTo(0, scrollTop)
    }
  }
}
