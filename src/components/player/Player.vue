<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd"
                   :class="cdCls"
              >
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <Scroll class="middle-r"
                  ref="lyricList"
                  :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   v-for="(line, index) in currentLyric.lines"
                   :class="{current: currentLineNum === index}"
                   ref="lyricLine"
                >{{ line.txt }}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                :percent="percent"
                @percentChange="onProgressBarChange"
              />
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev"
                 @click="prev"
              ></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon"
                 @click="togglePlaying"
              ></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next"
                 @click="next"
              ></i>
            </div>
            <div class="icon i-right">
              <i class="icon"
                 @click="toggleFavorite(currentSong)"
                 :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
           v-show="!fullScreen"
           @click="open"
      >
        <div class="icon" ref="icon">
          <img :src="currentSong.image"
               ref="smallImage"
               :class="cdCls"
          >
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :percent="percent">
            <i class="icon-mini"
               :class="miniIcon"
               @click.stop="togglePlaying"
            ></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <Playlist
      ref="playlist"
    />
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/ProgressBar'
  import ProgressCircle from 'base/progress-circle/ProgressCircle'
  import {playMode} from 'common/js/config'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/Scroll'
  import Playlist from 'components/playlist/Playlist'
  import {playerMixin} from 'common/js/mixin'

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    name: "Player",
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        deltaX: 0,
        deltaY: 0
      }
    },
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex'
      ])
    },
    created() {
      this.touch = {}
    },
    methods: {
      showPlaylist() {
        this.$refs.playlist.show();
      },
      back() {
        this.setFullSceen(false);
      },
      open() {
        this.setFullSceen(true);
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter(el) {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all, 0.4s';
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      afterLeave(el) {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      togglePlaying() {
        if (!this.songReady) {
          return false;
        }
        this.setPlayingState(!this.playing);
        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      next() {
        if (!this.songReady) {
          return false;
        }
        if (this.playlist.length === 1) {
          this.loop();
          return false;
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playlist.length) {
            index = 0;
          }
          this.$nextTick(() => {
            this.setCurrentIndex(index);
          });
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false;
      },
      prev() {
        if (!this.songReady) {
          return false;
        }
        if (this.playlist.length === 1) {
          this.loop();
          return false;
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playlist.length - 1;
          }
          this.$nextTick(() => {
            this.setCurrentIndex(index);
          });
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.songReady = false;
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      ready() {
        this.songReady = true;
        this.savePlayHistory(this.currentSong);
      },
      error() {
        this.songReady = true;
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime;
      },
      format(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);

        return `${minute}:${second}`
      },
      onProgressBarChange(data) {
        const currentTime = this.currentSong.duration * data;
        this.$refs.audio.currentTime = currentTime;
        if (!this.playing) {
          this.togglePlaying();
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000);
        }
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return false;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playlist) {
            this.currentLyric.play();
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      middleTouchStart(e) {
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return false;
        }
        const touch = e.touches[0];
        this.deltaX = touch.pageX - this.touch.startX;
        this.deltaY = touch.pageY - this.touch.startY;
        if (Math.abs(this.deltaY) > Math.abs(this.deltaX)) {
          return false;
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + this.deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = (1 - this.touch.percent);
        this.$refs.middleL.style[transitionDuration] = 0;
      },
      middleTouchEnd() {
        if (Math.abs(this.deltaY) > Math.abs(this.deltaX)) {
          return false;
        }
        let offsetWidth,
          opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.percent < 0.8) {
            offsetWidth = 0;
            opacity = 1;
            this.currentShow = 'cd';
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false;
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      _getPosAndScale() {
        const targetWidth = 40,
          paddingLeft = 40,
          paddingBottom = 30,
          paddingTop = 80,
          width = window.innerWidth * 0.8,
          scale = targetWidth / width,
          x = -(window.innerWidth / 2 - paddingLeft),
          y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullSceen: 'SET_FULL_SCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (!newVal.id) {
          return false;
        }
        if (newVal.id === oldVal.id) {
          return false;
        }
        if (this.currentLyric) {
          this.currentLyric.stop();
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$refs.audio.play();
          this.getLyric();
        }, 1000)
      },
      playing(newVal) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newVal ? audio.play() : audio.pause();
        })
      }
    },
    components: {
      Scroll,
      ProgressBar,
      ProgressCircle,
      Playlist
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(40px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 50px;
        .back {
          position: absolute;
          top: 0;
          left: 12px;
          z-index: 50;
          .icon-back {
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 80px;
          text-align: center;
          .no-wrap();
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle {
          line-height: 40px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 160px;
        bottom: 340px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 20px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused
              }
              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 60px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 40px;
              line-height: 40px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 64px;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current {
                color: @color-text
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 100px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 8px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: @color-text-l;
            &.active {
              width: 40px;
              border-radius: 10px;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 20px 0;
          .time {
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 60px;
            line-height: 60px;
            width: 60px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: @color-theme;
            &.disable {
              color: @color-theme-d;
            }
            i {
              font-size: 60px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 40px;
            text-align: center;
            i {
              font-size: 80px;
            }
          }
          .i-right {
            text-align: left;
          }
          .icon-favorite {
            color: @color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all 0.4s;
        .top, .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -200px, 0);
        }
        .bottom {
          transform: translate3d(0, 200px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 120px;
      background: @color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .icon {
        flex: 0 0 80px;
        width: 80px;
        padding: 0 20px 0 40px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 40px;
        overflow: hidden;
        .name {
          margin-bottom: 4px;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text;
        }
        .desc {
          .no-wrap();
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control {
        flex: 0 0 60px;
        width: 60px;
        padding: 0 20px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 60px;
          color: @color-theme-d;
        }
        .icon-mini {
          font-size: 64px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
