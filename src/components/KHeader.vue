<template>
  <div class="kheader">
    <div :class="[isShowBG ? '' : 'bg', 'top']">
      <p v-html="title"></p>
      <p class="text">欢迎来到GSC</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "KHeader",
    props: {
      title: {
        type: String,
        default: '登录'
      },
      isShowBG: {
        type: Boolean,
        default: true
      }
    },
    // data() {
    //   return {
    //     isShowBG: false
    //   }
    // }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .kheader {
    width: 100%;
    .top {
      position: relative;
      width: 100%;
      height: 7rem;
      &.bg {
        background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.pngg") no-repeat;
        background-size: cover;
      }
      background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/beijing@2x.61f33c0.png") no-repeat;
      background-size: cover;
      &:after{
        content: "";
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        background: inherit;
        filter: blur(2px);
        z-index: 2;
      }
      p {
        position: absolute;
        bottom: 1rem;
        box-sizing: border-box;
        width: 100%;
        padding: 0 0.8rem;
        font-size: 1rem;
        line-height: 1.45rem;
        color: @white-color;
        z-index: 5;
      }
      .text{
        bottom: .005rem;
        font-size: @font-xs;
      }
      div {
        width: 4.46rem;
        height: 4.46rem;
        position: absolute;
        left: calc(50% - 2.23rem);
        bottom: -2.7rem;
        img {
          width: 4.46rem;
          height: 4.46rem;
        }
      }
    }
  }

</style>
