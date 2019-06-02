<template>
  <div class="Market">
    <!--<div class="m-top">-->
    <!--<p class="title">行情</p>-->
    <!--</div>-->
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

      <div class="grapeGroup" style='width：12rem;height:19.5rem;overflow:hidden'>

        <div class="grape" ref="grape1" v-show="selected === 1">
          <!--v-show="selected === 1"-->
          <div class="head"><p>行情走势图</p></div>
          <div id='myChart2' style='width：12rem;height:15rem'></div>
        </div>

        <div class="grape" ref="grape2" style="visibility:hidden; ">
          <div class="head"><p>行情走势图</p></div>
          <div id='myChart3' style='width：12rem;height:15rem'></div>
        </div>
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
  import {mapGetters} from 'vuex'

  export default {
    name: "Market",
    components: {
      KFooter,
      KPublish
    },
    data() {
      return {
        selected: 1,
        list: [
          {
            title: '综合',
          },
          {
            title: 'GSC',
          }
        ],
        showChange: false,
        XData: [],
        YData: []
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo']),
    },
    created() {
      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo')
      }
    },
    mounted() {
      // this.drawLine()

      setTimeout(() => {
        this.drawLine1()
      }, 300)

      setTimeout(() => {
        this.drawLine2()
      }, 500)

      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    methods: {
      getStyle() {
        return {'background': 'red'}
      },
      change(index) {
        if (this.selected === index) {
          return
        }
        this.selected = index

        if (this.selected === 0) {
          this.$router.push('/AllList')
        } else if (this.selected === 1) {
          this.drawLine1();
          this.$refs.grape1.style.display = 'block'
          this.$refs.grape1.style.visibility = 'visible'
          this.$refs.grape2.style.display = 'none'
        } else if (this.selected === 2) {
          this.drawLine2();
          this.$refs.grape1.style.display = 'none'
          this.$refs.grape2.style.visibility = 'visible'
          this.$refs.grape2.style.display = 'block'
        }
        // this.$nextTick(()=>{})
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart1'))
        // 绘制图表

        //显示加载动画
        myChart.showLoading();

        api.marketTrend({
          'type': 1
        }).then((res) => {
          this.XData = res.data.time
          this.YData = res.data.kci_ratio
          // console.log(this.XData)

          myChart.hideLoading(); //隐藏加载动画

          var maxN = Math.max.apply(null, this.YData);
          var minN = Math.min.apply(null, this.YData);

          if (minN - minN * 0.01 < 0) {
            minN = 1
          } else {
            minN = (minN - minN * 0.01)
          }

          maxN = maxN + (maxN * 0.01)

          // console.log(minN,'    ',maxN)

          myChart.setOption({
            title: {
              subtext: 'X轴：时间',
              text: 'Y轴：GSC价值',
              textStyle: {
                fontSize: '0.7rem',
                color: '#8bc0d6'
              },
              subtextStyle: {
                fontSize: '0.7rem'
              },
            },
            tooltip: {
              trigger: 'axis'
            },
            // toolbox: {
            //   show : true,
            //   feature : {
            //     mark : {show: true},
            //     dataView : {show: true, readOnly: false},
            //     magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            //     restore : {show: true},
            //     saveAsImage : {show: true}
            //   }
            // },
            grid: [{
              show: true,
              left: '15%'
            }],
            xAxis: {
              boundaryGap: false,
              type: 'category',
              data: this.XData
            },
            yAxis: {
              type: 'value',
              // show: false,
              splitLine: {show: false},
              // boundaryGap: false,
              min: minN.toFixed(2),
              max: maxN.toFixed(2),
              // splitNumber: '10',
            },
            series: [{
              name: '兑换率',
              type: 'line',
              data: this.YData,
              smooth: true,
              hoverAnimation: false,
              // symbol: 'rect',
              itemStyle: {
                normal: {
                  color: '#8bc0d6',
                  opacity: 0,
                }
              },
              lineStyle: {
                normal: {
                  color: '#8bc0d6',
                  type: 'solid',
                },
              },
              areaStyle: {
                normal: {
                  color: '#8bc0d6',
                  opacity: '0.5'
                }
              }
            }]
          });

        })

      },
      drawLine1() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart2'))
        // 绘制图表

        //显示加载动画
        myChart.showLoading();

        api.marketTrend({
          'type': 2
        }).then((res) => {
          this.XData = res.data.time
          this.YData = res.data.kci_ratio
          // console.log(this.XData)

          var maxN = Math.max.apply(null, this.YData);
          var minN = Math.min.apply(null, this.YData);

          if (minN - minN * 0.01 < 0) {
            minN = 1
          } else {
            minN = (minN - minN * 0.01)
          }

          maxN = maxN + (maxN * 0.01)

          myChart.hideLoading(); //隐藏加载动画

          // console.log(minN,'    ',maxN)

          myChart.setOption({
            title: {
              subtext: 'X轴：时间',
              text: 'Y轴：GSC价值',
              textStyle: {
                fontSize: '0.7rem',
                color: '#8bc0d6'
              },
              subtextStyle: {
                fontSize: '0.7rem'
              },
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: [{
              show: true,
              left: '15%'
            }],
            xAxis: {
              boundaryGap: false,
              type: 'category',
              data: this.XData
            },
            yAxis: {
              type: 'value',
              // show: false,
              splitLine: {show: false},
              // boundaryGap: false,
              // maxInterval: 0.05,
              min: minN.toFixed(2),
              max: maxN.toFixed(2),
              // splitNumber: '5',
            },
            series: [{
              name: '兑换率',
              type: 'line',
              data: this.YData,
              smooth: true,
              hoverAnimation: false,
              // symbol: 'rect',
              itemStyle: {
                normal: {
                  color: '#8bc0d6',
                  opacity: 0,
                }
              },
              lineStyle: {
                normal: {
                  color: '#8bc0d6',
                  type: 'solid',
                },
              },
              areaStyle: {
                normal: {
                  color: '#8bc0d6',
                  opacity: '0.5'
                }
              }
            }]
          });


        })

      },
      drawLine2() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart3'))
        // 绘制图表

        //显示加载动画
        myChart.showLoading();

        api.marketTrend({
          'type': 3
        }).then((res) => {
          this.XData = res.data.time
          this.YData = res.data.kci_ratio
          // console.log(this.YData)

          var Ydata = this.YData.map(function (item) {
            return [item.open, item.close, item.lowest, item.highest];
          });

          // console.log(Ydata)

          myChart.hideLoading(); //隐藏加载动画

          myChart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false,
                type: 'cross',
                lineStyle: {
                  color: '#8bc0d6',
                  width: 1,
                  opacity: 0.6
                }
              },
              formatter: function (params) {
                // [item.open, item.close, item.lowest, item.highest]
                let dates = new Date()
                let years = dates.getFullYear();
                let months = (dates.getMonth() + 1) < 10 ? ('0' + (dates.getMonth() + 1)) : (dates.getMonth() + 1);
                let days = dates.getDate() < 10 ? ('0' + dates.getDate()) : dates.getDate();
                var time = years + "-" + months + "-" + days

                if (params[0].name === time) {
                  let res1 = params[0].seriesName + '<br/>' + params[0].name;
                  res1 += '<br/>  开盘 : ' + params[0].value[1] + '<br/> 最高 : ' + params[0].value[4];
                  res1 += '<br/>  收盘 : ' + '' + '<br/> 最低 : ' + params[0].value[3];
                  return res1
                } else {
                  let res = params[0].seriesName + '<br/>' + params[0].name;
                  res += '<br/>  开盘 : ' + params[0].value[1] + '<br/> 最高 : ' + params[0].value[4];
                  res += '<br/>  收盘 : ' + params[0].value[2] + '<br/> 最低 : ' + params[0].value[3];
                  return res;
                }

              }
            },
            grid: [{
              show: true,
              // left: '5%'
            }],
            dataZoom: [{
              textStyle: {
                color: '#8392A5'
              },
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              dataBackground: {
                areaStyle: {
                  color: '#8392A5'
                },
                lineStyle: {
                  opacity: 0.8,
                  color: '#8392A5'
                }
              },
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }, {
              type: 'inside'
            }],
            xAxis: {
              type: 'category',
              boundaryGap: true,
              axisTick: {onGap: false},
              splitLine: {show: false},
              data: this.XData
            },
            yAxis: {
              type: 'value',
              scale: true,
              splitLine: {show: false}
            },
            series: [{
              name: '日K',
              type: 'candlestick',
              smooth: true,
              data: Ydata,
              itemStyle: {
                normal: {
                  color: '#ff2121',
                  color0: '#1bff12',
                  borderColor: '#ff2121',
                  borderColor0: '#1bff12'
                }
              }
            }]
          });

        })

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
        // setTimeout(() => {
        done()
        // this.$store.dispatch('marketTrend')
        // }, 300)
      },
      loading(done) {
        done()
        // this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        const footerHeight = this.$refs.footer.offsetHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
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
      left: 65%;
      transform: translateX(-50%);
      width: 85%;
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
      .title {
        padding: .5rem;
        display: flex;
        color: @gray-color;
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
          .left {
            flex: 1;
            display: flex;
            flex-direction: column;
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
                span {
                  color: green;
                }
              }
            }
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: right;
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
            }
          }
        }
      }
    }
    .grapeGroup {
      .grape {
        margin: .5rem;
        background: @white-color;
        border-radius: 5px;
        height: 18rem;
        .head {
          text-align: center;
          // border-bottom: 1px solid @gray-color;
          color: @text-color;
          font-size: @font-s;
          p {
            padding: .4rem 0;
          }
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
    .space{
      height: 4rem;
    }
  }
</style>
