<template>
  <div class="PModification">
    <Record :title="'活力值进账记录'"></Record>
    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >

      <div class="banner">
        <p>业务类型</p>
        <p>数额</p>
        <p>时间</p>
      </div>

      <div class="content">
        <ul>
          <li class="item" v-for="item in userOrderList">
            <p>{{item.beizhu}}</p>
            <p class="kci">{{item.score}}</p>
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

  export default {
    name: "PModification",
    components: {
      Record,
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'userOrderList', 'userOrderCount'])
    },
    data() {
      return {
        id: '2',
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

  .scroller{
    margin-top: 5rem;
  }

  .PModification {
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
          .kci{
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

    }
  }

</style>
