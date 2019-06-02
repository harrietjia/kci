<template lang="html">
  <div class="confirmWrapper">
    <KTop :title="'确认订单'"></KTop>
    <div class="bg"></div>
    <div class="wrapper confirm-order">
      <scroller
        class="scroller"
        ref="scroller"
      >
        <div class="head" @click="gotoAddr" v-if="address.consignee">
          <div class="left">
            <p class="top">收货人： {{address.consignee}} <span class="iphone">{{address.mobilephone}}</span></p>
            <p class="address">收货地址： {{addressName}}</p>
          </div>
          <div class="right">
            <i class="ico ico-right"></i>
          </div>
        </div>
        <div class="head" @click="gotoAddr" v-if="!address.consignee">
          <div class="left">
            <p class="noAddress">请先选择收货地址</p>
          </div>
          <div class="right">
            <i class="ico ico-right"></i>
          </div>
        </div>
        <!--<div class="line"></div>-->
        <div class="order-box">
          <div class="title">购买订单</div>
          <div class="order-list">
            <div class="item" v-for="item of currentCart" :key="item.cart_id">
              <img :src="item.goods_pic"/>
              <div class="center">
                <p class="name">{{item.goods_name}}</p>
                <p class="desc">{{item.goods_attr_item_name}}</p>
                <p class="price" v-if="item.goods_type != '2'">通贝 :{{item.blue_score}}</p>
                <p class="price">&yen;{{item.goods_price}}
                  <span>×{{item.goods_count}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="item-line">
            <div class="left">快递费：</div>
            <div class="right">
              <span>&yen;{{freight}}</span>
            </div>
          </div>
          <div class="item-line">
            <div class="left">优惠券</div>
            <div class="right">
              <span class="red">无</span>
              <!--<i class="ico ico-right"></i>-->
            </div>
          </div>
          <div class="item-line">
            <!--<div class="left">备注留言</div>-->
            <div class="input-txt">
              <input type="text" maxlength="120" v-model="beizu" placeholder="备注留言">
            </div>
          </div>

          <div class="item-line space" @click="openPicker">
            <div class="left">通贝余额</div>
            <div class="right">
              <span class="blue">{{kTong}}</span>
            </div>
          </div>
          <div class="item-line" @click="openPicker">
            <div class="left">选择支付方式</div>
            <div class="right">
              <span class="blue">{{payWayData.name}}</span>
              <i class="ico ico-right"></i>
            </div>
          </div>
          <!--<div class="item-line">-->
          <!--<div class="right">-->
          <!--共一件商品-->
          <!--<span>小计： &yen;{{totalPrice}}</span>-->
          <!--<span>通贝：{{totalBlue}}</span>-->
          <!--<span>运费：{{freight}}</span>-->
          <!--</div>-->
          <!--</div>-->
          <div class="last"></div>
        </div>
      </scroller>
      <div class="bottom">
        <div class="total-price">
          <p>
            <span>共{{currentCart.length}}件，总金额</span>
            <span class="red" v-if="totalBlue">通贝 {{totalBlue}}</span>
            <!--<span class="red">&yen;{{totalPrice}}</span>-->
          </p>
          <p>
            <span>需现金支付:</span>
            <span class="red">&yen;{{Number(freight) + Number(totalPrice)}}</span>
          </p>
        </div>
        <button @click="openPay">提交订单</button>
      </div>


      <!--<Picker-->
      <!--:title="'选择优惠券'"-->
      <!--:datas="payList"-->
      <!--:flag="showPicker"-->
      <!--@onShow="openPicker"-->
      <!--@onComplete="touchItem"-->
      <!--/>-->
      <Picker
        :title="'选择支付方式'"
        :datas="payList"
        :flag="showPicker"
        @onShow="openPicker"
        @onComplete="touchItem"
      />
    </div>

    <KDialog :title="''" :props-show="showPay" @close="openPay" @onConfirm="pay()">
      <PayWord @change="change1"></PayWord>
    </KDialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Picker from '@/components/Picker'
  import KTop from '@/components/KTop'
  import * as api from '@/api/index'
  import md5 from 'blueimp-md5'
  import KDialog from '@/components/KDialog'
  import PayWord from '@/components/PayWord'

  export default {
    components: {
      Picker,
      KTop,
      KDialog,
      PayWord
    },
    data() {
      return {
        showPicker: false,
        payWayData: {},
        payList: [],
        scoreTag: 0,
        red: 0,
        beizu: '',
        address: {},
        payWord: '',
        showPay: false,
        kTong: '',
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.name === 'OrderList') {
        next(vm => {
          vm.$router.push('/Shop')
        })
      } else {
        next();
      }
    },
    created() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0

      if (this.$route.params.toOrder) {   //从商品页面过来时请求默认地址  其余取vuex里的地址
        api.defaultAddress().then((res) => {
          this.address = res.data
          const address = res.data
          this.$store.commit('SET_ADDRESS', {address})
        })
      } else {
        this.address = this.orderAddress
      }

      // if (!this.$route.params.toOrder) {  // 保留 防止从订单页面跳回来
      //   this.$router.push('/Shop')
      //   return
      // }
      if (!this.currentCart.length) {
        this.$router.push('/Shop')
        return
      }
      this.$store.dispatch('payWay').then(res => {
        this.kTong = this.payWay.blue_score
        this.payWay.pay_way_list.forEach(val => {
          this.payList.push({
            id: val.pay_way,
            name: val.pay_way_name,
          })
        })
        this.payWayData = this.payList[0]
      })
    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    computed: {
      ...mapGetters(['currentCart', 'payWay', 'orderAddress']),
      freight() {
        const total = this.currentCart
          .reduce((acc, val) => acc + Number(val.freight) * val.goods_count, 0)
          .toFixed(2)
        return Number(total)
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
      addressName() {
        const addr = this.address
        if (!addr.dev_id) return ''
        return addr.province + ' ' + addr.city + ' ' + addr.area + ' ' + addr.street
      },
      balance() {
        if (this.scoreTag != 1) return 0
        const balance = Number(this.payWay.balance)
        if (balance > this.totalPrice) return this.totalPrice
        return this.payWay.balance
      },
      ratio() {
        return Number(this.payWay.score_change_poundage_percent) / 100
      },
      redScore() {
        if (this.scoreTag != 2) return 0
        const score = Number(this.payWay.red_score)
        // const score = 5000
        const red = Math.floor(score / (1 + this.ratio))
        if (red > this.totalPrice) return this.getPayNum(this.totalPrice, this.ratio)
        return this.getPayNum(red, this.ratio)
      },
      price() {
        switch (this.scoreTag) {
          case 1:
            return (this.balance >= this.totalPrice ? 0 : this.totalPrice - this.balance).toFixed(2)
          case 2:
            let score = Math.floor(this.redScore / (this.ratio + 1))
            return (score >= this.totalPrice ? 0 : this.totalPrice - score).toFixed(2)
          default:
            return this.totalPrice.toFixed(2)
        }
      }
    },
    methods: {
      getPayNum(score, ratio) {
        return Math.ceil(score + score * ratio)
      },
      openPicker() {
        this.showPicker = !this.showPicker
      },
      touchItem(data) {
        this.payWayData = data
      },
      touchScore(tag) {
        this.scoreTag = this.scoreTag == tag ? 0 : tag
      },
      gotoAddr() {
        this.$router.push({path: '/AddressList', query: {confirmOrder: true}})
      },
      change1(pay) {
        this.payWord = pay
      },
      openPay() {
        if (!this.address || !this.address.dev_id) {
          this.$toast('请选择收货地址')
          return
        }
        this.showPay = !this.showPay
      },
      async pay() {

        if (!this.payWord || this.payWord.length < 6) {
          this.$toast('请输入正确的支付密码')
          return
        }
        if (!this.payWayData.id) {
          this.$toast('请选择支付方式')
          return
        }

        // if (this.payWayData.id == '2' && this.price > 0 && this.price < 500) {
        //   let tip = '由于银联快捷支付限制，单笔交易不低于500元/笔，不足500元将以最低单笔交易额扣除您500元，'
        //   tip += '您的该笔订单系统检测低于500元，为了避免造成不必要的麻烦，建议选择微信支付！感谢您对博大新零售的支持！'
        //   this.$dialog('请选择微信支付', tip).then(res => {
        //     this.payWayData = this.payList[1]
        //   }).catch(err => {
        //   })
        //   return
        // }
        let allMoney = Number(this.freight) + Number(this.totalPrice)
        await api.addOrder({
          'total_price': allMoney,
          'pay_blue_score': this.totalBlue,
          'pay_money': allMoney,
          'dev_id': this.address.dev_id,
          'goods_list': this.currentCart,
          'buyer_leave_message': this.beizu,
          'pay_password': md5(this.payWord)
        }).then((res) => {
          this.payWord = ''
          this.showPay = !this.showPay
          this.$store.dispatch('clientInfo')
          this.$router.push('/OrderList')
        }).catch((res) => {
          this.payWord = ''
          this.showPay = !this.showPay
        })

        // this.$store.dispatch('addOrder', {
        //   // 'pay_way': this.payWayData.id,
        //   'total_price': this.totalPrice,
        //   // 'pay_money': this.price,
        //   // 'pay_balance': this.balance,
        //   // 'pay_red_score': this.redScore,
        //   'pay_blue_score': this.totalBlue,
        //   'dev_id': this.address.dev_id,
        //   'goods_list': this.currentCart
        // }).then(url => {
        //   if (url) {
        //     window.location.href = url
        //   } else {
        //     this.$router.push('/OrderList')
        //   }
        // })

      },
      refresh(done) {
        setTimeout(() => {
          done()
        }, 300)
      },
      loading(done) {
        done()
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 100
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-checked {
    background: @primary-active;
    border-radius: 50%;
    .bg-image('check');
  }

  .ico-check {
    //.bg-image(check);
  }

  .ico-right {
    width: .7rem;
    height: .7rem;
    .bg-image('right');
  }

  .confirmWrapper {
    width: 100%;
    .bg {
      position: absolute;
      top: 0;
      z-index: -1;
      height: 8rem;
      .bg-image('layer_filter@2x');
    }
  }

  .confirm-order {
    width: 94%;
    margin: 0 auto;
    .head {
      background: #fff;
      padding: 0 .5rem;
      font-size: @font-s;
      font-weight: normal;
      margin: 1rem 0;
      min-height: 6rem;
      box-shadow: 0 5px 20px 0 rgba(51, 51, 51, 0.1);
      border-radius: 5px;
      display: flex;
      .left {
        flex: 1;
        .top {
          padding: .5rem 0;
          margin-bottom: .5rem;
          span {
            float: right;
            font-size: @font-s;
            color: @black-color;
            padding-right: 2rem;
          }
        }
        .noAddress {
          font-size: @font-xm;
          line-height: 5rem;
          margin-left: 1rem;
        }
        .address {
          position: relative;
          line-height: 1.5rem;
          color: @gray-color;
          .eddit {
            position: absolute;
            top: 0.5rem;
            right: 0;
          }
        }
      }
      .right {
        flex: 0 0 1rem;
        display: flex;
        align-self: center;
        i {
          width: 1rem;
          height: 1rem;
        }
      }

    }
    .line {
      width: 100%;
      height: 0.4rem;
      background: linear-gradient(90deg, #7898ff 0%, #7898ff 25%, white 25%, white 50%, #ff5543 50%, #ff5543 75%, white 75%, white 100%);
      background-size: 10% 100%;
    }
    .order-box {
      .title {
        background: #fff;
        color: @black-color;
        font-size: @font-s;
        padding: .5rem;
        border-bottom: 1px solid @border-color;
      }
      .order-list {
        background: #fff;
      }
      .item {
        display: flex;
        padding: 0.5rem;
        border-bottom: 1px solid @border-color;
        img {
          width: 4rem;
          height: 4rem;
          margin-right: 0.5rem;
        }
      }
      .center {
        width: 70%;
        p {
          font-size: @font-s;
        }
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .desc {
          min-height: 2rem;
          font-size: @font-s;
          color: @text-color;
        }
        .price {
          color: @gray-color;
          span {
            float: right;
            font-size: @font-s;
          }
        }
      }
      .item-line {
        display: flex;
        align-items: center;
        height: 2.3rem;
        line-height: 2.3rem;
        padding: 0 .5rem;
        background: #fff;
        border-bottom: 1px solid @border-color;
        .left {
          flex: 1;
          font-size: @font-s;
        }
        .right {
          flex: 1;
          font-size: @font-s;
          text-align: right;
          color: @text-color;
        }
      }
      .last {
        height: 2rem;
      }
      .score-box {
        background: #fff;
        border-bottom: 1px solid @border-color;
        padding: 0 .5rem;
        font-size: @font-s;
        .score {
          display: flex;
          align-items: center;
          height: 2rem;
          line-height: 2rem;
          div {
            flex: 1;
          }
          i {
            width: 1rem;
            height: 1rem;
          }
        }
        .middle {
          text-align: center;
        }
        .right {
          text-align: right;
        }
      }
    }
    .bottom {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      min-height: 2rem;
      line-height: 2rem;
      display: flex;
      font-size: @font-s;
      .total-price {
        background: #fff;
        width: 72%;
        p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 1.1rem;
          padding: 0 .5rem;
          span:first-child {
            flex: 0 0 5.5rem;
          }
          span:last-child {
            .no-wrap()
          }
        }
      }
      button {
        line-height: 2rem;
        font-size: @font-s;
        border: none;
        width: 28%;
        color: #fff;
        background: @primary-active;
        &:focus {
          outline: none;
        }
      }
    }
    .space {
      margin-top: .5rem;
    }

    .red {
      color: @text-color;
    }
    .blue {
      color: #77adff;
    }
  }

  .input-txt {
    /*flex: 3;*/
    width: 100%;
    input {
      /*height: 2rem;*/
      background: #f5f5f5;
      padding: .3rem;
      width: 96%;
      color: @text-color;
      border: none;
      &:focus {
        outline: none;
      }
    }
  }
</style>
