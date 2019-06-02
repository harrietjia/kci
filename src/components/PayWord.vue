<template>
  <div class="verification-code">
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
</template>

<script type="text/ecmascript-6">
  export default {
    name: "PayWord",
    data() {
      return {
        disInputs: [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}],
        realInput: '',
        messagepacket: false,
        pushShow: false
      }
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
        this.$emit('change',this.realInput)
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
      change(){
        this.$emit('change',this.realInput)
        this.clearNum()
      },
      cancel() {
        this.show = false
        this.clearNum()
        this.realInput = ''
        // wx.closeWindow()
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  #tips2 {
    padding: 0;
    color: @text-color;
    text-align: center;
  }

  .verification-code {
    height: 3.3rem;
    font-size: @font-s;
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
</style>
