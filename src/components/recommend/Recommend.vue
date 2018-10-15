<template>
  <div class="recommend" ref="recommend">
    <!-- 滚动区域 start -->
    <Scroll class="recommend-content"
            :data="discList"
            ref="scroll"
    >
      <div>
        <!-- banner start -->
        <div class="slider-wrapper" v-if="recommends.length">
          <Slider>
            <div v-for="item in recommends"
                 :key="item.id"
            >
              <a :href="item.linkUrl">
                <img class="needsclick"
                     @load="loadImage"
                     :src="item.picUrl"
                     alt="">
              </a>
            </div>
          </Slider>
        </div>
        <!-- banner end -->
        <!-- 歌单 start -->
        <div class="recommend-list">
          <!-- 歌单标题 start -->
          <h1 class="list-title">热门歌单推荐</h1>
          <!-- 歌单标题 end -->
          <!-- 歌单列表 start -->
          <ul>
            <li class="item"
                v-for="(item, index) in discList"
                :key="index"
                @click="selectItem(item)"
            >
              <!-- 列表icon start -->
              <div class="icon">
                <img v-lazy="item.imgurl" alt="">
              </div>
              <!-- 列表icon end -->
              <!-- 列表文本 start -->
              <div class="text">
                <h2 class="name">
                  {{ item.creator.name }}
                </h2>
                <p class="desc">
                  {{ item.dissname }}
                </p>
              </div>
              <!-- 列表文本 end -->
            </li>
          </ul>
          <!-- 歌单列表 end -->
        </div>
        <!-- 歌单 end -->
      </div>
      <!-- 加载动画 start -->
      <div class="loading-container" v-show="!discList.length">
        <Loading/>
      </div>
      <!-- 加载动画 end -->
    </Scroll>
    <!-- 滚动区域 end -->
    <router-view />
  </div>
</template>

<script>
  /**
   * Recommend Components
   *
   * Data:
   * - recommends {Array} Banner展示的图片
   * - discList {Array} 请求歌单列表返回的数据
   *
   * Created:
   * 实例创建完成后执行的钩子, 一般做一些数据请求
   *
   * Methods:
   * - _getRecommend {Fucntion} 请求Slider数据
   * - _getDiscList {Function} 请求List数据
   * - loadImage {Function} 确保图片已加载, 刷新better-scroll的高度
   * - handlePlaylist {Function} playlistMixin的兼容函数
   * - selectItem {Function} 点击后跳转到当前歌单的子路由并执行一个Mutationgs
   *
   * Mixins:
   * - playlistMixin {Object} 兼容当有mini播放器时改变recommend bottom的值
   */

  import Scroll from 'base/scroll/Scroll'
  import Slider from 'base/slider/Slider'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from "api/config"
  import Loading from 'base/loading/Loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    name: "Recommend",
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend();
      this._getDiscList();
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '1.2rem' : 0;
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
        })
      },
      loadImage() {
        if (!this.checkLoad) {
          this.$refs.scroll.refresh();
          this.checkLoad = true;
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .recommend {
    position: fixed;
    width: 100%;
    top: 176px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list {
        .list-title {
          height: 130px;
          line-height: 130px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-theme;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 40px 40px 40px;
          .icon {
            flex: 0 0 120px;
            width: 120px;
            padding-right: 40px;
            img {
              width: 120px;
              height: 120px;
            }
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 40px;
            overflow: hidden;
            font-size: @font-size-medium;
            .name {
              margin-bottom: 20px;
              color: @color-text;
            }
            .desc {
              color: @color-text-d;
            }
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
