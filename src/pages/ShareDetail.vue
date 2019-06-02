<template>
  <div class="ShareDetail">
    <KTop :title="'分享记录'">
    </KTop>

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >

      <div class="banner">
        <p>分享人</p>
        <p>手机号</p>
        <p>分享时间</p>
      </div>

      <div class="content">
        <ul>
          <li class="item" v-for="item in backScoreList">
            <p>{{item.client_name}}</p>
            <p>{{item.login_mobilephone}}</p>
            <p>{{item.create_time}}</p>
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
    name: "ShareDetail",
    components: {
      KTop
    },
    data() {
      return {
        isRequest: false,
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'backScoreList', 'backScoreCount'])
    },
    created() {
      this.$store.dispatch('getLoginStore')
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
          this.getDatas(this.backScoreCount).then(res => {
            done()
            this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
          })
        }, 300)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 20
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getShareRecord', {
          'page': page + 1,
          // 'type': this.id,
          'isRefresh': isRefresh,
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

  .ShareDetail {
    width: 100%;
    height: 100%;
    .banner {
      background: @banner-bg;
      margin-top: 2.5rem;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      color: @banner-color;
      p {
        display: inline-block;
        padding: .3rem;
        font-size: @font-s;
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
        }
      }

    }
  }
</style>
