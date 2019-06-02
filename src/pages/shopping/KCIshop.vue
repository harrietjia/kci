<template lang="html">
  <div class="wrapper shop">
    <KTop :title="'商城'"/>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="sort-wrapper">
        <ul class="sort-list">
          <li @click="openSort(1)">按价格排序：{{priceItem.name}}</li>
          <li @click="openSort(2)">按销售量排序：{{saleItem.name}}</li>
        </ul>
        <div class="sort-box">
          <ul class="sort-items" v-show="sortTag == 1">
            <li :class="[priceItem.id == 0 && 'active']" @click="sortPrice(0, '无')">无</li>
            <li :class="[priceItem.id == 1 && 'active']" @click="sortPrice(1, '低')">低</li>
            <li :class="[priceItem.id == 2 && 'active']" @click="sortPrice(2, '高')">高</li>
          </ul>
          <ul class="sort-items" v-show="sortTag == 2">
            <li :class="[saleItem.id == 0 && 'active']" @click="sortSale(0, '无')">无</li>
            <li :class="[saleItem.id == 1 && 'active']" @click="sortSale(1, '低')">低</li>
            <li :class="[saleItem.id == 2 && 'active']" @click="sortSale(2, '高')">高</li>
          </ul>
        </div>
      </div>
      <transition-group
        class="list-order list-goods"
        tag="ul"
        name="list-complete"
      >
        <goods-card
          :goods="h"
          class="list-complete-item order-item"
          @onConfirm="touchGoods"
          v-for="(h,idx) of commodityList"
          :key="idx"
        />
      </transition-group>
    </scroller>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import KTop from '@/components/KTop'
  import GoodsCard from '@/components/GoodsCard'

  export default {
    name: 'KCIshop',
    components: {
      KTop,
      GoodsCard,
    },
    data() {
      return {
        isRequest: false,
        tabTag: 0,
        keyword: '',
        sortTag: 0,
        priceItem: {id: 0, name: '无'},
        saleItem: {id: 0, name: '无'},
      }
    },
    created() {
      this.tabTag = this.$route.query.tag || 0
      this.keyword = this.$route.query.keyword || ''
      this.$store.commit('RECEIVE_GOODS_LIST', {list: []})
      this.getDatas(0, true)
    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    beforeDestroy() {
      window.onresize = null
    },
    computed: {
      ...mapGetters([
        'commodityList',
        'commodityCount',
      ]),
    },
    methods: {
      setTableHeight() {
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight}px`
      },
      refresh(done) {
        // this.keyword = ''
        // this.tabTag = 0
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
          'category_id': this.tabTag,
          // 'goods_type': 3,
          'goods_name': this.keyword,
          'ordered_count': this.saleItem.id,
          'price_sort': this.priceItem.id,
          'isRefresh': isRefresh,
        }).then(res => {
          this.isRequest = false
        })
      },
      touchGoods(goods) {
        this.$router.push({path: '/GoodsDetail', query: {id: goods.goods_id}})
      },
      openSort(tag) {
        this.sortTag = tag
      },
      sortPrice(tag, name) {
        this.priceItem.id = tag
        this.priceItem.name = name
        this.sortTag = 0
        this.getDatas(0, true)
      },
      sortSale(tag, name) {
        this.saleItem.id = tag
        this.saleItem.name = name
        this.sortTag = 0
        this.getDatas(0, true)
      },
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .scroller {
    margin-top: 2.5rem;
  }

  .list-goods {
    display: flex;
    flex-wrap: wrap;
    padding: 0.2rem;
    background: #fff;
    .order-item {
      width: 50%;
      box-sizing: border-box;
    }
  }

  .shop {
    .sort-wrapper {
      position: relative;
      background: #fff;
      font-size: @font-s;
    }
    .sort-list {
      display: flex;
      align-items: center;
      border-top: 1px solid @border-color;
      border-bottom: 1px solid @border-color;
      li {
        flex: 1;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
      }
    }
    .sort-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      transform: translateY(100%);
      z-index: 2;
    }
    .sort-items {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      li {
        flex: 1;
        padding-left: 1rem;
        height: 2rem;
        line-height: 2rem;
        border-bottom: 1px solid @border-color;
      }
      .active {
        color: @primary-active;
      }
    }
  }
</style>
