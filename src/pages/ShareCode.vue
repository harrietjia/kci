<template>
  <div class="ShareCode">
    <KTop :title="'分享'">
      <p class="slot">长按保存二维码</p>
    </KTop>

    <div class="content">
      <!--<input type="text" readonly="readonly" id="url" value="harriet" style="opacity: 0">-->
      <div class="scan">
        <div class="img">
          <img :src="imgUrl" alt="">
        </div>
        <p>扫描二维码可分享给好友</p>
      </div>
    </div>

    <div class="inp-con mb">
      <div class="form-btn">
        <button class="btn" @click="copyURL" :data-clipboard-text = "copyUrl">复制GSC下载地址</button>
      </div>
    </div>

    <div class="content">
      <div class="scan" @click="toShare()">
        <p class="share">分享记录</p>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import Vue from 'vue'
  import Clipboard from 'clipboard';
  import {mapGetters} from 'vuex'

  // Vue.use(Clipboard)

  const BASE_URL = 'http://dev-kci.ffun360.com/'
  let clipboard = new Clipboard('.btn');

  export default {
    name: "ShareCode",
    components: {
      KTop
    },
    data() {
      return {
        url: process.env.NODE_ENV === 'production' ? 'site/qrcode' : `${BASE_URL}site/qrcode`,
        imgUrl: '',
        copyUrl: ''
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'sercret'])
    },
    created() {
      this.imgUrl = `${this.url}?c=${this.clientInfo.client_code}`
      this.copyUrl = `http://dev-kci.ffun360.com/${this.imgUrl}`
    },
    methods: {
      toShare() {
        this.$router.push('/ShareDetail')
      },
      copyURL() {
        this.$toast('复制成功')
      },
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
    font-size: @font-xs;
    line-height: 2.7rem;
  }

  .ShareCode {
    width: 100%;
    height: 100%;
    .content {
      margin-top: .5rem;
      .scan {
        .center();
        .img {
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
        .share {
          padding: 0 1rem 1rem 1rem;
          font-size: @font-xs;
        }
      }
    }
  }

  .mb {
    margin-top: 1rem;
  }

  .inp-con .form-btn .btn {
    .center();
    width: 6.5rem;
    height: 2rem;
    padding: 0;
    font-size: .7rem;
    line-height: 2rem;
    /*color: #888;*/
    /*background: #EEE;*/
    border: none;
    border-radius: .3rem;
    color: #fff !important;
    background-image: linear-gradient(270deg, #d6c14d 0%, #efdc73 100%), linear-gradient(#f9f7ff, #f9f7ff);
    font-weight: bold;
  }
</style>
