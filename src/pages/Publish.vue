<template>
  <div class="Publish">
    <KTop :title="'发布'+text">
      <p class="slot" @click="more()">更多</p>
    </KTop>
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="bgImg">
      </div>


      <div class="sale">
        <div class="head">
          <p class="left">请选择{{text}}数额</p>
          <p class="right">中国</p>
        </div>

        <div class="choose">
          <p :class="setClass(number)" @click="chooseNumber(number)" v-for="number in allNumber">{{number}}</p>
        </div>
      </div>

      <div class="bankCard">
        <div class="head">
          <p>收款银行卡</p>
        </div>

        <div class="noCard" v-show="!bankCard.card_num" @click="addBankCard">
          <p>+请先添加中国大陆的银行卡</p>
        </div>

        <div class="content" v-if="bankCard.card_num">
          <p><span>姓名:</span>{{bankCard.card_holder}}</p>
          <p><span>银行:</span>{{bankCard.bank}}</p>
          <p><span>卡号:</span>{{bankCard.card_num}}</p>
        </div>
      </div>

      <KButton :title="'创建订单'" @clickBtn="openPay"></KButton>
    </scroller>

    <KPublish :propsShow="showMore" @close="more">
      <div class="head-bg"></div>
      <div class="box1">
        <div class="order" @click="goNext('Order')">
          <i class="ico ico-n1"></i>
          <p class="title">已取消订单</p>
        </div>
        <div class="order" @click="goNext('NoOrder')">
          <i class="ico ico-n2"></i>
          <p class="title">未匹配订单</p>
        </div>
        <div class="order" @click="goNext('OverOrder')">
          <i class="ico ico-n3"></i>
          <p class="title">已匹配订单</p>
        </div>
        <div class="order" @click="goNext('GetMoney')">
          <i class="ico ico-n4"></i>
          <p class="title">已{{orderText}}订单</p>
        </div>
        <div class="order" @click="goNext('Sale')">
          <i class="ico ico-n4"></i>
          <p class="title">已完成订单</p>
        </div>
      </div>
    </KPublish>

    <KDialog :title="''" :props-show="showPay" @close="openPay" @onConfirm="createOrder()">
      <PayWord @change="change1"></PayWord>
    </KDialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import KButton from '@/components/KButton'
  import KTop from '@/components/KTop'
  import KPublish from '@/components/KPublish'
  import KDialog from '@/components/KDialog'
  import PayWord from '@/components/PayWord'
  import md5 from 'blueimp-md5'
  import {mapGetters} from 'vuex'
  import * as api from '@/api/index'

  export default {
    name: "Publish",
    components: {
      KTop,
      KButton,
      KPublish,
      KDialog,
      PayWord
    },
    data() {
      return {
        showMore: false,
        allNumber: [],
        Number: 0,
        bankCard: {},
        text: '发布出售',
        orderText: '',
        payWord: '',
        showPay: false,
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'bankCardList']),
    },
    async created() {

      if (this.$route.query.type === 'buy') {
        await api.getBuyNum().then(res => {
          this.allNumber = res.data
        })
        this.text = '求购'
        this.orderText = '付款'
      }

      if (this.$route.query.type === 'sale') {
        await api.getSaleNum().then(res => {
          this.allNumber = res.data
        })
        this.text = '出售'
        this.orderText = '收款'

      }

      this.$store.dispatch('bankCardList').then(res => {
        this.bankCardList.forEach(item => {
          if (item['is_default'] == 1) {
            this.bankCard = item
          }
        })

      })

    },
    methods: {
      change1(pay) {
        this.payWord = pay
      },
      openPay() {
        if (!this.Number) {
          this.$toast('请选择金额')
          return
        }
        if (!this.bankCard.card_id) {
          this.$toast('请添加银行卡')
          return
        }

        this.showPay = !this.showPay
      },
      goNext(where) {
        this.$router.push({path: `/${where}`, query: {'type': this.$route.query.type, 'current': '1'}})
      },
      more() {
        this.showMore = !this.showMore
      },
      chooseNumber(number) {

        if (this.$route.query.type === 'sale') {
          if (Number(this.clientInfo.balance) < Number(number)) {
            this.$toast('账户余额不足')
            return
          }
        }

        this.Number = number
      },
      setClass(number) {
        if (this.Number === number) {
          return 'money active'
        } else {
          return 'money'
        }
      },
      addBankCard() {
        this.$router.push('/BankCardEdit')
      },
      async createOrder() {
        if (!this.payWord || this.payWord.length < 6) {
          this.$toast('请输入正确的支付密码')
          return
        }

        if (this.$route.query.type === 'buy') {
          await api.addBuyOrder({
            "card_id": this.bankCard.card_id,
            "balance": this.Number,
            'pay_password': md5(this.payWord)
          }).then(res => {
            this.$toast(res.errorMessage)
            this.payWord = ''
            this.showPay = !this.showPay
            this.$store.dispatch('clientInfo')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          }).catch((res) => {
            this.payWord = ''
            this.showPay = !this.showPay
          })
        }

        if (this.$route.query.type === 'sale') {
          await api.addSaleOrder({
            "card_id": this.bankCard.card_id,
            "balance": this.Number,
            'pay_password': md5(this.payWord)
          }).then(res => {
            this.$toast(res.errorMessage)
            this.payWord = ''
            this.showPay = !this.showPay
            this.$store.dispatch('clientInfo')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          }).catch((res) => {
            this.payWord = ''
            this.showPay = !this.showPay
          })
        }

      },
      refresh(done) {
        setTimeout(() => {
          done()
          // this.getDatas(0, true)
        }, 300)
      },
      loading(done) {
        if (this.isRequest) {
          done()
          return
        }
        // setTimeout(() => {
        // this.getDatas(this.scoreCount).then(res => {
        done()
        // this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
        // })
        // }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        // return this.$store.dispatch('scoreList', {
        //   'page': page + 1,
        //   'type': this.id,
        //   // 'isRefresh': isRefresh,
        // }).then(res => {
        //   // this.isRequest = false
        // })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .slot {
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: @font-xs;
    line-height: 2.7rem;
  }

  .input {
    text-align: center;
    .pay {
      width: 60%;
      min-height: 1rem;
      padding: 0.5rem 0;
      border: 0 none;
      font-size: .8rem;
      line-height: 1.2rem;
      text-align: center;
      color: #000;
    }
  }

  .ico-n1 {
    width: 1.5rem;
    height: 1.5rem;
    .bg-image('weiwancheng@2x');
  }

  .ico-n2 {
    width: 1.5rem;
    height: 1.5rem;
    .bg-image('wancheng@2x');
  }

  .ico-n3 {
    width: 1.5rem;
    height: 1.5rem;
    .bg-image('queren@2x');
  }

  .ico-n4 {
    width: 1.5rem;
    height: 1.5rem;
    .bg-image('maichu@2x');
  }

  .head-bg {
    position: absolute;
    right: .9rem;
    top: 1.9rem;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    /*border-top: 10px solid #5851c3;*/
    border-right: 10px solid transparent;
    border-bottom: .5rem solid @white-color;
    box-sizing: border-box;
  }

  .box1 {
    //.all-center();
    position: absolute;
    right: .5rem;
    top: 2.3rem;
    background: @white-color;
    border-radius: .3rem;
    .order {
      width: 5.5rem;
      height: 2rem;
      background: @white-color;
      border-radius: 1rem;
      /*margin-bottom: 1rem;*/
      display: flex;
      i {
        .flex-center();
        width: 1rem;
        height: 1rem;
        margin: 0 .5rem;
      }
      .title {
        .flex-center();
        font-size: @font-xs;
        color: @text-color;
      }
    }
  }

  .Publish {
    width: 100%;
    height: 100%;
    .bgImg {
      position: relative;
      width: 100%;
      height: 6rem;
      margin-top: 2.5rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .sale {
      display: table;
      margin: .7rem auto;
      width: 92%;
      padding: 1rem 0;
      background: @white-color;
      border-radius: 5px;
      .head {
        display: flex;
        border-bottom: 1px solid @gray-color;
        font-size: @font-s;
        position: relative;
        padding: .5rem 0;
        .left {
          margin-left: .5rem;
          color: @gray-color;
        }
        .right {
          position: absolute;
          right: .5rem;
          color: @white-color;
          background: #3fe0c1;
          padding: .1rem .3rem;
          border-radius: 2px;
        }
      }
      .choose {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        margin-top: .5rem;
        .money {
          color: #face65;
          width: 3.3rem;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          padding: .1rem .5rem;
          margin: .3rem;
          border: 1px solid #face65;
          font-size: @font-s;
        }
        .active {
          color: @white-color;
          background: #face65;
        }
      }
    }
    .bankCard {
      display: table;
      margin: .7rem auto;
      width: 92%;
      padding: .7rem 0;
      background: @white-color;
      border-radius: 5px;
      .head {
        border-bottom: 1px solid @gray-color;
        color: @gray-color;
        font-size: @font-s;
        padding: 0 .5rem .5rem .5rem;
      }
      .noCard {
        padding: 1.5rem 0;
        text-align: center;
        border-bottom: 1px solid @gray-color;
        p {
          font-size: @font-s;
        }
      }
      .content {
        padding: .5rem;
        p {
          font-size: @font-s;
          padding-top: .7rem;
          span {
            color: @gray-color;
            font-size: @font-s;
            margin-right: .5rem;
          }
        }
      }
    }
  }
</style>
