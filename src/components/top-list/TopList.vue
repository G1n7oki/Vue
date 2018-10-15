<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
      :showFlag="showFlag"
      :rank="rank"
    />
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/MusicList'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getSingerMusic} from 'api/singer'

  export default {
    name: "TopList",
    data() {
      return {
        songs: [],
        showFlag: false,
        rank: true
      }
    },
    created() {
      this._getMusicList();
    },
    computed: {
      title() {
        return this.topList.topTitle;
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank');
          return false;
        }
        getMusicList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist);
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          const musicData = item.data;
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
    transition: all 0.3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
