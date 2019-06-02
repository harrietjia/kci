<template>
  <div class="mine">
    <KTop :title="'我的资产'"></KTop>
    <div class="head">
      <div class="center">
        <p class="title">总资产约合</p>
        <p class="money">{{assets.total_kci_balance || '0.00'}} <span>GSC</span></p>
        <p class="head-text">≈ {{assets.total_money || '0.00'}} CNY</p>
      </div>
    </div>

    <div class="content">
      <div class="banner">
        <div class="left">
          <p class="left-text">名称</p>
        </div>
        <div class="right">
          <p>数额</p>
        </div>
      </div>
      <div class="part1">
        <ul class="items">
          <li class="item" @click="goNext('GSC')">
            <div class="left">
              <i class="ico ico-n1"></i>
              <p class="left-text">GSC</p>
            </div>
            <div class="right">
              <p>{{assets.kci_balance || '0.00'}}</p>
              <i class="ico ico-n0"></i>
            </div>
          </li>
          <li class="item" @click="goNext('')">
            <div class="left">
              <i class="ico ico-n2"></i>
              <p class="left-text">比特币</p>
            </div>
            <div class="right">
              <p>{{assets.btc_balance || '0'}}</p>
              <i class="ico ico-n0"></i>
            </div>
          </li>
          <li class="item" @click="goNext('')">
            <div class="left">
              <i class="ico ico-n3"></i>
              <p class="left-text">以太坊</p>
            </div>
            <div class="right">
              <p>{{assets.eth_balance || '0'}}</p>
              <i class="ico ico-n0"></i>
            </div>
          </li>
          <li class="item" @click="goNext('KModification')">
            <div class="left">
              <i class="ico ico-n4"></i>
              <p class="left-text">K通</p>
            </div>
            <div class="right">
              <p>{{assets.balance || '0.00'}}</p>
              <i class="ico ico-n0"></i>
            </div>
          </li>
          <li class="item" @click="goNext('PModification')">
            <div class="left">
              <i class="ico ico-n5"></i>
              <p class="left-text">活力值</p>
            </div>
            <div class="right">
              <p>{{assets.score || '0.00'}}</p>
              <i class="ico ico-n0"></i>
            </div>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KDialog from '@/components/KDialog'
  import UploadImg from '@/components/UploadImg'
  import axios from 'axios'
  import * as api from '@/api/index'
  import {mapGetters} from 'vuex'

  export default {
    name: "MyAssets",
    components: {
      KTop,
      KDialog,
      UploadImg
    },
    data() {
      return {
        assets: {},
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo']),
    },
    created() {

      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }
      this.getPersonal()
    },
    mounted() {
    },
    methods: {
      getPersonal() {
        api.getPersonalAssets().then((res) => {
          this.assets = res.data
        })
      },
      goNext(where) {
        this.$router.push(`/${where}`)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n0 {
    .bg-image('ic_return@2x');
  }

  .ico-n1 {
    .bg-image('gsc@2x');
  }

  .ico-n2 {
    .bg-image('BTC');
  }

  .ico-n3 {
    .bg-image('ETH');
  }

  .ico-n4 {
    .bg-image('KTong');
  }

  .ico-n5 {
    .bg-image('Score');
  }

  .mine {
    width: 100%;
    height: 100%;
    .head {
      position: relative;
      width: 100%;
      height: 9rem;
      background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer_filter@2x.08a07b1.png") no-repeat;
      background-size: cover;
      .center {
        position: absolute;
        left: 5%;
        top: 27%;
        /*transform: translate(-50%, -50%);*/
        text-align: left;
        font-size: @font-s;
        color: @white-color;
        p {
          margin-bottom: .5rem;
        }
      }
      .title {
        color: #8f8f8f;
      }
      .money {
        font-size: @font-xm;
        span {
          font-size: @font-s;
        }
      }
      .head-text {

      }
    }
    .content {
      position: relative;
      .banner {
        display: flex;
        justify-content: space-between;
        padding: .5rem;
        border-bottom: 1px solid @border-color;
        font-size: @font-xs;
        color: @gray-color;
        .left {
          p {
            align-self: center;
            margin-left: .3rem;
          }
        }
        .right {
          p {
            align-self: center;
            margin-right: .3rem;
          }
        }
      }
      .part1 {
        background-color: @white-color;
        .items {
          .item {
            display: flex;
            justify-content: space-between;
            padding: .7rem .5rem;
            border-bottom: 1px solid @border-color;
            font-size: .7rem;
            color: @text-color;
            &:last-child {
              border: none;
            }
            .left {
              display: flex;
              justify-content: space-between;
              i {
                align-self: center;
                width: 1rem;
                height: 1rem;
              }
              p {
                align-self: center;
                margin-left: .3rem;
              }
            }
            .right {
              display: flex;
              justify-content: space-between;
              p {
                align-self: center;
                margin-right: .3rem;
                color: @gray-color;
              }
              i {
                align-self: center;
                width: 0.7rem;
                height: 0.7rem;
              }
            }
          }
        }
      }
      .part1:first-child {
        margin-bottom: .5rem;
      }
    }
  }
</style>
