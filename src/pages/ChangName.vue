<template>
  <div class="changName">
    <KTop :title="'修改昵称'"></KTop>

    <div class="nctouch-main-layout fixed-Width mt10">
      <div class="nctouch-inp-con">
        <ul class="form-box">
          <li class="form-item">
            <label for="name">昵称</label>
            <input v-model="name" id="name" maxlength="16" tag="昵称" type="text" placeholder="请输入昵称"/>
            <span v-show="name" @click="clear('name')" class="input-del"></span>
          </li>
        </ul>
      </div>
    </div>

    <KButton :title="'保存'" @clickBtn="change()"></KButton>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import {mapGetters} from 'vuex'

  export default {
    name: "ChangName",
    data() {
      return {
        name: ''
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo'])
    },
    components: {
      KTop,
      KButton
    },
    methods: {
      clear(type) {
        this[type] = ''
      },
      checkName() {
        const regx = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
        if (!this.name || this.name.length < 2 || this.name.length > 16 || !regx.test(this.name)) {
          this.$toast('请输入2位以上由数字、字母或中文组成的昵称')
          return false
        }
        return true
      },
      change() {
        if (!this.checkName()) return

        const formData = new FormData()
        formData.append('client_name', this.name)
        this.$store.dispatch('putClientInfo', formData).then(res => {
          this.name = ''
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

  .changName {
    width: 100%;
    height: 100%;
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
          .active {
            color: @white-color;
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
