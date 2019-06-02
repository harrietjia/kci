<template>
  <div>
    <div class="container" v-if="mask" v-show="show">
      <div class="position">
        <p :class="[!show && 'leave']">{{msg}}</p>
      </div>
    </div>
    <div class="nomask" v-else v-show="show">
      <div class="position">
        <p :class="[!show && 'leave']">{{msg}}</p>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        show: true,
        msg: '',
        mask: true
      }
    },
    methods: {
      delayed(msg, mask, ms) {

        this.msg = msg
        this.mask = mask
        setTimeout(() => {
          this.show = false
        }, ms)
      }
    },

  }
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .nomask {
    p {
      font-size: @font-xs;
      line-height: 1rem;
      color: #333;
      /*background: #fff;*/
      transform-style: preserve-3d;
      -webkit-animation: entry 1s ease;
    }
    .leave {
      -webkit-animation: leave .5s ease;
    }
    @keyframes entry {
      from {
        opacity: 0;
        transform: rotateY(70deg);
      }
      to {
        opacity: 1;
        transform: rotateY(0deg);
      }
    }
    @keyframes leave {
      to {
        opacity: 0;
        transform: rotateY(-70deg);
      }
    }
  }

  .position {
    background-color: rgba(255, 255, 255, 0.95);
    border: solid 0.05rem #CCC;
    padding: 0.8rem 0.6rem;
    text-align: center;
    border-radius: 0.2rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 9999;
    color: #333;
    font-size: 0.7rem;
    line-height: 1rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15);
  }

  .container {
    .mask(rgba(0, 0, 0, .3), 9999);
    &:extend(.nomask all);
  }


</style>


