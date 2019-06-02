<template>
  <div class="GetMoney">
    <div class="m-top">
      <i class="ico ico-back" @click="back"></i>
      <p class="title">已{{orderText}}订单</p>
    </div>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="bgImg">
        <p class="tips">点击订单可查看详情</p>
        <!--<p class="tips">暂无订单</p>-->
      </div>

      <!--<div class="banner">-->
      <!--<p>{{orderText}}帐号</p>-->
      <!--<p>{{orderText}}状态</p>-->
      <!--<p>{{orderText}}时间</p>-->
      <!--</div>-->

      <div class="content">
        <ul>
          <li class="item" v-for="item in goodsList" @click="toOrderDetail(item)">
            <div class="left">
              <p>{{item.trader_client_name}}</p>
              <p class="time">{{item.payment_time}}</p>
            </div>
            <div class="right">
              <p>{{item.trader_behavior=== 1?'-':'+'}}{{item.order_amount_pay}}</p>
            </div>
          </li>
        </ul>
      </div>

    </scroller>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'

  export default {
    name: "GetMoney",
    components: {
      KTop,
    },
    data() {
      return {
        id: '1',
        isRequest: false,
        orderText: ''
      }
    },
    computed: {
      ...mapGetters(['goodsList', 'goodsCount', 'clientInfo',])
    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    created() {

      if (this.$route.query.type === 'buy') {
        this.type = 1
        this.orderText = '付款'
      } else if (this.$route.query.type === 'sale') {
        this.type = 2
        this.orderText = '收款'
      }
      this.getDatas(0, true)
    },
    methods: {
      toOrderDetail(list) {
        this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': list}})
      },
      back() {
        this.$router.go(-1)
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
          this.getDatas(this.goodsCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        // const footerHeight = this.$refs.footer.offsetHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      async getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return await  this.$store.dispatch('getMyList', {
          'page': page + 1,
          // 'order_type': this.type,
          'state': '4',
          'trader_behavior': this.type,
          'isRefresh': isRefresh,
          'currency_type': this.$route.query.current,
        }).then(res => {
          this.isRequest = false
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .GetMoney {
    width: 100%;
    height: 100%;
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
    .bgImg {
      position: relative;
      width: 100%;
      height: 6rem;
      margin-top: 2.5rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      .tips {
        .all-center();
        font-size: @font-s;
        color: @white-color;
      }
    }
    .banner {
      background: @primary-active;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      color: @white-color;
      p {
        display: inline-block;
        padding: .3rem;
        font-size: @font-s;
      }
    }
    .content {
      ul {
        .item {
          background: @white-color;
          padding: .5rem 1rem;
          display: flex;
          justify-content: space-between;
          color: @text-color;
          border-bottom: 1px solid #C9C9C9;
          .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: left;
            p {
              display: inline-block;
              min-width: 4rem;
              padding: .2rem 0;
              font-size: @font-s;
              color: @primary-active;
            }
            .time {
              color: @gray-color;
              font-size: @font-xs;
              /*margin-left: 1rem;*/
            }
          }
          .right {
            .flex-center();
            p {
              display: inline-block;
              min-width: 4rem;
              /*padding: .4rem .5rem;*/
              font-size: @font-s;
              color: #fd6e28;
            }
          }
        }
      }

    }
  }
</style>
