<template>
  <div class="nctouch-inp-con mb25">
    <div class="form-btn ok" @click="clickBtn()">
      <a href="javascript:void(0);" class="btn">{{title}}</a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "KButton",
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    methods:{
      clickBtn(){
        this.$emit('clickBtn')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
