<template>
  <div class="NoticeDetail">
    <KTop :title="'公告详情'"></KTop>

    <div class="text">
      <p class="title">{{notice.title}}</p>
      <p class="content" v-html="notice.content"></p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'

  export default {
    name: "NoticeDetail",
    components: {
      KTop
    },
    data() {
      return {
        notice: {}
      }
    },
    created() {
      this.notice = this.$route.params
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .NoticeDetail {
    width: 100%;
    height: 100%;
    .text {
      //.center();
      margin: .5rem;
      .title {
        padding: .5rem;
        color: @text-color;
        font-size: @font-s;
        text-align: center;
        border-bottom: 1px solid @border-color;
      }
      .content {
        padding-top: .3rem;
        font-size: @font-xm;
      }
    }
  }
</style>
