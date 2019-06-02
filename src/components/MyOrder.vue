<template>
  <div class="list">
    <ul>
      <li class="list-item" v-for="item in list" @click="toOrderDetail(item)">
        <p class="name">{{item.last_update_time}}</p>
        <!--<p class="name" v-show="item.trader_client_info">{{item.trader_client_info.client_name}}</p>-->
        <p class="money" v-if="C2Ctype === '0'">
          <span>通贝 {{item.order_amount}}</span>
          <span>RMB {{item.order_amount_pay}}</span>
        </p>
        <p class="money" v-if="C2Ctype === '1'">
          <span>GSC {{item.order_amount}}</span>
          <span>RMB {{item.order_amount_pay}}</span>
        </p>
        <p class="state">{{item.order_state_language}}</p>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "OrderList",
    data() {
      return {}
    },
    props: {
      C2Ctype: {
        type: String,
        default: 0
      },
      text: {
        type: String,
        default: ''
      },
      selected: {
        type: Number,
        default: 0
      },
      list: {
        types: Array,
        default() {
          return []
        }
      },
    },
    methods: {
      touchList(item) {
        this.$emit('onConfirm', item)
      },
      toOrderDetail(item) {
        this.$emit('toOrderDetail', item)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .list {
    ul {
      margin: 0 .5rem;
      .list-item {
        background: @white-color;
        margin: 1rem auto;
        display: flex;
        font-size: .7rem;
        .name {
          flex: 0 0 5rem;
          display: flex;
          justify-content: center;
          align-self: center;
          padding-left: .5rem;
          color: @gray-color;
          height: 2rem;
          line-height: 1rem;
          border-right: 1px solid #C9C9C9;
        }
        .state {
          flex: 0 0 4rem;
          display: flex;
          justify-content: center;
          align-self: center;
          color: @gray-color;
        }
        .money {
          flex: 1;
          padding-left: .5rem;
          span {
            color: @text-color;
            display: block;
            margin: .5rem 0;
          }
          span:first-child {
            color: @money-color;
          }
        }
        .list-btn {
          display: flex;
          justify-content: center;
          align-self: center;
          flex: 0 0 5rem;
          width: 5rem;
          height: 1.5rem;
          margin-right: .5rem;
          font-size: 0.5rem;
          line-height: 1.5rem;
          border: none;
          border-radius: 1rem;
          color: #fff !important;
          background-image: linear-gradient(90deg, #f2dbae 0%, #e4b970 100%), linear-gradient(#f9f7ff, #f9f7ff);
          box-shadow: 0px 0px .5rem 0px rgba(155, 98, 0, 0.15);
          font-weight: bold;
        }
      }
    }
  }
</style>
