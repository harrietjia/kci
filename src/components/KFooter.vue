<template lang="html">
  <div class="warp">
    <div class="footer">
      <router-link :to="'/Home'" class="link" :class="[tag == 1 && 'active']">
        <i class="a1"></i>{{$t('m.home')}}
      </router-link>
      <router-link :to="'/C2C2'" class="link" :class="[tag == 2 && 'active']">
        <i class="a2"></i>{{$t('m.c2c')}}
      </router-link>

      <router-link :to="'/AllList'" class="link" :class="[tag == 3 && 'active']">
        <i class="a3"></i>{{$t('m.market')}}
      </router-link>
      <router-link :to="'/Mine'" class="link" :class="[tag == 5 && 'active']">
        <i class="a5"></i>{{$t('m.mine')}}
      </router-link>
    </div>
    <router-link :to="'/Shop'" tag="div" class="link center" :class="[tag == 4 && 'active']">
      <i class="a4"></i>
      <p>{{$t('m.shop')}}</p>
    </router-link>
    <div class="top"></div>
    <div class="bottom"></div>
  </div>
</template>

<script>
  export default {
    name: 'KFooter',
    props: {
      tag: {
        types: Number,
        default: 0
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .warp {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .top{
      position: absolute;
      left: 50%;
      bottom: 0;
      z-index: 1;
      transform: translateX(-50%);
      background: @white-color;
      border-radius: 50%;
      width: 3.6rem;
      height: 3.1rem;
    }
    .bottom{
      position: absolute;
      left: 50%;
      bottom: 0;
      z-index: -1;
      transform: translateX(-50%);
      border: 1px solid @border-color;
      background: @white-color;
      border-radius: 50%;
      width: 3.5rem;
      height: 3.1rem;
    }
    .center {
      position: absolute;
      left: 50%;
      bottom: 0;
      z-index: 2;
      transform: translateX(-50%);
      background-image: linear-gradient(270deg, #d6c14d 0%, #efdc73 100%), linear-gradient(#f9f7ff, #f9f7ff);
      width: 2.8rem;
      height: 2.8rem;
      display: flex;
      flex-direction: column;
      border-radius: 50%;
      text-align: center;
      font-size: @font-xs;
      color: #ffffff;
    }
    .center i {
      .bg-image('shangcheng@2x');
      width: 1.2rem;
      height: 1.2rem;
      margin: .2rem auto;
      display: block;
    }
    .footer {
      display: flex;
      align-items: center;
      height: 2.5rem;
      border-top: 1px solid @border-color;
      background: #fff;
      overflow: hidden;
      .link {
        flex: 1;
        text-align: center;
        font-size: @font-xs;
        color: #A5A4A4;
      }
      .link:nth-child(2){
        padding-right: 1.5rem;
      }
      .link:nth-child(3){
        padding-left: 1.5rem;
      }
      .link.active {
        color: @primary-active;
      }
      .link i {
        width: 1rem;
        height: 1rem;
        margin: auto;
        display: block;
      }
      .a1 {
        .bg-image('2_shouye@2x');
      }
      .link.active .a1 {
        .bg-image('shouye@2x');
      }
      .a2 {
        .bg-image('c2c@2x');
      }
      .link.active .a2 {
        .bg-image('2_c2c@2x');
      }
      .a3 {
        .bg-image('hangqing@2x');
      }
      .link.active .a3 {
        .bg-image('2_hangqing@2x');
      }
      .a5 {
        .bg-image('wode@2x');
      }
      .link.active .a5 {
        .bg-image('2_wode@2x');
      }
    }
  }
</style>
