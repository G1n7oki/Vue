<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{ title }}</p>
  </div>
</template>

<script>
  export default {
    name: "NoResult",
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .no-result {
    text-align: center;
    .no-result-icon {
      width: 172px;
      height: 180px;
      margin: 0 auto;
      .bg-image('img/no-result', 0, 0);
    }
    .no-result-text {
      margin-top: 60px;
      font-size: @font-size-medium;
      color: @color-text-d;
    }
  }
</style>
