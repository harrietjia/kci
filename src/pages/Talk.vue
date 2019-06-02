<template>
  <div class="talk">
    <KTop :title="'发表观点'"></KTop>

    <textarea ref="contents" v-model="content" maxlength="360" name="txt" warp="virtual"
              placeholder="这一刻的想法..."></textarea>

    <KButton :title="'提交评论'" @clickBtn="submit()"></KButton>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import * as api from '@/api/index'

  export default {
    name: "Talk",
    components: {
      KTop,
      KButton
    },
    data() {
      return {
        content: '',
      }
    },
    methods: {
      submit() {
        if (!this.content) {
          this.$toast('内容不能为空！')
          return
        }
        api.publish_comment({
          id: this.$route.query.id,
          type: 1,
          body: this.content
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

  .talk {
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
      font-size: .7rem;
    }
  }
</style>
