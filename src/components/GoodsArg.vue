<template lang="html">
  <div class="goods-arg">
    <transition name="slider">
      <div class="container" v-show="show">
        <ul class="list">
          <li v-for="(l,idx) of list" :key="idx">
            <span class="title">{{l.text}}：</span>
            <span class="title-cray">{{l.value}}</span>
          </li>
        </ul>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="show" @click="close"></div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'GoodsArg',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      close() {
        this.$emit('onClose')
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";

  .goods-arg {
    font-size: @font-s;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      background: rgba(0, 0, 0, .4);
      z-index: 50;
      width: 100%;
      height: 100%;
    }
    .container {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      max-height: 60rem;
      overflow: hidden;
      background: #fff;
      z-index: 52;
    }
    .list {
      padding: 1rem;
      color: @black-color;
      border-bottom: 1px solid @border-color;
    }
    .title {
      display: inline-block;
      width: 7rem;
    }
    .title-cray {
      color: @text-color;
      margin-left: 1rem;
    }
    .total-pay {
      color: @danger-color;
    }
  }
</style>
