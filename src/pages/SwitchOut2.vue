<template>
  <div class="SwitchOut2">
    <div class="m-top">
      <i class="ico ico-back" @click="back"></i>
      <p class="title">转出</p>
      <p class="slot" @click="toRecord()">转出记录</p>
    </div>

    <div class="head">
      <div class="center">
        <img :src="clientData.head_img_url" alt="">
        <p class="head-text">{{clientData.client_name || 'xxx'}}({{clientData.client_code || 'xxx'}})</p>
      </div>
    </div>

    <p class="tips">转出的通贝最多两位小数</p>
    <div class="nctouch-main-layout fixed-Width mt5">
      <div class="nctouch-inp-con">
        <ul class="form-box">

          <li class="form-item">
            <label for="balance">转出通贝</label>
            <input v-model="balance" id="balance" type="number" placeholder="0"/>
            <span v-show="balance" @click="clear('balance')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="money">支付金额</label>
            <input class="inp-money" readOnly="readOnly" v-model="balance" id="money" type="number" placeholder="0"/>
            <!--<span>RMB</span>-->
            <!--<span v-show="money" @click="clear('money')" class="input-del"></span>-->
          </li>
          <li class="form-item">
            <label for="phoneNumber">手机末4位</label>
            <input v-model="phoneNumber" maxlength="4" id="phoneNumber" type="tel" placeholder="请输入对方手机号末4位"/>
            <span v-show="phoneNumber" @click="clear('phoneNumber')" class="input-del"></span>
          </li>
        </ul>
        <div :class="getReady()">
          <a href="javascript:void(0);" @click="openPay" class="btn">确认转出</a>
        </div>
      </div>
    </div>

    <KDialog :title="''" :props-show="showPay" @close="openPay" @onConfirm="submit">
      <PayWord @change="change1" ></PayWord>
    </KDialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'
  import KDialog from '@/components/KDialog'
  import PayWord from '@/components/PayWord'
  import md5 from 'blueimp-md5'
  import * as api from '@/api/index'

  export default {
    name: "SwitchOut2",
    components: {
      KTop,
      KDialog,
      PayWord
    },
    data() {
      return {
        pwd: false,
        client_code: '',
        balance: '',
        phoneNumber: '',
        payWord: '',
        showPay: false,
        clientData: {}
      }
    },
    // watch:{
    //   balance: function () {
    //     const regx = /^\\d+.\\d{2}/
    //     if (!regx.test(this.balance)) {
    //       this.$toast('小数点后只能输入2位')
    //       // return false
    //     }
    //   }
    // },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'pageList'])
    },
    async created() {

      if (!this.$route.params.hasOwnProperty('client_code') && !this.getUrlKey('c')) {
        if (this.pageList.length <= 2) {
          this.$router.push('/Home')
        } else {
          this.$router.go(-1)
        }
      }
      this.clientData = this.$route.params
      this.client_code = this.$route.params.client_code

      if (this.getUrlKey('c')) {
        this.client_code = this.getUrlKey('c')
        await api.changeBalanceInfo({'field': this.client_code}).then(res => {
          this.clientData = res.data
        })
      }

    },
    methods: {
      change1(pay) {
        this.payWord = pay
      },
      openPay() {
        if (!this.balance || Number(this.balance) < 0.1) {
          this.$toast('请输入金额并不少于0.1')
          return
        }
        if (Number(this.clientInfo.balance) < Number(this.balance)) {
          this.$toast('账户余额不足')
          return
        }
        if (!this.checkBalance()) return
        if (!this.checkPhone()) return

        this.showPay = !this.showPay
      },
      back() {
        if (this.pageList.length <= 2) {
          this.$router.push('/Home')
        } else {
          this.$router.go(-1)
        }
      },
      toRecord() {
        this.$router.push('/SwitchOutRecord')
      },
      clear(type) {
        this[type] = ''
      },
      getReady() {
        if (!this.balance || !this.phoneNumber) {
          return "form-btn"
        } else {
          return "form-btn ok"
        }
      },
      getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      },
      checkPhone() {
        const regx = /^\d{4}$/
        if (!this.phoneNumber || !regx.test(this.phoneNumber)) {
          this.$toast('请输入正确的手机号后4位')
          return false
        }
        return true
      },
      checkBalance() {
        var regStrs = [
          ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
          ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
          ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
          ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
        ];
        for (let i = 0; i < regStrs.length; i++) {
          let reg = new RegExp(regStrs[i][0]);
          this.balance = this.balance.replace(reg, regStrs[i][1]);
        }
        return true
      },
      async submit() {

        if (!this.payWord || this.payWord.length < 6) {
          this.$toast('请输入正确的支付密码')
          return
        }

        const data = await api.turnOutBalance({
          'balance': this.balance,
          'client_code': this.client_code,
          'end_num': this.phoneNumber,
          'pay_password': md5(this.payWord)
        }).then(res => {
          this.$toast(res.errorMessage)
          this.balance = ''
          this.phoneNumber = ''
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

  .slot {
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: @font-s;
    line-height: 2.7rem;
  }

  .tips {
    margin: .2rem 0 0 .5rem;
    color: @gray-color;
    font-size: .7rem;
  }

  .SwitchOut2 {
    width: 100%;
    height: 100%;
    .head {
      position: relative;
      width: 100%;
      height: 6rem;
      background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png") no-repeat;
      background-size: cover;
      .center {
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translate(-50%, -50%);
        text-align: center;
        img {
          width: 3.3rem;
          height: 3.3rem;
          border-radius: 50%;
        }
        .head-text {
          font-size: @font-s;
          color: @white-color;
        }
      }
    }
    .nctouch-main-layout.fixed-Width {
      margin-top: 4rem;
      .nctouch-inp-con ul {
        background: #FFF;
        margin: 0.2rem 0;
        border-radius: 0.15rem;
        .form-item {
          display: flex;
          margin: 0;
          border-bottom: 7px solid #e9e9e9;
          &:last-child {
            border: none;
          }
          label {
            z-index: 1;
            width: 25%;
            font-size: 0.6rem;
            line-height: 2.2rem;
            color: #444;
            text-align: center;
            .none {
              visibility: hidden
            }
          }
          input {
            width: 65%;
            min-height: 0.95rem;
            padding: 0.5rem 0;
            border: 0 none;
            font-size: 0.6rem;
            line-height: 1.2rem;
            text-align: left;
            color: #000;
          }
          .inp-money {
            color: @black-color;
          }
          .input-del {
            .input-del();
            display: block;
          }
          .active {
            color: @white-color;
            background: @gray-color;
          }
        }
      }
      /*a.btn {*/
      /*border-radius: 20px;*/
      /*}*/
    }
  }
</style>
