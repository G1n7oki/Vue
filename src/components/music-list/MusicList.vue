<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" ref="title">{{ title }}</h1>
    <div class="bg-image"
         :style="bgStyle"
         ref="bgImage"
    >
      <div class="play-wrapper">
        <div class="play"
             ref="playBtn"
             v-show="showFlag"
             @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll class="list"
            :data="songs"
            ref="list"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="selectItem"
          v-show="showFlag"
          :rank="rank"
        />
      </div>
      <div v-show="!showFlag" class="loading-container">
        <loading></loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
  import SongList from 'base/song-list/SongList'
  import Scroll from 'base/scroll/Scroll'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import Loading from 'base/loading/Loading'
  import {playlistMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-fikter');

  export default {
    name: "MusicList",
    data() {
      return {
        scrollY: 0,
        listShow: false
      }
    },
    mixins: [playlistMixin],
    props: {
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      showFlag: {
        type: Boolean,
        default: false
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`;
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.bgImageHeight = this.$refs.bgImage.clientHeight;
      this.maxTranslateY = -this.bgImageHeight + this.$refs.title.clientHeight;
      this.$refs.list.$el.style.top = `${this.bgImageHeight}px`;
    },

    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '.8rem' : 0;
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      back() {
        this.$router.back();
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newVal) {
        let bgImage = this.$refs.bgImage,
          translateY = Math.max(this.maxTranslateY, newVal),
          zIndex = 0,
          scale = 1,
          blur = 0;

        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;

        const percent = Math.abs(newVal / this.bgImageHeight);

        if (newVal > 0) {
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(20 * percent, 20);
        }

        this.$refs.filter.style[backdrop] = `blur(${blur})px`;

        if (newVal < this.maxTranslateY) {
          zIndex = 10;
          bgImage.style.paddingTop = 0;
          bgImage.style.height = `${this.$refs.title.clientHeight}px`;
          this.$refs.playBtn.style.display = 'none'
        } else {
          bgImage.style.paddingTop = '70%';
          bgImage.style.height = 0;
          this.$refs.playBtn.style.display = ''
        }

        bgImage.style.zIndex = zIndex;
        bgImage.style[transform] = `scale(${scale})`;
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;
    .back {
      position: absolute;
      top: 0;
      left: 12px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 20px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      .no-wrap();
      text-align: center;
      line-height: 80px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 40px;
        z-index: 50;
        width: 100%;
        .play {
          box-sizing: border-box;
          width: 270px;
          padding: 14px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid @color-theme; /*no*/
          color: @color-theme;
          border-radius: 100px;
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
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: @color-background;
      .song-list-wrapper {
        padding: 40px 60px;
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
