<template>
  <div class="record">
    <i class="ico ico-back" @click="back"></i>
    <p class="title">{{title}}</p>
    <slot/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "Record",
    props: {
      title: {
        type: String,
        default: ''
      },
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .record {
    position: sticky;
    top: 0;
    left: 0;
    box-sizing: border-box;
    height: 5rem;
    background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png") no-repeat;
    background-size: cover;
    color: #fff;
    z-index: 52;
    .ico-back {
      position: absolute;
      top: 50%;
      left: 0.5rem;
      transform: translateY(-50%);
      width: 2rem;
      height: 2rem;
      .bg-image('back_white');
    }
    .title {
      line-height: 5rem;
      text-align: center;
      color: #fff;
      font-size: @font-m;
    }
  }
</style>
