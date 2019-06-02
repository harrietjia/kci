
<template>
  <transition name="scale">
    <div class="content" v-show="show" @touchmove.prevent>
      <div class="box">
        <p>{{text}}</p>
        <p class="tips" v-if="need === 1">已匹配订单取消后信用会降级</p>
        <div class="credit" v-if="need === 2">
          <p class="tips">对方的信用度为：</p>
          <i v-for="(itemClass,index) of itemClasses" :class="itemClass"></i>
        </div>
        <!--<div class="input" v-if="need === 2">-->
        <!--<input class="pay" @click="toTel" v-model="payWord" maxlength="6"-->
        <!--@keyup="payWord=payWord.replace(/[^\d]/g,'')"-->
        <!--type="password" placeholder="请输入6位支付密码">-->
        <!--<input class="pay" autofocus="autofocus" ref="pwd" v-model="payWord" type="tel" maxlength="6"-->
        <!--style="position: absolute;z-index: -1;left:-100%;opacity: 0">-->
        <!--</div>-->
        <div class="verification-code" v-if="need === 2 || need === 3">
          <input type="tel" maxlength="6" class="realInput" v-model="realInput" @keyup="getNum()" @keydown="delNum()"
                 id="focusid">
          <p id="tips2">请输入6位支付密码：</p>
          <ul class="write-input clearfix">
            <li v-for="disInput in disInputs">
              <input class="disInput" type="password" maxlength="1" v-model="disInput.value" @click="getbackMoney">
              <input class="disInput" type="tel" maxlength="1"
                     style="position: absolute;z-index: -1;left:-100%;opacity: 0" v-model="disInput.value"
                     @click="getbackMoney">
            </li>
          </ul>
        </div>
        <div class="credit" v-if="need === 2 && price !== 0">
          <p class="price">GSC订单当前价格为：{{price}}</p>
        </div>
        <div class="message-btn">
          <button class="cancel" @click="cancel">取消</button>
          <button @click="confirm">确定</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>

  const CLS_ON = 'ico-n2'
  const CLS_OFF = 'ico-n1'
  const LENGTH = 5

  export default {
    data() {
      return {
        price: 0,
        show: false,
        text: null,
        func: null,
        need: 0,
        credit: 0,
        // payWord: '',
        disInputs: [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
        realInput: '',
        packets: [],
        messagepacket: false,
        pushShow: false
      }
    },
    // watch: {
    //   show(val) {
    //     if (val && this.need === 2) {
    //       this.$nextTick(() => {
    //         this.$refs.pwd.focus()
    //         this.$refs.pwd.click()
    //       })
    //     }
    //
    //   }
    // },
    // props:{
    //   text: {
    //     type: String,
    //     default: '请输入内容'
    //   }
    // },
    // created() {
    //   console.log(document.querySelector('#pwd'))
    // },
    computed: {
      itemClasses() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = this.credit; // 计算所有星星的数量
        for (let i = 0; i < score; i++) { // 整数星星使用on
          result.push(CLS_ON);// 一个整数星星就push一个CLS_ON到数组
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF);// 类似
        }
        return result;
      },
    },
    methods: {
      //验证码输入功能
      getbackMoney() {
        this.messagepacket = true;
        var idObj = document.getElementById("focusid");
        idObj.focus();
        //点击进来自动获取焦点
      },
      getbackMoneyclock() {
        this.messagepacket = false;
      },
      getNum() {
        for (var i = 0; i < this.realInput.length; i++) {
          this.disInputs[i].value = this.realInput.charAt(i);
          // 表示字符串中某个位置的数字，即字符在字符串中的下标。
        }
      },
      delNum() {
        var oEvent = window.event;
        if (oEvent.keyCode == 8) {
          if (this.realInput.length > 0) {
            this.disInputs[this.realInput.length - 1].value = "";
          }
        }
      },
      clearNum() {
        for (let i = 0; i < this.realInput.length; i++) {
          this.disInputs[i].value = "";
        }
      },
      // toTel() {
      //   this.$refs.pwd.focus();
      // },
      cancel() {
        this.show = false
        this.clearNum()
        this.realInput = ''
        // wx.closeWindow()
      },
      confirm() {
        this.show = false
        if (this.func) this.func(this.realInput)
        this.clearNum()
      }

    }
  }
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('icon_diamond@2x_88')
  }

  .ico-n2 {
    .bg-image('icon_diamond@2x')
  }

  .input {
    text-align: center;
    .pay {
      width: 60%;
      min-height: 1rem;
      padding: 0.5rem 0;
      border: 0 none;
      font-size: .8rem;
      line-height: 1.2rem;
      text-align: center;
      color: #000;
    }
  }

  .content {
    .mask();
    .box {
      /*animation: entry .7s ease;*/
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 70%;
      border-radius: 8px; /*no*/
      p {
        padding: 1rem 0;
        font-size: @font-s;
        text-align: center;
      }
      .tips {
        padding: 0;
        color: @primary-active;
      }
      .credit {
        padding: 0;
        text-align: center;
        i {
          display: inline-block;
          vertical-align: middle;
          width: 1rem;
          height: 1rem;
        }
      }
      .price {
        padding: 0;
        color: @text-color;
        .no-wrap();
      }
      .message-btn {
        padding: .5rem 0;
        display: flex;
        position: relative;
        button {
          /*flex: 1;*/
          margin: .5rem;
          z-index: 1;
          display: inline-block;
          width: 5rem;
          height: 1.8rem;
          font-size: 0.6rem;
          line-height: 1.8rem;
          text-align: center;
          color: #ffffff;
          background: @primary-active;
          border-radius: 100px;
        }
        .cancel {
          color: @text-color;
          background: @white-color;
          border: 1px solid @text-color;
        }
      }
    }
    /*@keyframes entry {*/
    /*from {*/
    /*opacity: 0;*/
    /*transform: translate3d(-50%, -50%, 0) scale3d(0, 0, 1);*/
    /*}*/

    /*to {*/
    /*opacity: 1;*/
    /*transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);*/
    /*}*/
    /*}*/

    #tips2 {
      padding: 0;
      color: @text-color;
    }
    .verification-code{
      height: 3.3rem;
    }
    .write-input {
      width: 9.3rem;
      margin: 10px auto;
      /*padding: 0 3px 5px 3px;*/
      position: relative;
      border: 1px solid #888888;
    }
    .write-input li {
      float: left;
      width: 1.5rem;
      height: 1.5rem;
      margin-bottom: 2px;
      border-right: 1px solid #888888;
    }
    .write-input li:last-child {
      border-right: none;
    }
    .write-input li input {
      -webkit-appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      resize: none;
      outline: none;
      border: 0;
      width: 1.5rem;
      line-height: 1.2rem;
      text-align: center;
      height: 1.2rem;
      font-size: @font-s;
    }
    .write-phonenum .mint-button--default {
      background: #3b90d1;
      color: #fff;
      font-family: "微软雅黑";
      font-size: 14px;
      width: 80%;
      margin: 10px auto;
    }
    .realInput {
      /* Keyword values */
      -webkit-appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      resize: none;
      outline: none;
      border: 0;
      z-index: 3;
      position: absolute;
      width: 290px;
      height: 30px;
      line-height: 30px;
      background: none;
      display: block;
      left: -100%;
      margin-left: -145px;
      opacity: 0;
      font-size: 0px;
      caret-color: #fff;
      color: #000;
      text-indent: -5em;
      top: 1px;
    }
    input[type="tel"]:disabled {
      background-color: #fff;
    }
  }

</style>
