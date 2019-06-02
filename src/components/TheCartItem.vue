<template lang="html">
  <div class="cart-item" @touchstart="touchstart($event)" @touchend="touchend" @touchmove="move($event)">
    <ul class="cart-list" :class="[isMove && 'edit']">
      <li class="box-radio">
        <i class="radio"
           @touchstart.stop="switchState"
           @touchend.stop
           :class="[order.chosen ? 'r1' : 'r2']"
        ></i>
      </li>
      <li class="box-left">
        <div class="box-img">
          <img :src="order.goods_pic" alt="">
        </div>
      </li>
      <li class="box-right">
        <p class="name">{{order.goods_name}}</p>
        <p class="attr">{{order.goods_attr_item_name}}</p>
        <p class="score" v-if="order.goods_type !== '2'">通贝 {{order.blue_score}}</p>
        <div class="price">
          <span v-if="order.goods_type !== '3'">&yen;{{order.goods_price}}</span>
          <!--为了flex布局-->
          <span v-if="order.goods_type === '3'"></span>
          <!--为了flex布局-->
          <ul class="counter">
            <li class="sub" @click.stop="sub">-</li>
            <li class="num">{{order.goods_count}}</li>
            <li class="add" @click.stop="add">+</li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="box-control" :class="[isMove && 'edit']">
      <div class="btn-edit" @touchstart.stop="edit">编辑</div>
      <div class="btn-del" @touchstart.stop="del">删除</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'TheCartItem',
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        timer: '',
        startX: '',
        isMove: false,
        isOk: true,
      }
    },
    methods: {
      ...mapMutations(['CHANGE_SUM', 'CHOSEN_ITEM']),
      sub() {
        let sum = Number(this.order.goods_count)
        if (sum == 1) return
        this.CHANGE_SUM({sum: --sum, id: this.order.cart_id})
      },
      add() {
        let sum = Number(this.order.goods_count)
        this.CHANGE_SUM({sum: ++sum, id: this.order.cart_id})
      },
      switchState() {
        let flag = !this.order.chosen
        this.CHOSEN_ITEM({flag, id: this.order.cart_id})
      },
      edit() {
        this.isMove = false
        setTimeout(() => this.isOk = true, 300)
        this.$emit('onEdit', this.order)
      },
      del() {
        this.isMove = false
        setTimeout(() => this.isOk = true, 300)
        this.$emit('onDel', this.order)
      },
      touchstart(e) {
        this.startX = e.changedTouches[0].pageX
        this.timer = setTimeout(this.del, 1000)
      },
      touchend() {
        clearTimeout(this.timer)
        if (!this.timer) return
        if (!this.isOk) return
        // this.$loading()  不要跳转
        // this.$store.dispatch('goods', {
        // 	'goods_id': this.order.goods_id
        // }).then(res => {
        // 	this.$loading(0)
        //   this.$router.push({path: '/GoodsDetail', query: {id: this.order.goods_id}})
        // })
      },
      move(e) {
        clearTimeout(this.timer)
        const {pageX} = e.changedTouches[0]
        if (pageX - this.startX > 20) {
          setTimeout(() => this.isMove = false, 150)
        } else if (pageX - this.startX < -20) {
          this.isMove = true
          this.isOk = false
        }
        return false
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .cart-item {
    position: relative;
    background: #fff;
    padding: .5rem 0;
    overflow: hidden;
    border-bottom: 1px solid @border-color;
    margin-bottom: .2rem;
    .cart-list {
      display: flex;
      align-items: center;
      transition: all 0.3s cubic-bezier(.55, 0, .1, 1);
    }
    .edit {
      transform: translateX(-10rem);
    }
    .box-control {
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      width: 5rem;
      height: 100%;
      transform: translateX(10rem);
      transition: all 0.3s cubic-bezier(.55, 0, .1, 1);
      font-size: @font-s;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 5rem;
        height: 100%;
      }
    }
    .btn-edit {
      background: @primary-active;
      color: #fff;
    }
    .btn-del {
      background: black;
      color: #fff;
    }
    .box-control.edit {
      transform: translateX(0rem);
    }

    .box-left {
      width: 4rem;
    }

    .box-img {
      .box-img(3.5rem, 3.5rem);
      img{
        width: 100%;
        height: 100%;
      }
    }

    .box-right {
      padding: 0 .5rem;
      flex: 1;
      overflow: hidden;
    }

    .name {
      font-size: @font-s;
      .no-wrap();
    }

    .attr {
      // margin-top: 0.8rem;
      color: @text-color;
      font-size: @font-s;
    }
    .score {
      // margin-top: 0.5rem;
      color: @warning-color;
      font-size: @font-s;
    }
    .price {
      font-size: @font-s;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    .counter {
      display: flex;
      align-items: center;
      text-align: center;
      font-size: @font-s;
      li {
        border-top: 1px solid @border-color;
        border-bottom: 1px solid @border-color;
        height: 1rem;
        line-height: 1rem;
      }
      .sub {
        border-left: 1px solid @border-color;
        border-radius: 4px 0 0 4px;
        width: 1.5rem;
        color: @text-color;
        background: #f4f4f4;
      }
      .add {
        border-right: 1px solid @border-color;
        border-radius: 0 4px 4px 0;
        width: 1.5rem;
        color: @text-color;
        background: #f4f4f4;
      }
      .num {
        flex: 1;
        min-width: 1rem;
        padding: 0 .5rem;
        border-left: 1px solid @border-color;
        border-right: 1px solid @border-color;
      }
    }

    .box-radio {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
    }

    .radio {
      display: inline-block;
      vertical-align: middle;
      width: 1rem;
      height: 1rem;
    }

    .r1 {
      background: @primary-active;
      border-radius: 50%;
      .bg-image('check');
    }

    .r2 {
      //.bg-image(success);
      border: 1px solid black;
      border-radius: 50%;
    }
  }
</style>
