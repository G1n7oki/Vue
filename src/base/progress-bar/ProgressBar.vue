<template>
  <div class="progress-bar"
       ref="progressBar"
       @click="progressClick"
  >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn"
             ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend.prevent="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform');

  export default {
    name: "ProgressBar",
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(this.barWidth, Math.max(0, deltaX + this.touch.left));
        this._offset(offsetWidth);
      },
      progressTouchEnd() {
        this.touch.initiated = false;
        this._triggerPercent();
      },
      progressClick(e) {
        this._offset(e.offsetX);
        this._triggerPercent();
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      },
      _triggerPercent() {
        const percent = this.$refs.progress.clientWidth / this.barWidth;
        this.$emit('percentChange', percent);
      }
    },
    watch: {
      percent(newVal) {
        if (newVal > 0 && !this.touch.initiated) {
          this.barWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth;
          const offsetWidth = newVal * this.barWidth;
          this._offset(offsetWidth);
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .progress-bar {
    height: 60px;
    .bar-inner {
      position: relative;
      top: 26px;
      height: 8px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -16px;
        top: -26px;
        width: 60px;
        height: 60px;
        .progress-btn {
          position: relative;
          top: 14px;
          left: 14px;
          box-sizing: border-box;
          width: 32px;
          height: 32px;
          border: 6px solid @color-text;
          border-radius: 50%;
          background: @color-theme;
        }
      }
    }
  }
</style>
