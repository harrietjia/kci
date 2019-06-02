<template>
  <div class="Seller">
    <KTop :title="'商家详情'">
      <i :class="is_attention === 0 ? 'ico slot':'ico slot2'" @click="collect"></i>
    </KTop>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >

      <div class="slide-item">
        <img :src="hotel.store_pic_url" alt="商家图片">
      </div>

      <div class="goMap" @click="goMap()">
      </div>

      <div class="detail">
        <p class="title">{{hotel.factory_store_name}}</p>
        <div class="address lineHeight"><i class="ico ico-address"></i><span>{{hotel.distance}}</span> <span
          class="gray">|</span> <span class="road">{{hotel.address}}</span>
        </div>
        <div class="star lineHeight"><i v-for="(itemClass,index) of itemClasses" :class="itemClass"></i><span
          class="num">{{hotel.visitor_count}}人已访问</span></div>

        <div class="bottom">
          <p class="time lineHeight"><i class="ico ico-time"></i> 营业时间：{{hotel.run_time}}</p>
          <div class="concat">
            <p></p>
            <p><i class="ico ico-phone"></i><a :href="`tel:${hotel.operation_mobilephone}`">联系商家</a></p>
          </div>
        </div>
      </div>

      <div class="suggest" v-if="commodityList.length > 0">
        <div class="head">
          <p class="title">热销推荐</p>
        </div>

        <ul class="new">
          <GoodsCard
            :goods="h"
            class="order-item"
            @onConfirm="touchGoods"
            v-for="(h,idx) of commodityList"
            :key="idx"
          >
          </GoodsCard>
        </ul>
        <!--<div class="toMore" @click="checkMore">-->
        <!--<p>查看全部推荐 ></p>-->
        <!--</div>-->
      </div>
    </scroller>

  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import BMap from 'BMap'
  import * as api from '@/api/index'
  import KTop from '@/components/KTop'
  import GoodsCard from '@/components/GoodsCard'
  import wx from 'weixin-js-sdk'

  const CLS_ON = 'ico-n1'
  const CLS_OFF = 'ico-n2'
  const CLS_HALF = 'half'
  const LENGTH = 5

  export default {
    name: "Seller",
    components: {
      KTop,
      GoodsCard
    },
    data() {
      return {
        title: '',
        latitude: '',
        longitude: '',
        is_attention: 0,
      }
    },
    computed: {
      ...mapGetters([
        'hotel',
        'pageList',
        'commodityList',
        'commodityCount',
      ]),
      itemClasses() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = Math.floor(Number(this.hotel.score) * 2) / 2; // 计算所有星星的数量
        // 判断是否有半星
        let hasDecimal = score % 1 !== 0;
        // 计算有几个全星
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) { // 整数星星使用on
          result.push(CLS_ON);// 一个整数星星就push一个CLS_ON到数组
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF);// 类似
        }
        return result;
      },
    },
    created() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0

      // if (!this.hotel.address) {
      this.location()
      // }

      this.$store.commit('RECEIVE_GOODS_LIST', {list: []})
      this.getDatas(0, true)
    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    methods: {
      collect() {
        api.changeCollect({
          'type': 1,
          'factory_store_id': this.$route.query.factory_store_id
        }).then((res) => {
          this.$toast(res.errorMessage)
          this.is_attention = res.data.is_attention
        })

      },
      getSeller(opt) {

        // this.$loading()
        this.$store.dispatch('hotel', opt).then(res => {
          this.is_attention = this.hotel.is_attention
          this.share()
          this.$loading(0)
        }).catch(err => this.$loading(0))

      },
      location() {
        const self = this
        const geolocation = new BMap.Geolocation();
        this.$loading()
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            self.longitude = r.point.lng
            self.latitude = r.point.lat

            const opt = {
              'factory_store_id': self.$route.query.factory_store_id,
              'longitude': self.longitude,
              'latitude': self.latitude
            }
            self.getSeller(opt)
          }
          else {
            console.log('failed' + this.getStatus());
          }
        }, {enableHighAccuracy: true})

      },
      setTableHeight() {
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight}px`
      },
      refresh(done) {
        this.keyword = ''
        this.tabTag = 0
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
          this.getDatas(this.commodityCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getCommodityList', {
          'page': page + 1,
          'ordered_count': 0,
          'price_sort': 0,
          'factory_store_id': this.$route.query.factory_store_id,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        })
      },
      touchGoods(goods) {
        this.$router.push({path: '/GoodsDetail', query: {id: goods.goods_id}})
      },
      share() {
        const opt = {
          title: this.hotel.factory_store_name,
          link: window.location.href,
          imgUrl: this.hotel.store_logo_url,
          desc: this.hotel.factory_desc,
        }
        wx.onMenuShareTimeline(opt)
        wx.onMenuShareAppMessage(opt)
        wx.onMenuShareQQ(opt)
        wx.onMenuShareWeibo(opt)
      },
      goMap() {
        const longitude = this.hotel.longitude
        const latitude = this.hotel.latitude
        const name = this.hotel.factory_store_name
        const address = this.hotel.address
        // const url = 'http://1.dev-reservation.ffun360.com/share_admin/index'
        // window.location.href = `${url}?longitude=${longitude}&latitude=${latitude}&name=${name}&address=${address}`
        window.location.href = "http://api.map.baidu.com/marker?location=" + latitude + "," + longitude + "&title=" + name + "&content=" + address + "&output=html"
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('star')
  }

  .ico-n2 {
    .bg-image('star2')
  }

  .half {
    .bg-image('half')
  }

  .slot {
    position: absolute;
    top: 0.8rem;
    right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
    .bg-image('store_focus@2x');
  }

  .slot2 {
    position: absolute;
    top: 0.8rem;
    right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
    .bg-image('store_focus1@2x');
  }

  .ico-time {
    .bg-image('ic_time@2x');
    width: .7rem;
    height: .7rem;
    margin: 3px;
  }

  .ico-address {
    .bg-image('icon_place@2x');
    width: 1rem;
    height: 1rem;
  }

  .ico-phone {
    .bg-image('icon_phone@2x');
    width: .8rem;
    height: .8rem;
  }

  .Seller {
    width: 100%;
  }

  .scroller {
    margin-top: 2.5rem;
  }

  .slide-item {
    .box-img(100%, 9.5rem);
    img {
      width: 100%;
      height: 100%;
    }
  }

  .goMap {
    position: absolute;
    right: 0;
    margin-top: -2rem;
    width: 4.5rem;
    height: 4.5rem;
    .bg-image('btn_navigation_h@2x');
  }

  .detail {
    font-size: @font-s;
    display: flex;
    flex-direction: column;
    padding: .5rem;
    border-bottom: 1px solid @border-color;
    background: white;
    margin-bottom: .3rem;
    .lineHeight {
      min-height: 1.1rem;
      line-height: 1.1rem;
      margin-bottom: .2rem;
    }
    .title {
      font-size: .8rem;
      margin-bottom: .3rem;
      /*font-weight: bold;*/
    }
    .address {
      color: #39b2ff;
      /*line-height: .7rem;*/
      .gray {
        color: #878787;
        margin: 0 .3rem;
      }
      .road {
        /*display: inline-block;*/
        /*width: 7rem;*/
        text-overflow: ellipsis;
        overflow: hidden;
        /*white-space: nowrap;*/
      }
    }
    .star {
      color: #878787;
      margin-left: 3px;
      padding: 0;
      .num {
        margin-left: 1rem;
        vertical-align: middle;
      }
      i {
        display: inline-block;
        vertical-align: middle;
        width: .7rem;
        height: .7rem;
        margin-right: 3px;
      }
    }
  }

  .bottom {
    display: flex;
    .time {
      line-height: 1.8rem;
      flex: 0 0 10rem;
      color: #878787;
    }
    .concat {
      flex: 1;
      text-align: right;
      display: flex;
      p {
        flex: 1;
        align-self: center;
      }
      p:last-child {
        flex: 0 0 3.6rem;
        padding: .2rem .5rem;
        color: #5c5c5c;
        border: 1px solid #5c5c5c;
        border-radius: 8px;
      }
      a {
        color: #5c5c5c;
      }
    }
  }

  .suggest {
    border-top: 1px solid @border-color;
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
</style>
