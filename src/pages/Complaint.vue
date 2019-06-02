<template>
  <div class="Complaint">
    <KTop :title="'投诉建议'"></KTop>

    <textarea ref="contents" v-model="content" maxlength="500" name="txt" warp="virtual" placeholder="请留下您的意见"></textarea>

    <KButton :title="'提交意见'" @clickBtn="submit()"></KButton>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import {mapGetters} from 'vuex'
  import * as api from '@/api/index'

  export default {
    name: "Complaint",
    components: {
      KTop,
      KButton
    },
    data() {
      return {
        content: '',
        type: '1'
      }
    },
    // watch: {
    //   content: function () {
    //     if (this.content.length >= 500) {
    //       this.$toast('内容最大长度为500')
    //       // this.$refs.contents.setAttribute("readOnly", "readOnly")
    //     }
    //   }
    // },
    methods: {
      submit() {
        if (!this.content) {
          this.$toast('内容不能为空！')
          return
        }
        if (this.content.length > 500) {
          this.$toast('内容最大长度为500')
          return
        }
        api.sendFeedback({
          'content': this.content,
          'type': this.type
        }).then(res => {
          this.content = ''
          this.$toast(res.errorMessage)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .Complaint {
    width: 100%;
    height: 100%;
    textarea {
      .center();
      width: 88%;
      margin-top: .5rem;
      padding: .5rem;
      height: 12rem;
      border: none;
      outline: 1px solid @border-color;
    }
  }
</style>
