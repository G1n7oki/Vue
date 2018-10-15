<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <router-link class="mine"
                 to="/user"
                 tag="div"
    >
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "Header"
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .header {
    position: relative;
    height: 88px;
    text-align: center;
    color: @color-theme;
    font-size: 0;
    .icon {
      display: inline-block;
      vertical-align: top;
      margin-top: 12px;
      width: 60px;
      height: 64px;
      margin-right: 18px;
      .bg-image('img/logo', 0, 0);
    }
    .text {
      display: inline-block;
      vertical-align: top;
      line-height: 88px;
      font-size: @font-size-large;
    }
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: 24px;
        font-size: 40px;
        color: @color-theme;
      }
    }
  }
</style>
