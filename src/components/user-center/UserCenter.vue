<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back"
        @click="back"
      >
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <Switches
          :currentIndex="currentIndex"
          :switches="switches"
          @switch="switchItem"
        />
      </div>
      <div class="play-btn"
           ref="playBtn"
           @click="random"
      >
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper"
           ref="listWrapper"
      >
        <Scroll class="list-scroll"
                ref="favoriteList"
                v-if="currentIndex===0"
                :data="favoriteList">
          <div class="list-inner">
            <SongList
              :songs="favoriteList"
              @select="selectSong"
            />
          </div>
        </Scroll>
        <scroll class="list-scroll"
                ref="playList"
                v-if="currentIndex===1"
                :data="playHistory"
        >
          <div class="list-inner">
            <SongList
              :songs="playHistory"
              @select="selectSong"
            />
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper"
           v-show="noResult"
      >
        <NoResult
          :title="noResultDesc"
        />
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from 'base/switches/Switches'
  import {mapGetters, mapActions} from 'vuex'
  import SongList from 'base/song-list/SongList'
  import Scroll from 'base/scroll/Scroll'
  import Song from 'common/js/song'
  import {playlistMixin} from 'common/js/mixin'
  import NoResult from 'base/no-result/NoResult'

  export default {
    name: "UserCenter",
    mixins:[playlistMixin],
    data() {
      return {
        currentIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ]
      }
    },
    computed: {
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      noResultDesc() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '1rem' : '';
        this.$refs.listWrapper.style.bottom = bottom;
        this.$refs.favoriteList && this.$refs.favoriteList.refresh();
        this.$refs.playList && this.$refs.playList.refresh();
      },
      switchItem(data) {
        this.currentIndex = data;
      },
      selectSong(song) {
        this.insertSong(new Song(song))
      },
      back() {
        this.$router.back()
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
        if (list.length === 0) {
          return false;
        }
        list = list.map((item) => {
          return new Song(item);
        })
        this.randomPlay({
          list
        })
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      SongList,
      Switches,
      Scroll,
      NoResult
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: @color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .back {
      position: absolute;
      top: 0;
      left: 12px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 30px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .switches-wrapper {
      margin: 20px 0 60px 0;
    }
    .play-btn {
      box-sizing: border-box;
      width: 270px;
      padding: 14px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid  @color-text-l;/*no*/
      color: @color-text-l;
      border-radius: 200px;
      font-size: 0;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
        font-size: @font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
    .list-wrapper {
      position: absolute;
      top: 220px;
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
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
