<template>
  <div class="shop">
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="top">
        <div class="text">
          <p>商城</p>
          <p class="card" @click="toCard">购物车</p>
        </div>

        <div class="sliders" ref="sliderWrapper">

          <div class="slider" ref="slider">
            <div class="slider-group" ref="sliderGroup">
              <div v-for="item of recommends">
                <!--:href="item.location"-->
                <a @click.stop="toNext(item)">
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
            <li class="item" @click="goNext('CityHotelMap')">
              <i class="ico ico-n1"></i>
              <p>附近商家</p>
            </li>
            <li class="item" @click="goNext('Category')">
              <i class="ico ico-n2"></i>
              <p>分类</p>
            </li>
            <li class="item" @click="goNext('signOn')">
              <i class="ico ico-n3"></i>
              <p>签到</p>
            </li>
            <li class="item" @click="test">
              <i class="ico ico-n4"></i>
              <p>论坛</p>
            </li>
          </ul>
          <ul class="button-item">
            <li class="item" @click="goNext('ETPCheck')">
              <i class="ico ico-n5"></i>
              <p>商家申请</p>
            </li>
            <li class="item" @click="test">
              <i class="ico ico-n7"></i>
              <p>在线影院</p>
            </li>
            <li class="item" @click="goNext('ShareCode')">
              <i class="ico ico-n8"></i>
              <p>推广二维码</p>
            </li>
            <li class="item" @click="test">
              <i class="ico ico-n6"></i>
              <p>更多</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="content">

        <div class="news">
          <div class="head">
            <p class="title">今日推荐</p>
          </div>

          <ul class="new">
            <GoodsCard
              :goods="h"
              class="order-item"
              @onConfirm="touchGoods"
              v-for="(h,idx) of goodsList"
              :key="idx"
            >
            </GoodsCard>
          </ul>
          <div class="toMore" @click="checkMore">
            <p>查看全部商品 ></p>
          </div>
        </div>

      </div>


      <!--<button @click="openRed">click</button>-->
    </scroller>

    <KFooter :tag="4" ref="footer"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import KFooter from '@/components/KFooter'
  import KPublish from '@/components/KPublish'
  import GoodsCard from '@/components/GoodsCard'
  import Slider from '@/components/slider'
  import {mapGetters} from 'vuex'
  import {addClass} from '@/assets/js/dom'
  import BScroll from 'better-scroll'
  import * as api from '@/api/index'

  export default {
    name: "Shop",
    components: {
      KFooter,
      KPublish,
      Slider,
      GoodsCard
    },
    data() {
      return {
        recommends: [],
        loop: true,
        autoPlay: true,
        interval: 3000,
        dots: [],
        currentPageIndex: 0,
        isRequest: false,
        goodsList: []
      }
    },
    created() {

      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }

    },
    mounted() {
      this.getShopData()

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
      touchGoods(goods) {
        this.$router.push({path: '/GoodsDetail', query: {id: goods.goods_id}})
      },
      checkMore() {
        this.$router.push('/KCIshop')
      },
      toCard() {
        this.$router.push('/Cart')
      },
      test(){
        this.$toast('尚未开通，敬请期待')
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

        // setTimeout(() => {
        //   done()
        //   this.getDatas(0, true)
        // }, 300)
      },
      loading(done) {
        if (this.isRequest) {
          done()
          return
        }
        setTimeout(() => {
          // this.getDatas(this.newsCount).then(res => {
          done()
          this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          // })
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
      getShopData() {
        api.getShopHome().then((res) => {
          this.recommends = res.data.home_pic_url_list
          this.goodsList = res.data.goods_list
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
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('store_business@2x');
  }

  .ico-n2 {
    .bg-image('store_classification@2x');
  }

  .ico-n3 {
    .bg-image('store_sign@2x');
  }

  .ico-n4 {
    .bg-image('store_forum@2x');
  }

  .ico-n5 {
    .bg-image('store_apply@2x');
  }

  .ico-n6 {
    .bg-image('store_entrance@2x');
  }

  .ico-n7 {
    .bg-image('store_cinema@2x');
  }

  .ico-n8 {
    .bg-image('store_code@2x');
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

  .shop {
    width: 100%;
    height: 100%;
    .top {
      position: relative;
      width: 100%;
      height: 17rem;
      .bg-image('shop_beijing@2x');
      /*background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png") no-repeat;*/
      /*background-size: cover;*/
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
        .card {
          font-size: @font-s;
          position: absolute;
          right: .5rem;
          top: .5rem;
        }
      }
      .sliders {
        position: relative;
        width: 100%;
        overflow: hidden;
        left: 50%;
        transform: translateX(-50%);
        height: 7rem;
        /*border-radius: 10px;*/
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
              font-size: @font-xs;
            }
            .zimu {
              margin-top: .3rem;
            }
          }
        }
      }
    }
    .content {
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
          padding-bottom: .5rem;
          display: flex;
          flex-wrap: wrap;
          .order-item {
            width: 50%;
            box-sizing: border-box;
          }
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
        .toMore {
          color: @gray-color;
          font-size: @font-xs;
          text-align: center;
          padding: .7rem;
          p {
            margin: 0 auto;
            width: 5rem;
            padding: .3rem .5rem;
            border: 1px solid @border-color;
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
