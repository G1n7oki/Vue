<template>
  <ul class="switches">
    <li class="switch-item"
        v-for="(item, index) in switches"
        :class="{active: currentIndex === index}"
        @click="switchItem(index)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "Switches",
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index);
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .switches {
    display: flex;
    align-items: center;
    width: 480px;
    margin: 0 auto;
    border: 1px solid @color-highlight-background;/*no*/
    border-radius: 10px;
    .switch-item {
      flex: 1;
      padding: 16px;
      text-align: center;
      font-size: @font-size-medium;
      color: @color-text-d;
      &.active {
        background: @color-highlight-background;
        color: @color-text;
      }
    }
  }
</style>
