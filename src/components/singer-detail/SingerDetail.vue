<template>
  <transition name="slide">
    <music-list
      :songs="songs"
      :title="title"
      :bg-image="bgImage"
      :showFlag="showFlag"
    />
  </transition>
</template>

<script>
  /**
   * SingerDetail Components
   *
   * Methods:
   * - _getSingerDetail {Function} 获取歌手详情数据
   */

  import {mapGetters} from 'vuex'
  import {getSingerDetail, getSingerMusic} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/MusicList'

  export default {
    name: "SingerDetail",
    data() {
      return {
        songs: [],
        showFlag: false
      }
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getSingerDetail();
    },
    methods: {
      _getSingerDetail() {
        getSingerDetail(this.singer.id).then(res => {
          if (!this.singer.id) {
            this.$router.push('/singer');
            return;
          }

          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            getSingerMusic(musicData.songmid).then(res => {
              if (res.code === ERR_OK) {
                const vkey = res.data.items[0].vkey;
                ret.push(createSong(musicData, vkey));
                if (list.length === ret.length) {
                  this.showFlag = true;
                }
              }
            })
          }
        })

        return ret;
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
