<template>
  <div class="Market">
    <scroller
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="bgImg">
        <div class="tab">
          <ul>
            <li v-for="(item, index) of list" :class="{active:selected===index,tabItem:true}" @click="change(index)">
              {{item.title}}
            </li>
          </ul>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <p class="name">名称</p>
          <p class="price">价格</p>
        </div>
        <ul class="items">
          <!--ico-n2-->
          <li :class="getStyle(ticker,i)" @click="toKChart(ticker.symbol)" :key="i" v-for="(ticker,i) of tickers">
            <div class="left">
              <p class="name">{{changeText(ticker.symbol)}}</p>
              <div class="state" v-if="ticker.change">
                <i :class="(ticker.change/ticker.open) < 0 ? 'ico ico-n3':'ico ico-n2'"></i>
                <p class="text">涨幅 <span :class="(ticker.change/ticker.open) < 0 ? 'down':'up'">{{((ticker.change /ticker.open)*100).toFixed(2) || 0.0}}%</span>
                </p>
              </div>
            </div>
            <div class="right">
              <p class="money">${{ticker.last}}</p>
              <p class="rmb">&yen;{{(ticker.last * rate).toFixed(8)}}</p>
            </div>
          </li>

        </ul>
        <!--<div class="head"><p>行情走势图</p></div>-->
        <!--<div id='myChart1' style='width：12rem;height:15rem'></div>-->
      </div>

      <div class="bg-btn" @click="toChange()">
        <p class="text">兑换</p>
      </div>

      <div class="space"></div>
    </scroller>

    <KPublish :props-show="showChange" @close="toChange">
      <div class="box1">
        <div class="sale" @click="goChange('1')">
          <p class="text active">通贝</p>
          <div class="center">
            <i class="ico ico-n1"></i>
            <span>兑换</span>
          </div>
          <p class="text">GSC</p>
        </div>
        <div class="sale" @click="goChange('2')">
          <p class="text">GSC</p>
          <div class="center">
            <i class="ico ico-n1"></i>
            <span>兑换</span>
          </div>
          <p class="text active">通贝</p>
        </div>
      </div>
    </KPublish>

    <KFooter :tag="3" ref="footer"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import KFooter from '@/components/KFooter'
  import KPublish from '@/components/KPublish'
  import * as api from '@/api/index'
  import {doSend} from '../assets/js/dom'
  import axios from 'axios'
  import {mapGetters} from 'vuex'

  export default {
    name: "AllList",
    components: {
      KFooter,
      KPublish
    },
    data() {
      return {
        selected: 0,
        isRequest: true,
        list: [
          {
            title: '综合',
          },
          {
            title: 'GSC',
          }
        ],
        showChange: false,
        tickers: [],
        sendData: [],
        rate: 0
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo']),
    },
    created() {
      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }

      this.initData()

    },
    mounted() {
      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    destroyed() {
      this.c = true
      this.marketSocket.close()
    },
    methods: {
      changeText(str) {
        let len = str.indexOf('_')
        return str.substring(0, len).toLocaleUpperCase()
      },
      initData() {
        axios.get('http://gapi.chajiedianshang.com/proxy/request/exchange_rate').then((res) => {
          this.rate = res.data.rate
        })
        axios.get('http://gapi.chajiedianshang.com/proxy/request/tickers').then((res) => {
          this.tickers = this.dealwith(res.data.tickers)

          for (let i = 0, len = this.tickers.length; i < len; i++) {
            this.sendData.push(`{'event':'addChannel','channel':'ok_sub_spot_${this.tickers[i].symbol}_ticker'}`)
          }

          this.initWebsocket()

        })

      },
      initWebsocket() {
        const self = this
        const marketSocketUrl = 'wss://okexcomreal.bafang.com:10441/websocket';//websocket地址
        this.marketSocket = new WebSocket(marketSocketUrl);

        this.marketSocket.onopen = this.websocketonopen

        this.marketSocket.onmessage = this.websocketonmessage

        this.marketSocket.onclose = function (evt) {
          console.log('close')
          if (!self.c) {
            self.initWebsocket()
          }
        };
        this.marketSocket.onerror = function (evt) {
          console.log('errror')
          self.initWebsocket()
        };
      },
      websocketonopen(evt) {
        console.log('OK')
        const self = this

        if (this.sendData.length > 1) {
          self.marketSocket.send(`[${this.sendData}]`);
        }

      },
      websocketonmessage(evt) {

        this.Kdata = JSON.parse(evt.data)

        // console.log(this.Kdata)
        for (let i = 0, len = this.tickers.length; i < len; i++) {
          if (this.Kdata[0].channel === `ok_sub_spot_${this.tickers[i].symbol}_ticker`) {
            // console.log(this.Kdata[0].data.open)
            // console.log(this.Kdata[0].data.change)
            this.tickers[i].last = this.Kdata[0].data.last
            this.tickers[i].open = this.Kdata[0].data.open
            this.tickers[i].change = this.Kdata[0].data.change
          }

        }

      },
      toKChart(name) {
        this.$router.push({path: '/KCharts', query: {name: name}})
      },
      dealwith(tickers) {
        const data = []

        for (let i = 0; i < tickers.length; i++) {
          if (tickers[i].symbol.indexOf('usdt') !== -1 && tickers[i].symbol.indexOf('gsc') === -1) {
            data.push(tickers[i])
          }

        }
        return data
      },
      getStyle(ticker, i) {
        // if()
        if (ticker.change) {
          if ((ticker.change / ticker.open) < 0) {
            return 'item down'
          }

          if ((ticker.change / ticker.open) > 0) {
            return 'item up'
          }
        }

        return 'item'
      },
      change(index) {
        if (this.selected === index) {
          return
        }
        this.selected = index
        if (this.selected === 1) {
          this.$router.push('/Market')
        }
      },
      goChange(num) {
        if (num === '1') {
          this.$router.push('/ExchangeKCI')
        }
        if (num === '2') {
          this.$router.push('/ExchangeKTong')
        }
      },
      toChange() {
        this.showChange = !this.showChange
      },
      refresh(done) {
        done()
      },
      loading(done) {
        if (this.isRequest) {
          done()
          return
        }
        setTimeout(() => {
          done()
        }, 300)
      },
      setTableHeight() {
        const headHeight = 0
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('jiantou@2x');
  }

  .ico-n2 {
    .bg-image('trend_rise@2x');
  }

  .ico-n3 {
    .bg-image('trend_fall@2x');
  }

  /*.scroller {*/
  /*margin-top: 7rem;*/
  /*}*/

  .box1 {
    .all-center();
    .sale {
      width: 13rem;
      height: 3.5rem;
      background: @white-color;
      border-radius: .5rem;
      margin-bottom: 1rem;
      display: flex;
      text-align: center;
      line-height: 3.5rem;
      .center {
        //.flex-center();
        flex: 1;
        margin-top: .7rem;
        height: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        i {
          flex: 0 0 1rem;
          width: 2rem;
          height: 1rem;
        }
        span {
          /*flex: 1;*/
          line-height: 1rem;
          font-size: @font-xs;
          color: #bdbdbd;
        }
      }
      .text {
        //.flex-center();
        flex: 0 0 3rem;
        font-size: @font-xm;
        color: @text-color;
      }
      .text:first-child {
        text-align: right;
      }
      .text:last-child {
        text-align: left;
      }
      .active {
        color: @primary-active;
      }
    }
  }

  .Market {
    width: 100%;
    height: 100%;
    background: @white-color;
    .m-top {
      position: sticky;
      top: 0;
      left: 0;
      box-sizing: border-box;
      height: 2.5rem; // 44 + 20 : top, 98 : bottom
      background: #1c1c1c;
      // border-bottom: 1px solid @border-color;
      color: #fff;
      z-index: 52;
      .title {
        line-height: 2.7rem;
        text-align: center;
        color: #fff;
        font-size: @font-s;
      }
    }
    .bgImg {
      /*margin-top: 2.5rem;*/
      position: relative;
      width: 100%;
      height: 6rem;
      background-image: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer@2x.1ce104f.png");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .tab {
      position: absolute;
      top: 2.5rem;
      left: 60%;
      transform: translateX(-50%);
      width: 66%;
      ul {
        /*column-count: 3;*/
        color: @primary-active;
        font-size: @font-s;
        overflow: hidden;
        .tabItem {
          /*-webkit-column-break-inside: avoid;*/
          /*height: 100%;*/
          /*overflow: auto; //兼容火狐 break-inside:avoid;*/
          width: 25%;
          height: .8rem;
          float: left;
          text-align: center;
          padding: .3rem .5rem;
          border: 1px solid @primary-active;
          border-radius: 3px;
          /*margin-bottom: 1px;*/
        }
        .tabItem:first-child {
          border-radius: 5px 0 0 5px;
        }
        .tabItem:last-child {
          border-radius: 0 5px 5px 0;
        }
        .active {
          background: @primary-active;
          color: @text-color;
        }
      }
    }
    .content {
      font-size: @font-s;
      margin-bottom: 1rem;
      .title {
        padding: .5rem;
        display: flex;
        color: @gray-color;
        background: #f2f2f2;
        .name {
          flex: 1;
        }
        .price {
          flex: 0 0 1.5rem;
        }
      }
      .items {
        background: @white-color;
        padding: 0 .5rem;
        .item {
          display: flex;
          padding: .5rem 0;
          height: 3rem;
          transition-property: background-color;
          transition-duration: 0.3s;
          transition-timing-function: ease;
          .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 30%;
            .name {
              padding: .3rem 0 .6rem 0;
            }
            .state {
              display: flex;
              i {
                width: .8rem;
                height: 1rem;
              }
              .text {
                margin-left: .2rem;
                color: #b2b2b2;
                .up {
                  color: green;
                }
                .down {
                  color: red;
                }
              }
            }
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: right;
            width: 70%;
            p {
              padding-top: .4rem;
            }
            .money {
              flex: 1;
            }
            .rmb {
              flex: 1;
              color: #b2b2b2;
              font-size: .7rem;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
        }
        .red {
          /*background-color: red;*/
          animation: redChange 1s;
        }
        .green {
          /*background-color: green;*/
          animation: greenChange 1s;
        }
        .paused {
          animation-play-state: paused;
        }
      }
    }
    .bg-btn {
      width: 8rem;
      height: 1.5rem;
      background-color: #3c9cff;
      box-shadow: 0px 8px 8px 0px rgba(95, 197, 255, 0.2);
      border-radius: 2rem;
      text-align: center;
      margin: 0 auto;
      .text {
        font-size: @font-s;
        color: @white-color;
        line-height: 1.5rem;
      }
    }
    .space {
      height: 11rem;
    }
  }

  @keyframes redChange {
    0% {
      background: white;
    }
    50% {
      background: #ef232a;
    }
    100% {
      background: white;
    }
  }

  @keyframes greenChange {
    0% {
      background: white;
    }
    50% {
      background: #14b143;
    }
    100% {
      background: white;
    }
  }
</style>
