<template lang="html">
  <div class="goods-card" @click="touchGoods">
    <div class="goods-box">
      <div class="box-img">
        <img :src="goods.goods_picture">
        <!--<p class="brand color1" v-if="goods.goods_brand">{{goods.goods_brand}}</p>-->
      </div>
      <div class="content">
        <p class="name clamp">{{goods.goods_name}}</p>
        <!-- <ul class="tags">
            <li class="tag blue" v-for="t of goods.tags">{{t}}</li>
        </ul> -->
        <p class="price" >&yen;{{goods.goods_price}}</p>
        <p class="scope" >{{goods.blue_score_price}} 通贝</p>
      </div>
    </div>

    <!-- <p class="red-text" v-if="!goods.goods_type">库存积分：{{goods.score_price || 0}}</p>
    <p class="red-text" v-if="!goods.goods_type">可用积分：{{goods.score_to_exchange_price || 0}}</p> -->
    <!-- <p class="red-text font-s" v-if="goods.goods_type">赠送积分：{{goods.score_price}}</p> -->
  </div>
</template>

<script>
  export default {
    name: 'GoodsCard',
    props: {
      goods: {
        types: Object,
        default() {
          return {
            // id: 100,
            // goods_picture: 'http://dev-static.ffun360.com/uploads/image/test/20180116/07f2c1df7fa3a423d21b04b17db7f730.png',
            // brand: 'apopee/爱宝奇',
            // goods_name: '纯天然植物饮料纯天然植物饮料纯天然植物饮料纯天然植物饮料',
            // goods_price: '210',
            // blue_score_price: '10',
            // tags: ['跨店', '每满300减30']
          }
        }
      },
    },
    computed: {
      color() {
        switch (Math.ceil(Math.random() * 3)) {
          case 0:
            return 'color1'
          case 1:
            return 'color2'
          case 2:
            return 'color3'
        }
      }
    },
    methods: {
      touchGoods() {
        this.$emit('onConfirm', this.goods)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    overflow: hidden;
  }

  .goods-card {
    padding: 0.2rem;

    .goods-box {
      border: 1px solid @border-color;
      overflow: hidden;
      background: #fff;
      min-height: 12.5rem;
      .content {
        padding: .2rem;
        border-top: 1px solid @border-color;
      }
      .brand {
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 1rem;
        font-size: @font-s;
        color: #fff;
        background-color: #8FA7C7;
        padding: 0.5rem;
        transform: translateY(50%);
      }
      .name {
        font-size: @font-xs;
        color: @text-color;
        min-height: 1.5rem;
        overflow: hidden;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        .tag {
          font-size: 0.9rem;
          margin-right: 0.5rem;
          padding: 0 0.2rem;
          border-radius: 4px;
          color: #5DA1FD;
          border: 1px solid #5DA1FD;
        }
      }
      .price {
        margin: .2rem 0;
        color: @text-color;
        font-size: @font-s;
      }
      .scope {
        color: @primary-active;
        font-size: @font-s;
      }
    }

    .box-img {
      .box-img(100%, 100%);
      margin-bottom: .5rem;
      img{
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
