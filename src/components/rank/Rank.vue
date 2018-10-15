<template>
  <div class="rank" ref="rank">
    <Scroll class="top-list"
            :data="topList"
            ref="topList"
    >
      <ul>
        <li class="item"
            v-for="item in topList"
            @click="selectItem(item)"
        >
          <div class="icon">
            <img v-lazy="item.picUrl" alt="">
          </div>
          <ul class="song-list">
            <li class="song"
                v-for="(song, index) in item.songList"
            >
              <span>{{ index + 1 }}</span>
              <span>{{ song.songname }} - {{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading />
      </div>
    </Scroll>
    <router-view/>
  </div>
</template>

<script>
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import Scroll from 'base/scroll/Scroll'
  import Loading from 'base/loading/Loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: "Rank",
    mixins: [playlistMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList();
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '1.2rem' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.topList.refresh();
      },
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        });
        this.setTopList(item);
      },
      _getTopList() {
        getTopList().then(res => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .rank {
    position: fixed;
    width: 100%;
    top: 176px;
    bottom: 0;
    .top-list {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 40px;
        padding-top: 40px;
        height: 200px;
        &:last-child {
          padding-bottom: 40px;
        }
        .icon {
          flex: 0 0 200px;
          width: 200px;
          height: 200px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .song-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 40px;
          height: 200px;
          overflow: hidden;
          background: @color-highlight-background;
          color: @color-text-d;
          font-size: @font-size-small;
          .song {
            .no-wrap();
            line-height: 52px;
          }
        }
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
