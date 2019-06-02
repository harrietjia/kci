<template>
  <div class="switchOut">
    <KTop :title="'转出'">
    </KTop>
    <div class="bgImg">
      <div class="tab">
        <ul>
          <li v-for="(item, index) of list" :class="{active:selected===index,tabItem:true}" @click="change(index)">
            {{item.title}}
          </li>
        </ul>
      </div>
      <!--<div class="bg-btn" @click="toRecord()">-->
      <!--<p class="text">转出记录</p>-->
      <!--</div>-->
    </div>

    <div class="content">
      <!--<div class="scan" v-if="showScan" @click="scanCode()">-->
        <!--<div class="img"></div>-->
        <!--<p>扫一扫支付</p>-->
      <!--</div>-->

      <ul class="form-box">
        <li class="form-item">
          <label for="phone">对方帐号</label>
          <input v-model="phone" id="phone" tag="手机" type="text" placeholder="请输入对方的邀请码"/>
          <span v-show="phone" @click="clear('phone')" class="input-del"></span>
        </li>
      </ul>

    </div>

    <KButton :title="'下一步'" @clickBtn="nextStep()"></KButton>

  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import {mapGetters} from 'vuex'
  import wx from 'weixin-js-sdk'
  import * as api from '@/api/index'

  export default {
    name: "SwitchOut",
    components: {
      KTop,
      KButton,
    },
    data() {
      return {
        phone: '',
        showScan: false,
        selected: -1,
        list: [
          {
            title: '通贝记录',
          },
          {
            title: '转出记录',
          }
        ],
      }
    },
    created() {
      this.isWeixinBrowser()
    },
    computed: {
      ...mapGetters(['weixinData'])
    },
    methods: {
      change(index) {
        if (this.selected === index) {
          return
        }
        this.selected = index
        if(this.selected === 0){
          this.$router.push('/KModification')
          return
        }
        if(this.selected === 1){
          this.$router.push('/SwitchOutRecord')
          return
        }
      },
      isWeixinBrowser() {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.match(/MicroMessenger/i) == "micromessenger") {
          return this.showScan = true;
        } else {
          return this.showScan = false;
        }
      },
      clear(type) {
        this[type] = ''
      },
      toRecord() {
        this.$router.push('/SwitchOutRecord')
      },
      checkPhone() {
        const regx = /^[a-zA-Z0-9]{6}$/
        if (!this.phone || !regx.test(this.phone)) {
          this.$toast('请输入正确的邀请码')
          return false
        }
        return true
      },
      async nextStep() {
        if (!this.checkPhone()) return

        await api.changeBalanceInfo({
          'field': this.phone
        }).then(res => {
          let clientData = res.data
          this.$router.push({path: '/SwitchOut2', name: 'SwitchOut2', params: clientData})
          // console.log(res)
          // this.$toast(res.errorMessage)
        })

      },
      scanCode() {
        // console.log('scan')
        // const self = this

        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            const result = '/SwitchOut2?c=' + res.resultStr // 当needResult 为 1 时，扫码返回的结果
            // alert(result)
            window.location.href = result
          }
        })

      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .switchOut {
    width: 100%;
    height: 100%;
    .bgImg {
      position: relative;
      width: 100%;
      height: 7rem;
      display: flex;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      .tab {
        position: absolute;
        top: 2.5rem;
        left: 60%;
        transform: translateX(-50%);
        width: 66%;
        ul {
          /*column-count: 3;*/
          color: @primary-active;
          font-size: @font-s;
          overflow: hidden;
          .tabItem {
            /*-webkit-column-break-inside: avoid;*/
            /*height: 100%;*/
            /*overflow: auto; //兼容火狐 break-inside:avoid;*/
            width: 25%;
            height: .8rem;
            float: left;
            text-align: center;
            padding: .3rem .5rem;
            border: 1px solid @primary-active;
            border-radius: 3px;
            /*margin-bottom: 1px;*/
          }
          .tabItem:first-child {
            border-radius: 5px 0 0 5px;
          }
          .tabItem:last-child {
            border-radius: 0 5px 5px 0;
          }
          .active {
            background: @primary-active;
            color: @text-color;
          }
        }
      }
      .bg-btn {
        //.all-center();
        flex: 1;
        width: 5rem;
        height: 1.5rem;
        background-color: @white-color;
        box-shadow: 0rem 0rem 1rem 0rem rgba(255, 36, 0, 0.16);
        border-radius: 2rem;
        text-align: center;
        .text {
          font-size: @font-s;
          color: @primary-active;
          line-height: 1.5rem;
        }
      }
    }
    .content {
      margin-top: 1rem;
      .scan {
        .center();
        .img {
          width: 5.5rem;
          height: 5.5rem;
          margin: 0 auto;
          .bg-image('saoyisao@2x');
        }
        p {
          text-align: center;
          color: @primary-active;
          font-size: @font-s;
        }
      }
      .form-item {
        width: 90%;
        display: flex;
        margin: 2.5rem auto 0 auto;
        background: @white-color;
        position: relative;
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
        .active {
          color: @white-color;
          background: @gray-color;
        }
      }
    }
  }
</style>
