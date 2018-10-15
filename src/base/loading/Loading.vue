<template>
  <div class="loading">
    <img src="./img/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .loading {
    width: 100%;
    text-align: center;
    img {
      width: 48px;
      height: 48px;
    }
    .desc {
      line-height: 40px;
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
</style>
