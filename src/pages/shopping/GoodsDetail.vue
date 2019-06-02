<template lang="html">
  <div class="wrapper ShopDetail" v-if="goods.goods_id">
    <KTop :title="'商品详情'">
      <p v-if="goods.factory_store_id !== '0'" class="slot" @click="toSeller()">进入店铺</p>
    </KTop>
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="swiperBox">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(p,idx) of goods.goods_picture_list" :key="idx">
            <div class="slide-item">
              <img :src="p">
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="titleBox">
        <div class="priceContent">
          <p class="price">
            <span class="icon-yuan">&yen;{{goods.goods_price}}</span>
            <span class="bule-baby">通贝: {{goods.blue_score_price}}</span>
          </p>
        </div>
        <div class="titleContent">
          <div>
            <span class="title">{{goods.goods_name}}</span>
          </div>
          <!-- <p class="title-icon">
            <img :src="goods.goods_picture">
          </p> -->
        </div>
        <div class="detail">
          <span class="sell">销量：{{goods.ordered_count}}</span>
          <span class="sell">库存：{{goods.goods_amount}}</span>
          <span class="sell">快递：&yen;{{goods.freight}}</span>
        </div>

        <!--<div class="descContent">-->
        <!--<p>{{goods.goods_text}}</p>-->
        <!--</div>-->
      </div>
      <ul class="descBox">
        <li class="item" @click="openArg">
          <div class="left">产品参数</div>
          <div class="right">
            <i class="ico ico-right"></i>
          </div>
        </li>
        <!--<li class="item" @click="openTab" v-if="goods.attribute.length">-->
        <!--<div class="left">选择主要颜色，尺寸</div>-->
        <!--<div class="right">-->
        <!--<i class="ico ico-right"></i>-->
        <!--</div>-->
        <!--</li>-->

      </ul>

      <div class="tabBox">
        <p class="picText" :class="[tag === 1 && 'tab-active']" @click="handleTag(1)">商品详情</p>
        <p class="comment" :class="[tag === 2 && 'tab-active']" @click="handleTag(2)">评论（{{appraiseTotal}}）</p>
      </div>
      <div class="bottom" v-if="tag === 1" v-html="goods.goods_description"></div>
      <div class="bottom" v-if="tag === 2">

        <div class="comment-item" v-for="list of appraiseList">
          <div class="top">
            <div class="left">
              <div class="img-box">
                <img :src="list.head_img_url" alt="头像">
              </div>
              <div class="score">
                <p class="name"><span>{{list.client_name}}</span> <i class="ico img-bg"
                                                                     v-if="list.is_super_node==='1'"></i></p>
                <Star :type="'2'" :star="list.goods_score"></Star>
              </div>
            </div>
            <div class="right">
              <p>{{list.create_time}}</p>
            </div>
          </div>
          <div class="center">
            <p>{{list.content}}</p>
            <div class="img" v-for="pic of list.appraise_pic_url">
              <img :src="pic" @click.stop="show(pic)" alt="图片">
            </div>
          </div>
          <div class="comment-foot">
            <p class="count" @click="clickLike(list)"><i :class="list.is_like === 1 ?'ico like2':'ico like'"></i><span>{{list.like_count}}</span>
            </p>
          </div>
        </div>

      </div>
      <div class="space"></div>
    </scroller>
    <div class="space"></div>

    <div class="foot">
      <div class="left">
        <div class="click" @click="toCard">
          <i class="ico ico-cart"></i>
          <p>购物车</p>
        </div>
        <div class="click" @click="collect()">
          <i :class="is_attention === 0 ? 'ico ico-collect':'ico ico-collect ico-collectOn'"></i>
          <p>收藏</p>
        </div>
      </div>
      <div class="button">
        <button class="addCard" @click="join">加入购物车</button>
        <button class="buy" @click="pay">立即购买</button>
      </div>
    </div>

    <KPublish :props-show="showImg" @close="hide">
      <div class="uploadImg" :style="'backgroundImage: url('+imgURL+')'">
      </div>
    </KPublish>

    <goods-arg
      :show="showArg"
      :list="goods.goods_parameter"
      @onClose="openArg"
    />
    <tab-control
      :goods="goods"
      :show="showTab"
      @close="openTab"
      @onConfirm="confirm"
    />
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import KTop from '@/components/KTop'
  import KPublish from '@/components/KPublish'
  import GoodsArg from '@/components/GoodsArg'
  import Star from '@/components/Star'
  import TabControl from '@/components/TabControl'
  import * as api from '@/api/index'
  import wx from 'weixin-js-sdk'
  // import BMap from 'BMap'

  export default {
    name: 'GoodsDetail',
    components: {
      KTop,
      swiper,
      swiperSlide,
      TabControl,
      GoodsArg,
      KPublish,
      Star
    },
    data() {
      return {
        swiperOption: {
          loop: true,
          spaceBetween: 30,
          centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
          }
        },
        showPicker: false,
        showTab: false,
        tag: 1,
        isPay: false,
        showArg: false,
        is_attention: 0,
        showImg: false,
        imgURL: '',
        isRequest: false,
      }
    },
    created() {
      const id = this.$route.query.id
      if (!id) {
        this.$router.push('/Home')
        return
      }
      this.$loading()
      this.getDatas(0, true)
      this.$store.dispatch('goods', {
        'goods_id': id
      }).then(res => {
        this.$loading(0)
        this.is_attention = this.goods.is_attention
        this.share()
      })
    },
    mounted() {
      window.onresize = () => setTimeout(() => this.setScroller(), 300)
    },
    destroyed() {
      this.$store.commit('RECEIVE_GOODS', {goods: {}})
    },
    computed: {
      ...mapGetters(['goods', 'appraiseList', 'appraiseCount', 'appraiseTotal']),
    },
    methods: {
      setScroller() {
        const wHeight = window.innerHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${wHeight}px`
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
          this.getDatas(this.ordersCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getAppraiseList', {
          'page': page + 1,
          'goods_id': this.$route.query.id,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        }).catch(err => {
        })
      },
      hide() {
        this.showImg = false
        this.imgURL = ''
      },
      show(url) {
        this.imgURL = url
        this.showImg = true
      },
      clickLike(list) {
        api.likeAppraise({
          id: list.goods_appraise_id,
        }).then(() => {
          if (list.is_like === 1) {
            list.like = 0
          } else {
            list.like = 1
          }
          this.$store.commit('CHANGE_APPRAISE', {comment: list})
        })
      },
      collect() {
        api.changeCollect({
          'type': 2,
          'goods_id': this.$route.query.id,
          'factory_store_id': this.goods.factory_store_id
        }).then((res) => {
          this.is_attention = res.data.is_attention
        })

      },
      location() { // 保留(可删) 获取定位
        const self = this
        const geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            self.longitude = r.point.lng
            self.latitude = r.point.lat
          }
          else {
            console.log('failed' + this.getStatus());
          }
        }, {enableHighAccuracy: true})
      },
      toCard() {
        this.$router.push('/Cart')
      },
      toSeller() {
        // this.$loading()
        const opt = {
          'factory_store_id': this.goods.factory_store_id,
          // 'longitude': this.longitude,
          // 'latitude': this.latitude
        }
        // this.$store.dispatch('hotel', opt).then(res => {
        //   this.$loading(0)
        this.$router.push({path: '/Seller', query: opt})
        // }).catch(err => this.$loading(0))
      },
      openArg() {
        this.showArg = !this.showArg
      },
      handleTag(tag) {
        this.tag = tag
        if (this.tag === 2) {
          this.setScroller()
        }
      },
      openTab() {
        this.showTab = !this.showTab
      },
      confirm(order) {
        if (this.isPay) {
          order.cart_id = `C${order.goods_id}`
          order.chosen = true
          this.confirmOrder(order)
        } else {
          this.$store.dispatch('addCart', order).then(res => {
            // this.$router.push('/Cart')
            this.$toast('加入购物车成功')
            this.openTab()
          })
        }
      },
      join() {
        this.isPay = false
        if (this.goods.stock_switch === '1') {
          if (Number(this.goods.goods_amount) <= 0) {
            this.$toast('该商品库存为0，不能购买')
            return
          }
        }
        if (this.goods.attribute.length > 0) {
          this.openTab()
        } else {
          this.$store.dispatch('addCart', {
            'freight': this.goods.freight,
            'goods_id': this.goods.goods_id,
            'goods_name': this.goods.goods_name,
            'goods_price': this.goods.goods_price,
            'blue_score': this.goods.blue_score_price,
            'goods_pic': this.goods.goods_picture,
            'goods_attr_id': '',
            'goods_count': 1,
            'goods_attr_item_name': '',
            'goods_type': this.goods.goods_type,
          }).then(res => {
            // this.$router.push('/Cart')
            this.$toast('加入购物车成功')
          })
        }
      },
      pay() {
        this.isPay = true
        if (this.goods.stock_switch === 1) {
          if (this.goods.goods_amount <= 0) {
            this.$toast('该商品库存为0，不能购买')
            return
          }
        }
        if (this.goods.attribute.length > 0) {
          this.openTab()
        } else {
          const order = {
            'cart_id': `C${this.goods.goods_id}`,
            'goods_id': this.goods.goods_id,
            'goods_name': this.goods.goods_name,
            'goods_price': this.goods.goods_price,
            'blue_score': this.goods.blue_score_price,
            'goods_pic': this.goods.goods_picture,
            'goods_type': this.goods.goods_type,
            'goods_attr_id': '',
            'goods_count': 1,
            'goods_attr_item_name': '',
            'freight': this.goods.freight,
            'chosen': true,
          }
          this.confirmOrder(order)
        }
      },
      confirmOrder(order) {
        const list = []
        list.push(order)
        this.$store.commit('RECEIVE_CART_LIST', {list})
        this.$router.push({path: '/ConfirmOrder', name: 'ConfirmOrder', params: {toOrder: true}})
      },
      share() {
        const opt = {
          title: this.goods.goods_name,
          link: window.location.href,
          imgUrl: this.goods.goods_picture,
          desc: this.goods.goods_text,
        }
        wx.onMenuShareTimeline(opt)
        wx.onMenuShareAppMessage(opt)
        wx.onMenuShareQQ(opt)
        wx.onMenuShareWeibo(opt)
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-right {
    width: 1.4rem;
    height: 1.4rem;
    //.bg-image(right);
  }

  .ico-cart {
    width: 1.1rem;
    height: 1.1rem;
    .bg-image('store_shopping@2x');
  }

  .ico-collect {
    width: 1.1rem;
    height: 1.1rem;
    .bg-image('store_collection@2x');
  }

  .like {
    .bg-image('home_fabulous1@2x');
    width: 1rem;
    height: 1rem;
    /*margin: .5rem;*/
  }

  .like2 {
    .bg-image('home_fabulous@2x');
    width: 1rem;
    height: 1rem;
    /*margin: .5rem;*/
  }

  .ico-collectOn {
    width: 1.1rem;
    height: 1.1rem;
    .bg-image('store_collection_h@2x');
  }

  .slot {
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: @font-s;
    line-height: 2.7rem;
  }

  .distance {
    margin: 1rem 0;
  }

  .scroller {
    margin-top: 2.5rem;
  }

  .titleBox {
    padding: .5rem 1rem;
    background: #fff;
    border-bottom: 1px solid #E4DDDD;
    margin-bottom: .4rem;
    .titleContent {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      overflow: hidden;
      .title {
        display: inline-block;
        font-size: @font-s;
      }
      .sell {
        display: block;
        margin-top: .5rem;
        font-size: @font-s;
        color: @text-color;
      }
      .title-icon {
        background: @primary-color;
        width: 1.5rem;
        height: 1.5rem;
        margin: .5rem 0;
      }
    }
    .detail {
      font-size: @font-xs;
      background: #f7f7f7;
      color: #454545;
      margin: .2rem 0;
      padding: .2rem .1rem;
      display: flex;
      border-radius: 10px;
      text-align: center;
      .sell {
        flex: 1;
        .no-wrap();
      }
    }
    .priceContent {
      margin: .5rem 0;
      .price {
        font-size: 1rem;
        .icon-yuan {
          display: block;
          font-size: 1.1rem;
        }
        .bule-baby {
          font-size: @font-s;
          color: @primary-active;
          padding-left: 4px;
        }
      }
    }
    .descContent {
      font-size: @font-s;
      color: @text-color;
    }
  }

  .slide-item {
    .box-img(100%, 100%);
    img {
      width: 100%;
      height: 100%;
    }
  }

  .item {
    display: flex;
    align-items: center;
    height: 2.8rem;
    line-height: 2.8rem;
    border-bottom: 1px solid @border-color;
    padding: 0 .6rem;
    background: #fff;
    .left {
      flex: 1;
      font-size: @font-s;
    }
    // .right {
    //     font-size: @font-l;
    //     text-align: right;
    // }
  }

  .promise {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: @font-s;
    li {
      flex: 1;
      text-align: center;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
    .icon-spot {
      display: inline-block;
      vertical-align: middle;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 0.6rem;
      background: @text-color;
      margin: 0.2rem 0.4rem;
    }
  }

  .tabBox {
    display: flex;
    height: 2rem;
    background: #fff;
    line-height: 2rem;
    font-size: @font-s;
    color: #3c3c3c;
    border-bottom: 1px solid @border-color;
    p {
      text-align: center;
      margin: 0 2rem;
      flex: 1;
    }
  }

  .tab-active {
    border-bottom: 3px solid @primary-active;
  }

  .foot {
    display: flex;
    background: white;
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2.3rem;
    line-height: 2.3rem;
    .left {
      flex: 0 0 5rem;
      display: flex;
      font-size: @font-xs;
      color: #9f9f9f;
    }
    .click {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
      i {
        align-self: center;
        flex: 1;
      }
      p {
        flex: 1;
        line-height: 1rem;
      }
    }
  }

  .button {
    flex: 1;
    display: flex;
    button {
      flex: 1;
      text-align: center;
      border: none;
      font-size: @font-s;
      color: #fff;
      &:focus {
        outline: none;
      }
    }
    .addCard {
      background: black;
    }
    .buy {
      background: @primary-active;
    }
  }

  .bottom {
    padding: 0 .5rem 1rem .5rem;
    background: #fff;
    overflow: hidden;
    text-align: center;
    font-size: @font-xs;
  }

  .comment-item {
    font-size: @font-s;
    margin: .5rem 0;
    padding-bottom: .3rem;
    border-bottom: 1px solid @border-color;
    .top {
      display: flex;
      line-height: 3rem;
      .left {
        flex: 1;
        display: flex;
      }
      .right {
        flex: 0 0 7rem;
        color: #bbbbbb;
      }
      .img-box {
        .box-img(3rem, 3rem);
        margin: 0;
        img {
          width: 100%;
          height: 100%;
          left: 0;
          border-radius: 50%;
        }
      }
      .score {
        display: flex;
        flex-direction: column;
        p {
          height: 1.5rem;
          line-height: 1.5rem;
        }
      }
      .name {
        margin-left: .3rem;
        width: 6rem;
        text-align: left;
        .no-wrap();
        span {
          vertical-align: middle;
        }
      }
      .img-bg {
        .bg-image('head');
        width: 1rem;
        height: 1rem;
        vertical-align: middle;
      }
    }
    .center {
      text-align: left;
      margin: .5rem 0 .3rem 0;
      .img {
        margin-top: .5rem;
        width: 4.9rem;
        min-height: 4.9rem;
        display: inline-block;
        margin-right: .3rem;
        img {
          width: 4.9rem;
          height: 4.9rem;
          margin-bottom: .2rem;
          border-radius: 8px;
        }
      }
    }
    .comment-foot {
      text-align: right;
      margin-left: 85%;
      .count {
        color: #bbbbbb;
        width: 2rem;
        i {
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
          margin-left: .2rem;
        }
      }
    }
  }

  .uploadImg {
    width: 80%;
    height: 80%;
    margin: 0 auto;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .space {
    height: 2.5rem
  }
</style>
<style lang="less">
  .swiper-container .swiper-pagination .swiper-pagination-bullet-active {
    background-color: #fff !important;
  }
</style>
