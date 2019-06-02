<template lang="html">
  <div class="order1" @click="touchItem">
    <div class="order-list">
      <div class="item">
        <img :src="order.goods_picture"/>
        <div class="center">
          <div class="top">
            <p class="name">{{order.goods_name}}</p>
            <p class="desc">{{order.goods_attr_str}}</p>
          </div>

          <div class="bottom">
            <p class="count" >×{{order.goods_count}}</p>
            <p class="desc" v-if="order.goods_type !== '2' && order.blue_score_price">通贝 {{order.blue_score_price}}</p>
            <p class="price" v-if="order.goods_type !== '3'">&yen;{{order.goods_price}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OrderItem',
    props: {
      order: {
        types: Object,
        default() {
          return {
          }
        }
      },
      state: {
        types: String,
        default() {
          return {}
        }
      }
    },
    methods: {
      touchItem() {
        this.$emit('onConfirm', this.order)
      },
      pay() {
        this.$toast('快点付款啊')
      },
      feedback() {
        this.$toast('评价一点点')
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .order-list {
    background: #fff;
    .item {
      display: flex;
      padding: .5rem;
      border-bottom: 1px solid @border-color;
      img {
        width: 4rem;
        height: 4rem;
        margin-right: 0.5rem;
      }
      .center {
        width: 70%;
        display: flex;
        flex-direction: column;
        p {
          font-size: @font-s;
        }
        .top {
          flex: 1;
          min-height: 3rem;
          .name {
            .no-wrap();
          }
          .desc {
            font-size: .6rem;
            color: @text-color;
          }
        }
        .bottom {
          flex: 1;
          display: flex;
          .count{
            flex: 1;
            color: @gray-color;
          }
          .price {
            flex: 1;
            text-align: right;
            color: @text-color;
          }
        }
      }
    }

  }
</style>
