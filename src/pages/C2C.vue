<template>
  <div class="c2c">

    <div class="m-top">
      <p class="title">C2C</p>
      <div class="bg-btn" @click="openPublish()">
        <p class="text">发布</p>
      </div>
    </div>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >

      <div class="bgImg">
        <div class="tab">
          <ul>
            <li v-for="(item, index) of list" :class="{active:selected===index,tabItem:true}" @click="change(index)">
              {{item.title}}
            </li>
          </ul>
        </div>
      </div>

      <div class="change">
        <div class="item" @click="goNext('C2C2')">
          <p>GSC</p>
        </div>
        <div class="item" @click="goNext('C2C')">
          <p class="active">通贝</p>
        </div>
      </div>

      <!--<transition name="component-fade" mode="out-in">-->
      <SaleOrderList v-show="selected === 0" :C2Ctype="'0'" :list="goodsList" @toDetail="toDetail" @onSale="buy">
      </SaleOrderList>
      <!--</transition>-->
      <OrderList v-show="selected === 1" :C2Ctype="'0'" :list="goodsList" @toDetail="toDetail" @onBuy="sale">
      </OrderList>

      <MyOrder v-show="selected === 2" :C2Ctype="'0'" :list="goodsList" @toOrderDetail="toOrderDetail">
      </MyOrder>

    </scroller>

    <KPublish :props-show="showPublish" @close="openPublish">
      <div class="box1">
        <div class="sale" @click="publish('sale')">
          <i class="ico ico-n1"></i>
          <p class="text">出售</p>
        </div>
        <div class="sale" @click="publish('buy')">
          <i class="ico ico-n2"></i>
          <p class="text">求购</p>
        </div>
      </div>
    </KPublish>

    <KFooter :tag="2" ref="footer"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import KPublish from '@/components/KPublish'
  import KDialog from '@/components/KDialog'
  import md5 from 'blueimp-md5'
  import KFooter from '@/components/KFooter'
  import OrderList from '@/components/OrderList'
  import SaleOrderList from '@/components/SaleOrderList'
  import MyOrder from '@/components/MyOrder'
  import * as api from '@/api/index'
  import {mapGetters} from 'vuex'

  export default {
    name: "C2C",
    components: {
      KFooter,
      OrderList,
      KPublish,
      MyOrder,
      SaleOrderList,
      KDialog
    },
    data() {
      return {
        selected: 0,
        isRequest: false,
        getC2C: 2,
        showPublish: false,
        payWord: '',
        list: [
          {
            title: '买币',
          },
          {
            title: '卖币',
          },
          {
            title: '我的订单',
          },
        ]
      }
    },
    created() {
      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }
      this.$store.commit('RECEIVE_GOODS_LIST', {})
      this.getDatas(0, true)
    },
    computed: {
      ...mapGetters(['goodsList', 'goodsCount', 'clientInfo',])
    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    destroyed() {
      this.$store.commit('RECEIVE_GOODS_LIST', {}) //先清空数据再请求接口
    },
    methods: {
      goNext(where) {
        this.$router.push(`/${where}`)
      },
      openPublish() {
        this.showPublish = !this.showPublish
      },
      change(index) {
        if (this.selected === index) {
          return
        }
        this.$store.commit('RECEIVE_GOODS_LIST', {}) //先清空数据再请求接口

        this.selected = index
        if (index === 0) {
          this.getC2C = 2
        } else if (index === 1) {
          this.getC2C = 1
        }
        this.getDatas(0, true)
        // this.$nextTick(()=>{})
      },
      buy(item) {
        let clicktag = 0;
        if (item.is_current_client === 0) {
          this.$dialog('确定买入', (pwd) => {
            this.payWord = pwd
            if (!this.payWord || this.payWord.length < 6) {
              this.$toast('请输入正确的支付密码')
              return
            }
            if (clicktag === 0) {
              clicktag = 1
              api.Buy({
                'order_id': item.order_id,
                'pay_password': md5(this.payWord)
              }).then(() => {
                this.payWord = ''
                this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': item}})
              }).catch((res) => {
              })
              setTimeout(function () {
                clicktag = 0
              }, 500)
            }

          }, 2, item.credit)
        } else if (item.is_current_client === 1) {
          this.$dialog('确定取消挂卖', () => {
            if (clicktag === 0) {
              clicktag = 1
              api.Cancel({
                'order_id': item.order_id,
              }).then(() => {
                this.$toast('取消成功')
                this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': item}})
              }).catch((res) => {
              })
              setTimeout(function () {
                clicktag = 0
              }, 500)
            }
          })
        }

      },
      sale(item) {
        let clicktag = 0

        if (item.is_current_client === 0) {
          this.$dialog('确定出售', (pwd) => {
            if (Number(this.clientInfo.balance) < Number(item.order_amount)) {
              this.$toast('账户余额不足')
              return
            }
            this.payWord = pwd
            if (!this.payWord || this.payWord.length < 6) {
              this.$toast('请输入正确的支付密码')
              return
            }
            if (clicktag === 0) {
              clicktag = 1
              api.Sale({
                'order_id': item.order_id,
                'pay_password': md5(this.payWord)
              }).then(() => {
                this.payWord = ''
                this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': item}})
              }).catch((res) => {
              })
              setTimeout(function () {
                clicktag = 0
              }, 500)
            }

          }, 2, item.credit)
        } else if (item.is_current_client === 1) {
          this.$dialog('确定取消求购', () => {
            if (clicktag === 0) {
              clicktag = 1;
              api.Cancel({
                'order_id': item.order_id,
              }).then(() => {
                this.$toast('取消成功')
                this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': item}})
              }).catch((res) => {
              })
              setTimeout(function () {
                clicktag = 0
              }, 500)
            }
          })
        }

      },
      toDetail(list) {
        if (list.is_current_client === 1) {
          this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': list}})
        }

      },
      toOrderDetail(list) {
        this.$dialog('查看订单详情', () => {
          this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': list}})
        })

      },
      publish(String) {
        this.$router.push({path: '/Publish', query: {'type': String}})
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
        const headHeight = 30
        const footerHeight = this.$refs.footer.offsetHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      async getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        if (this.selected < 2) {
          return await  this.$store.dispatch('getC2CList', {
            'page': page + 1,
            // 'category_id': this.tabTag,
            'type': this.getC2C,
            'isRefresh': isRefresh,
            'currency_type': 1
          }).then(res => {
            this.isRequest = false
          })
        }
        if (this.selected === 2) {
          return await  this.$store.dispatch('getMyList', {
            'page': page + 1,
            // 'order_type': this.type,
            // 'trader_behavior': this.type,
            'isRefresh': isRefresh,
            'currency_type': 1
          }).then(res => {
            this.isRequest = false
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    width: 2.5rem;
    height: 2.5rem;
    .bg-image('sale');
  }

  .ico-n2 {
    width: 2.5rem;
    height: 2.5rem;
    .bg-image('card');
  }

  .box1 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: @white-color;
    display: flex;
    .sale {
      flex: 1;
      height: 4rem;
      background: @white-color;
      border-radius: 1rem;
      margin-bottom: 1rem;
      padding: .5rem 0;
      //.flex-center();
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      i {
        //.flex-center();
        display: block;
        /*margin-left: .7rem;*/
      }
      .text {
        //.flex-center();
        font-size: @font-xm;
        color: @text-color;
      }
    }
  }

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }

  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }

  .scroller {
    margin-top: 1.5rem;
  }

  .c2c {
    width: 100%;
    height: 100%;
    .m-top {
      position: sticky;
      top: 0;
      left: 0;
      box-sizing: border-box;
      height: 2.5rem; // 44 + 20 : top, 98 : bottom
      background: #020202;
      // border-bottom: 1px solid @border-color;
      color: #fff;
      z-index: 52;
      .title {
        line-height: 2.7rem;
        text-align: center;
        color: #fff;
        font-size: @font-xm;
      }
      .bg-btn {
        .text {
          position: absolute;
          top: 0;
          right: .7rem;
          color: #fff;
          line-height: 2.7rem;
          font-size: .8rem;
        }
      }
    }
    .bgImg {
      position: relative;
      width: 100%;
      height: 7rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      .tab {
        position: absolute;
        top: 3rem;
        left: 51%;
        transform: translateX(-50%);
        width: 85%;
        ul {
          /*column-count: 3;*/
          color: @primary-active;
          font-size: @font-s;
          overflow: hidden;
          .tabItem {
            /*-webkit-column-break-inside: avoid;*/
            /*height: 100%;*/
            /*overflow: auto; //兼容火狐 break-inside:avoid;*/
            width: 25%;
            float: left;
            text-align: center;
            padding: .3rem .5rem;
            border: 1px solid @primary-active;
          }
          .tabItem:first-child {
            border-radius: 5px 0 0 5px;
          }
          .tabItem:last-child {
            border-radius: 0 5px 5px 0;
          }
          .active {
            background: @primary-active;
            color: @white-color;
          }
        }
      }
      .bg-text {
        position: absolute;
        left: .5rem;
        bottom: .5rem;
        p {
          font-size: @font-l;
          color: @white-color;
        }
      }
      .bg-btn {
        position: absolute;
        right: .5rem;
        bottom: .5rem;
        width: 5rem;
        height: 1.5rem;
        background-color: @white-color;
        box-shadow: 0 0 1rem 0 rgba(255, 36, 0, 0.16);
        border-radius: 2rem;
        text-align: center;
        .text {
          font-size: @font-s;
          color: @primary-active;
          line-height: 1.5rem;
        }
      }
    }
    .change {
      background: white;
      display: flex;
      height: 2rem;
      font-size: .8rem;
      .item {
        flex: 1;
        line-height: 2rem;
        box-sizing: border-box;
        p {
          color: @disable-color;
          text-align: center;
          width: 4rem;
          margin: 0 auto;
        }
        .active {
          color: black;
          border-bottom: 2px solid @primary-active;
        }
      }
    }
    .list {
      ul {
        margin: 0 .5rem;
        .list-item {
          background: @white-color;
          margin: 1rem auto;
          display: flex;
          font-size: .7rem;
          .name {
            flex: 0 0 5rem;
            display: flex;
            justify-content: center;
            align-self: center;
            color: @gray-color;
          }
          .money {
            flex: 1;
            span {
              color: @text-color;
              display: block;
              margin: .5rem 0;
            }
            span:first-child {
              color: #ff5236;
            }
          }
          .list-btn {
            display: flex;
            justify-content: center;
            align-self: center;
            flex: 0 0 5rem;
            width: 5rem;
            height: 1.5rem;
            margin-right: .5rem;
            font-size: 0.5rem;
            line-height: 1.5rem;
            border: none;
            border-radius: 1rem;
            color: #fff !important;
            background-image: linear-gradient(-90deg, #fc5d25 0%, #ffa031 100%), linear-gradient(#f9f7ff, #f9f7ff);
            box-shadow: 0rem 0rem 1rem 0rem rgba(255, 101, 0, 0.2);
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
