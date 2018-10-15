<template>
  <transition name="list-fade">
    <div class="playlist"
         v-show="showFlag"
         @click.stop="hide"
    >
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"
               :class="iconMode"
               @click="changeMode"
            ></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll class="list-content"
                :data="sequenceList"
                ref="listContent"
                :refreshDelay="refreshDelay"
        >
          <transition-group name="list" tag="ul">
            <li class="item"
                v-for="(item, index) in sequenceList"
                @click="selectItem(item, index)"
                ref="listItem"
                :key="item.id"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like"
                    @click.stop="toggleFavorite(item)"
              >
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <Confirm
        ref="confirm"
        title="是否清空当前播放列表"
        confirmText="清空"
        @confirm="clearList"
      />
      <AddSong
        ref="addSong"
      />
    </div>
  </transition>
</template>

<script>
  import {mapActions} from 'vuex'
  import Scroll from 'base/scroll/Scroll'
  import {playMode} from 'common/js/config'
  import Confirm from 'base/confirm/Confirm'
  import {playerMixin} from 'common/js/mixin'
  import AddSong from 'components/add-song/AddSong'

  export default {
    name: "Playlist",
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        refreshDelay: 120
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.listContent.refresh();
          this.scrollToCurrent(this.currentSong);
        }, 20);
      },
      hide() {
        this.showFlag = false;
      },
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play';
        }
        return '';
      },
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex((list) => {
            return list.id === item.id;
          });
        }
        this.setCurrentIndex(index);
        this.setPlayingState(true);
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((item) => {
          return current.id === item.id;
        });
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
      },
      deleteOne(item) {
        this.deleteSong(item);
        if (!this.playlist.length) {
          this.hide();
        }
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      clearList() {
        this.deleteSongList();
        this.hide();
      },
      addSong() {
        this.$refs.addSong.show();
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (!this.showFlag || newVal.id === oldVal.id) {
          return false;
        }
        this.scrollToCurrent(newVal);
      }
    },
    components: {
      Confirm,
      Scroll,
      AddSong
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    &.list-fade-enter {
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: @color-highlight-background;
      .list-header {
        position: relative;
        padding: 40px 60px 20px 40px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 20px;
            font-size: 60px;
            color: @color-theme-d;
          }
          .text {
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
          .clear {
            .extend-click();
            .icon-clear {
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 480px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 80px;
          padding: 0 60px 0 40px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
          }
          &.list-enter, &.list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 40px;
            width: 40px;
            font-size: @font-size-small;
            color: @color-theme-d;
          }
          .text {
            flex: 1;
            .no-wrap();
            font-size: @font-size-medium;
            color: @color-text-d;
          }
          .like {
            .extend-click();
            margin-right: 30px;
            font-size: @font-size-small;
            color: @color-theme;
            .icon-favorite {
              color: @color-sub-theme;
            }
          }
          .delete {
            .extend-click();
            font-size: @font-size-small;
            color: @color-theme;
          }
        }
      }
      .list-operate {
        width: 304px;
        margin: 40px auto 60px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 16px 32px;
          border: 1px solid @color-text-l; /* no */
          border-radius: 200px;
          color: @color-text-l;
          .icon-add {
            margin-right: 10px;
            font-size: @font-size-small-s;
          }
          .text {
            font-size: @font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 100px;
        background: @color-background;
        font-size: @font-size-medium-x;
        color: @color-text-l;
      }
    }
  }
</style>
