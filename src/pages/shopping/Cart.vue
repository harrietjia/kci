<template lang="html">
  <div class="wrapper cart">
    <KTop :title="'购物车'"></KTop>

    <div class="no-result" v-show="cartList.length === 0">
      <img src="../../assets/images/shoppingcart@2x.png" alt="">
      <p class="result">您的购物车空空如也~</p>
    </div>

    <div class="box-goods">
      <cart-item
        class="goods-item"
        :order="item"
        v-for="item of cartList"
        :key="item.cart_id"
        @onEdit="edit"
        @onDel="del"
      />
    </div>
    <ul class="box-footer flex">
      <li class="box-radio flex-1">
        <i class="radio" @click="switchAll" :class="[chosen ? 'r1' : 'r2']"></i>
        <span class="text">已选({{total}})</span>
      </li>
      <li class="price-box">
        <span class="price">合计 &yen;{{totalPrice}}</span>
        <span class="price">通贝：{{totalBlue}}</span>
      </li>
      <li class="">
        <span class="confirm" @click="submit">下单</span>
      </li>
    </ul>
    <div class="cart-hr"></div>
    <tab-control
      :goods="goods"
      :newOrder="currentOrder"
      :show="showTab"
      @close="openTab"
      @onConfirm="confirm"
    />
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import KTop from '@/components/KTop'
  import CartItem from '@/components/TheCartItem'
  import TabControl from '@/components/TabControl'

  export default {
    name: 'Cart',
    components: {
      KTop,
      CartItem,
      TabControl,
    },
    data() {
      return {
        showTab: false,
        showDel: false,
        currentOrder: {},
      }
    },
    created() {
      this.$store.dispatch('cartList')
    },
    computed: {
      ...mapGetters(['cartList', 'currentCart', 'goods']),
      total() {
        return this.currentCart.length
      },
      totalPrice() {
        const total = this.currentCart
          .reduce((acc, val) => acc + Number(val.goods_price) * val.goods_count, 0)
          .toFixed(2)
        return Number(total)
      },
      totalBlue() {
        return this.currentCart
          .reduce((acc, val) => acc + Number(val.blue_score) * val.goods_count, 0)
      },
      chosen() {
        return this.currentCart.length == this.cartList.length && this.currentCart.length > 0
      },
    },
    methods: {
      ...mapMutations(['CHOSEN_ALL_ITEM']),
      openTab() {
        this.showTab = !this.showTab
      },
      confirm(order) {
        const goods = {...order}
        goods.cart_id = this.currentOrder.cart_id
        this.$store.dispatch('putCart', goods).then(res => {
          this.$store.dispatch('cartList')
          this.openTab()
        })
      },
      edit(order) {
        this.$loading()
        this.$store.dispatch('goods', {
          'goods_id': order.goods_id
        }).then(res => {
          this.$loading(0)
          this.currentOrder = order
          this.openTab()
        })
      },
      del(order) {
        this.$dialog('是否删除该商品？', (res) => {
          this.$store.dispatch('delCart', {
            'cart_id': order.cart_id
          })
        })
      },
      switchAll() {
        this.CHOSEN_ALL_ITEM({flag: !this.chosen})
      },
      submit() {
        if (this.currentCart.length == 0) {
          this.$toast('请至少选择一个商品')
          return
        }
        this.$router.push({path: '/ConfirmOrder', name: 'ConfirmOrder', params: {toOrder: true}})
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .cart {
    .no-result{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: @font-s;
      color: #2d2d2d;
      img{
        width: 8rem;
        height: 8rem;
      }
    }

    .title {
      margin: 1rem 0;
      text-align: center;
    }

    .box-goods {
      .goods-item {
        &:first-child {
          border-top: none;
        }
      }
    }

    .box-footer {
      position: fixed;
      width: 100%;
      height: 2rem;
      bottom: 0;
      align-items: center;
      background: white;
      .text {
        font-size: @font-s;
      }
    }

    .price-box{
      display: flex;
      flex-direction: column;
      text-align: right;
      width: 7rem;
    }
    .price {
      font-size: @font-s;
      margin-right: 1rem;
      vertical-align: middle;
      color: @text-color;
      .no-wrap();
    }

    .confirm {
      display: inline-block;
      background: @primary-active;
      border-radius: 0;
      color: #fff;
      text-align: center;
      width: 5rem;
      height: 2rem;
      line-height: 2rem;
      font-size: @font-s;
    }

    .box-radio {
      width: 5rem;
      & > span {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .radio {
      margin-left: 10px;
      display: inline-block;
      vertical-align: middle;
      width: 20px;
      height: 20px;
    }

    .r1 {
      background: @primary-active;
      border-radius: 50%;
      .bg-image('check');
    }

    .r2 {
      //.bg-image(success);
      border: 1px solid black;
      border-radius: 50%;
    }

    .cart-hr {
      width: 100%;
      height: 2rem;
    }
  }
</style>
