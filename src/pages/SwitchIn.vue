<template>
  <div class="switchIn">
    <KTop :title="'转入'">
      <p class="slot" @click="toRecord()">转入记录</p>
    </KTop>
    <div class="bgImg">
      <!--<div class="bg-btn">-->
      <!--<p class="text">转出记录</p>-->
      <!--</div>-->
    </div>

    <div class="content">
      <div class="scan">
        <p>扫一扫，向我付款</p>
        <div class="img">
          <!--<qrcode :value="clientInfo.client_code" :options="{ size: 200 }"></qrcode>-->
          <img :src="imgUrl" alt="">
        </div>
      </div>
    </div>

    <div class="inp-con mb25">
      <div class="form-btn" @click="saveCode()">
        <a href="javascript:void(0);" class="btn">长按保存二维码</a>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import {mapGetters} from 'vuex'
  import * as api from '@/api'
  // import Vue from 'vue'
  // import Qrcode from '@xkeshi/vue-qrcode'
  // Vue.component('qrcode', Qrcode);

  const BASE_URL = 'http://dev-kci.ffun360.com/'

  export default {
    name: "SwitchIn",
    components: {
      KTop,
      KButton
    },
    data() {
      return {
        url: process.env.NODE_ENV === 'production' ? 'site/give_balance_qrcode' : `${BASE_URL}site/give_balance_qrcode`,
        imgUrl: ''
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'sercret'])
    },
    created() {
      this.imgUrl = `${this.url}?c=${this.clientInfo.client_code}`
    },
    methods: {
      toRecord() {
        this.$router.push('/SwitchInRecord')
      },
      // saveCode() {
      //   console.log('save')
      //   //保存二维码
      //   // 创建下载任务
      //   picurl = `${this.url}?c=${this.clientInfo.client_code}`;
      //   //图片保存到手机后的路径
      //   picname = "_downloads/test.png";
      //   var dtask = plus.downloader.createDownload(picurl, {}, function (d, status) {
      //     // 下载完成
      //     if (status == 200) {
      //       //		alert( "Download success: " + d.filename );
      //       plus.gallery.save(picname, function () {//保存到相册方法
      //         this.$toast('已保存到手机相册');
      //       }, function () {
      //         this.$toast('保存失败，请重试！');
      //       });
      //     } else {
      //       //		alert( "Download failed: " + status );
      //     }
      //   });
      //   //dtask.addEventListener( "statechanged", onStateChanged, false );
      //   dtask.start();//开始下载
      // }
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

  .switchIn {
    width: 100%;
    height: 100%;
    .bgImg {
      position: relative;
      width: 100%;
      height: 7rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      /*.bg-btn {
        .all-center();
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
      }*/
    }
    .content {
      margin-top: 1.5rem;
      .scan {
        .center();
        .img {
          /*width: 9.5rem;*/
          /*height: 9.5rem;*/
          margin: 1rem auto;
          img {
            width: 9.5rem;
            height: 9.5rem;
          }
        }
        p {
          text-align: center;
          color: @primary-active;
          font-size: @font-s;
        }
      }
      /*.form-item {
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
      }*/
    }
  }

  .inp-con .form-btn .btn {
    .center();
    width: 6.5rem;
    height: 1.5rem;
    padding: 0;
    font-size: 0.5rem;
    line-height: 1.5rem;
    /*color: #888;*/
    /*background: #EEE;*/
    border: none;
    border-radius: 1rem;
    color: #fff !important;
    background-image: linear-gradient(270deg, #d6c14d 0%, #efdc73 100%), linear-gradient(#f9f7ff, #f9f7ff);
    font-weight: bold;
  }

</style>
