<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot"
            v-for="(item, index) in dots"
            :key="index"
            :class="{active: pageIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script>
  /**
   * Slider Components
   *
   * Date:
   * - dots {Array} 下标小点显示的数量
   * - pageIndex {Number} 下标小点高亮的索引
   *
   * Props:
   * - loop {Boolean} 是否循环
   * - autoPlay {Boolean} 自动播放
   * - interval {Number} 移动的时间
   *
   * Methods:
   * - _setSliderWidth {Function} 初始化slider-group的宽度
   * - _initDots {Function} 初始化下标小点
   * - _initSlider {Function} 初始化better-scroll
   * _ _play {Function} 初始化自动播放
   *
   * @param isResize {Boolean} 是否已开启循环
   *
   * mounted:
   * 编译好的HTML挂载到页面完成后执行的钩子
   *
   * destroyed:
   * 实例销毁后完成的钩子
   */
  import BScroll from 'better-scroll'
  import { addClass } from "common/js/dom";

  export default {
    name: "Slider",
    data() {
      return {
        dots: [],
        pageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if (this.autoPlay) {
          this._play();
        }
      }, 20);

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      })
    },
    destroyed() {
      clearTimeout(this.timer);
    },
    methods: {
      _setSliderWidth(isResize) {
        let sliderGroup = this.$refs.sliderGroup,
          width = 0,
          sliderWidth = this.$refs.slider.clientWidth;

        this.children = sliderGroup.children;

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          // 每个图片的宽度应该都等于最外层的宽度
          child.style.width = sliderWidth + 'px';
          // 所有图片的宽度就是为slider-group的宽度
          width += sliderWidth;
        }

        // 当需要循环时, 头尾都需要增加一张图片的宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }

        // 设置inner的宽度
        sliderGroup.style.width = width + 'px';
      },
      _initDots() {
        // 创造一个和clildren长度一样的数组
        this.dots = new Array(this.children.length);
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click: true
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;

          this.pageIndex = pageIndex;

          if (this.autoPlay) {
            clearTimeout(this.timer);
            this._play();
          }
        })
      },
      _play() {
        let pageIndex = this.pageIndex + 1;

        if (pageIndex > this.children.length - 3) {
          pageIndex = 0;
        }

        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400);
        }, this.interval);
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  .slider {
    min-height: 1px; /*no*/
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 14px;
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: @color-text-l;
        &.active {
          width: 40px;
          border-radius: 10px;
          background: @color-text-ll;
        }
      }
    }
  }
</style>
