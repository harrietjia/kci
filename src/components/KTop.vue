<template lang="html">
  <div class="m-top" @touchmove.prevent>
    <i class="ico ico-back" @click="back"></i>
    <p class="title">{{title}}</p>
    <slot/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'KTop',
    props: {
      title: {
        type: String,
        default: ''
      },
    },
    computed: {
      ...mapGetters(['pageList'])
    },
    methods: {
      back() {
        if (this.pageList.length <= 2) {
          this.$router.push('/Home')
        }else{
          this.$router.go(-1)
        }
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";
  .m-top {
    position: sticky;
    top: 0;
    left: 0;
    box-sizing: border-box;
    height: 2.5rem; // 44 + 20 : top, 98 : bottom
    background: #1c1c1c;
    // border-bottom: 1px solid @border-color;
    color: #fff;
    z-index: 52;
    .ico-back {
      position: absolute;
      top: 50%;
      left: 0.5rem;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      .bg-image('back_white');
    }
    .title {
      line-height: 2.7rem;
      text-align: center;
      color: #fff;
      font-size: @font-s;
    }
  }
</style>
