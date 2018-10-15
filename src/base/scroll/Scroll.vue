<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  /**
   * Props:
   * - probeType {Number} 反馈滚动的位置
   * - click {Boolean} 是否派发点击事件
   * - data {Array} 更新的数据
   * - listenScroll {Boolean} 是否向父组件发送滚动的位置
   *
   * Methods:
   * -  _initScroll {Function} 初始化better-scroll
   * - refresh {Function} 刷新better-scroll组件
   * - enable {Function}
   * - disable {Function}
   */

  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
      }, 20)
    },
    methods: {
      _initScroll() {
        let wrapper = this.$refs.wrapper;
        if (!wrapper) {
          return;
        }

        this.scroll = new BScroll(wrapper, {
          probeType: this.probeType,
          click: this.click
        });

        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos);
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd');
            }
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, this.refreshDelay)
      }
    }
  }
</script>

<style scoped>

</style>
