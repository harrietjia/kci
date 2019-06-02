<template lang="html">
  <div class="order1">
    <div class="order-list">
      <div class="item" v-if="order.type === '2'">
        <img :src="order.goods_picture"/>
        <div class="center">
          <div class="top">
            <p class="name">{{order.goods_name}}</p>
          </div>

          <div class="bottom">
            <div class="left">
              <p class="price" v-if="order.goods_type !== '3'">&yen;{{order.goods_price}}</p>
              <p class="desc" v-if="order.goods_type !== '2' && order.blue_score_price">通贝
                {{order.blue_score_price}}</p>
            </div>
            <div class="right">
              <p style="visibility: hidden">取消收藏</p>
              <p @click.stop="collect">取消收藏</p>
            </div>

          </div>
        </div>
      </div>
      <div class="item" v-if="order.type === '1'">
        <img :src="order.store_logo_url"/>
        <div class="center">
          <div class="top">
            <p class="name">{{order.factory_store_name}}</p>
          </div>

          <div class="bottom">
            <div class="left2 star lineHeight">
              <i v-for="(itemClass,index) of itemClasses" :class="itemClass"></i>
              <span class="num">{{order.visitor_count}}人已访问</span>
            </div>

            <div class="right2">
              <p @click.stop="collect">取消收藏</p>
            </div>

          </div>

          <div class="foot">
            <p>关注人数：{{order.attention_count}}</p>
          </div>

        </div>
      </div>
      <div class="item" v-if="order.type === '3'">
        <img :src="order.pic_url"/>
        <div class="center">
          <div class="top">
            <p class="name">{{order.title}}</p>
          </div>

          <div class="middle">{{order.preview_content}}</div>

          <div class="bottom">
            <div class="left3">
              <p class="count"><i class="ico like"></i><span>{{order.like_count}}</span></p>
              <p class="count"><i class="ico collect"></i><span>{{order.attention_count}}</span></p>
            </div>
            <div class="right">
              <p @click.stop="collect">取消收藏</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const CLS_ON = 'ico-n1'
  const CLS_OFF = 'ico-n2'
  const CLS_HALF = 'half'
  const LENGTH = 5
  export default {
    name: 'CollectItem',
    props: {
      order: {
        types: Object,
        default() {
          return {}
        }
      },
      state: {
        types: String,
        default() {
          return {}
        }
      }
    },
    computed: {
      itemClasses() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = Math.floor(Number(this.order.score) * 2) / 2; // 计算所有星星的数量
        // 判断是否有半星
        let hasDecimal = score % 1 !== 0;
        // 计算有几个全星
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) { // 整数星星使用on
          result.push(CLS_ON);// 一个整数星星就push一个CLS_ON到数组
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF);// 类似
        }
        return result;
      },
    },
    methods: {
      collect() {
        this.$emit('collect', this.order)
      },
      touchItem() {
        this.$emit('onConfirm', this.order)
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .like {
    .bg-image('home_fabulous1@2x');
    width: .8rem;
    height: .8rem;
    margin-right: .3rem;
  }

  .collect {
    .bg-image('home_Collection1@2x');
    width: .8rem;
    height: .8rem;
    margin-right: .3rem;
  }

  .ico-n1 {
    .bg-image('star')
  }

  .ico-n2 {
    .bg-image('star2')
  }

  .half {
    .bg-image('half')
  }

  .order-list {
    background: #fff;
    .item {
      display: flex;
      padding: .5rem;
      border-bottom: 1px solid @border-color;
      img {
        width: 4rem;
        height: 4rem;
        margin-right: 0.5rem;
      }
      .center {
        width: 70%;
        display: flex;
        flex-direction: column;
        p {
          font-size: @font-s;
        }
        .top {
          flex: 1;
          .name {
            //.no-wrap();
            margin-bottom: .3rem;
          }
          .desc {
            font-size: .6rem;
            color: @text-color;
          }
        }
        .middle {
          color: #878787;
          margin-bottom: .3rem;
          font-size: @font-xs;
        }
        .bottom {
          flex: 1;
          display: flex;
          font-size: @font-xs;
          .left {
            flex: 1;
            color: @gray-color;
          }
          .left2 {
            flex: 0 0 8rem;
            .no-wrap();
          }
          .right2 {
            flex: 1;
            text-align: right;
            color: @border-color;
          }
          .star {
            color: #878787;
            .num {
              /*margin-left: .3rem;*/
              vertical-align: middle;
            }
            i {
              display: inline-block;
              vertical-align: middle;
              width: .7rem;
              height: .7rem;
            }
          }
          .left3 {
            flex: 1;
            display: flex;
            color: @gray-color;
          }
          .count {
            width: 3.5rem;
            color: #878787;
            .no-wrap();
            i {
              vertical-align: middle;
            }
            span {
              vertical-align: middle;
            }
          }
          .desc {
            color: @primary-active;
          }
          .right {
            flex: 1;
            text-align: right;
            color: @border-color;
            p:last-child {
              margin-left: 1.5rem;
              width: 3rem;
            }
          }
        }
        .foot > p {
          font-size: .6rem;
          color: @gray-color;
        }
      }
    }

  }
</style>
