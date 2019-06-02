<template lang="html">
  <div class="wrapper order-detail">
    <KTop :title="'订单详情'"></KTop>

    <div class="head">
      <p class="state">{{orders.state_info}}</p>
      <p class="number">订单编号： {{orders.order_code}}</p>
      <p class="time">创建时间： {{orders.order_create_time}}</p>
    </div>

    <div class="address">
      <div class="left">
        <i class="ico ico-address"></i>
      </div>

      <div class="right">
        <p class="top">收货人： {{orders.receiver_name}} <span class="iphone">{{orders.receiver_mobilephone}}</span></p>
        <p class="address-text">收货地址： {{orders.receiver_address}}</p>
      </div>
    </div>

    <div class="order-box">
      <div class="order-list">
        <order-item
          :order="item"
          :state="orders.state_info"
          v-for="(item,idx) of orders.sub"
          :key="item.sub_order_id"
        />
      </div>
      <div class="order-des-s">
        <p class="des">商品总价</p>
        <p class="money">&yen;{{orders.total_price}}</p>
      </div>
      <div class="order-des-s">
        <p class="des">运费（快递）</p>
        <p class="money">&yen;{{orders.freight_money}}</p>
      </div>
      <div class="order-des">
        <p class="des">订单总价</p>
        <p class="money">&yen;{{orders.total_price}}</p>
      </div>
      <div class="pay">
        <p class="des">需付款</p>
        <div class="right">
          <p class="money">&yen;{{orders.actual_total_price}}</p>
          <p class="money">通贝：{{orders.total_blue_score_price}}</p>
        </div>
      </div>
    </div>

    <div class="order-desc">
      <ul class="list">
        <li class="item-top">
          <span class="title">服务时间：</span>
          <span class="title-cray">{{orders.run_time}}</span>
        </li>
      </ul>
      <div class="service-box">
        <div class="service-btn">
          <i class="ico ico-phone"></i>
          <span><a class="title" :href="`tel:${orders.custom_service_phone}`">电话客服</a></span>
        </div>
      </div>
    </div>

    <div class="space"></div>

    <div class="footer-box">
      <div class="left-box">
        <!--<span>付款：</span>-->
        <!--<span class="price">&yen;{{order.actual_total_price}}</span> -->
      </div>
      <div class="right-box">
        <div class="footer-btn" v-if="orders.state == '101'" @click="cancel(orders.parent_order_id)">取消订单</div>
        <div class="footer-btn yellow" v-if="orders.state == '101'" @click="pay(orders.parent_order_id)">立即支付</div>
        <div class="footer-btn hidden" v-if="orders.can_receipt">确认收货</div>
        <div class="footer-btn yellow" v-if="orders.can_receipt" @click="confirmOrder(orders.parent_order_id)">确认收货</div>
        <div class="footer-btn big-padding hidden" v-if="orders.can_comment" @click="test(orders.parent_order_id)"> 换货 </div>
        <div class="footer-btn big-padding yellow" v-if="orders.can_comment" @click="comment(orders)"> 评价 </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import OrderItem from '@/components/OrderItem'
  import KTop from '@/components/KTop'

  export default {
    name: 'OrdersDetail',
    components: {
      OrderItem,
      KTop
    },
    created() {
      const id = this.$route.query.id
      this.$store.dispatch('getOrdersDetail', {
        'parent_order_id': id,
      })
    },
    computed: {
      ...mapGetters(['orders'])
    },
    methods: {
      cancel(id) {
        this.$dialog('是否要取消该订单？', (res) => {
          this.$store.dispatch('delGood', {
            'parent_order_id': id
          }).then(res => {
            this.$router.go(-1)
          })
        })
      },
      comment(order) {
        this.$router.push({path: '/Review', name: 'Review', params: order})
      },
      pay(id) {
        this.$store.dispatch('getPayUrl', {
          'type': 1,
          'order_id': id
        }).then(url => {
          window.location.href = url
        })
      },
      confirmOrder(id) {
        this.$dialog('是否确认收货？', (res) => {
          this.$store.dispatch('confirmOrder', {
            'parent_order_id': id,
          }).then(res => {
            this.$store.dispatch('getOrdersDetail', {'parent_order_id': id})
          })
        })
      },
      refund(id) {

      },
      test() {
        this.$toast('该功能未完善，敬请期待')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-phone {
    .bg-image('icon_phone@2x');
    width: .8rem;
    height: .8rem;
  }

  .order-detail {
    .head {
      background: #fff;
      padding: .5rem;
      font-size: @font-xs;
      color: @disable-color;
      margin-bottom: .3rem;
      border: 1px solid @border-color;
      .number {
        .no-wrap();
        margin-bottom: .3rem;
      }
      .time {
      }
      .state {
        font-size: .8rem;
        color: black;
        font-weight: bold;
        margin-bottom: .5rem;
      }
    }
    .address {
      background: #fff;
      padding: .5rem;
      margin-bottom: .3rem;
      border: 1px solid @border-color;
      font-size: @font-s;
      display: flex;
      .left {
        flex: 0 0 1.5rem;
        i {
          width: 1rem;
          height: 1rem;
          .bg-image('store_address@2x');
        }
      }
      .right {
        flex: 1;
        .top {
          padding-bottom: .5rem;
          span {
            /*float: right;*/
            font-size: @font-s;
            padding-left: 1rem;
          }
        }
        .address-text {
          color: @disable-color;
          line-height: 1.1rem;
        }
      }
    }
    .order-box {
      background: #fff;
      margin-bottom: .5rem;
      border-top: 1px solid #ecedef;
      .order-des-s {
        font-size: @font-xs;
        padding: .3rem .5rem;
        display: flex;
        color: @gray-color;
      }
      .order-des {
        font-size: @font-s;
        padding: .3rem .5rem;
        display: flex;
      }
      .pay {
        font-size: @font-s;
        padding: .3rem .5rem;
        display: flex;
        border-top: 1px solid @border-color;
        .des {
          flex: 1;
        }
        .money {
          width: 12rem;
          text-align: right;
          color: @primary-active;
          font-size: @font-s;
          .no-wrap();
        }
      }
      .des {
        flex: 0 0 4rem;
      }
      .money {
        flex: 1;
        text-align: right;
      }
    }

    .order-desc {
      background: #fff;
      font-size: @font-s;
      .list {
        padding: .4rem .7rem;
        color: @black-color;
        border-bottom: 1px solid #F5F5F5;
      }
      .title {
        display: inline-block;
        width: 3.5rem;
      }
      .title-cray {
        color: @text-color;
        margin-left: .5rem;
      }
      .service-box {
        padding: .4rem .7rem;
        .service-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid @border-color;
          border-radius: 4px;
          width: 5rem;
          height: 1.5rem;
        }
        .title{
          color: @text-color;
        }
        i {
          margin-right: 0.5rem;
        }
      }
    }

    .space{
      height: 2.5rem;
    }

    .footer-box {
      font-size: @font-s;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2.5rem;
      display: flex;
      align-items: center;
      background: #fff;
      overflow: hidden;
      border-top: 1px solid @border-color;
      text-align: right;
      .left-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: @font-s;
      }
      .price {
        color: @danger-color;
      }
      .right-box {
        flex: 0 0 9rem;
        display: flex;
        text-align: right;
      }
      .footer-btn {
        padding: .1rem .5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        border-radius: 4px;
        border: 1px solid @border-color;
        margin-right: .5rem;
      }
      .big-padding{
        padding: .1rem 1.2rem;
      }
      .yellow {
        color: white;
        background-image: linear-gradient(-90deg, #d6b44d 0%, #efdc73 100%), linear-gradient(#f4dc63, #f4dc63);
        background-blend-mode: normal, normal;
      }
      .hidden{
        visibility: hidden;
      }
    }
  }
</style>
