<template>
  <div class="register">
    <div class="top">
      <p>注册</p>
    </div>
    <div class="nctouch-main-layout fixed-Width mt10">
      <div class="nctouch-inp-con">
        <ul class="form-box">
          <li class="form-item" v-show="showInvite">
            <label for="invite">邀 请 码</label>
            <input v-model="invite" id="invite" maxlength="6" tag="邀请码" type="text" placeholder="请输入邀请码"/>
            <span v-show="invite" @click="clear('invite')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="name">昵<span class="none">撑开</span>称</label>
            <input v-model="name" id="name" tag="姓名" maxlength="16" type="text" placeholder="请输入2位以上的字符"/>
            <span v-show="name" @click="clear('name')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="phone">手机号码</label>
            <input v-model="phone" id="phone" tag="手机" type="text" placeholder="请输入您的手机号码"/>
            <span v-show="phone" @click="clear('phone')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="QR">验 证 码</label>
            <input v-model="QR" id="QR" tag="验证码" maxlength="4" type="text" style="width: 40%" placeholder="请输入验证码"/>
            <div
              class="get-qr"
              :class="[timer && 'btn-gray']"
              @click="getCode">{{timer ? timerNum : '获取验证码'}}
            </div>
          </li>
          <li class="form-item">
            <label for="password">登录密码</label>
            <input v-model="password" id="password" tag="登录密码" type="password" placeholder="请输入6-20位密码"/>
            <span v-show="password" @click="clear('password')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="Cpassword">确认密码</label>
            <input v-model="Cpassword" id="Cpassword" tag="确认密码" type="password" placeholder="请再次输入密码"/>
            <span v-show="Cpassword" @click="clear('Cpassword')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="payment">支付密码</label>
            <input v-model="payment" id="payment" tag="支付密码" type="password" placeholder="请输入6位支付密码"/>
            <span v-show="payment" @click="clear('payment')" class="input-del"></span>
          </li>
        </ul>
        <div :class="getReady()">
          <a href="javascript:void(0);" @click="submit" class="btn">注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'
  import * as api from '@/api/index'

  export default {
    name: "Register",
    data() {
      return {
        name: '',
        phone: '',
        password: '',
        Cpassword: '',
        payment: '',
        invite: '',
        QR: null,
        // canGet: true,
        timer: '',
        timerNum: 60,
        showInvite: true,
        // qrNum: null,
      }
    },
    computed: {
      ...mapGetters(['signUpInfo', 'sercret', 'sessionId', 'smsToken'])
    },
    methods: {
      clear(type) {
        this[type] = ''
      },
      getReady() {
        if (!this.name || !this.phone || !this.password || !this.Cpassword || !this.payment || !this.QR || !this.invite) {
          return "form-btn"
        } else {
          return "form-btn ok"
        }
      },
      getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
      },
      checkPhone() {
        const regx = /^(1)\d{10}$/
        if (!this.phone || !regx.test(this.phone)) {
          this.$toast('请输入正确的手机号码')
          return false
        }
        return true
      },
      checkName() {
        const regx = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
        if (!this.name || this.name.length < 2 || this.name.length > 16 || !regx.test(this.name)) {
          this.$toast('请输入2位以上由数字、字母或中文组成的昵称')
          return false
        }
        return true
      },
      checkInvite() {
        const regx = /^[\w]{6}$/
        if (!this.invite || !regx.test(this.invite)) {
          this.$toast('请输入6位邀请码')
          return false
        }
        return true
      },
      checkPassword() {
        const regx = /^[\w!@#$%^&*.]{6,20}$/
        if (!this.password || !regx.test(this.password)) {
          this.$toast('请输入6-20位的密码')
          return false
        }
        return true
      },
      checkPay() {
        const regx = /^\d{6}$/
        if (!this.payment || !regx.test(this.payment)) {
          this.$toast('请输入6位数的支付密码')
          return false
        }
        return true
      },
      getCode() {
        if (!this.checkPhone()) return
        if (this.timer) return
        this.setTimer()
        this.$store.dispatch('mobileCode', {
          'mobilephone': this.phone,
          'token': md5(this.phone + this.sercret),
          'session_id': this.sessionId
        })
        this.$toast(`验证码已发送至${this.phone}，请输入验证码`)
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
      async submit() {
        if (!this.Cpassword || !this.QR || !this.invite) {
          // this.$toast('不能为空')
          return
        }

        if(!this.smsToken){
          this.$toast('请先获取验证码')
          return
        }

        if (!this.checkInvite()) return
        if (!this.checkName()) return
        if (!this.checkPassword()) return
        if (!this.checkPhone()) return
        if (!this.checkPay()) return

        if (this.password !== this.Cpassword) {
          this.$toast('两次输入的密码不一致')
          return
        }

        this.$store.dispatch('register', {
          "sms_token": this.smsToken,
          "rem_code": this.invite,
          "login_name": this.name,
          "mobilephone": this.phone,
          "password": md5(this.password),
          "sms_code": this.QR,
          "pay_password": md5(this.payment)
        }).then(res => {
          this.$store.commit('SAVE_SIGN_UP_INFO', {
            info: {
              "sms_token": this.smsToken,
              "login_name": this.name,
              "mobilephone": this.phone,
              "password": md5(this.password),
              "pay_password": this.payment,
              "rem_code": this.invite
            }
          })

          const self = this
          api.login({
            'mobilephone': this.phone,
            'password': md5(this.password),
          }).then(res => {
            const user = res.data.client_info
            const loginInfo = {
              'login_client_id': res.data.login_client_id,
              'login_time': res.data.login_time,
              'login_token': res.data.login_token,
              'session_id': res.data.session_id
            }
            self.$store.dispatch('setLoginStore', loginInfo, {root: true})
            self.$store.commit('LOGIN', {user})

            self.$router.push('/Home')
          })

        })

      },
    },
    async created() {
      this.$store.dispatch('session')

      this.invite = this.getUrlKey('invite_id') || this.getUrlKey('c')
      if (this.invite) {
        this.showInvite = false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .register {
    width: 100%;
    height: 100%;
    .top {
      position: relative;
      width: 100%;
      height: 7rem;
      background: url("../assets/images/other_top.png") no-repeat;
      background-size: cover;
      .login {
        background: @primary-active;
      }
      p {
        position: absolute;
        bottom: 1rem;
        box-sizing: border-box;
        width: 100%;
        padding: 0 0.8rem;
        font-size: 1rem;
        line-height: 1.45rem;
        color: #fff;
      }
      div {
        width: 4.46rem;
        height: 4.46rem;
        position: absolute;
        left: calc(50% - 2.23rem);
        bottom: -2.7rem;
        img {
          width: 4.46rem;
          height: 4.46rem;
        }
      }
    }
    .nctouch-main-layout.fixed-Width {
      margin-top: 4rem;
      .nctouch-inp-con ul {
        background: #FFF;
        margin: 0.2rem 0.9rem;
        border-radius: 0.15rem;
        .form-item {
          display: flex;
          padding: .1rem 0;
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
    }
  }

</style>
