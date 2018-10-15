<template>
  <transition name="confirm-fade">
    <div class="confirm"
         v-show="showFlag"
         @click.stop
    >
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ title }}</p>
          <div class="operate">
            <div class="operate-btn left"
                 @click="cancel"
            >{{ cancelText }}
            </div>
            <div class="operate-btn"
                @click="confirm"
            >{{ confirmText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Confirm",
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      confirm() {
        this.hide();
        this.$emit('confirm');
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: @color-background-d;
    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }
    .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .confirm-content {
        width: 540px;
        border-radius: 26px;
        background: @color-highlight-background;
        .text {
          padding: 38px 30px;
          line-height: 44px;
          text-align: center;
          font-size: @font-size-large;
          color: @color-text-l;
        }
        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: @font-size-large;
          .operate-btn {
            flex: 1;
            line-height: 44px;
            padding: 20px 0;
            border-top: 1px solid @color-background-d; /*no*/
            color: @color-text-d;
            &.left {
              border-right: 1px solid @color-background-d; /*no*/
            }
          }
        }
      }
    }
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0)
    }
    50% {
      transform: scale(1.1)
    }
    100% {
      transform: scale(1)
    }
  }
</style>
