<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box"
           :placeholder="placeholder"
           v-model="query"
    >
    <i class="icon-dismiss"
       v-show="query"
       @click="clear"
    ></i>
  </div>
</template>

<script>
  import {debounce} from 'common/js/uitl'

  export default {
    name: "SearchBox",
    data() {
      return {
        query: ''
      }
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery);
      }, 200));
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    methods: {
      clear() {
        this.query = '';
      },
      setQuery(query) {
        this.query = query
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 12px;
    height: 80px;
    background: @color-highlight-background;
    border-radius: 12px;
    .icon-search {
      font-size: 24px;
      color: @color-background;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: @color-highlight-background;
      color: @color-text;
      font-size: @font-size-medium;
      &::placeholder {
        color: @color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 32px;
      color: @color-background;
    }
  }
</style>
