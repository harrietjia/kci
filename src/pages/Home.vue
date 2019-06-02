<template>
  <div class="home">
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="top">
        <div class="text">
          <p>首页</p>
        </div>

        <div class="sliders" ref="sliderWrapper">

          <div class="slider" ref="slider">
            <div class="slider-group" ref="sliderGroup">
              <div v-for="item of recommends">
                <a @click="toNext(item)">
                  <img class="needsclick" @load="loadImage" :src="item.pic_url">
                </a>
              </div>
            </div>
            <div class="dots">
              <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
            </div>
          </div>

        </div>

        <div class="buttons">
          <ul class="button-item">
            <li class="item" @click="scanCode()">
              <i class="ico ico-n1"></i>
              <p>扫一扫</p>
            </li>
            <li class="item" @click="goNext('SwitchIn')">
              <i class="ico ico-n2"></i>
              <p>收款</p>
            </li>
            <li class="item" @click="goNext('SwitchOut')">
              <i class="ico ico-n3"></i>
              <p>通贝</p>
            </li>
            <li class="item" @click="goNext('PackageUrl')">
              <i class="ico ico-n4"></i>
              <p class="zimu">GSC</p>
            </li>
          </ul>
          <ul class="button-item">
            <li class="item" @click="goNext('C2C2')">
              <i class="ico ico-n5"></i>
              <p class="zimu">C2C</p>
            </li>
            <li class="item" @click="goNext('PModification')">
              <i class="ico ico-n6"></i>
              <p>活力值</p>
            </li>
            <li class="item" @click="goNext('AllList')">
              <i class="ico ico-n7"></i>
              <p>行情</p>
            </li>
            <li class="item" @click="goNext('Exchange')">
              <i class="ico ico-n8"></i>
              <p>兑换</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="content">
        <div class="market">
          <div class="head">
            <p class="title">行情</p>
            <div class="right">
              <p :class="index === 1 ? 'active' : ''" @click="up()">上涨</p>
              <p :class="index === 2 ? 'active' : ''" @click="down()">下跌</p>
            </div>
          </div>
          <div class="toMore" @click="checkMore">
            <p>查看更多 >></p>
          </div>
        </div>

        <div class="news">
          <div class="head">
            <p class="title">资讯</p>
          </div>
          <ul class="new">
            <li v-for="n in newsList" @click="toNews(n)">

              <div class="left">
                <p class="text">{{n.title}}</p>
                <div class="bottom">
                  <p class="time">{{n.create_time}}</p>
                  <div class="watch">
                    <i class="ico"></i>
                    <p>{{n.view_count}}</p>
                  </div>
                </div>
              </div>
              <div class="right">
                <img :src="n.pic_url">
              </div>

            </li>
          </ul>
        </div>

      </div>


      <!--<button @click="openRed">click</button>-->
    </scroller>

    <KFooter :tag="1" ref="footer"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import KFooter from '@/components/KFooter'
  import KPublish from '@/components/KPublish'
  import Slider from '@/components/slider'
  import wx from 'weixin-js-sdk'
  import {mapGetters} from 'vuex'
  import {addClass} from '../assets/js/dom'
  import BScroll from 'better-scroll'
  import * as api from '@/api/index'

  export default {
    name: "Home",
    components: {
      KFooter,
      KPublish,
      Slider
    },
    data() {
      return {
        index: 1,
        HB: 0,
        recommends: [],
        loop: true,
        autoPlay: true,
        interval: 3000,
        dots: [],
        currentPageIndex: 0,
        isRequest: false,
      }
    },
    created() {

      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }

      api.existPay().then((res) => {  // 验证是否有支付密码
        if (res.data.code === 10002) {
          this.$toast('请先设置支付密码')
          setTimeout(() => {
            this.$router.push('/ChangePay')
          }, 1500)
          return
        }
      })

      this.getDatas(0, true)
    },
    mounted() {
      api.home().then((res) => {
        this.recommends = res.data.home_pic_url_list
        setTimeout(() => {   // 确保dom渲染完成 20ms
          this._setSliderWidth()
          this._initDots()
          this._initSlider()

          if (this.autoPlay) {
            this._play()
          }
        }, 20)
        // console.log(this.recommends)
      })

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })

      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    computed: {
      ...mapGetters(['clientInfo', 'sercret', 'loginInfo', 'timeInfo', 'newsList', 'newsCount'])
    },
    methods: {
      toNext(item) {
        if (item.location_type === '1') {
          this.$router.push({path: '/News', query: {topic_id: item.location}})
        }
        if (item.location_type === '2') {
          this.$router.push({path: '/GoodsDetail', query: {id: item.location}})
        }
        if (item.location_type === '3') {
          window.location.href = item.location
        }
      },
      up() {
        this.index = 1
      },
      down() {
        this.index = 2
      },
      checkMore() {

      },
      toNews(n) {
        this.$router.push({path: '/News', query: {topic_id: n.topic_id}})
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
        }
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) { // 可以滑动loop会克隆两个dom，所以要*2
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) { // 可以滑动loop会克隆两个dom
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
      goNext(where) {
        this.$router.push(`/${where}`)
      },
      refresh(done) {
        setTimeout(() => {
          done()
          this.$store.dispatch('clientInfo')
        }, 200)

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
          this.getDatas(this.newsCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        const footerHeight = this.$refs.footer.offsetHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight - footerHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getNewsList', {
          'page': page + 1,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        })
      },
      scanCode() {
        // console.log('scan')

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

  .ico-n1 {
    .bg-image('home_scan@2x');
  }

  .ico-n2 {
    .bg-image('home_recharge@2x');
  }

  .ico-n3 {
    .bg-image('home_ktong@2x');
  }

  .ico-n4 {
    .bg-image('home_gsc@2x');
  }

  .ico-n5 {
    .bg-image('home_c2c@2x');
  }

  .ico-n6 {
    .bg-image('home_hot@2x');
  }

  .ico-n7 {
    .bg-image('home_trend@2x');
  }

  .ico-n8 {
    .bg-image('home_change@2x');
  }

  .box1 {
    .all-center();
    .red {
      width: 13rem;
      height: 17rem;
      .bg-image('hongbao@2x');
      border-radius: 1rem;
      margin-bottom: 1rem;
      display: flex;
      i {
        //.bg-image('dakai@2x');
        width: 5rem;
        height: 5rem;
        position: absolute;
        left: 50%;
        top: 32%;
        transform: translate(-50%, -50%);
      }
    }
    .open {
      position: absolute;
      left: 50%;
      top: 67%;
      transform: translate(-50%, -50%);
      .text {
        padding: .2rem .5rem;
        font-size: @font-xs;
        border: 1px solid @white-color;
        color: @white-color;
        border-radius: 1rem;
      }
    }
    .close {
      position: absolute;
      left: 50%;
      top: 98%;
      transform: translate(-50%, -50%);
      i {
        .bg-image('guanbi@2x');
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .box2 {
    .all-center();
    .red2 {
      width: 13rem;
      height: 17rem;
      .bg-image('lingqu@2x');
      border-radius: 1rem;
      margin-bottom: 1rem;

      .money {
        font-size: @font-m;
        color: #2f2f2f;
        position: absolute;
        left: 50%;
        top: 28%;
        transform: translate(-50%, -50%);
      }
      .tip {
        font-size: @font-xs;
        color: #d27c0d;
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translate(-50%, -50%);
      }
    }
    .open {
      position: absolute;
      left: 50%;
      top: 75%;
      transform: translate(-50%, -50%);
      .text {
        padding: .3rem .7rem;
        font-size: @font-xs;
        width: 4rem;
        height: 1.5rem;
        .bg-image('home_lingqu@2x');
        /*border: 1px solid @white-color;
        background-image: linear-gradient(0deg, #ffc90e 0%, #fff06e 100%), linear-gradient(#ffffff, #ffffff);
        box-shadow: 0px 0px 16px 0px rgba(187, 88, 0, 0.3);
        color: #ff6f36;*/
        border-radius: 1rem;
      }
    }
    .close {
      position: absolute;
      left: 51%;
      top: 98%;
      transform: translate(-50%, -50%);
      i {
        .bg-image('guanbi@2x');
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .home {
    width: 100%;
    height: 100%;
    .top {
      position: relative;
      width: 100%;
      height: 17rem;
      background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png") no-repeat;
      background-size: cover;
      margin-bottom: .5rem;
      .text {
        padding-top: .5rem;
        margin-bottom: .5rem;
        p {
          text-align: center;
          box-sizing: border-box;
          padding: 0 auto;
          font-size: @font-xm;
          line-height: 1.45rem;
          color: #fff;
        }
      }
      .sliders {
        position: relative;
        width: 96%;
        overflow: hidden;
        left: 50%;
        transform: translateX(-50%);
        height: 7rem;
        border-radius: 10px;
        .slider {
          min-height: 1px;
          .slider-group {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            .slider-item {
              float: left;
              box-sizing: border-box;
              overflow: hidden;
              text-align: center;
              a {
                display: block;
                height: 7rem;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
              }
              img {
                display: block;
                width: 100%;
                height: 7rem;
              }
            }
          }
          .dots {
            position: absolute;
            right: 0;
            left: 0;
            bottom: 12px;
            text-align: center;
            font-size: 0;
            .dot {
              display: inline-block;
              margin: 0 4px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: @white-color;
              &.active {
                width: 20px;
                border-radius: 5px;
                background: @white-color;
              }
            }
          }
        }
      }
      .buttons {
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translateX(-50%);
        color: @primary-active;
        width: 90%;
        .button-item {
          display: flex;
          width: 100%;
          margin-bottom: 1rem;
          .item {
            flex: 1;
            display: flex;
            align-items: center;
            flex-direction: column;
            .ico {
              width: 1.2rem;
              height: 1.2rem;
            }
            p {
              margin-top: .2rem;
              font-size: @font-s;
            }
            .zimu {
              margin-top: .3rem;
            }
          }
        }
      }
    }
    .content {
      .market {
        background: @white-color;
        margin-bottom: .5rem;
        .head {
          padding: .5rem;
          border-bottom: 1px solid @border-color;
          display: flex;
          font-size: @font-s;
          .title {
            flex: 1;
            padding-left: .5rem;
            border-left: 5px solid @primary-active;
            line-height: 1.3rem;
          }
          .right {
            flex: 0 0 5rem;
            display: flex;
            color: @primary-active;
            p {
              display: inline-block;
              border: 1px solid @primary-active;
              padding: .1rem .5rem;
            }
            p.active {
              background: @primary-active;
              color: @white-color;
            }
          }
        }
        .toMore {
          color: @gray-color;
          font-size: @font-s;
          text-align: center;
          padding: .7rem;
        }
      }
      .news {
        background: @white-color;
        .head {
          padding: .5rem;
          border-bottom: 1px solid @border-color;
          display: flex;
          font-size: @font-s;
          .title {
            flex: 1;
            padding-left: .5rem;
            border-left: 5px solid @primary-active;
            line-height: 1.3rem;
          }
        }
        .new {
          padding: 0 .5rem .5rem .5rem;
          li {
            display: flex;
            font-size: @font-s;
            border-bottom: 1px solid @border-color;
            .left {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding-right: 1.5rem;
              margin-top: .5rem;
              .text {
                margin-bottom: .5rem;
              }
              .bottom {
                display: flex;
                color: @gray-color;
                .time {
                  flex: 1;
                  line-height: 2.4rem;
                }
                .watch {
                  display: flex;
                  line-height: 2.4rem;
                  i {
                    .bg-image('ico_view');
                    align-self: center;
                    margin-right: .3rem;
                    width: 1rem;
                    height: 1rem;
                  }
                }
              }
            }
            .right {
              flex: 0 0 4rem;
              width: 4rem;
              height: 4rem;
              margin-top: .5rem;
              // background: @primary-active;
              img {
                width: 4rem;
                height: 4rem;
              }
            }
          }
        }
      }
    }
    .content-item {
      width: 100%;
      height: 4rem;
      line-height: 4rem;
      padding: 0 .5rem;
      border-bottom: 1px solid @border-color;
      display: flex;
      &:last-child {
        border: none;
      }
      .fll {
        display: flex;
        align-items: center;
        flex: 0 0 4.5rem;
        .ico {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
        }
        .name {
          display: inline-block;
          color: @gray-color;
          font-size: @font-s;
        }
      }
      .right {
        /*display: flex;*/
        /*align-items: center;*/
        .no-wrap();
        width: 50%;
        flex: 1;
        text-align: right;
        .money {
          display: inline-block;
          /*margin-right: 1rem;*/
          font-size: @font-m;
        }
      }
      .check {
        flex: 0 0 2rem;
        i {
          width: 1rem;
          height: 1rem;
          .bg-image('ic_return@2x');
          display: inline-block;
        }
      }
    }
  }
</style>
