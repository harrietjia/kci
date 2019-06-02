<template>
  <div class="BankCardEdit">
    <KTop :title="'绑定银行卡'"></KTop>

    <div class="nctouch-main-layout fixed-Width mt10">
      <div class="nctouch-inp-con">

        <ul class="form-box">
          <li class="form-item">
            <label for="bank">所属银行</label>
            <input v-model="bank" id="bank" tag="所属银行" type="text" placeholder="请输入所属银行名称"/>
            <span v-show="bank" @click="clear('bank')" class="input-del"></span>
          </li>
        </ul>

        <ul class="form-box">
          <li class="form-item">
            <label for="bankNumber">卡号</label>
            <input v-model="bankNumber" id="bankNumber" tag="卡号" type="text" placeholder="请输入银行卡号"/>
            <span v-show="bankNumber" @click="clear('bankNumber')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="name">姓名</label>
            <input v-model="name" id="name" tag="姓名" type="text" placeholder="请输入真实姓名"/>
            <span v-show="name" @click="clear('name')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="cardNumber">身份证</label>
            <input v-model="cardNumber" id="cardNumber" tag="身份证" type="text" placeholder="请输入身份证号码"/>
            <span v-show="cardNumber" @click="clear('cardNumber')" class="input-del"></span>
          </li>
        </ul>

        <ul class="form-box">
          <li class="form-item">
            <label for="phone">手机号码</label>
            <input v-model="phone" id="phone" tag="手机" type="tel" placeholder="请输入银行预留手机号"/>
            <span v-show="phone" @click="clear('phone')" class="input-del"></span>
          </li>
          <li class="form-item">
            <label for="QR">验 证 码</label>
            <input v-model="QR" id="QR" maxlength="4" tag="验证码" type="text" style="width: 40%" placeholder="请输入验证码"/>
            <div
              class="get-qr"
              :class="[timer && 'btn-gray']"
              @click="getCode">{{timer ? timerNum : '获取验证码'}}
            </div>
          </li>
        </ul>
        <div :class="getReady()">
          <a href="javascript:void(0);" @click="submit" class="btn">立即绑定</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'

  export default {
    name: "BankCardEdit",
    components: {
      KTop,
    },
    data() {
      return {
        phone: '',
        bank: '',
        name: '',
        bankNumber: '',
        cardNumber: '',
        QR: null,
        timer: '',
        timerNum: 60,
        bankCard: {}
      }
    },
    created() {
      if (this.$route.params.hasOwnProperty('item')) {
        this.bankCard = this.$route.params.item
      }
      // console.log(this.bankCard)
    },
    computed: {
      ...mapGetters(['bankCardList', 'banks', 'zone', 'sercret', 'sessionId', 'smsToken'])
    },
    methods: {
      clear(type) {
        this[type] = ''
      },
      getReady() {
        if (!this.phone || !this.bank || !this.QR || !this.name || !this.bankNumber || !this.cardNumber) {
          return "form-btn"
        } else {
          return "form-btn ok"
        }
      },
      checkPhone() {
        const regx = /^(1)\d{10}$/
        if (!this.phone || !regx.test(this.phone)) {
          this.$toast('请输入正确的手机号码')
          return false
        }
        return true
      },
      checkBankCard(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
          newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
          if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
          } else //偶数位
            arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
          jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
          jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
          sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
          sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
          sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
          sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;

        if (lastNum == luhn) {
          // this.$toast("luhn验证通过");
          return true;
        } else {
          this.$toast("请填写正确的银行卡号");
          return false;
        }
      },
      checkBank() {
        const regx = /^[\u4e00-\u9fa5]{2,10}$/i
        if (!this.bank || !regx.test(this.bank)) {
          this.$toast('请输入正确银行名称')
          return false
        }
        return true
      },
      checkName() {
        const regx = /^[\u4e00-\u9fa5]{2,5}$/i
        if (!this.name || !regx.test(this.name)) {
          this.$toast('请输入真实姓名')
          return false
        }
        return true
      },
      checkIdentity() {
        const regx = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
        if (!this.cardNumber || !regx.test(this.cardNumber)) {
          this.$toast('请输入正确的身份证号')
          return false
        }
        return true
      },
      getCode() {
        if (!this.checkPhone()) return
        if (this.timer) return
        this.setTimer()
        this.$store.dispatch('mobileCode', {
          'mobilephone': this.phone,
          'token': md5(this.phone + this.sercret),
          'session_id': this.sessionId
        })
        this.$toast(`验证码已发送至${this.phone}，请输入验证码`)
      },
      setTimer() {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.timerNum = this.timerNum - 1
          if (this.timerNum <= 0) {
            clearInterval(this.timer)
            this.timer = ''
            this.timerNum = 60
          }
        }, 1000);
      },
      async submit() {
        if (!this.QR || !this.bankNumber) {
          // this.$toast('不能为空')
          return
        }
        if(!this.smsToken){
          this.$toast('请先获取验证码')
          return
        }

        if (!this.checkBank()) return
        if (!this.checkBankCard(this.bankNumber)) return
        if (!this.checkName()) return
        if (!this.checkIdentity()) return
        if (!this.checkPhone()) return

        this.$store.dispatch('addBankCard', {
          'card_holder': this.name,
          'mobilephone': this.phone,
          'bank': this.bank,
          'card_num': this.bankNumber,
          'identity_card': this.cardNumber,
          'sms_code': this.QR
        }).then(res => this.$router.go(-1))

      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .BankCardEdit {
    width: 100%;
    height: 100%;
    .nctouch-main-layout.fixed-Width {
      margin-top: 4rem;
      .nctouch-inp-con ul {
        background: #FFF;
        margin: 0.3rem 0;
        border-radius: 0.15rem;
        .form-item {
          display: flex;
          margin: 0;
          label {
            z-index: 1;
            width: 25%;
            font-size: 0.6rem;
            line-height: 2.2rem;
            color: #444;
            text-align: center;
            .none {
              visibility: hidden
            }
          }
          input {
            width: 65%;
            min-height: 0.95rem;
            padding: 0.5rem 0;
            border: 0 none;
            font-size: 0.6rem;
            line-height: 1.2rem;
            text-align: left;
            color: #000;
          }
          .input-del {
            .input-del();
            display: block;
          }
          .get-qr {
            position: absolute;
            z-index: 1;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
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
          .btn-gray {
            background: @gray-color;
          }
        }
      }
    }
  }

</style>
