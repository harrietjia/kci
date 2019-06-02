<template>
  <div class="OrderDetail">
    <KTop :title="'订单详情'">
    </KTop>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <!--<div class="bgImg">-->
      <!--</div>-->

      <div class="detail">
        <div class="head">
          <p class="state">{{order.trader_behavior=== 1?'买入':'卖出'}}</p>
          <p class="time">{{order.last_update_time}}</p>
        </div>

        <div class="content" ref="content">
          <div class="left" v-if="getTrader()">
            <p>订单号：{{order.order_sn}}</p>
            <p>{{order.trader_behavior=== 1?'收款':'打款'}}人：{{traderCard.card_holder}}</p>
            <p>{{order.trader_behavior=== 1?'收款':'打款'}}银行：{{traderCard.bank}}</p>
            <p>{{order.trader_behavior=== 1?'收款':'打款'}}帐号：{{traderCard.card_num}}</p>
            <p>联系电话：{{traderCard.mobilephone}}</p>
          </div>
          <div class="right">
            <p>{{order.currency_type === '1' ? '通贝':'GSC'}}：{{order.order_amount}}</p>
            <p>RMB：{{order.order_amount_pay}}</p>
          </div>
        </div>

        <div class="foot">
          <p>订单状态：<span>{{state}}</span></p>
          <p class="wait" v-show="order.order_state=='20'">{{order.trader_behavior=== 1?' 等待线下付款':'等待对方打款'}}</p>
          <p class="wait" v-show="order.order_state=='30' && imgURL" @click="openImg">
            查看上传图片</p>
        </div>
      </div>

      <div class="process" v-if="order.order_state!='0'&& clientInfo.client_id !== order.from_client_id">
        <p :class="order.order_state!='0'? 'text':''"><span
          :class="order.order_state!='0'? 'point active':'point'"></span>您匹配了{{traderInfo.client_name}}的订单</p>

        <!--{{order.trader_behavior===1?'买入':'卖出'}}-->

        <div class="order" v-if="currentCart.bank">
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}人：{{currentCart.card_holder}}</p>
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}银行：{{currentCart.bank}}</p>
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}帐号：{{currentCart.card_num}}</p>
        </div>

        <p v-if="order.trader_behavior=== 2" :class="order.order_state!='0'? 'text':''"><span
          :class="order.order_state!='0'? 'point active':'point'"></span>冻结账户{{order.order_amount}}{{order.currency_type === '1' ? '通贝':'GSC'}}作为保证金
        </p>

        <div v-show="order.trader_behavior=== 1">
          <p :class="order.order_state>='30'? 'text':''"><span
            :class="order.order_state>='30'? 'point active':'point'"></span>您已向{{order.trader_behavior===
            1?'买入':'卖出'}}用户线下{{order.trader_behavior=== 1?'打款':'收款'}}</p>


          <p :class="order.order_state>='40'? 'text':''"><span
            :class="order.order_state>='40'? 'point active':'point'"></span>等待{{order.trader_behavior===
            1?'卖出':'买入'}}用户确认{{order.trader_behavior=== 1?'收款':'打款'}}</p>
        </div>

        <div v-show="order.trader_behavior=== 2">
          <p :class="order.order_state>='30'? 'text':''"><span
            :class="order.order_state>='30'? 'point active':'point'"></span>等待{{order.trader_behavior===
            1?'卖出':'买入'}}用户确认{{order.trader_behavior=== 1?'收款':'打款'}}</p>

          <p :class="order.order_state>='40'? 'text':''"><span
            :class="order.order_state>='40'? 'point active':'point'"></span>您已向{{order.trader_behavior===
            1?'买入':'卖出'}}用户线下{{order.trader_behavior=== 1?'打款':'收款'}}</p>
        </div>

        <p :class="order.order_state>='40'? 'text':''"><span
          :class="order.order_state>='40'? 'point active':'point'"></span>{{order.trader_behavior=== 1?'买入':'卖出'}}成功</p>
      </div>


      <div class="process" v-if="order.order_state!='0'&& clientInfo.client_id === order.from_client_id">

        <p :class="order.order_state!='0'? 'text':''"><span
          :class="order.order_state!='0'? 'point active':'point'"></span>您创建了{{order.trader_behavior===
          1?'买入':'卖出'}}订单</p>

        <div class="order" v-if="currentCart.bank">
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}人：{{currentCart.card_holder}}</p>
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}银行：{{currentCart.bank}}</p>
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}帐号：{{currentCart.card_num}}</p>
        </div>

        <p v-if="order.trader_behavior=== 2" :class="order.order_state!='0'? 'text':''"><span
          :class="order.order_state!='0'? 'point active':'point'"></span>冻结账户{{order.order_amount}}{{order.currency_type === '1' ? '通贝':'GSC'}}作为保证金
        </p>

        <p :class="order.order_state>='20'? 'text':''"><span
          :class="order.order_state>='20'? 'point active':'point'"></span>成功匹配{{order.trader_behavior=== 1?'卖出':'买入'}}用户
        </p>

        <div v-show="order.trader_behavior=== 1">
          <p :class="order.order_state>='30'? 'text':''"><span
            :class="order.order_state>='30'? 'point active':'point'"></span>您已向{{order.trader_behavior===
            1?'卖出':'买入'}}用户线下{{order.trader_behavior=== 1?'打款':'收款'}}</p>

          <p :class="order.order_state>='40'? 'text':''"><span
            :class="order.order_state>='40'? 'point active':'point'"></span>等待{{order.trader_behavior===
            1?'卖出':'买入'}}用户确认{{order.trader_behavior=== 1?'收款':'打款'}}</p>
        </div>

        <div v-show="order.trader_behavior=== 2">
          <p :class="order.order_state>='30'? 'text':''"><span
            :class="order.order_state>='30'? 'point active':'point'"></span>等待{{order.trader_behavior===
            2?'买入':'卖出'}}用户线下{{order.trader_behavior=== 1?'收款':'打款'}}</p>

          <p :class="order.order_state>='40'? 'text':''"><span
            :class="order.order_state>='40'? 'point active':'point'"></span>您已向{{order.trader_behavior===
            2?'买入':'卖出'}}用户确认{{order.trader_behavior=== 1?'打款':'收款'}}</p>
        </div>

        <p :class="order.order_state>='40'? 'text':''"><span
          :class="order.order_state>='40'? 'point active':'point'"></span>{{order.trader_behavior=== 1?'买入':'卖出'}}成功</p>
      </div>


      <div class="process" v-if="order.order_state=='0'">

        <p :class="orderState.indexOf('10') > -1 ? 'text':''"><span
          :class="orderState.indexOf('10') > -1 ? 'point active':'point'"></span>您创建了中国区{{order.trader_behavior===
          1?'买入':'卖出'}}
          订单</p>
        <div class="order" v-if="currentCart.bank">
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}人：{{currentCart.card_holder}}</p>
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}银行：{{currentCart.bank}}</p>
          <p>{{order.trader_behavior=== 1?'打款':'收款'}}帐号：{{currentCart.card_num}}</p>
        </div>

        <p v-if="order.trader_behavior=== 2" :class="orderState.indexOf('10') > -1? 'text':''"><span
          :class="orderState.indexOf('10') > -1? 'point active':'point'"></span>冻结账户{{order.order_amount}}{{order.currency_type === '1' ? '通贝':'GSC'}}作为保证金
        </p>

        <p v-if="orderState.indexOf('20') > -1" :class="orderState.indexOf('20') > -1? 'text':''"><span
          :class="orderState.indexOf('20') > -1? 'point active':'point'"></span>成功匹配{{order.trader_behavior===
          1?'卖出':'买入'}}用户
        </p>

        <div v-show="order.trader_behavior=== 1">
          <p v-if="orderState.indexOf('30') > -1" :class="orderState.indexOf('30') > -1? 'text':''"><span
            :class="orderState.indexOf('30') > -1? 'point active':'point'"></span>您已向{{order.trader_behavior===
            1?'卖出':'买入'}}用户线下{{order.trader_behavior=== 1?'打款':'收款'}}</p>


          <p v-if="orderState.indexOf('40') > -1" :class="orderState.indexOf('40') > -1? 'text':''"><span
            :class="orderState.indexOf('40') > -1? 'point active':'point'"></span>等待{{order.trader_behavior===
            1?'卖出':'买入'}}用户确认{{order.trader_behavior=== 1?'收款':'打款'}}</p>
        </div>

        <div v-show="order.trader_behavior=== 2">
          <p v-if="orderState.indexOf('30') > -1" :class="orderState.indexOf('30') > -1? 'text':''"><span
            :class="orderState.indexOf('30') > -1? 'point active':'point'"></span>等待{{order.trader_behavior===
            1?'卖出':'买入'}}用户确认{{order.trader_behavior=== 1?'收款':'打款'}}</p>

          <p v-if="orderState.indexOf('40') > -1" :class="orderState.indexOf('40') > -1? 'text':''"><span
            :class="orderState.indexOf('40') > -1? 'point active':'point'"></span>您已向{{order.trader_behavior===
            1?'买入':'卖出'}}用户线下{{order.trader_behavior=== 1?'打款':'收款'}}</p>

        </div>

        <p v-if="order.trader_behavior=== 2" :class="order.order_state=='0'? 'text':''"><span
          :class="order.order_state!='0'? 'point':'point active'"></span>已退还账户{{order.order_amount}}{{order.currency_type === '1' ? '通贝':'GSC'}}保证金
        </p>

      </div>


      <div class="container">
        <div class="message-btn" v-show="order.order_state>'0'&&order.order_state<'40'">
          <button v-show="order.trader_behavior===1 && order.order_state>='20' && order.order_state<'30'"
                  @click="sure(order)">已经完成线下付款
          </button>
          <button v-show="order.trader_behavior===1 && order.order_state>='30' && order.order_state<'40'"
                  @click="openAvatar">上传打款图片
          </button>
          <button v-show="order.trader_behavior===2 && order.order_state>='30' && order.order_state<'40'"
                  @click="sure(order)">确认收款
          </button>
          <button v-show="order.from_client_id === clientInfo.client_id" @click="openPublish(order)" class="cancel">取消
          </button>
          <button v-show="order.from_client_id !== clientInfo.client_id" @click="cancel(order)" class="cancel">取消订单
          </button>
        </div>
      </div>

    </scroller>


    <KPublish :props-show="showPublish" @close="openPublish">
      <div class="box1">
        <div class="sale" @click="cancel(order)">
          <!--<i class="ico ico-n1"></i>-->
          <p class="text">取消订单</p>
        </div>
        <div class="sale" @click="openCancel">
          <!--<i class="ico ico-n2"></i>-->
          <p class="text">重新{{order.trader_behavior===1 ? '求购': '挂卖'}}</p>
        </div>
      </div>
    </KPublish>


    <KPublish :props-show="showCancel">
      <div class="content">
        <div class="box">
          <p>是否重新{{order.trader_behavior===1 ? '求购': '挂卖'}}</p>
          <div class="message-btn">
            <button class="cancel" @click="openCancel">否</button>
            <button @click="confirm(order)">是</button>
          </div>
        </div>
      </div>
    </KPublish>

    <KDialog :title="'上传图片'" :props-show="showAvatar" @close="openAvatar" @onConfirm="submitAvatar(order)">
      <UploadImg class="box-avatar" :loading="show" @upload="getImg"></UploadImg>
    </KDialog>

    <KPublish :props-show="showImg" @close="openImg">
      <div class="uploadImg" :style="'backgroundImage: url('+imgURL+')'">
      </div>
    </KPublish>

  </div>
