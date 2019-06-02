<template>
  <div class="ExchangeRecord">
    <Record :title="'兑换记录'"></Record>
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="banner">
        <p>{{type == '1'?'GSC':'通贝'}}</p>
        <p>兑换的{{type == '1'?'通贝':'GSC'}}</p>
        <p>兑换时间</p>
      </div>

      <div class="content">
        <ul>
          <li class="item" v-for="item in KCIList">
            <p>{{type == '1' ? item.kci_balance : item.balance }}</p>
            <p>{{type == '1' ? item.balance : item.kci_balance }}</p>
            <p>{{item.add_time}}</p>
          </li>
        </ul>
      </div>
    </scroller>
  </div>
</template>

<script type="text/ecmascript-6">
  import Record from '@/components/Record'
  import {mapGetters} from 'vuex'

  export default {
    name: "ExchangeRecord",
    components: {
      Record,
    },
    data() {
      return {
        isRequest: false,
        type: ''
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'KCIList', 'KCICount'])
    },
    created() {
      this.$store.dispatch('getLoginStore')
      this.type = this.$route.query.num
      this.getDatas(0, true)

    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    methods: {
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
          this.getDatas(this.KCICount).then(res => {
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
        return this.$store.dispatch('KCIChangeRecord', {
          'page': page + 1,
          'type': this.type,
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

  .scroller {
    margin-top: 5rem;
  }

  .ExchangeRecord {
    width: 100%;
    height: 100%;
    .banner {
      background: @white-color;
      margin-top: .2rem;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      color: @primary-active;
      p {
        display: inline-block;
        padding: .3rem;
        font-size: @font-s;
      }
    }
    .content {
      margin-bottom: 1rem;
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
            text-overflow: ellipsis;
            overflow: hidden;
            min-width: 5rem;
            padding: .4rem .2rem;
            font-size: @font-s;
          }
          p:first-child {
            color: #fd6e28;
          }
          p:last-child {
            color: #a2a2a2;
          }
        }
      }

    }
  }

</style>
