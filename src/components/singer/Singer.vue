<template>
  <div class="singer" ref="singer">
    <list-view :data="singers"
               @select="selectSinger"
               ref="list"
    />
    <router-view/>
  </div>
</template>

<script>
  /**
   * Singer Components
   *
   * Data:
   * - singers {Array} 接受请求到的数据
   *
   * Methods:
   * - _getSingerList {Function} 请求歌手列表数据
   * - _normalizeSinger {Function} 把请求的数据整理成可用的数据
   * - selectSinger {Function} 接受子组件传来的数据
   *
   * @param list {Object} 返回的数据
   * @singer singer {Object} 子组件传来的数据
   */

  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/list-view/ListView'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default {
    name: "Singer",
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '.8rem' : 0;
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list);
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        // 把map整理成可用的对象
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }

          const key = item.Findex;

          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))

        });
        // 得到有序列表处理map
        let hot = [],
          ret = [];

        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val);
          } else if (val.title === '热门') {
            hot.push(val);
          }
        }

        // 把带字母的数据从A-Z排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="less">
  .singer {
    position: fixed;
    top: 176px;
    bottom: 0;
    width: 100%;
  }
</style>
