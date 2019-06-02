<template lang="html">
  <div class="picker" @touchmove.prevent>
    <transition name="slider">
      <ul class="list" v-show="flag">
        <h3 class="title" v-if="title">{{title}}</h3>
        <li class="item"
            v-for="(data, idx) of datas"
            @click="touchItem(data, idx)"
            :class="[tag === idx && 'active']"
            :key="idx"
        >
          <p><i :class="data.name === '微信支付'?'ico ico-weixin':'ico ico-paybao'"></i><span>{{data.name}}</span></p>
          <!--<i class="ico" :class="[tag === idx && 'ico-choose']"></i>-->
        </li>
      </ul>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="flag" @click="show"></div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'Picker',
    props: {
      flag: {
        type: Boolean,
        required: true,
        default: false
      },
      title: {
        type: String,
        default: '',
      },
      datas: {
        types: Array,
        required: true,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        tag: '',
      }
    },
    methods: {
      show() {
        this.$emit('onShow')
      },
      touchItem(data, index) {
        this.tag = index
        this.$emit('onComplete', data)
        this.$emit('onShow')
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

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

  .ico-weixin {
    .bg-image('weixin');
    width: 1rem;
    height: 1rem;
  }

  .ico-paybao {
    .bg-image('paybao');
    width: 1rem;
    height: 1rem;
  }

  .active {
    color: @primary-active;
    & .ico-choose {
      width: 1rem;
      height: 1rem;
    }
  }

  & .picker {
    & .title {
      padding: .5rem;
      text-align: center;
      font-size: @font-s;
    }
    & .list {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      background: #fff;
      font-size: @font-s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid @border-color;
      z-index: 52;
    }
    & .item {
      /*flex: 1;*/
      display: flex;
      align-items: center;
      /*justify-content: space-between;*/
      text-align: center;
      padding: .5rem;
      border-top: 1px solid @border-color;
      p {
        text-align: center;
        margin: 0 auto;
      }
      span {
        font-size: @font-s;
      }
    }
  }
</style>
