<template>
  <div class="signon">
    <KTop :title="'签到领红包'"></KTop>

    <div class="bg-box">
      <div :class="getClass()" @click="signOn"></div>
      <div class="tips-wrap">
        <p class="tips">每日签到领红包</p>
      </div>
      <div class="bottom1">
      </div>
      <div class="bottom">
        <p>今日获得通贝：<span>{{today_score}}</span></p>
        <p class="right">本月获得通贝总数：<span>{{total_score || 0}}</span></p>
      </div>
    </div>

    <Calendar ref="Calendar" :sundayStart="true" :markDateMore="arr" :markDate="arr2" v-on:isToday="clickToday"
              agoDayHide=0 v-on:choseDay="clickDay" v-on:changeMonth="changeDate"></Calendar>

    <KPublish :props-show="showRed">
      <!--<div class="box1" v-if="!showMoney">-->
      <!--<div class="red">-->
      <!--<i class="ico" @click="getHB()"></i>-->
      <!--</div>-->
      <!--<div class="open">-->
      <!--<p class="text" @click="getHB()">点击打开红包</p>-->
      <!--</div>-->
      <!--<div class="close" @click="openRed">-->
      <!--<i class="ico"></i>-->
      <!--</div>-->
      <!--</div>-->

      <transition name="scale">
        <div class="box2">
          <div class="red2">
            <p class="money">{{HB}}</p>
            <p class="tip">加速活力值</p>
          </div>
          <div class="open">
            <p class="text" @click="getMoney()"></p>
          </div>
          <div class="close" @click="openRed">
            <i class="ico ico-n2"></i>
          </div>
        </div>
      </transition>

    </KPublish>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import KTop from '@/components/KTop'
  import KPublish from '@/components/KPublish'
  import * as api from '@/api/index'
  import Calendar from '../../plugins/calendar/index';

  export default {
    name: "SignOn",
    components: {
      KTop,
      KPublish,
      Calendar
    },
    data() {
      return {
        showRed: false,
        showMoney: false,
        HB: 0,
        total_score: '',
        today_score: '',
        arr2: [],
        arr: []
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'sercret', 'loginInfo', 'timeInfo',])
    },
    created() {
      this.$store.dispatch('getTimeStore')

      this.getDate()
    },
    methods: {
      getDate() {
        function format() {
          let date = new Date();
          let month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
          return `${date.getFullYear()}-${month}`;
        }

        api.getReceive({
          date: format()
        }).then((res) => {
          this.arr2 = res.data.receive_logs
          this.total_score = res.data.total_score
          this.today_score = res.data.today_score
        })
      },
      getClass() {
        // let times = (Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() - 1))) / 1000 // 昨天23:59:59

        if (!Number(this.today_score)) {
          return 'sign'
        } else {
          return 'sign on'
        }

      },
      clickDay(data) {
        console.log('选中了', data); //选中某天
        // this.$toast('选中了' + data);
      },
      clickToday(data) {
        console.log('跳到了本月今天', data); //跳到了本月
      },
      changeDate(data) {
        this.arr2 = []

        function format(data) {
          let date = new Date(data);
          let month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
          return `${date.getFullYear()}-${month}`;
        }

        api.getReceive({
          date: format(data)
        }).then((res) => {
          this.arr2 = res.data.receive_logs
          this.total_score = res.data.total_score
        })
      },
      demo() {
        this.$refs.Calendar.ChoseMonth('2018-12-13'); //跳到12月12日选中12月12日
      },
      openRed() {
        this.showRed = !this.showRed
      },
      getHB() {
        this.showMoney = true
      },
      getMoney() {
        api.OpenHB().then(res => {
          this.$toast('领取成功')
          this.$store.dispatch('clientInfo')

          let now = (Date.parse(new Date())) / 1000   //当前时间戳
          const timeInfo = {'now': now}
          this.$store.dispatch('setTimeStore', timeInfo, {root: true})

          this.showRed = false
          this.getDate()
        })
      },
      signOn() {
        this.$store.dispatch('getTimeStore')
        let times = (Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime() - 1))) / 1000 // 昨天23:59:59

        if (!this.timeInfo || this.timeInfo.now < times) {
          api.getHB().then(res => {
            this.HB = res.data.total_score
            if (this.HB > 0) {
              this.openRed()
            } else {
              if (!Number(this.today_score)) {
                this.$toast('尊敬的用户您没有活力值释放')
              } else {
                this.$toast('已经签到过了')
              }

            }
          })
        } else {
          this.$toast('已经签到过了')
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .signon {
    width: 100%;
  }

  .mark1 {
    background-color: red;
  }

  .mark2 {
    background-color: blue;
  }

  .bg-box {
    font-size: @font-s;
    position: relative;
    width: 100%;
    height: 8rem;
    color: @white-color;
    margin-bottom: .5rem;
    .bg-image('pic_background@2x');
    .sign {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -20%);
      .bg-image('sign_normal@2x');
      width: 4rem;
      height: 4rem;
    }
    .sign.on {
      .bg-image('sign_select@2x');
    }
    .tips-wrap {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -40%);
      .tips {
        display: inline-block;
        position: relative;
        text-align: center;
        &::after,
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 39%;
          display: block;
          width: 1rem;
          height: 1px;
          background: #ccc;
        }
        &::before {
          transform: translate(-330%, -50%);
        }
        &::after {
          transform: translate(330%, -50%);
        }
      }
    }
    .bottom1 {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 1.3rem;
      background-color: #ffffff;
      opacity: 0.08;
    }
    .bottom {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      width: 100%;

      z-index: 2;
      p {
        flex: 1;
        padding: .3rem;
        .no-wrap();
        span {
          color: @primary-active;
        }
      }
      .right {
        text-align: right;
      }
    }
  }

  .box1 {
    .all-center();
    .red {
      width: 13rem;
      height: 17rem;
      .bg-image('hongbao@2x');
      border-radius: 1rem;
      margin-bottom: 1rem;
      display: flex;
      i {
        //.bg-image('dakai@2x');
        width: 5rem;
        height: 5rem;
        position: absolute;
        left: 50%;
        top: 32%;
        transform: translate(-50%, -50%);
      }
    }
    .open {
      position: absolute;
      left: 50%;
      top: 67%;
      transform: translate(-50%, -50%);
      .text {
        padding: .2rem .5rem;
        font-size: @font-xs;
        border: 1px solid @white-color;
        color: @white-color;
        border-radius: 1rem;
      }
    }
    .close {
      position: absolute;
      left: 50%;
      top: 98%;
      transform: translate(-50%, -50%);
      i {
        .bg-image('guanbi@2x');
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .box2 {
    .all-center();
    .red2 {
      width: 15rem;
      height: 19rem;
      .bg-image('lingqu@2x');
      border-radius: 1rem;
      margin-bottom: 1rem;

      .money {
        font-size: @font-m;
        color: #2f2f2f;
        position: absolute;
        left: 50%;
        top: 28%;
        transform: translate(-50%, -50%);
      }
      .tip {
        font-size: @font-xs;
        color: #d27c0d;
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translate(-50%, -50%);
      }
    }
    .open {
      position: absolute;
      left: 50%;
      top: 75%;
      transform: translate(-50%, -50%);
      .text {
        padding: .3rem .7rem;
        font-size: @font-xs;
        width: 5rem;
        height: 1.6rem;
        .bg-image('home_lingqu@2x');
        /*border: 1px solid @white-color;
        background-image: linear-gradient(0deg, #ffc90e 0%, #fff06e 100%), linear-gradient(#ffffff, #ffffff);
        box-shadow: 0px 0px 16px 0px rgba(187, 88, 0, 0.3);
        color: #ff6f36;*/
        border-radius: 1rem;
      }
    }
    .close {
      position: absolute;
      left: 50.5%;
      top: 98%;
      transform: translate(-50%, -50%);
      i {
        .bg-image('guanbi@2x');
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
</style>
