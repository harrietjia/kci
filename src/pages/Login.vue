<template>
  <div class="login">
    <div class="head">
      <div class="logo"></div>
    </div>

    <div class="nctouch-main-layout fixed-Width">
      <div class="nctouch-inp-con">
        <ul class="form-box">
          <li class="form-item">
            <i class="ico ico-n1"></i>
            <input v-model="phone" id="phone" tag="手机" type="text" placeholder="请输入手机号"/>
            <span v-show="phone" @click="clear('phone')" class="input-del"></span>
          </li>
          <li class="form-item">
            <i class="ico ico-n2"></i>
            <input v-model="password" id="password" tag="登录密码" type="password" placeholder="请输入密码"/>
            <span v-show="password" @click="clear('password')" class="input-del"></span>
          </li>
        </ul>
        <router-link :to="'/Forget'" class="forget">
          忘记密码？
        </router-link>
        <div :class="getReady()">
          <a @click="submit" class="btn">登录</a>
        </div>
        <div class="form-btn">
          <router-link :to="'/Register'" class="btn2">
            立即注册
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import KHeader from '@/components/KHeader'
  import * as API from '@/api/index'
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'

  export default {
    name: "Login",
    data() {
      return {
        phone: '',
        password: ''
      }
    },
    created() {
      this.$store.dispatch('getLoginStore').then(res => {
        if (!this.loginInfo) {
          console.log('OK')
        } else {
          this.$router.push('/Home')
        }

      })
    },
    computed: {
      ...mapGetters(['clientInfo', 'sercret', 'loginInfo'])
    },
    components: {
      KHeader
    },
    methods: {
      clear(type) {
        this[type] = ''
      },
      getReady() {
        if (!this.phone || !this.password) {
          return "form-btn mt"
        } else {
          return "form-btn mt ok"
        }
      },
      checkPhone() {
        const regx = /^(1)\d{10}$/
        if (!this.phone || !regx.test(this.phone)) {
          this.$toast('请输入正确的手机号码')
          return false
        }
        return true
      },
      checkPassword() {
        const regx = /^[\w!@#$%^&*.]{6,20}$/
        if (!this.password || !regx.test(this.password)) {
          this.$toast('请输正确的密码')
          return false
        }
        return true
      },
      async submit() {
        if (!this.checkPhone()) return
        if (!this.checkPassword()) return

        this.$store.dispatch('login', {
          'mobilephone': this.phone,
          'password': md5(this.password),
        }).then(res => {
          if(this.$route.params.to_url === 1){
            this.$router.push('/ETPCheck')
            return
          }
          this.$router.push('/Home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('zhanghao@2x');
  }

  .ico-n2 {
    .bg-image('mima@2x');
  }

  .login {
    width: 100%;
    height: 100%;
    .bg-image('login_bg@2x');
    .head{
      position: absolute;
      top: 3rem;
      left: 50%;
      transform: translateX(-50%);
      .logo{
        display: block;
        width: 4rem;
        height: 4rem;
        .bg-image('login_logo@2x');
      }
    }
    .nctouch-main-layout.fixed-Width {
      margin-top: 8rem;
      .nctouch-inp-con ul {
        margin: 0.2rem 0.9rem;
        border-radius: 0.15rem;
        background: transparent;
        .form-item {
          /*display: flex;*/
          padding: 0 10px;
          background: #343434;
          border-bottom: solid #343434 0.05rem;
          margin-bottom: 1rem;
          i {
            z-index: 1;
            width: 1.3rem;
            height: 1.3rem;
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
            color: #fff;
            background: #343434;
          }
          .input-del {
            position: absolute;
            z-index: 1;
            top: 0.5rem;
            right: 0.5rem;
            width: 0.975rem;
            height: 0.975rem;
            background-image: url("../assets/images/cancel_b1.png");
            background-repeat: no-repeat;
            background-position: 50% 50%;
            background-size: 60%;
            opacity: 0.4;
            display: block;
          }
          .active {
            color: @white-color;
            background: @gray-color;
          }
        }
      }
      .mt {
        margin-top: 3.5rem;
      }
      a.forget {
        position: absolute;
        right: 1rem;
        font-size: 0.6rem;
        font-weight: 600;
        color: @primary-active;
        letter-spacing: 0.5px;
      }
    }
  }
</style>
