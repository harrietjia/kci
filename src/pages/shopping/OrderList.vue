<template lang="html">
  <div class="wrapper">
    <KTop :title="'我的订单'"></KTop>
    <!--<div class="head" @touchmove.prevent>-->
      <!--<form action="#" onsubmit="return false;" class="input-kw-form">-->
        <!--<input type="text" style="display:none;"/>-->
        <!--<input-->
          <!--type="search"-->
          <!--class="form-input"-->
          <!--v-model="keyword"-->
          <!--placeholder="搜索所有订单"-->
          <!--@keyup.enter.prevent="search"-->
        <!--&gt;-->
      <!--</form>-->
    <!--</div>-->
    <div class="order-list-tab" ref="tabHead">
      <ul class="tab-head" @touchmove.prevent>
        <li :class="[tabTag === 0 && 'active']" @click="touchTag(0)">全部</li>
        <li :class="[tabTag === 1 && 'active']" @click="touchTag(1)">待付款</li>
        <li :class="[tabTag === 2 && 'active']" @click="touchTag(2)">待发货</li>
        <li :class="[tabTag === 3 && 'active']" @click="touchTag(3)">待收货</li>
        <li :class="[tabTag === 4 && 'active']" @click="touchTag(4)">已完成</li>
      </ul>

      <div class="no-result" v-show="ordersList.length === 0">
        <img src="../../assets/images/noorder@2x.png" alt="">
        <p class="result">您的订单空空如也~</p>
      </div>

      <scroller
        v-show="ordersList.length !== 0"
        :on-refresh="refresh"
        :on-infinite="loading"
        class="scroller"
        ref="scroller"
      >
        <transition-group name="list-complete">
          <li
            class="li-item list-complete-item"
            v-for="(o,idx) of ordersList"
            :key="o.parent_order_id"
            @click="touchItem(o.parent_order_id)"
          >
            <p class="time">下单时间：{{o.order_create_time}}
              <span class="state" v-if="o.state_info">{{o.state_info}}</span>
              <!--<span v-if="o.state == 101" @click.stop="cancel(o.parent_order_id)">取消订单</span>-->
            </p>
            <order-item
              :order="item"
              :state="o.state_info"
              v-for="(item,idx) of o.sub"
              :key="item.sub_order_id"
            />
            <div class="footer">
              <div class="top">
                <p class="desc">共{{o.sub.length}}件商品，合计：（含运费&yen;{{o.freight_money}}）&yen;{{o.total_price}}</p>
                <p class="desc">通贝：{{o.total_blue_score_price}}</p>
              </div>

              <div class="bottom">
                <button v-if="o.state === 101" class="cancel" @click.stop="cancel(o.parent_order_id)">取消订单</button>
                <button v-if="o.state === 101" @click.stop="pay(o.parent_order_id)">立即付款</button>
                <button v-if="o.can_receipt" @click.stop="confirmOrder(o.parent_order_id)">确认收货</button>
                <button v-if="o.can_comment" class="big-padding" @click.stop="comment(o)">评价</button>
              </div>
            </div>
          </li>
        </transition-group>
        <div class="space"></div>
      </scroller>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import KTop from '@/components/KTop'
  import KFooter from '@/components/KFooter'
  import OrderItem from '@/components/OrderItem'

  export default {
    name: 'OrderList',
    components: {
      KTop,
      KFooter,
      OrderItem
    },
    data() {
      return {
        tabTag: 0,
        isRequest: false,
        keyword: ''
      }
    },
    created() {
      const tag = Number(this.$route.params.tag)
      this.touchTag(tag ? tag : 0)
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    mounted() {
      this.setScroller()
      window.onresize = () => setTimeout(() => this.setScroller(), 300)
    },
    beforeDestroy() {
      window.onresize = null
    },
    computed: {
      ...mapGetters(['ordersList', 'ordersCount'])
    },
    methods: {
      setScroller() {
        const wHeight = window.innerHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${wHeight}px`
      },
      touchTag(id) {
        this.tabTag = id
        this.getDatas(0, true)
      },
      refresh(done) {
        setTimeout(() => {
          done()
          this.getDatas(0, true)
        }, 300)
      },
      loading(done) {
        if (this.isRequest) {
          done()
          return
        }
        setTimeout(() => {
          this.getDatas(this.ordersCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getOrdersList', {
          'page': page + 1,
          'state': this.tabTag,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        }).catch(err => this.$loading(0))
      },
      comment(order) {
        this.$router.push({path: '/Review', name: 'Review', params: order})
      },
      cancel(id) {
        this.$dialog('是否要取消该订单？', (res) => {
          this.$store.dispatch('delGood', {
            'parent_order_id': id
          }).then(res => {
            this.getDatas(0, true)
          })
        })
      },
      confirmOrder(id) {
        this.$dialog('是否确认收货？', (res) => {
          this.$store.dispatch('confirmOrder', {
            'parent_order_id': id,
          }).then(res => {
            this.getDatas(0, true)
          })
        })
      },
      pay(id) {
        this.$store.dispatch('getPayUrl', {
          'type': 1,
          'order_id': id
        }).then(url => {
          window.location.href = url
        })
      },
      touchItem(id) {
        this.$router.push({path: '/OrdersDetail', query: {id}})
      },
      search() {
        this.$router.push({path: '/KCIshop', name: 'KCIshop', params: {keyword: this.keyword}})
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .scroller {
    margin-top: 5rem;
  }

  .space {
    height: 5rem;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
    background: #ededed;
    border-bottom: 1px solid @border-color;
    .input-kw-form {
      display: flex;
      width: 100%;
      border-radius: 20px;
      /*padding: 0 1rem;*/
      margin: 0 .5rem;
    }
    .form-input {
      /*flex: 1;*/
      width: 100%;
      height: 1.5rem;
      background: white;
      border-radius: 20px;
      padding: 0 1rem;
      border: none;
      &:focus {
        outline: none;
      }
    }
  }

  .time {
    background: #fff;
    padding: .8rem .4rem;
    color: @text-color;
    border-bottom: 1px solid @border-color;
    span {
      float: right;
      color: @primary-active;
    }
  }

  .li-item {
    margin-bottom: .5rem;
  }

  .footer {
    display: flex;
    flex-direction: column;
    /*height: 2.5rem;*/
    /*line-height: 2.5rem;*/
    background: #fff;
    /*align-items: center;*/
    padding: .5rem;
    .top {
      padding-bottom: .5rem;
      .desc {
        text-align: right;
      }
    }
    .bottom {
      text-align: right;
      button {
        flex: 1;
        padding: .2rem 1rem;
        height: 1.5rem;
        border: none;
        background: @primary-active;
        border-radius: 4px;
        color: #fff;
        font-size: @font-s;
        &:focus {
          outline: none;
        }
      }
      .big-padding {
        padding: .2rem 1.2rem;
      }
      .cancel {
        background: white;
        color: black;
        border: 1px solid black;
      }
    }
  }

  .order-list-tab {
    font-size: @font-s;
    .no-result {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: @font-s;
      color: #2d2d2d;
      img {
        width: 8rem;
        height: 8rem;
      }
    }
    .tab-head {
      display: flex;
      align-items: center;
      background: #fff;
      & > li {
        flex: 1;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-bottom: 1px solid @border-color;
      }
      .active {
        transition: all 0.3s ease;
        color: @primary-active;
        border-bottom: 1px solid @primary-active;
      }
    }
  }
</style>
