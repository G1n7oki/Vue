<template>
  <Scroll class="list-view"
          :data="data"
          ref="listView"
          @scroll="scroll"
          :listenScroll="listenScroll"
          :probeType="probeType"
  >
    <ul>
      <li class="list-group"
          v-for="(group, index) in data"
          :key="index"
          ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item"
              v-for="(item, index) in group.items"
              :key="index"
              @click="selectItem(item)"
          >
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li class="item"
            v-for="(item, index) in shortcutList"
            :key="index"
            :data-index="index"
            ref="item"
            :class="{current: currentIndex === index}"
        >{{ item }}
        </li>
      </ul>
    </div>
    <div class="list-fixed"
         v-show="fixedTitle"
         ref="fixed"
    >
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
  </Scroll>
</template>

<script>
  /**
   * ListView Components
   *
   * Data:
   * - scrollY {Number} 记录滚动的距离
   * - currentIndex {Number} 高亮的索引
   * - diff {Number} 偏移量
   *
   * Created: 不需要关心数据的变化所以在此声明变量
   * - listHeight {Array} 保存所有item距离顶部的高度
   * - touch {Object} 保存移动的距离
   *
   * Props:
   * - data {Array}
   *
   * Computed:
   * - shortcutList {Function} 返回所有的标题字段
   * - fixedTitle {Function} 返回显示的标题
   *
   * Methods:
   * - onShortcutTouchStart {Function}
   * - onShortcutTouchMove {Function}
   * - _scrollTo {Function} 抽象出来的滚动方法
   * - scroll {Function} 接受子组件传来的数据
   * - _calculateHeight {Function} 计算所有item距离顶部的距离
   * - selectItem {Function} 派发事件
   *
   * @param pos 子组件返回的数据
   * @param item 向父组件传递的数据
   */

  import Scroll from 'base/scroll/Scroll'
  import {getData} from 'common/js/dom'

  export default {
    name: "ListView",
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.probeType = 3;
      this.listHeight = [];
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(item => {
          return item.title.substr(0, 1);
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return false;
        }

        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(parseInt(anchorIndex));
      },
      onShortcutTouchMove(e) {
        let height = this.$refs.item[0].clientHeight;
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / height | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      refresh() {
        this.$refs.listView.refresh();
      },
      _scrollTo(index) {
        // 不执行的情况
        if (!index && index !== 0) {
          return;
        }
        // 设置边界
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }

        /*this.scrollY = -this.listHeight[index];*/
        this.currentIndex = index;
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i].clientHeight;
          height += item;
          this.listHeight.push(height);
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY(newValue) {
        let y = Math.abs(newValue);
        const listHeight = this.listHeight;
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];

          if (y >= height1 && y < height2) {
            this.currentIndex = i;
            this.diff = height2 - y;
            return;
          }
        }
      },
      diff(newVal) {
        const num = this.$refs.fixed.clientHeight;
        let fixedTop = (newVal > 0 && newVal < num) ? newVal - num : 0;
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .list-view {
    position: relative;
    width: 100%;;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    .list-group {
      padding-bottom: 60px;
      .list-group-title {
        height: 60px;
        line-height: 60px;
        padding-left: 40px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 40px 0 0 60px;
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .name {
          margin-left: 40px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      padding: 40px 0;
      border-radius: 20px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item {
        padding: 6px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current {
          color: @color-theme;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 60px;
        line-height: 60px;
        padding-left: 40px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
