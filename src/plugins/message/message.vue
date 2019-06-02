<template>
  <div class="content" v-show="show">
    <div class="box">
      <p>{{text}}</p>
      <div class="message-btn">
        <button class="confirm" @click="confirm">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
  // import wx from 'weixin-js-sdk'

  export default {
    data() {
      return {
        show: false,
        text: null,
        func: null,
      }
    },
    // props:{
    //   text: {
    //     type: String,
    //     default: '请输入内容'
    //   }
    // },
    methods: {
      confirm() {
        this.show = false
        if (this.func) this.func()
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .content {
    .mask();
    .box {
      -webkit-animation: entry .7s ease;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      /*width: 250px;*/
      /*height: 150px;*/
      height: 23%;
      width: 70%;
      border-radius: 8px; /*no*/
      p {
        padding: 45px 15px;
        font-size: @font-xs;
        text-align: center;
      }
      .message-btn {
        padding: 20px 0;
        display: flex;
        position: relative;
        span {
          flex: 1;
        }
        .confirm {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          display: inline-block;
          width: 5rem;
          height: 1.8rem;
          font-size: 0.6rem;
          line-height: 1.8rem;
          text-align: center;
          color: #ffffff;
          background: @primary-active;
          border-radius: 100px;
        }
      }
    }
    @keyframes entry {
      from {
        opacity: 0;
        transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 1);
      }

      to {
        opacity: 1;
        transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);
      }
    }
  }


</style>
