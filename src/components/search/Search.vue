<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox
        ref="searchBox"
        @query="queryChange"
      />
    </div>
    <div class="shortcut-wrapper"
         v-show="!query"
         ref="shortcutWrapper"
    >
      <Scroll class="shortcut"
              :data="shortcut"
              ref="shortcut"
              :refreshDelay="refreshDelay"
      >
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item"
                  v-for="item in hotKey"
                  @click="addQuery(item.k)"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear"
                    @click="showConfirm"
              >
              <i class="icon-clear"></i>
            </span>
            </h1>
            <SearchList
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteSearchHistory"
            />
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result"
         v-show="query"
         ref="searchResult"
    >
      <Suggest
        :query="query"
        @select="saveSearch"
        ref="suggest"
      />
    </div>
    <Confirm
      ref="confirm"
      title="是否清空所有搜索历史"
      confirmText="清空"
      @confirm="clearSearchHistory"
    />
    <router-view/>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/SearchBox'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/Suggest'
  import {mapActions} from 'vuex'
  import SearchList from 'base/search-list/SearchList'
  import Confirm from 'base/confirm/Confirm'
  import Scroll from 'base/scroll/Scroll'
  import {playlistMixin, searchMixin} from 'common/js/mixin'

  export default {
    name: "Search",
    mixins: [playlistMixin, searchMixin],
    data() {
      return {
        hotKey: []
      }
    },
    created() {
      this._getHotKey();
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory);
      }
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '.8rem' : '';
        const bottoms = playlist.length > 0 ? '1.6rem' : '';
        this.$refs.shortcutWrapper.style.bottom = bottoms;
        this.$refs.shortcut.refresh();
        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10);
          }
        })
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20)
        }
      }
    },
    components: {
      Scroll,
      SearchBox,
      Suggest,
      SearchList,
      Confirm
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .search {
    .search-box-wrapper {
      margin: 40px;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 356px;
      bottom: 0;
      width: 100%;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 40px 40px 40px;
          .title {
            margin-bottom: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
          .item {
            display: inline-block;
            padding: 10px 20px;
            margin: 0 40px 20px 0;
            border-radius: 12px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
        .search-history {
          position: relative;
          margin: 0 40px;
          .title {
            display: flex;
            align-items: center;
            height: 80px;
            font-size: @font-size-medium;
            color: @color-text-l;
            .text {
              flex: 1;
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
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 356px;
      bottom: 0;
    }
  }
</style>
