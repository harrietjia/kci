<template>
  <div class="wrap">
    <p class="star" v-if="type==='1'"><i @click="selectStar(index)" v-for="(itemClass,index) of itemClasses"
                       :class="itemClass"></i><span>{{text}}</span>
    </p>
    <p class="star2" v-if="type==='2'"><i v-for="(itemClass,index) of itemClasses2" :class="itemClass"></i>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  const CLS_ON = 'ico-n1'
  const CLS_OFF = 'ico-n2'
  const CLS_HALF = 'half'
  const LENGTH = 5
  export default {
    name: "Star",
    data() {
      return {
        score: 0,
        text: ''
      }
    },
    props: {
      type:{
        type: String,
        default: '1'
      },
      i: {
        type: Number,
        default: 0
      },
      star:{
        type: String,
        default: '0'
      }
    },
    watch: {
      score(val) {
        switch (val) {
          case 1:
            this.text = '不满意'
            break;
          case 2:
            this.text = '一般'
            break;
          case 3:
            this.text = '还好'
            break;
          case 4:
            this.text = '较满意'
            break;
          case 5:
            this.text = '很满意'
            break;
          default:
            this.text = ''
        }
      }
    },
    computed: {
      itemClasses() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = Math.floor(Number(this.score) * 2) / 2; // 计算所有星星的数量
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
      itemClasses2() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = Math.floor(Number(this.star) * 2) / 2; // 计算所有星星的数量
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
      selectStar(index) {
        // 点击当前星星索引值+1
        this.score = index + 1;
        let s = this.score
        this.$emit('selectStar', this.i, s)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('star')
  }

  .ico-n2 {
    .bg-image('star2')
  }

  .half {
    .bg-image('half')
  }

  .star {
    padding: .5rem 0;
    i {
      display: inline-block;
      vertical-align: middle;
      width: 1rem;
      height: 1rem;
      margin-left: .5rem;
    }
    i:first-child {
      margin: 0;
    }
    span {
      margin-left: 6.5rem;
      vertical-align: middle;
      color: #bbbbbb;
    }
  }

  .star2 {
    text-align: left;
    margin-left: .3rem;
    height: 1.5rem;
    line-height: 1.5rem;
    i {
      display: inline-block;
      vertical-align: middle;
      width: .8rem;
      height: .8rem;
    }
    i:first-child {
      margin: 0;
    }
  }
</style>
