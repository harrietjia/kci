<template>
  <div class="kchart">
    <div class="m-top">
      <i class="ico ico-back" @click="back"></i>
      <p class="title">{{changeText(BTC)}}</p>
    </div>

    <div class="head">
      <div class="left">
        <p class="price">${{ticker.last || 0}}</p>
        <p>开盘：${{ticker.open || ticker.last || 0}}</p>
        <p>收盘：${{ticker.close || ticker.last || 0}}</p>
        <p class="state">成交量： {{ticker.vol || 0}}</p>
      </div>
      <div class="right">
        <p>最高 <span>{{ticker.high || 0}}</span></p>
        <p>买一 <span>{{ticker.buy || 0}}</span></p>
        <p>最低 <span>{{ticker.low || 0}}</span></p>
        <p>卖一 <span>{{ticker.sell || 0}}</span></p>
      </div>
    </div>

    <div class="tab-wrapper" ref="tabWrapper">
      <ul class="tab-list" ref="tabList">
        <li @click="changeTime(tab,i)" :class="selected === i ? 'tab-item tab' : 'tab-item'" v-for="(tab ,i) of tabs">
          {{tab}}
        </li>
      </ul>
    </div>

    <div id='myChart' style='width：13rem;height:22rem'></div>

    <div class="bg-btn" v-if="BTC === 'btc_usdt' || BTC === 'eth_usdt'" @click="toChange()">
      <p class="text">兑换</p>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import * as api from '@/api/index'
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import BScroll from 'better-scroll'

  export default {
    name: "KCharts",
    data() {
      return {
        selected: 1,
        data: [],
        Kdata: [],
        ticker: {},
        tabs: ['分时', '1分钟', '3分钟', '5分钟', '15分钟', '30分钟', '1小时', '2小时', '4小时', '6小时', '12小时', '1天', '1周'],
        BTC: 'btc_usdt',
        TIME: '1min'
      }
    },
    created() {
      this.BTC = this.$route.query.name
      if (!this.BTC) {
        this.$router.push('/Home')
        return
      }
      this.initData()
      this.initTicker()
      this.initWebsocket()
    },
    mounted() {
      this._initTabs()
      this.drawLine(95, 100)
    },
    destroyed() {
      this.c = true
      this.marketSocket.close()
    },
    computed: {
      ...mapGetters(['pageList'])
    },
    methods: {
      toChange() {
        let opt = {
          name: this.$route.query.name
        }
        this.$router.push({path: '/ExchangeAll', query: opt})
      },
      changeText(str) {
        let len = str.indexOf('_')
        return str.substring(0, len).toLocaleUpperCase()
      },
      back() {
        if (this.pageList.length <= 2) {
          this.$router.push('/Home')
        } else {
          this.$router.go(-1)
        }
      },
      _initTabs() {
        if (this.tabs) {
          let tabWidth = 50;
          let margin = 15;
          let width = (tabWidth + margin) * this.tabs.length + margin;
          this.$refs.tabList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.tabScroll) {
              this.tabScroll = new BScroll(this.$refs.tabWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.tabScroll.refresh();
            }
          });
        }
      },
      changeTime(tab, i) {
        const list = ['分时', '1min', '3min', '5min', '15min', '30min', '1hour', '2hour', '4hour', '6hour', '12hour', 'day', 'week']

        if (this.selected === i) {
          return
        }

        this.selected = i

        if (this.selected === 0) {
          this.TIME = '1min'
        } else {
          this.TIME = list[i]
        }
        this.marketSocket.close()
        this.initData()
        if (this.marketSocket.readyState === 3) { //判断是否已经关闭连接
          this.initWebsocket()
        }
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
        this.marketSocket.send(`{'event':'addChannel','channel':'ok_sub_spot_${this.BTC}_ticker'}`);
        this.marketSocket.send(`{'event':'addChannel','channel':'ok_sub_spot_${this.BTC}_kline_${this.TIME}'}`);
      },
      websocketonmessage(evt) {

        this.Kdata = JSON.parse(evt.data)
        if (this.Kdata[0].channel === `ok_sub_spot_${this.BTC}_kline_${this.TIME}`) {
          // this.myChart.clear()
          if (this.selected === 0) {
            this.drawLine1(95, 100)
          } else {
            this.drawLine2()
          }
        }
        if (this.Kdata[0].channel === `ok_sub_spot_${this.BTC}_ticker`) {
          this.ticker = this.Kdata[0].data
        }

      },
      timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return Y + M + D + h + m;
      },
      initTicker() {
        axios.get(`http://gapi.chajiedianshang.com/proxy/request/ticker?symbol=${this.BTC}`).then((res) => {
          this.ticker = res.data.ticker
        })
      },
      initData() {

        axios.get(`http://gapi.chajiedianshang.com/proxy/request/kline?symbol=${this.BTC}&type=${this.TIME}&size=500`).then((res) => {
          this.data = splitData(res.data);
          this.myChart.clear()
          if (this.selected === 0) {
            this.drawLine1(95, 100)
          } else {
            if (this.TIME === 'week') {
              this.drawLine(20, 100)
            } else {
              this.drawLine(95, 100)
            }
          }

        })

        function timestampToTime(timestamp) {
          var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          let D = date.getDate() + ' ';
          let h = date.getHours() + ':';
          let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
          return Y + M + D + h + m;
        }

        function splitData(rawData) {
          var categoryData = [];
          var values = [];
          var vols = [];
          // var macds = [];
          // var difs = [];
          // var deas = [];
          for (var i = 0; i < rawData.length; i++) {
            categoryData.push(timestampToTime(rawData[i].splice(0, 1)[0] / 1000));
            values.push(rawData[i])
            vols.push(rawData[i][4]);
            // macds.push(rawData[i][6]);
            // difs.push(rawData[i][7]);
            // deas.push(rawData[i][8]);
          }
          var Ydata = values.map(function (item) {
            return [item[0], item[3], item[2], item[1], item[4]];
          });

          return {
            categoryData: categoryData,
            values: Ydata,
            vols: vols,
            // macds: macds,
            // difs: difs,
            // deas: deas
          };
        }
      },
      drawLine(start, end) {
        // 基于准备好的dom，初始化echarts实例
        if (this.Kdata.length !== 1) {
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
        }
        //显示加载动画
        this.myChart.showLoading();

        // 绘制图表
        //数据模型 time0 open1 close2 min3 max4 vol5 tag6 macd7 dif8 dea9
        //['2015-10-19',18.56,18.25,18.19,18.56,55.00,0,-0.00,0.08,0.09]

        const self = this

        if (this.data.length !== 0) {
          this.myChart.hideLoading(); //隐藏加载动画
        }

        this.myChart.setOption({
          backgroundColor: '#21202D',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            }
          },
          grid: [{
            left: '3%',
            top: '1%',
            height: '60%'
          }, {
            left: '3%',
            right: '10%',
            top: '70%',
            height: '10%'
          }, {
            left: '3%',
            right: '10%',
            top: '78%',
            height: '0%'
          }],
          xAxis: [{
            type: 'category',
            data: this.data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white',
              // }
            },
            axisLabel: {
              color: 'white',
            },
            splitLine: {
              show: false
            },
            splitNumber: 20
          }, {
            type: 'category',
            gridIndex: 1,
            data: this.data.categoryData,
            axisLabel: {
              show: false
            },

          }, {
            type: 'category',
            gridIndex: 2,
            data: this.data.categoryData,
            axisLabel: {
              show: false
            },
          }
          ],
          yAxis: [{
            scale: true,
            splitArea: {
              show: false
            },
            // axisLine: {
            //   lineStyle: {
            //     color: 'white',
            //   }
            // },
            axisLabel: {
              color: 'white',
            },
            splitLine: {
              show: false
            },
            position: 'right'
          }, {
            gridIndex: 1,
            splitNumber: 3,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white'
              // }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: 'white'
            },
            position: 'right'
          }, {
            gridIndex: 2,
            splitNumber: 4,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white'
              // }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: 'white'
            },
            position: 'right'
          }],
          dataZoom: [{
            type: 'inside',
            start: start,
            end: end,
          }, {
            show: false,
            type: 'slider',
            y: '90%',
            xAxisIndex: [0, 1],
            start: start,
            end: end
          }, {
            show: false,
            xAxisIndex: [0, 2],
            type: 'slider',
            start: start,
            end: end
          }],
          series: [{
            name: '日K',
            type: 'candlestick',
            data: this.data.values,
            itemStyle: {
              normal: {
                color: '#ef232a',
                color0: '#14b143',
                borderColor: '#ef232a',
                borderColor0: '#14b143'
              }
            },
          },
            {
              name: 'Volumn',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: this.data.vols,
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList;
                    if (self.data.values[params.dataIndex][1] > self.data.values[params.dataIndex][0]) {
                      colorList = '#ef232a';
                    } else {
                      colorList = '#14b143';
                    }
                    return colorList;
                  },
                }
              }
            },
          ]
        });

        // })

      },
      drawLine1(start, end) {
        // 基于准备好的dom，初始化echarts实例
        if (this.Kdata.length !== 1) {
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
        }
        //显示加载动画
        this.myChart.showLoading();

        // 绘制图表
        //数据模型 time0 open1 close2 min3 max4 vol5 tag6 macd7 dif8 dea9
        //['2015-10-19',18.56,18.25,18.19,18.56,55.00,0,-0.00,0.08,0.09]

        var pushdata

        if (this.Kdata.length === 1) {

          if (this.Kdata[0].channel === `ok_sub_spot_${this.BTC}_kline_${this.TIME}`) {
            pushdata = dealwith(this.Kdata[0].data)
            let length = this.data.categoryData.length

            if (this.timestampToTime(pushdata.categoryData[0] / 1000) === this.data.categoryData[length - 1]) {
              this.data.categoryData.pop()
              this.data.values.pop()
              this.data.vols.pop()
            }

            //开 高 低 收
            //open1 close2 min3 max4
            var Ydata = pushdata.values.map(function (item) {
              return [item[0], item[3], item[2], item[1], item[4]];
            });

            this.data.categoryData.push(this.timestampToTime(pushdata.categoryData[0] / 1000)) //时间
            this.data.values.push(Ydata[0]) //K线图数据
            this.data.vols.push(pushdata.vols[0]) //股票成交量
          }

        }

        function dealwith(newData) {
          var categoryData = [];
          var values = [];
          var vols = [];
          for (var i = 0; i < newData.length; i++) {
            categoryData.push(newData[i].splice(0, 1)[0]);
            values.push(newData[i])
            vols.push(newData[i][4]);
          }
          return {
            categoryData: categoryData,
            values: values,
            vols: vols,
          };
        }

        const self = this

        function calculateMA(dayCount) {
          var result = [];
          for (var i = 0, len = self.data.values.length; i < len; i++) {
            if (i < dayCount) {
              result.push('-');
              continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
              sum += Number(self.data.values[i - j][1]);
            }
            result.push(sum / dayCount);
          }
          return result;
        }

        if (this.data.length !== 0) {
          this.myChart.hideLoading(); //隐藏加载动画
        }

        this.myChart.setOption({
          backgroundColor: '#21202D',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            }
          },
          grid: [{
            left: '3%',
            top: '1%',
            height: '60%'
          }, {
            left: '3%',
            right: '10%',
            top: '70%',
            height: '10%'
          }, {
            left: '3%',
            right: '10%',
            top: '78%',
            height: '0%'
          }],
          xAxis: [{
            type: 'category',
            data: this.data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white',
              // }
            },
            axisLabel: {
              color: 'white',
            },
            splitLine: {
              show: false
            },
            splitNumber: 20
          }, {
            type: 'category',
            gridIndex: 1,
            data: this.data.categoryData,
            axisLabel: {
              show: false
            },

          }, {
            type: 'category',
            gridIndex: 2,
            data: this.data.categoryData,
            axisLabel: {
              show: false
            },
          }
          ],
          yAxis: [{
            scale: true,
            splitArea: {
              show: false
            },
            // axisLine: {
            //   lineStyle: {
            //     color: 'white',
            //   }
            // },
            axisLabel: {
              color: 'white',
            },
            splitLine: {
              show: false
            },
            position: 'right'
          }, {
            gridIndex: 1,
            splitNumber: 3,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white'
              // }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: 'white'
            },
            position: 'right'
          }, {
            gridIndex: 2,
            splitNumber: 4,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white'
              // }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: 'white'
            },
            position: 'right'
          }],
          dataZoom: [{
            type: 'inside',
            start: start,
            end: end,
          }, {
            show: false,
            type: 'slider',
            y: '90%',
            xAxisIndex: [0, 1],
            start: start,
            end: end
          }, {
            show: false,
            xAxisIndex: [0, 2],
            type: 'slider',
            start: start,
            end: end
          }],
          series: [
            {
              name: 'MA5',
              type: 'line',
              data: calculateMA(5),
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  opacity: 0.5
                }
              }
            }, {
              name: 'MA10',
              type: 'line',
              data: calculateMA(10),
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  opacity: 0.5
                }
              }
            }, {
              name: 'MA20',
              type: 'line',
              data: calculateMA(20),
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  opacity: 0.5
                }
              }
            }, {
              name: 'MA30',
              type: 'line',
              data: calculateMA(30),
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  opacity: 0.5
                }
              }
            },
            {
              name: 'Volumn',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: this.data.vols,
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList;
                    if (self.data.values[params.dataIndex][1] > self.data.values[params.dataIndex][0]) {
                      colorList = '#ef232a';
                    } else {
                      colorList = '#14b143';
                    }
                    return colorList;
                  },
                }
              }
            },
          ]
        });

        // })

      },
      drawLine2() {
        // 基于准备好的dom，初始化echarts实例
        if (this.Kdata.length !== 1) {
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
          console.log('1')
        }

        // 绘制图表

        //数据模型 time0 open1 close2 min3 max4 vol5 tag6 macd7 dif8 dea9
        //['2015-10-19',18.56,18.25,18.19,18.56,55.00,0,-0.00,0.08,0.09]

        var pushdata

        if (this.Kdata.length === 1) {

          if (this.Kdata[0].channel === `ok_sub_spot_${this.BTC}_kline_${this.TIME}`) {
            pushdata = dealwith(this.Kdata[0].data)
            let length = this.data.categoryData.length

            if (this.timestampToTime(pushdata.categoryData[0] / 1000) === this.data.categoryData[length - 1]) {
              this.data.categoryData.pop()
              this.data.values.pop()
              this.data.vols.pop()
            }

            //开 高 低 收
            //open1 close2 min3 max4
            var Ydata = pushdata.values.map(function (item) {
              return [item[0], item[3], item[2], item[1], item[4]];
            });

            this.data.categoryData.push(this.timestampToTime(pushdata.categoryData[0] / 1000)) //时间
            this.data.values.push(Ydata[0]) //K线图数据
            this.data.vols.push(pushdata.vols[0]) //股票成交量
          }

        }

        function dealwith(newData) {
          var categoryData = [];
          var values = [];
          var vols = [];
          for (var i = 0; i < newData.length; i++) {
            categoryData.push(newData[i].splice(0, 1)[0]);
            values.push(newData[i])
            vols.push(newData[i][4]);
          }
          return {
            categoryData: categoryData,
            values: values,
            vols: vols,
          };
        }

        const self = this

        function calculateMA(dayCount) {
          var result = [];
          for (var i = 0, len = self.data.values.length; i < len; i++) {
            if (i < dayCount) {
              result.push('-');
              continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
              sum += Number(self.data.values[i - j][1]);
            }
            result.push(sum / dayCount);
          }
          return result;
        }

        //显示加载动画
        // this.myChart.showLoading();

        // this.myChart.hideLoading(); //隐藏加载动画

        this.myChart.setOption({
          backgroundColor: '#21202D',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            }
          },
          grid: [{
            left: '3%',
            top: '1%',
            height: '60%'
          }, {
            left: '3%',
            right: '10%',
            top: '70%',
            height: '10%'
          }, {
            left: '3%',
            right: '10%',
            top: '78%',
            height: '0%'
          }],
          xAxis: [{
            type: 'category',
            data: this.data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white',
              // }
            },
            axisLabel: {
              color: 'white',
            },
            splitLine: {
              show: false
            },
            splitNumber: 20
          }, {
            type: 'category',
            gridIndex: 1,
            data: this.data.categoryData,
            axisLabel: {
              show: false
            },

          }, {
            type: 'category',
            gridIndex: 2,
            data: this.data.categoryData,
            axisLabel: {
              show: false
            },
          }
          ],
          yAxis: [{
            scale: true,
            splitArea: {
              show: false
            },
            // axisLine: {
            //   lineStyle: {
            //     color: 'white',
            //   }
            // },
            axisLabel: {
              color: 'white',
            },
            splitLine: {
              show: false
            },
            position: 'right'
          }, {
            gridIndex: 1,
            splitNumber: 3,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white'
              // }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: 'white'
            },
            position: 'right'
          }, {
            gridIndex: 2,
            splitNumber: 4,
            axisLine: {
              onZero: false,
              // lineStyle: {
              //   color: 'white'
              // }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: 'white'
            },
            position: 'right'
          }],
          dataZoom: [{
            type: 'inside',
            maxSpan: 60
            // start: 90,
            // end: 100,
          }, {
            show: false,
            type: 'slider',
            y: '90%',
            xAxisIndex: [0, 1],
            minSpan: 60
            // start: 90,
            // end: 100
          }, {
            show: false,
            xAxisIndex: [0, 2],
            type: 'slider',
            // start: 90,
            // end: 100
          }],
          series: [{
            name: '日K',
            type: 'candlestick',
            data: this.data.values,
            itemStyle: {
              normal: {
                color: '#ef232a',
                color0: '#14b143',
                borderColor: '#ef232a',
                borderColor0: '#14b143'
              }
            },
            // markPoint: {
            //   data: [{
            //     name: 'XX标点'
            //   }]
            // },
            // markLine: {
            //   silent: true,
            //   data: [{
            //     yAxis: 2222,
            //   }]
            // }
          },
            // {
            //   name: 'MA5',
            //   type: 'line',
            //   data: calculateMA(5),
            //   smooth: true,
            //   lineStyle: {
            //     normal: {
            //       opacity: 0.5
            //     }
            //   }
            // }, {
            //   name: 'MA10',
            //   type: 'line',
            //   data: calculateMA(10),
            //   smooth: true,
            //   lineStyle: {
            //     normal: {
            //       opacity: 0.5
            //     }
            //   }
            // }, {
            //   name: 'MA20',
            //   type: 'line',
            //   data: calculateMA(20),
            //   smooth: true,
            //   lineStyle: {
            //     normal: {
            //       opacity: 0.5
            //     }
            //   }
            // }, {
            //   name: 'MA30',
            //   type: 'line',
            //   data: calculateMA(30),
            //   smooth: true,
            //   lineStyle: {
            //     normal: {
            //       opacity: 0.5
            //     }
            //   }
            // },
            {
              name: 'Volumn',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: this.data.vols,
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList;
                    if (self.data.values[params.dataIndex][1] > self.data.values[params.dataIndex][0]) {
                      colorList = '#ef232a';
                    } else {
                      colorList = '#14b143';
                    }
                    return colorList;
                  },
                }
              }
            },
            //   {
            //   name: 'MACD',
            //   type: 'bar',
            //   xAxisIndex: 2,
            //   yAxisIndex: 2,
            //   data: data0.macds,
            //   itemStyle: {
            //     normal: {
            //       color: function (params) {
            //         var colorList;
            //         if (params.data >= 0) {
            //           colorList = '#ef232a';
            //         } else {
            //           colorList = '#14b143';
            //         }
            //         return colorList;
            //       },
            //     }
            //   }
            // }, {
            //   name: 'DIF',
            //   type: 'line',
            //   xAxisIndex: 2,
            //   yAxisIndex: 2,
            //   data: data0.difs
            // }, {
            //   name: 'DEA',
            //   type: 'line',
            //   xAxisIndex: 2,
            //   yAxisIndex: 2,
            //   data: data0.deas
            // }
          ]
        });

        // })

      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .kchart {
    width: 100%;
    height: 100%;
    background: #21202D;
    color: white;
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
      .ico-back {
        position: absolute;
        top: 50%;
        left: 0.5rem;
        transform: translateY(-50%);
        width: 1.2rem;
        height: 1.2rem;
        .bg-image('back_white');
      }
      .title {
        line-height: 2.7rem;
        text-align: center;
        color: #fff;
        font-size: @font-xm;
      }
    }
    .head {
      display: flex;
      font-size: @font-s;
      margin: .5rem;
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-left: .5rem;
        font-size: @font-xs;
        .price {
          margin-bottom: .5rem;
          color: @primary-active;
          font-size: @font-xm;
        }
        .state {
        }
      }
      .right {
        flex: 1;
        font-size: @font-xs;
        align-self: center;
        text-align: right;
        margin-top: .5rem;
        p {
          display: inline-block;
          width: 2rem;
          margin-right: 1rem;
          margin-bottom: .5rem;
          span {
            width: 2rem;
          }
        }
      }
    }
    .tab-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      margin-bottom: .5rem;
      .tab-list {
        font-size: .8rem;
        margin-left: .5rem;
        .tab-item {
          display: inline-block;
          width: 50px;
          height: 1rem;
          padding-bottom: .3rem;
          margin-right: 15px;
          text-align: center;
        }
        .tab {
          color: @primary-active;
          border-bottom: 5px solid @primary-active;
        }
      }
    }
    .bg-btn {
      position: fixed;
      bottom: .3rem;
      right: .3rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: #3c9cff;
      box-shadow: 0px 8px 8px 0px rgba(95, 197, 255, 0.2);
      text-align: center;
      margin: 0 auto;
      .text {
        font-size: @font-s;
        color: @white-color;
        line-height: 2.5rem;
      }
    }
  }
</style>
