<template>
  <div class="KCI">
    <Record :title="'GSC变动记录'">
    </Record>
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >

      <div class="banner">
        <p>业务类型</p>
        <p>变动</p>
        <p>时间</p>
      </div>

      <div class="content">
        <ul>
          <li class="item" v-for="item in userOrderList">
            <p>{{item.beizhu}}</p>
            <p class="kci">{{item.kci_balance}}</p>
            <p>{{item.create_time}}</p>
          </li>
        </ul>
      </div>
    </scroller>
  </div>
</template>

<script type="text/ecmascript-6">
  import Record from '@/components/Record'
  import {mapGetters} from 'vuex'
  import wx from 'weixin-js-sdk'

  export default {
    name: "GSC",
    components: {
      Record,
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'userOrderList', 'userOrderCount', 'weixinData'])
    },
    data() {
      return {
        id: '3',
        isRequest: false
      }
    },
    created() {
      this.getDatas(0, true)
    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    methods: {
      package() {
        this.$router.push('/PackageUrl')
      },
      scan() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            const result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            // alert(result)
            window.location.href = result
          }
        })
      },
      refresh(done) {
        setTimeout(() => {
          done()
          this.getDatas(0, true)
        }, 300)
      },
      loading(done) {
        if (this.isRequest) {
          done()
          return
        }
        setTimeout(() => {
          this.getDatas(this.userOrderCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 100
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getScoreRecord', {
          'page': page + 1,
          'type': this.id,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        }).catch(err => this.$loading(0))
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .icos {
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: @font-s;
    line-height: 5rem;
    i {
      width: 1.1rem;
      height: 1.1rem;
      margin-right: .5rem;
    }
    .ico-n1 {
      .bg-image('home_money@2x');
    }
    .ico-n2 {
      .bg-image('home_scanning@2x');
      margin-right: 0;
    }
  }
  .money{
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: @font-s;
    color: @white-color;
  }

  .scroller {
    margin-top: 5rem;
  }

  .KCI {
    width: 100%;
    height: 100%;
    .banner {
      background: @banner-bg;
      color: @banner-color;
      /*margin-top: .2rem;*/
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      p {
        display: inline-block;
        padding: .3rem;
        font-size: @font-s;
      }
      p:nth-child(2){
        padding-right: 1.5rem;
      }
    }
    .content {
      ul {
        .item {
          background: @white-color;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          color: @text-color;
          //border-bottom: 1px solid @border-color;
          p {
            display: inline-block;
            min-width: 5rem;
            padding: .4rem .2rem;
            font-size: @font-s;
          }
          p:nth-child(2) {
            color: @money-color;
          }
          p:last-child {
            color: #a2a2a2;
          }
          .kci {
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

    }
  }

</style>
