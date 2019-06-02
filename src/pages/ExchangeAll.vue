<template>
  <div class="exchange">
    <KTop :title="'兑换'+text">
      <!--<p class="slot" @click="toRecord('1')">兑换记录</p>-->
    </KTop>
    <div class="bgImg">
      <!--<div class="bg-l">-->
      <!--<p class="money">{{clientInfo.balance || 0}}</p>-->
      <!--<p class="text">通贝</p>-->
      <!--</div>-->
      <div class="bg-r">
        <p class="money text">GSC</p>
        <p class="money">{{clientInfo.total_kci_balance || 0}}</p>
      </div>
    </div>

    <div class="content">
      <div class="change">
        <p class="title">兑换多少{{text}}</p>
        <div class="change-text">
          <i :class="text === 'BTC'?'ico ico-BTC':'ico ico-ETH'"></i>
          <input v-model="balance" maxlength="6" ref="input" @keyup="balance=balance.replace(/[^\d]/g,'')" type="tel"
                 placeholder="0"/>
        </div>
        <p class="changeNum" :class="Number(change) >= Number(clientInfo.total_kci_balance) ? 'red' : ''">所需GSC：
          {{change}}</p>
        <p class="tips">注意：兑换的{{text}}必须为大于0的整数</p>
        <p class="title mt20">火币钱包地址</p>
        <div class="address-text mb20">
          <input v-model="address" type="text" placeholder="请输入钱包地址"/>
        </div>
      </div>
    </div>

    <KButton class="test" :title="'兑换'" @clickBtn="openPay"></KButton>

    <KDialog :title="''" :props-show="showPay" @close="openPay" @onConfirm="nextStep()">
      <PayWord @change="change1"></PayWord>
    </KDialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import PayWord from '@/components/PayWord'
  import KDialog from '@/components/KDialog'
  import md5 from 'blueimp-md5'
  import {mapGetters} from 'vuex'
  import * as api from '@/api/index'

  export default {
    name: "ExchangeAll",
    components: {
      KTop,
      KButton,
      KDialog,
      PayWord
    },
    data() {
      return {
        balance: '',
        change: '0.00000000',
        changeNum: 0,
        address: '',
        payWord: '',
        showPay: false,
        text: ''
      }
    },
    watch: {
      balance: function () {
        this.$refs.input.readOnly = true
        this.$loading()
        api.getEquUnlock({
          symbol: this.text,
          amount: this.balance
        }).then((res) => {
          this.change = res.data.equ_unlock_kci_balance
          this.$refs.input.readOnly = false
          this.$loading(0)
        })

      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo'])
    },
    created() {
      this.$store.dispatch('getLoginStore')
      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }

      this.text = this.changeText(this.$route.query.name)
      api.getChangeNum({
        'type': 2
      }).then(res => {
        this.changeNum = res.data
      })
    },
    mounted(){
      this.setTime()
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      getEquUnlockDate() {
        // this.$refs.input.readOnly = true
        api.getEquUnlock({
          symbol: this.text,
          amount: this.balance
        }).then((res) => {
          this.change = res.data.equ_unlock_kci_balance
          // this.$refs.input.readOnly = false
        })
      },
      setTime() {
        this.timer = setInterval(() => {
          this.getEquUnlockDate()
        }, 2000)
      },
      changeText(str) {
        let len = str.indexOf('_')
        return str.substring(0, len).toLocaleUpperCase()
      },
      change1(pay) {
        this.payWord = pay
      },
      openPay() {
        this.$toast('敬请期待')
        return

        if (!this.balance) {
          this.$toast('请填入数额')
          return
        }

        if (!this.address) {
          this.$toast('请填入火币钱包地址')
          return
        }

        if (Number(this.clientInfo.balance) < Number(this.balance)) {
          this.$toast('账户余额不足')
          return
        }

        this.showPay = !this.showPay
      },
      toRecord(num) {
        // console.log('1')
        this.$router.push({path: '/KCIRecord', query: {'num': num}})
      },
      nextStep() {

        if (!this.payWord || this.payWord.length < 6) {
          this.$toast('请输入正确的支付密码')
          return
        }
        api.marketCurrency({
          symbol: this.text,
          amount: this.balance,
          huobi_wallet_code: this.address,
          pay_password: md5(this.payWord)
        }).then(res => {
          this.$toast(res.errorMessage)
          this.balance = ''
          this.address = ''
          this.payWord = ''
          this.showPay = !this.showPay
          this.$store.dispatch('clientInfo')
        }).catch((res) => {
          this.payWord = ''
          this.showPay = !this.showPay
        })

      }
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
    font-size: @font-s;
    line-height: 2.7rem;
  }

  .ico-BTC {
    .bg-image('BTC')
  }

  .ico-ETH {
    .bg-image('ETH')
  }

  .exchange {
    width: 100%;
    height: 100%;
    .bgImg {
      display: flex;
      position: relative;
      width: 100%;
      height: 8.5rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/duihuan_bg@2x.b21316c.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      .bg-l {
        /*flex: 1;*/
        /*width: 50%;*/
        text-align: left;
        color: @white-color;
        margin: 3rem auto;
        border-right: 1px solid @white-color;
        .money {
          font-size: @font-xm;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .text {
          font-size: .8rem;
        }
      }
      .bg-r {
        /*flex: 1;*/
        width: 90%;
        text-align: center;
        color: @white-color;
        margin: 1.8rem auto;
        .money {
          font-size: 1.1rem;
          .no-wrap();
        }
        .text {
          font-size: .8rem;
        }
      }
    }
    .content {
      position: relative;
      top: -3rem;
      z-index: 10;
      .change {
        .center();
        width: 90%;
        /*height: 5.5rem;*/
        box-shadow: 0rem 0rem 1rem 0rem rgba(255, 101, 0, 0.15);
        border-radius: 5px;
        background: @white-color;
        p {
          margin: 1rem 0 .5rem 1rem;
          font-size: @font-s;
          color: @text-color;
        }
        .changeNum {
          margin: .5rem 0 .5rem 3rem;
          font-size: @font-xs;
          color: @primary-active;
        }
        .red {
          color: red;
        }
        .tips {
          margin: .5rem 0 .5rem 3rem;
          color: #bbbbbb;
          font-size: @font-xs;
        }
        .title {
          font-size: .8rem;
        }
        .address-text {
          input {
            width: 80%;
            min-height: 0.75rem;
            padding: .4rem .6rem;
            margin-left: 6%;
            border: 1px solid #bbbbbb;
            border-radius: 1rem;
            font-size: @font-xs;
            line-height: .8rem;
            text-align: left;
            color: #bbbbbb;
          }
        }
        .change-text {
          i {
            display: inline-block;
            width: 1.3rem;
            height: 1.3rem;
            margin: .5rem 0 0 .8rem;
          }
          input {
            width: 65%;
            min-height: 0.75rem;
            padding: 0.2rem 0;
            margin-left: .3rem;
            border: 0 none;
            border-bottom: 1px solid @gray-color;
            font-size: @font-xm;
            line-height: .8rem;
            text-align: left;
            color: #000;
          }
        }
      }
    }
    .test {
      margin-top: -2.5rem;
    }
  }

</style>
