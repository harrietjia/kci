<template>
  <div class="NoOrder">
    <KTop :title="'未匹配订单'">
    </KTop>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="bgImg">
        <p class="tips">点击订单可查看详情</p>
        <!--<p class="tips" v-if="goodsList.length === 0">暂无订单</p>-->
      </div>

      <div class="content">
        <ul>
          <li class="item" v-for="item in goodsList" @click="toOrderDetail(item)">
            <p>{{item.currency_type === '1' ? '通贝':'GSC'}}：{{item.order_amount}}</p>
            <p>RMB：{{item.order_amount_pay}}</p>
            <p class="time">{{item.last_update_time}}</p>
          </li>
        </ul>
      </div>
    </scroller>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'

  export default {
    name: "NoOrder",
    components: {
      KTop,
    },
    data() {
      return {
        id: '1',
        isRequest: false,
        card_state: '0',
        type: '0'
      }
    },
    created() {

      if (this.$route.query.type === 'buy') {
        this.type = 1
      } else if (this.$route.query.type === 'sale') {
        this.type = 2
      }
      this.getDatas(0, true)
    },
    computed: {
      ...mapGetters(['goodsList', 'goodsCount', 'clientInfo',])
    },
    methods: {
      toOrderDetail(list) {
        this.$router.push({path: '/OrderDetail', name: 'OrderDetail', params: {'list': list}})
      },
      change(state) {
        if (this.card_state === state) {
          return
        }
        this.card_state = state
        this.getDatas(0)
      },
      refresh(done) {
        this.keyword = ''
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
          this.getDatas(this.goodsCount).then(res => {
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
      async getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return await  this.$store.dispatch('getMyList', {
          'page': page + 1,
          // 'order_type': this.type,
          'state': '2',
          'trader_behavior': this.type,
          'isRefresh': isRefresh,
          'currency_type': this.$route.query.current,
        }).then(res => {
          this.isRequest = false
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .NoOrder {
    width: 100%;
    height: 100%;
    .bgImg {
      position: relative;
      width: 100%;
      height: 6rem;
      margin-top: 2.5rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      .tips {
        .all-center();
        font-size: @font-s;
        color: @white-color;
      }
    }
    .content {
      ul {
        .item {
          background: @white-color;
          padding: .2rem .1rem;
          display: flex;
          justify-content: space-between;
          color: @text-color;
          border-bottom: 1px solid @border-color;
          p {
            display: inline-block;
            min-width: 4rem;
            padding: .4rem .2rem;
            font-size: @font-s;
            color: @primary-active;
          }
          p:nth-child(2){
            color: #f74c31;
          }
          .time {
            font-size: .7rem;
            color: @gray-color;
          }
        }
      }

    }
  }
</style>
