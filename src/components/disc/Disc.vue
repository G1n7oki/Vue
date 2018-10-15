<template>
  <transition name="slide">
    <MusicList
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
      :showFlag="showFlag"
    />
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/MusicList'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getSingerMusic} from 'api/singer'

  export default {
    name: "Disc",
    data() {
      return {
        songs: [],
        showFlag: false
      }
    },
    created() {
      this._getSongList()
    },
    computed: {
      title() {
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend');
          return false;
        }

        getSongList(this.disc.dissid).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          if (item.songid && item.albummid) {
            getSingerMusic(item.songmid).then(res => {
              if (res.code === ERR_OK) {
                const vkey = res.data.items[0].vkey;
                ret.push(createSong(item, vkey));
                if (list.length === ret.length) {
                  this.showFlag = true;
                }
              }
            })
          }
        });

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
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
