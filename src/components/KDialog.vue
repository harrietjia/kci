<template lang="html">
  <transition name="scale">
    <div class="m-dialog" v-if="visible" @touchmove.prevent>
      <div class="box-dialog">
        <p class="title">{{title}}</p>
        <div class="content">
          <slot>{{tips}}</slot>
        </div>
        <div class="box-btn clearfix">
          <slot name="footer">
            <div class="btn-cancel" @click="close">取消</div>
            <div class="btn-sure" v-if="!propsShow" @click="sure">确定</div>
            <div class="btn-sure" v-if="propsShow" @click="confirm">确定</div>
          </slot>
        </div>
      </div>
      <div class="mask"></div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'KDialog',
    props: {
      title: {
        type: String,
        default: '提示'
      },
      tips: {
        type: String,
        default: ''
      },
      propsShow: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      propsShow(val) {
        this.visible = val
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      close() {
        this.$emit('close')
        this.visible = false
        this.callback && this.callback.call(this, 'close')
      },
      sure() {
        this.$emit('sure')
        this.visible = false
        this.callback && this.callback.call(this, 'sure')
      },
      confirm() {
        this.$emit('onConfirm')
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .m-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .mask(rgba(0, 0, 0, .3), 9999);
    .title {
      /*margin-bottom: 1rem;*/
      font-size: @font-s;
    }
    .box-dialog {
      position: fixed;
      left: 50%;
      top: 50%;
      width: 75%;
      padding: 1rem;
      border-radius: 4px;
      transform: translateX(-50%) translateY(-50%);
      background-color: #fff;
      z-index: 51;
    }
    .content {
      overflow: auto;
      margin-bottom: 1rem;
    }
    .box-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .box-btn > div {
      flex: 1;
      max-width: 46%;
      font-size: @font-s;
      text-align: center;
      border: 1px solid @border-color;
      border-radius: 4px;
      margin: 0 2%;
      padding: 0.5rem 0;
    }
    .btn-sure {
      color: #fff;
      background-color: @primary-active;
    }
  }
</style>
