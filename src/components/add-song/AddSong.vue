<template>
  <transition name="slide">
    <div class="add-song"
         v-show="showFlag"
         @click.stop
    >
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close"
             @click="hide"
        >
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <SearchBox
          ref="searchBox"
          placeholder="搜索歌曲"
          @query="queryChange"
        />
      </div>
      <div class="shortcut" v-show="!query">
        <Switches
          :switches="switches"
          :currentIndex="currentIndex"
          @switch="switchItem"
        />
        <div class="list-wrapper">
          <Scroll class="list-scroll"
                  v-if="currentIndex === 0"
                  :data="playHistory"
                  ref="songList"
          >
            <div class="list-inner">
              <SongList
                :songs="playHistory"
                @select="selectSong"
              />
            </div>
          </Scroll>
          <Scroll class="list-scroll"
                  v-if="currentIndex === 1"
                  :data="searchHistory"
                  ref="searchList"
                  :refreshDelay="refreshDelay"
          >
            <div class="list-inner">
              <SearchList
                @delete="deleteSearchHistory"
                @select="addQuery"
                :searches="searchHistory"
              />
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <Suggest
          :query="query"
          :showSinger="showSinger"
          @select="selectSuggest"
        />
      </div>
      <TopTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script>
  import {searchMixin} from 'common/js/mixin'
  import SearchBox from 'base/search-box/SearchBox'
  import Suggest from 'components/suggest/Suggest'
  import Switches from 'base/switches/Switches'
  import Scroll from 'base/scroll/Scroll'
  import {mapGetters, mapActions} from 'vuex'
  import SongList from 'base/song-list/SongList'
  import SearchList from 'base/search-list/SearchList'
  import Song from 'common/js/song'
  import TopTip from 'base/top-tip/TopTip'

  export default {
    name: "AddSong",
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show() {
        this.showFlag = true;
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh();
          } else {
            this.$refs.searchList.refresh();
          }
        }, 20);
      },
      hide() {
        this.showFlag = false;
      },
      selectSuggest() {
        this.saveSearch();
        this.showTip();
      },
      switchItem(data) {
        this.currentIndex = data;
      },
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song));
          this.showTip();
        }
      },
      showTip() {
        this.$refs.topTip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      TopTip,
      Switches,
      Suggest,
      SearchBox,
      Scroll,
      SongList,
      SearchList
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: @color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: 88px;
      text-align: center;
      .title {
        line-height: 88px;
        font-size: @font-size-large;
        color: @color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 16px;
        .icon-close {
          display: block;
          padding: 24px;
          font-size: 40px;
          color: @color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: 40px;
    }
    .shortcut {
      .list-wrapper {
        position: absolute;
        top: 330px;
        bottom: 0;
        width: 100%;
        .list-scroll {
          height: 100%;
          overflow: hidden;
          .list-inner {
            padding: 40px 60px;
          }
        }
      }
    }
    .search-result {
      position: fixed;
      top: 248px;
      bottom: 0;
      width: 100%;
    }
    .tip-title {
      text-align: center;
      padding: 36px 0;
      font-size: 0;
      .icon-ok {
        font-size: @font-size-medium;
        color: @color-theme;
        margin-right: 8px;
      }
      .text {
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
  }
</style>
