<template>
  <transition name="scale">
    <div class="m-dialog" @click="close" v-if="visible" @touchmove.prevent>
      <slot></slot>
      <div class="mask"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "KPublish",
    props: {
      propsShow: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      propsShow(val) {
        this.visible = val
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      close() {
        this.$emit('close')
        // this.visible = false
        // this.callback && this.callback.call(this, 'close')
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .m-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .mask(rgba(0, 0, 0, .3), 9999);
  }
</style>
