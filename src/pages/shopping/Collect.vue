<template lang="html">
  <div class="wrapper">
    <KTop :title="'我的收藏'"></KTop>
    <!--<div class="head">-->
    <!--<input-->
    <!--type="search"-->
    <!--class="form-input"-->
    <!--v-model="keyword"-->
    <!--placeholder="搜索所有订单"-->
    <!--@keyup.enter="search"-->
    <!--&gt;-->
    <!--</div>-->
    <div class="order-list-tab" ref="tabHead">
      <ul class="tab-head" @touchmove.prevent>
        <li :class="[tabTag === 2 && 'active']" @click="touchTag(2)">商品</li>
        <li :class="[tabTag === 1 && 'active']" @click="touchTag(1)">店铺</li>
        <li :class="[tabTag === 3 && 'active']" @click="touchTag(3)">文章</li>
      </ul>

      <div class="no-result" v-show="collectList.length === 0">
        <img src="../../assets/images/noorder@2x.png" alt="">
        <p class="result">您的收藏空空如也~</p>
      </div>

      <scroller
        :on-refresh="refresh"
        :on-infinite="loading"
        class="scroller"
        ref="scroller"
      >
        <transition-group name="list-complete">
          <li
            class="li-item list-complete-item"
            v-for="(o,idx) of collectList"
            :key="idx"
            @click.stop="touchItem(o)"
          >
            <collect-item
              :order="o"
              @collect="collect"
            />
          </li>
        </transition-group>
        <div class="space"></div>
      </scroller>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import KTop from '@/components/KTop'
  import KFooter from '@/components/KFooter'
  import CollectItem from '@/components/CollectItem'
  import * as api from '@/api/index'

  export default {
    name: 'OrderList',
    components: {
      KTop,
      KFooter,
      CollectItem
    },
    data() {
      return {
        tabTag: 2,
        isRequest: false,
        keyword: ''
      }
    },
    created() {
      const tag = 2
      this.$store.commit('RECEIVE_COLLECT_LIST', {list: []})
      this.touchTag(tag ? tag : 2)
    },
    mounted() {
      this.setScroller()
      window.onresize = () => setTimeout(() => this.setScroller(), 300)
    },
    beforeDestroy() {
      window.onresize = null
    },
    computed: {
      ...mapGetters(['collectList', 'collectCount'])
    },
    methods: {
      collect(item) {
        const self = this
        this.$dialog('是否要取消收藏？', () => {
          api.changeCollect({
            'type': item.type,
            'topic_id': item.topic_id,
            'goods_id': item.goods_id,
            'factory_store_id': item.factory_store_id
          }).then((res) => {
            self.touchTag(item.type)
          })
        })

      },
      setScroller() {
        const wHeight = window.innerHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${wHeight}px`
      },
      touchTag(id) {
        this.tabTag = id
        this.getDatas(0, true)
      },
      refresh(done) {
        setTimeout(() => {
          done()
          this.getDatas(0, true)
        }, 300)
      },
      // loading(done) {
      //   if (this.isRequest) {
      //     done()
      //     return
      //   }
      //   setTimeout(() => {
      //     this.getDatas(this.collectCount).then(res => {
      //       done()
      //       this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
      //     })
      //   }, 300)
      // },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getCollectList', {
          'page': page + 1,
          'type': this.tabTag,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
          console.log(res.data)
        }).catch(err => this.$loading(0))
      },
      location() {  // 保留(可删) 获取定位
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
      touchItem(item) {
        if (item.type === '1') {
          const opt = {
            'factory_store_id': item.factory_store_id,
            // 'longitude': this.longitude,
            // 'latitude': this.latitude
          }
          this.$router.push({path: '/Seller', query: opt})
        }
        if (item.type === '2') {
          this.$router.push({path: '/GoodsDetail', query: {id: item.goods_id}})
        }
        if (item.type === '3') {
          this.$router.push({path: '/News', query: {topic_id: item.topic_id}})
        }
      },
      search() {
        this.$router.push({path: '/KCIshop', name: 'KCIshop', params: {keyword: this.keyword}})
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .scroller {
    margin-top: 4.7rem;
  }

  .space {
    height: 5rem;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
    background: #ededed;
    border-bottom: 1px solid @border-color;
    .form-input {
      /*flex: 1;*/
      width: 90%;
      height: 1.5rem;
      background: white;
      border-radius: 20px;
      padding: 0 1rem;
      border: none;
      &:focus {
        outline: none;
      }
    }
  }

  .li-item {
    margin-bottom: .5rem;
  }

  .order-list-tab {
    font-size: @font-s;
    .no-result {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: @font-s;
      color: #2d2d2d;
      img {
        width: 8rem;
        height: 8rem;
      }
    }
    .tab-head {
      display: flex;
      align-items: center;
      background: #fff;
      & > li {
        flex: 1;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        border-bottom: 1px solid @border-color;
      }
      .active {
        transition: all 0.3s ease;
        color: @primary-active;
        border-bottom: 1px solid @primary-active;
      }
    }
  }
</style>
