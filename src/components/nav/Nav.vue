<template>
  <div class="nav">
    <router-link tag="div" class="nav-item" to="/recommend">
      <span class="nav-link">推荐</span>
    </router-link>
    <router-link tag="div" class="nav-item" to="/singer">
      <span class="nav-link">歌手</span>
    </router-link>
    <router-link tag="div" class="nav-item" to="/rank">
      <span class="nav-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="nav-item" to="/search">
      <span class="nav-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "Nav"
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .nav {
    display: flex;
    height: 88px;
    line-height: 88px;
    font-size: @font-size-medium;
    .nav-item {
      flex: 1;
      text-align: center;
      .nav-link {
        padding-bottom: 10px;
        color: @color-text-l;
      }
      &.router-link-active {
        .nav-link {
          color: @color-theme;
          border-bottom: 2px solid @color-theme; /*no*/
        }
      }
    }
  }
</style>
