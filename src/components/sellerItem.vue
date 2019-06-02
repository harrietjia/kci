<template>
  <div class="wrapper" @click="touchShop(seller)">
    <div class="img-box">
      <img :src="seller.store_logo_url" alt="商家">
    </div>
    <div class="right">
      <p class="title">{{seller.factory_store_name}}</p>
      <div class="address lineHeight"><i class="ico ico-address"></i><span>{{seller.distance}}</span> <span
        class="gray">|</span> <span class="road">{{seller.address}}</span>
      </div>
      <div class="star lineHeight"><i v-for="(itemClass,index) of itemClasses" :class="itemClass"></i><span
        class="num">{{seller.visitor_count}}人已访问</span></div>
      <p class="time lineHeight"><i class="ico ico-time"></i> 营业时间：{{seller.run_time}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const CLS_ON = 'ico-n1'
  const CLS_OFF = 'ico-n2'
  const CLS_HALF = 'half'
  const LENGTH = 5
  export default {
    name: "sellerItem",
    props: {
      score: {
        type: String,
        default: '3.5'
      },
      seller: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {}
    },
    computed: {
      itemClasses() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = Math.floor(Number(this.score) * 2) / 2; // 计算所有星星的数量
        // 判断是否有半星
        let hasDecimal = score % 1 !== 0;
        // 计算有几个全星
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) { // 整数星星使用on
          result.push(CLS_ON);// 一个整数星星就push一个CLS_ON到数组
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF);// 类似
        }
        return result;
      },
    },
    methods: {
      touchShop(seller) {
        this.$emit('touchShop', seller)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('star')
  }

  .ico-n2 {
    .bg-image('star2')
  }

  .half{
    .bg-image('half')
  }

  .wrapper {
    display: flex;
    padding: .5rem 0;
    border-bottom: 1px solid @border-color;
    .img-box {
      flex: 0 0 3.5rem;
      align-self: center;
      display: inline-block;
      border-radius: 10px;
      .box-img(3.5rem, 3.5rem);
      /*margin-left: .5rem;*/
      /*background: red;*/
      img {
        border-radius: 10px;
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      margin-left: .5rem;
      .lineHeight {
        min-height: 1.1rem;
        line-height: 1.1rem;
      }
      .title {
        font-size: @font-s;
        margin-bottom: .2rem;
        /*font-weight: bold;*/
      }
      .address {
        color: #39b2ff;
        line-height: .7rem;
        .gray {
          color: #878787;
          margin: 0 .3rem;
        }
        .road {
          display: inline-block;
          width: 7rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .star {
        color: #878787;
        margin-left: 3px;
        vertical-align: center;
        .num {
          margin-left: .6rem;
        }
      }
      .time {
        color: #878787;
      }
    }
  }

  .star {
    padding: 0;
    /*text-align: center;*/
    i {
      display: inline-block;
      vertical-align: middle;
      width: .7rem;
      height: .7rem;
      margin-right: 2px;
    }
  }
</style>
