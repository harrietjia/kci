<template>
  <div class="ChangePay">
    <KTop :title="'更改支付密码'"></KTop>

    <p class="tips">您当前的手机号码是：{{clientInfo.login_mobilephone.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2")}}</p>
    <p class="tips">支付密码由6位数字组成</p>

    <div class="nctouch-main-layout fixed-Width mt10">
      <div class="nctouch-inp-con">
        <ul class="form-box">
          <li class="form-item">
            <label for="name">支付密码</label>
            <input v-model="pay" id="name" tag="支付密码" type="password" placeholder="请输入新的支付密码"/>
            <span v-show="pay" @click="clear('pay')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="QR">验 证 码</label>
            <input v-model="QR" id="QR" tag="验证码" type="text" style="width: 40%" placeholder="请输入验证码"/>
            <div
              class="get-qr"
              :class="[timer && 'btn-gray']"
              @click="getCode">{{timer ? timerNum : '获取验证码'}}
            </div>
          </li>
        </ul>
        <div :class="getReady()">
          <a href="javascript:void(0);" @click="submit" class="btn">完成</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'

  export default {
    name: "ChangePay",
    components: {
      KTop
    },
    data() {
      return {
        pay: '',
        QR: null,
        timer: '',
        timerNum: 60,
      }
    },
    created() {
      this.$store.dispatch('session')
    },
    computed: {
      ...mapGetters(['clientInfo', 'userInfo', 'loginInfo', 'sercret', 'sessionId', 'smsToken'])
    },
    methods: {
      getReady() {
        if (!this.pay || !this.QR) {
          return "form-btn"
        } else {
          return "form-btn ok"
        }
      },
      getCode() {
        // if (!this.checkPhone()) return
        if (this.timer) return
        this.setTimer()
        this.$store.dispatch('mobileCode', {
          'mobilephone': this.clientInfo.login_mobilephone,
          'token': md5(this.clientInfo.login_mobilephone + this.sercret),
          'session_id': this.sessionId
        })
        this.$toast(`验证码已发送至${this.clientInfo.login_mobilephone}，请输入验证码`)
      },
      setTimer() {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.timerNum = this.timerNum - 1
          if (this.timerNum <= 0) {
            clearInterval(this.timer)
            this.timer = ''
            this.timerNum = 60
          }
        }, 1000);
      },
      clear(type) {
        this[type] = ''
      },
      checkPay() {
        const regx = /^\d{6}$/
        if (!this.pay || !regx.test(this.pay)) {
          this.$toast('请输入6位数的支付密码')
          return false
        }
        return true
      },
      async submit() {
        if (!this.QR) {
          // this.$toast('不能为空')
          return
        }

        if (!this.checkPay()) return

        const formData = new FormData()
        formData.append('mobilephone', this.clientInfo.login_mobilephone)
        formData.append('sms_code', this.QR)
        formData.append('sms_token', this.smsToken)
        formData.append('pay_password', md5(this.pay))
        this.$store.dispatch('putClientInfo', formData).then(res => {
          this.$toast('修改成功')
          this.$store.dispatch('clientInfo')
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        })

      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ChangePay {
    width: 100%;
    height: 100%;
    .tips {
      margin: .5rem 1rem;
      font-size: @font-xs;
      color: @gray-color;
    }
    .nctouch-main-layout.fixed-Width {
      margin-top: 4rem;
      .nctouch-inp-con ul {
        background: #FFF;
        margin: 0.2rem 0.9rem;
        border-radius: 0.15rem;
        .form-item {
          display: flex;
          margin: 0;
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
          .input-del {
            .input-del();
            display: block;
          }
          .get-qr {
            position: absolute;
            z-index: 1;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
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
          .btn-gray {
            background: @gray-color;
          }
        }
      }
      a.btn {
        border-radius: 20px;
      }
    }
  }
</style>
