<template>
  <div class="Notice">
    <KTop :title="'公告'">

    </KTop>

    <div class="text" v-for="item in noticeList">
      <p class="notice" @click="toDetail(item)">{{item.title}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'

  export default {
    name: "Notice",
    components: {
      KTop
    },
    data() {
      return {
        isRequest: false,
      }
    },
    created() {
      this.getDatas(0, true)
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'noticeList', 'noticeCount'])
    },
    methods: {
      toDetail(item) {
        this.$router.push({path: '/NoticeDetail', name: 'NoticeDetail', params: item})
      },
      getDatas(page = 0, isRefresh = false) {
        this.isRequest = true
        return this.$store.dispatch('getNotice', {
          'page': page + 1,
          // 'isRefresh': isRefresh,
        }).then(res => {
          // this.isRequest = false
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .Notice {
    width: 100%;
    height: 100%;
    .text {
      background: @white-color;
      .notice {
        padding: .5rem 1rem;
        border-bottom: 1px solid @border-color;
        font-size: @font-s;
        color: @gray-color;
      }
    }
  }
</style>
