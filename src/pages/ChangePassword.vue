<template>
  <div class="ChangePassword">
    <KTop :title="'更改登录密码'"></KTop>

    <p class="tips">登录密码由6-20个大小写英文字母、符号或数字组成</p>

    <div class="nctouch-main-layout fixed-Width mt10">
      <div class="nctouch-inp-con">
        <ul class="form-box">
          <li class="form-item">
            <label for="Opassword">原密码</label>
            <input v-model="Opassword" id="Opassword" tag="手机" type="text" placeholder="请输入原登录密码"/>
            <span v-show="Opassword" @click="clear('Opassword')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="password">设置密码</label>
            <input v-model="password" id="password" tag="登录密码" type="password" placeholder="请输入6-20位的新密码"/>
            <span v-show="password" @click="clear('password')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="Cpassword">确认密码</label>
            <input v-model="Cpassword" id="Cpassword" tag="确认密码" type="password" placeholder="请再次输入密码"/>
            <span v-show="Cpassword" @click="clear('Cpassword')" class="input-del"></span>
          </li>
        </ul>
        <div :class="getReady()">
          <a href="javascript:void(0);" @click="submit" class="btn">提交</a>
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
    name: "ChangePassword",
    components: {
      KTop
    },
    data() {
      return {
        Opassword: '',
        password: '',
        Cpassword: '',
      }
    },
    computed: {
      ...mapGetters(['sercret', 'sessionId', 'smsToken', 'clientInfo', 'loginInfo'])
    },
    methods: {
      clear(type) {
        this[type] = ''
      },
      getReady() {
        if (!this.password || !this.Opassword || !this.Cpassword) {
          return "form-btn"
        } else {
          return "form-btn ok"
        }
      },
      checkPassword() {
        const regx = /^[\w!@#$%^&*.]{6,20}$/
        if (!this.password || !regx.test(this.password)) {
          this.$toast('请输入6-20位的密码')
          return false
        }
        return true
      },
      async submit() {
        if (!this.Opassword || !this.Cpassword) {
          // this.$toast('不能为空')
          return
        }

        if (!this.checkPassword()) return

        if (this.password !== this.Cpassword) {
          this.$toast('两次输入的密码不一致')
          return
        }

        const formData = new FormData()
        formData.append('old_password', md5(this.Opassword),)
        formData.append('new_password', md5(this.password),)
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

  .ChangePassword {
    width: 100%;
    height: 100%;
    .tips{
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
