<template>
  <div class="song-list">
    <ul ref="list">
      <li class="item"
          v-for="(song, index) in songs"
          @click="selectItem(song, index)"
          :key="index"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "SongList",
    data() {
      return {
        len: 0
      }
    },
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer} · ${song.album}`;
      },
      selectItem(item, index) {
        this.$emit('select', item, index);
      },
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        }else{
          return 'text';
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1;
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 128px;
      font-size: @font-size-medium;
      .rank {
        width: 50px;
        flex: 0 0 50px;
        text-align: center;
        margin-right: 60px;
        .icon {
          display: inline-block;
          width: 50px;
          height: 48px;
          background-size: 50px 48px;
          &.icon0 {
            .bg-image('img/first', 0, 0);
          }
          &.icon1 {
            .bg-image('img/second', 0, 0);
          }
          &.icon2 {
            .bg-image('img/third', 0, 0);
          }
        }
        .text {
          color: @color-theme;
          font-size: @font-size-large;
        }
      }
      .content {
        flex: 1;
        line-height: 40px;
        overflow: hidden;
        .name {
          .no-wrap();
          color: @color-text;
        }
        .desc {
          .no-wrap();
          margin-top: 8px;
          color: @color-text-d;
        }
      }
    }
  }
</style>