</template>

<script type="text/ecmascript-6">
  import KButton from '@/components/KButton'
  import KTop from '@/components/KTop'
  import KPublish from '@/components/KPublish'
  import KDialog from '@/components/KDialog'
  import UploadImg from '@/components/UploadImg'
  import md5 from 'blueimp-md5'
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import * as api from '@/api/index'

  export default {
    name: "OrderDetail",
    components: {
      KButton,
      KTop,
      KPublish,
      KDialog,
      UploadImg
    },
    data() {
      return {
        avatar: '',
        showAvatar: false,  //上传图片
        imgURL: '',
        show: false,  //上传中
        showPublish: false,
        showCancel: false,
        showImg: false,
        id: '11',
        isRequest: false,
        card_state: '0',
        type: '0',
        state: '',
        list: {},
        currentCart: {},
        traderCard: {},
        orderState: [],
        traderInfo: {},
        payWord: '',
      }
    },
    computed: {
      ...mapGetters(['bankCardList', 'clientInfo', 'signature', 'order']),
    },
    created() {
      if (!this.signature.host) {
        this.$store.dispatch('getSignature')
      }
      this.list = this.$route.params.list
      this.getDatas()
    },
    // mounted() {
    //   document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=2, user-scalable=yes')
    // },
    methods: {
      openPublish() {
        this.showPublish = !this.showPublish
      },
      openImg() {
        this.showImg = !this.showImg
      },
      openCancel() {
        this.showCancel = !this.showCancel
      },
      getTrader() {
        if (this.traderCard === null) {
          this.$refs.content.style.height = '2rem'
          return false
        } else if (this.traderCard) {
          return true
        }
      },
      getImg(file) {
        this.avatar = file
        // console.log(this.avatar)
        this.syncSubmit()
      },
      openAvatar() {
        this.showAvatar = !this.showAvatar
      },
      submitAvatar(order) {
        if (!this.avatar) {
          this.$toast('请选择图片')
          return
        }
        if (this.show) {
          return
        }

        api.upload_payment_voucher({
          'order_id': order.order_id,
          'payment_voucher_url': this.avatar.src
        }).then(res => {
          this.imgURL = res.data.payment_voucher_url
          this.$toast('上传成功')
          this.openAvatar()
        })
      },
      syncSubmit() {
        const self = this
        self.show = true
        const form = new FormData()
        const filename = this.signature.client_id + new Date().getTime() + this.avatar.name
        form.append('name', filename)
        form.append('key', this.signature.dir + filename)
        form.append('policy', this.signature.policy)
        form.append('OSSAccessKeyId', this.signature.accessid)
        form.append('success_action_status', 200)
        form.append('signature', this.signature.signature)
        form.append('file', this.avatar)
        axios.post(this.signature.host, form, this.config).then(res => {
          self.show = false
          self.avatar.err = ''
          self.avatar.src = `${this.signature.host}/${this.signature.dir}${filename}`
        }).catch(err => {
          self.show = false
          self.avatar.err = '上传图片失败'
        })
      },
      sure(order) {
        if (order.trader_behavior === 1) {
          this.$dialog('确定已经完成线下付款', () => {
            api.offlinePlay({
              'order_id': order.order_id
            }).then(() => {
              this.$toast('打款成功')
              this.getDatas(0, true)
              setTimeout(() => {
                this.$router.go(-1)
              }, 1500)
            })
          })
        } else if (order.trader_behavior === 2) {
          this.$dialog('确认收款', (pwd) => {
            this.payWord = pwd
            if (!this.payWord || this.payWord.length < 6) {
              this.$toast('请输入正确的支付密码')
              return
            }
            api.confirmPayment({
              'order_id': order.order_id,
              'pay_password': md5(this.payWord)
            }).then(() => {
              this.$toast('收款成功')
              this.payWord = ''
              this.getDatas(0, true)
              setTimeout(() => {
                this.$router.go(-1)
              }, 1500)
            }).catch((res) => {
              this.payWord = ''
            })
          }, 3)
        }

      },
      confirm(order) {
        api.initOrder({
          'order_id': order.order_id
        }).then(() => {
          if (order.trader_behavior === 1) {
            this.$toast('订单已重新求购')
          } else {
            this.$toast('订单已重新挂卖')
          }

          this.openCancel()
          this.$router.go(-1)
          this.getDatas(0, true)
        })
        this.openCancel()
      },
      cancel(order) {

        if (this.order.order_state >= '20') {
          this.$dialog('确定取消订单', () => {
            api.Cancel({
              'order_id': order.order_id
            }).then(() => {
              this.$toast('取消成功')
              this.getDatas(0, true)
              this.$store.dispatch('clientInfo')
            })
          }, 1)
        } else {
          this.$dialog('确定取消订单', () => {
            api.Cancel({
              'order_id': order.order_id
            }).then(() => {
              this.$toast('取消成功')
              this.getDatas(0, true)
            })
          })
        }


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
        // setTimeout(() => {
        //   this.getDatas(this.goodsCount).then(res => {
        done()
        this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
        //   })
        // }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        const footerHeight = this.$refs.footer.offsetHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight - footerHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      async getDatas(page = 0, isRefresh = false) {
        this.isRequest = true

        if (!this.list) {    //假如用户直接进入订单详情
          this.$router.push('/Home')
          return
        }

        return await  this.$store.dispatch('getOrderDetail', {
          // 'page': page + 1,
          'order_id': this.list.order_id,
          // 'isRefresh': isRefresh,
        }).then(res => {
          this.currentCart = this.order.current_card_info
          this.traderCard = this.order.trader_client_card_info
          this.traderInfo = this.order.trader_client_info

          if (this.order.order_state == '0') {
            this.orderState = this.order.order_state_log
          }
          // console.log(this.order)
          this.imgURL = this.order.payment_voucher_url

          switch (this.order.order_state) {
            case "0":
              this.state = '已取消'
              break
            case "10":
              this.state = '未匹配交易用户'
              break
            case "20":
              this.state = '已匹配交易用户'
              break
            case "30":
              this.state = '已线下打款'
              break
            case "40":
              this.state = '确认已收款'
              break
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .uploadImg {
    width: 80%;
    height: 80%;
    margin: 0 auto;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
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
      height: 1.5rem;
      background: @white-color;
      /*border-radius: 1rem;*/
      /*margin-bottom: 1rem;*/
      padding: .5rem 0;
      //.flex-center();
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      i {
        //.flex-center();
        /*display: block;*/
        /*margin-left: .7rem;*/
      }
      .text {
        //.flex-center();
        font-size: @font-xm;
        color: @text-color;
      }
    }
    .sale:first-child {
      border-right: 1px solid @gray-color;
    }
  }

  .content {
    //.mask();
    .box {
      /*animation: entry .7s ease;*/
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 70%;
      border-radius: 8px; /*no*/
      p {
        padding: 1.5rem 0;
        font-size: @font-s;
        text-align: center;
      }
      .message-btn {
        padding: 20px 0;
        display: flex;
        position: relative;
        button {
          /*flex: 1;*/
          margin: .5rem;
          z-index: 1;
          display: inline-block;
          width: 5rem;
          height: 1.8rem;
          font-size: 0.6rem;
          line-height: 1.8rem;
          text-align: center;
          color: #ffffff;
          background: @primary-active;
          border-radius: 100px;
        }
        .cancel {
          color: @text-color;
          background: @white-color;
          border: 1px solid @text-color;
        }
      }
    }
    /*@keyframes entry {*/
    /*from {*/
    /*opacity: 0;*/
    /*transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 1);*/
    /*}*/

    /*to {*/
    /*opacity: 1;*/
    /*transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);*/
    /*}*/
    /*}*/
  }

  .OrderDetail {
    width: 100%;
    height: 100%;
    .bgImg {
      position: relative;
      width: 100%;
      height: 5rem;
      margin-top: 2.5rem;
      .bg-image('layer@2x');
    }
    .detail {
      background: @white-color;
      margin: 3rem 0 .7rem 0;
      font-size: .65rem;
      .head {
        display: flex;
        border-bottom: 1px solid #C9C9C9;
        position: relative;
        padding: .5rem 0;
        .state {
          color: @white-color;
          background: #fdc121;
          padding: .1rem .5rem;
          margin-left: .5rem;
          border-radius: 2px;
        }
        .time {
          position: absolute;
          right: .5rem;
          top: .7rem;
        }
      }
      .content {
        display: flex;
        position: relative;
        margin: .2rem .5rem;
        .left {
          p {
            line-height: 1.3rem;
          }
        }
        .right {
          color: @primary-active;
          position: absolute;
          top: 1.3rem;
          right: 0;
        }
      }
      .foot {
        display: flex;
        position: relative;
        padding: .5rem 0;
        margin: .2rem .5rem;
        color: @gray-color;
        span {
          color: #3fe0c1;;
        }
        p {
          padding: .1rem 0;
        }
        .wait {
          position: absolute;
          color: @primary-active;
          right: 0;
          padding: .1rem .6rem;
          border: 1px solid @primary-active;
          border-radius: 1rem;
        }
      }
    }
    .process {
      background: @white-color;
      margin: .5rem 0;
      font-size: .65rem;
      padding: .5rem 0;
      .order {
        margin-left: 1rem;
        color: @gray-color;
        font-size: @font-xs;
      }
      p {
        padding-left: 2rem;
        padding-bottom: .5rem;
        .point {
          display: inline-block;
          width: .4rem;
          height: .4rem;
          background-color: @gray-color;
          border-radius: 50%;
          margin-right: .3rem;
        }
        .active {
          background-color: @primary-active;
        }
      }
      .text {
        color: @primary-active;
      }
    }
    .container {
      .center();
      .message-btn {
        /*padding: .5rem 0;*/
        display: flex;
        position: relative;
        button {
          /*flex: 1;*/
          margin: .5rem;
          z-index: 1;
          display: inline-block;
          width: 6rem;
          height: 1.8rem;
          font-size: 0.6rem;
          line-height: 1.8rem;
          text-align: center;
          color: #ffffff;
          background-image: linear-gradient(270deg, #d6c14d 0%, #efdc73 100%), linear-gradient(#f9f7ff, #f9f7ff);
          box-shadow: 0rem 0rem .5rem 0rem rgba(255, 101, 0, 0.2);
          border-radius: 100px;
        }
        .cancel {
          color: @text-color;
          background: @white-color;
          border: 1px solid @text-color;
          box-shadow: 0 0 0 0 rgba(255, 101, 0, 0.2);
        }
      }
    }
  }
</style>
