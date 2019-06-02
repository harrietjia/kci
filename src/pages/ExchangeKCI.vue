<template>
  <div class="exchange">
    <KTop :title="'兑换GSC'">
      <p class="slot" @click="toRecord('1')">兑换记录</p>
    </KTop>
    <div class="bgImg">
      <div class="bg-l">
        <p class="money">{{clientInfo.balance || 0}}</p>
        <p class="text">通贝</p>
      </div>
      <div class="bg-r">
        <p class="money">{{clientInfo.total_kci_balance || 0}}</p>
        <p class="text">GSC</p>
      </div>
    </div>

    <div class="content">
      <div class="change">
        <p>兑换成GSC</p>
        <div class="change-text">
          <span>通贝</span>
          <input v-model="balance" type="tel" placeholder="请输入兑换的通贝"/>
        </div>
        <p>转换GSC</p>
        <p class="changeNum" v-text="change"></p>
      </div>
      <p class="tips">注意：最小转换数额100，请输入100的整数倍</p>
    </div>

    <div class="mt"></div>
    <KButton :title="'兑换'" @clickBtn="openPay"></KButton>

    <KDialog :title="''" :props-show="showPay" @close="openPay" @onConfirm="nextStep()">
      <PayWord @change="change1" ></PayWord>
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
    name: "ExchangeKCI",
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
        payWord: '',
        showPay: false,
      }
    },
    watch: {
      balance: function () {
        this.change = (this.balance / this.changeNum).toFixed(8)
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'sercret', 'loginInfo'])
    },
    created() {
      this.$store.dispatch('getLoginStore')
      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }
      api.getChangeNum({
        'type': 2
      }).then(res => {
        this.changeNum = res.data
      })
    },
    methods: {
      change1(pay) {
        this.payWord = pay
      },
      openPay() {
        if (!this.balance) {
          this.$toast('请填入数额')
          return
        }

        if (Number(this.clientInfo.balance) < Number(this.balance)) {
          this.$toast('账户余额不足')
          return
        }

        if (Number(this.balance) < 100 || Number(this.balance) % 100 !== 0) {
          console.log(Number(this.balance))
          this.$toast('最小转换数额100，请输入100的整数倍')
          return
        }

        this.showPay = !this.showPay
      },
      clear(type) {
        this[type] = ''
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

        this.$store.dispatch('addKCI', {
          'balance': this.balance,
          'pay_password': md5(this.payWord)
        }).then(res => {
          this.$toast('兑换成功')
          this.balance = ''
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
        flex: 1;
        width: 50%;
        text-align: center;
        color: @white-color;
        margin: 3rem auto;
        border-right: 1px solid @white-color;
        .money {
          font-size: @font-l;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .text {
          font-size: @font-s;
        }
      }
      .bg-r {
        flex: 1;
        width: 50%;
        text-align: center;
        color: @white-color;
        margin: 3rem auto;
        .money {
          font-size: @font-l;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .text {
          font-size: @font-s;
        }
      }
    }
    .content {
      position: relative;
      top: -1.5rem;
      z-index: 10;
      .change {
        .center();
        width: 90%;
        height: 5.5rem;
        box-shadow: 0rem 0rem 1rem 0rem rgba(255, 101, 0, 0.15);
        border-radius: 5px;
        background: @white-color;
        p {
          display: inline-block;
          margin: 1rem 0 .5rem 1rem;
          font-size: @font-s;
          color: @primary-active;
        }
        .changeNum {
          display: inline-block;
          margin: 1rem 0 .5rem 3rem;
          font-size: @font-s;
          color: @primary-active;
        }
        .change-text {
          span {
            display: inline-block;
            margin: .5rem 0 0 1rem;
            color: @text-color;
            font-size: @font-s;
          }
          input {
            width: 65%;
            min-height: 0.75rem;
            padding: 0.2rem 0;
            margin-left: .3rem;
            border: 0 none;
            border-bottom: 1px solid @gray-color;
            font-size: @font-s;
            line-height: .8rem;
            text-align: left;
            color: #000;
          }
        }
      }
      .tips {
        margin: .5rem 1.5rem;
        color: @gray-color;
        font-size: @font-xs;
      }
    }
    .mt {
      margin-top: 3.5rem;
    }
  }

</style>
