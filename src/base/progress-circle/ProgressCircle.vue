<template>
  <div class="progress-circle">
    <svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "ProgressCircle",
    data() {
      return {
        dashArray: Math.PI * 100
      }
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .progress-circle {
    position: relative;
    svg {
      width: 64px;
      height: 64px;
      circle {
        stroke-width: 16px;
        transform-origin: center;
        &.progress-background {
          transform: scale(0.9);
          stroke: @color-theme-d;
        }
        &.progress-bar {
          transform: scale(0.9) rotate(-90deg);
          stroke: @color-theme;;
        }
      }
    }
  }
</style>
