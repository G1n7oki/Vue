<template>
  <Scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="(item, index) in result"
          @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <Loading v-show="hasMore" title=""/>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉, 暂无搜索结果" />
    </div>
  </Scroll>
</template>

<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/Scroll'
  import Loading from 'base/loading/Loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import {getSingerMusic} from 'api/singer'
  import NoResult from 'base/no-result/NoResult'

  const TYPE_SINGER = 'singer',
    perpage = 20

  export default {
    name: "Suggest",
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh();
      },
      search() {
        this.page = 1;
        this.$refs.suggest.scrollTo(0, 0);
        this.hasMore = true;
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this._getResault(res.data);
            this._checkMore(res.data);
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return false;
        }
        this.page++;
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._getResault(res.data));
            this._checkMore(res.data);
          }
        })
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name} - ${item.singer}`;
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          });
          this.$router.push({
            path: `/search/${singer.id}`
          });
          this.setSinger(singer);
        } else {
          this.insertSong(item);
        }
        this.$emit('select');
      },
      _checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      _getResault(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));

          ret.forEach(item => {
            getSingerMusic(item.mid).then(res => {
              if (res.code === ERR_OK) {
                let vkey = res.data.items[0].vkey;
                item.url = `http://dl.stream.qqmusic.qq.com/C400${item.mid}.m4a?vkey=${vkey}&guid=6623027863&uin=0&fromtag=66`;
              }
            })
          })
        }

        return ret;
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          if (item.songid && item.albummid) {
            ret.push(createSong(item));
          }
        });
        return ret;
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 60px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 40px;
      }
      .icon {
        flex: 0 0 60px;
        width: 60px;
        [class^="icon-"] {
          font-size: 28px;
          color: @color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text {
          .no-wrap();
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
