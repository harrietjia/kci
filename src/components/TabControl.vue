<template lang="html">
  <div class="tab-control">
    <transition name="slider">
      <ul class="tab-body" v-show="show">
        <div class="box-top">
          <div class="box-img">
            <img :src="goods.goods_picture">
          </div>
        </div>
        <li class="tab box-cart-top">
          <div class="box-content">
            <p class="price" v-if="goods.goods_type != '3'">&yen;{{total}}</p>
            <p class="price" v-if="goods.goods_type != '2'">通贝: {{total_score}}</p>
            <p class="num" v-show="order.stock">库存：{{order.stock}} 件</p>
            <p v-if="attrList.length>0">请选择规格属性</p>
          </div>
        </li>
        <li class="tab" v-for="attrs of attrList">
          <span>{{attrs.attr_name}}</span>
          <ul class="box-attr">
            <li class="attr"
                :class="[a.active && 'active']"
                v-for="a of attrs.sub"
                @click="touchAttr(a, attrs.sub)"
            >{{a.attr_item_name}}
            </li>
          </ul>
        </li>
        <li class="box-counter">
          <p class="title">购买数量</p>
          <ul class="counter">
            <li class="sub" @click="sub">-</li>
            <li class="num">{{sum}}</li>
            <li class="add" @click="add">+</li>
          </ul>
        </li>
        <li class="tab">
          <div class="btn-sure" @click="confirm">完成</div>
        </li>
      </ul>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="show" @click="close"></div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'TabControl',
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      goods: { //商品详情
        type: Object,
        default() {
          return {}
        }
      },
      newOrder: { //已选择的属性
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        sum: 1,
        attrList: [],
        order: {},
      }
    },
    created() {
      this.setList(this.goods)
    },
    watch: {
      // goods() {
      // 	this.setList(this.goods)
      // },
      newOrder() {
        this.setList(this.goods)
      },
    },
    computed: {
      total() {
        if (this.order.goods_price) return this.order.goods_price
        return this.goods.goods_price
      },
      total_score() {
        if (this.order.blue_score_price) return this.order.blue_score_price
        return this.goods.blue_score_price
      },
      stock() {
        return this.order.stock || 0
      }
    },
    methods: {
      setList(goods) {
        this.attrList = []
        if (Object.keys(this.goods).length == 0) return
        const ids = this.getOrderIds()
        const isCopy = ids.length > 0

        goods.attribute.forEach((val, idx) => {
          const attr = goods.attribute[idx]
          const list = isCopy ? this.copyList([...attr.sub], ids) : attr.sub
          this.attrList.push({
            'attr_id': attr.attr_id,
            'attr_name': attr.attr_name,
            'sub': [...list]
          })

        })
        isCopy && this.setOrder()
      },
      getOrderIds() {
        const isOrder = Object.keys(this.newOrder).length > 0
        if (isOrder) {
          this.sum = Number(this.newOrder.goods_count)
          const attrId = this.newOrder.goods_attr_id
          const item = this.getAttrItem(this.goods.goods_attribute, attrId)
          const ids = item.attr_item_id_list.split(',')
          return ids
        }
        return []
      },
      getAttrItem(obj, id) {
        for (let key in obj) {
          if (obj[key].goods_attr_id == id) return obj[key]
        }
        return {
          attr_item_id_list: ''
        }
      },
      copyList(list, ids) {
        for (let i = 0, len = ids.length; i < len; i++) {
          for (let j = 0, l = list.length; j < l; j++) {
            list[j].attr_item_id == ids[i] && (list[j].active = true)
          }
        }
        return list
      },
      sub() {
        if (this.sum === 1) return
        this.sum--
      },
      add() {
        this.sum++
      },
      touchAttr(item, list) {
        list.forEach((val, idx) => {
          const flag = val.attr_item_id == item.attr_item_id
          list[idx].active = flag ? !list[idx].active : false
        })
        this.attrList = [...this.attrList]
        this.setOrder()
      },
      setOrder() {
        if (this.getErrors().length > 0) {
          this.order = {}
          return
        }
        const order = {}
        order.goods_id = this.goods.goods_id
        order.goods_name = this.goods.goods_name
        order.goods_pic = this.goods.goods_picture
        order.goods_type = this.goods.goods_type
        order.freight = this.goods.freight

        const chosenList = []

        if (this.attrList.length) {
          this.attrList.forEach(val => {
            const item = val.sub.filter(item => item.active)[0]
            chosenList.push(item)
          })

          const attrs = chosenList.map(val => val.attr_item_id)
          const names = chosenList.map(val => val.attr_item_name)
          const key = attrs.join()
          const item = this.goods.goods_attribute[key]

          if(order.goods_type === '1'){
            order.blue_score_price = item.blue_score_price
            order.blue_score = item.blue_score_price
            order.goods_price = item.goods_price
          }
          if(order.goods_type === '3'){
            order.blue_score_price = item.blue_score_price
            order.blue_score = item.blue_score_price
            order.goods_price = 0
          }
          if(order.goods_type === '2'){
            order.blue_score_price = 0
            order.blue_score = 0
            order.goods_price = item.goods_price
          }
          order.goods_attr_id = item.goods_attr_id
          order.stock = item.goods_amount
          order.goods_attr_item_name = names.join()
        } else {
          if(order.goods_type === '1'){
            order.blue_score_price = this.goods.blue_score_price
            order.blue_score = this.goods.blue_score_price
            order.goods_price = this.total
          }
          if(order.goods_type === '3'){
            order.goods_price = 0
            order.blue_score_price = this.goods.blue_score_price
            order.blue_score = this.goods.blue_score_price
          }
          if(order.goods_type === '2'){
            order.blue_score_price = 0
            order.blue_score = 0
            order.goods_price = this.total
          }
          order.goods_attr_id = ''
          order.goods_attr_item_name = ''
        }

        this.order = {...order}
        // console.log(this.order)
      },
      getErrors() {
        const errors = []
        this.attrList.forEach(val => {
          const selected = val.sub.filter(item => item.active)
          if (selected.length == 0) {
            errors.push(val.attr_name)
          }
        })
        return errors
      },
      confirm() {
        const errors = this.getErrors()
        if (errors.length > 0) {
          this.$toast('请选择' + errors.join())
          return
        }
        if (!this.sum) {
          this.$toast('请选择数量')
          return
        }
        this.order.goods_count = this.sum
        this.$emit('onConfirm', this.order)
      },
      close() {
        this.$emit('close')
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .tab-control {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 50;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      background: rgba(0, 0, 0, .4);
      z-index: 50;
      width: 100%;
      height: 100%;
    }
    .tab-body {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
      z-index: 51;
      .tab {
        font-size: @font-xs;
        display: flex;
        align-items: center;
        margin: 0 auto;
        padding: .5rem 0;
        width: 98%;
        border-bottom: 1px solid @border-color;
        span {
          flex: 0 0 2rem;
          margin-left: .5rem;
        }
      }
      .box-cart-top {
        position: relative;
        display: flex;
        align-items: flex-start;
      }
      .box-content {
        margin-left: 6.5rem;
        font-size: @font-xs;
        .price {
          font-size: @font-s;
          color: @primary-active;
        }
        p {
          color: @gray-color;
        }
      }
    }

    .box-counter {
      margin: 1.5rem 1rem;
      min-height: 3rem;
      .title {
        color: @gray-color;
        font-size: @font-s;
        margin-bottom: .8rem;
      }
    }

    .attr {
      margin: 0 .5rem .3rem 0;
      display: inline-block;
      padding: .3rem 0.6rem;
      text-align: center;
      color: @gray-color;
      border: 1px solid @gray-color;
    }
    .attr.active {
      color: #fff;
      background: @primary-active;
      border: 1px solid @primary-active;
    }

    .box-top {
      position: absolute;
      top: -15%;
      .box-img {
        .box-img(6rem, 80%);
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

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

  .btn-sure {
    width: 100%;
    text-align: center;
    border: none;
    font-size: .8rem;
    color: #fff;
    background: @primary-active;
    height: 2rem;
    line-height: 2rem;
  }
</style>
