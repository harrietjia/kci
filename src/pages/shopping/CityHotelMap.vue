<template lang="html">
  <div class="wrapper">
    <div class="head">
      <i class="ico ico-back" @click="back"></i>
      <form action="#" onsubmit="return false;" class="input-kw-form">
        <input type="text" style="display:none;"/>
        <input
          type="search"
          class="form-input"
          v-model="keyword"
          placeholder="搜索附近商家"
          @keyup.enter.prevent="search"
        >
      </form>
    </div>

    <div class="map" id="allMap"></div>
    <!--v-show="showCard"-->
    <div class="shop-card">
      <ul>
        <sellerItem
          v-for="(h,idx) in hotel"
          :seller="h"
          :score="h.score"
          @touchShop="touchShop"
          :key="idx"
        ></sellerItem>
      </ul>

    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import BMap from 'BMap'
  import * as api from '@/api/index'
  import sellerItem from '@/components/sellerItem'

  export default {
    name: 'CityHotelMap',
    components: {
      sellerItem
    },
    data() {
      return {
        keyword: '',
        latitude: '',
        longitude: '',
        address: '',
        name: '',
        hotel: [],
      }
    },
    created() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    mounted() {
      // this.loadMap()

      this.ready()
    },
    computed: {
      ...mapGetters([
        'allHotels',
        'location',
        'checkinDate',
        'checkoutDate',
        'pageList',
      ]),
      showCard() {
        if (Object.keys(this.hotel).length > 0) return true
        return false
      },
    },
    methods: {
      back() {
        if (this.pageList.length <= 2) {
          this.$router.push('/Home')
        } else {
          this.$router.go(-1)
        }
      },
      search() {
        this.map1.clearOverlays();
        this.$loading()
        this.getSeller(this.map1, this.longitude, this.latitude, this.keyword)
        let input = document.querySelector('.form-input')
        input.blur()
        input.addEventListener('keydown', function (e) {
          let keywd = e.target.value;
          if (event.keyCode == 13 && keywd) {
            e.preventDefault();
          }
        });
      },
      ready() {
        const self = this
        const map = new BMap.Map("allMap");
        this.map1 = map
        map.centerAndZoom(new BMap.Point(113.411835, 23.129713), 17);
        map.enableScrollWheelZoom(true)
        map.enableDragging()

        map.addEventListener('dragend', function () {
          self.$loading()
          //获得移动之后地图中心点的像素位置
          let pixel = map.pointToOverlayPixel(map.getCenter());

          //获得定位图标所在位置在地图上的地理位置，实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处
          let Point = map.overlayPixelToPoint({x: pixel.x, y: pixel.y});
          self.getSelf(map, Point)
          self.getSeller(map, Point.lng, Point.lat);
        });

        const geolocation = new BMap.Geolocation();
        this.$loading()
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            self.getSelf(map, r.point)

            // self.getSeller(map, '113.411835', '23.129713')
            self.getSeller(map, self.longitude, self.latitude)

            console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
          }
          else {
            console.log('failed' + this.getStatus());
          }
        }, {enableHighAccuracy: true})

        // 添加带有定位的导航控件
        const navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        });
        map.addControl(navigationControl);
        // 添加定位控件
        const geolocationControl = new BMap.GeolocationControl();
        geolocationControl.addEventListener("locationSuccess", function (e) {
          self.$loading()
          // 定位成功事件
          self.getSelf(map, e.point)
          self.getSeller(map, e.point.lng, e.point.lat)

          // console.log(e);
        });
        geolocationControl.addEventListener("locationError", function (e) {
          // 定位失败事件
          console.log(e.message);
        });
        map.addControl(geolocationControl);              // 将标注添加到地图中
      },
      getSelf(map, point) {
        map.clearOverlays();
        let myIcon = new BMap.Icon('http://ffun-dev.oss-cn-hangzhou.aliyuncs.com/dev-kci-pic/351533634486703icon_positioning@2x.png', new BMap.Size(50, 50));
        const mk = new BMap.Marker(point, {icon: myIcon});
        map.addOverlay(mk);
        map.panTo(point);
        this.longitude = point.lng
        this.latitude = point.lat
      },
      getSeller(map, lng, lat, keyWord = '', distance = '2000') {
        const self = this

        api.nearbyStore({
          'longitude': lng,
          'latitude': lat,
          'search': keyWord,
          'distance': distance,
        }).then((res) => {
          self.hotel = res.data
          var points = self.hotel.map(function (item) {
            return new BMap.Point(item.longitude, item.latitude);
          });

          for (let i = 0, len = points.length; i < len; i++) {
            // 编写自定义函数,创建标注
            let myIcon = new BMap.Icon('http://ffun-dev.oss-cn-hangzhou.aliyuncs.com/dev-kci-pic/351533635283915icon_merchants@2x.png', new BMap.Size(30, 30));
            let marker = new BMap.Marker(points[i], {icon: myIcon});
            map.addOverlay(marker);

            let label = new BMap.Label(self.hotel[i].factory_store_name, {offset: new BMap.Size(20, -10)});
            label.setStyle({
              color: "#000",
              fontSize: "14px",
              backgroundColor: "0.05",
              border: "0",
            });
            marker.setLabel(label);
          }

          self.$loading(0)

        })
      },
      touchShop(hotel) {
        // this.$loading()
        const opt = {
          'factory_store_id': hotel.factory_store_id,
          // 'longitude': this.longitude,
          // 'latitude': this.latitude,
        }
        // this.$store.dispatch('hotel', opt).then(res => {
        //   this.$loading(0)
        this.$router.push({path: '/Seller', query: opt})
        // }).catch(err => this.$loading(0))
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-time {
    .bg-image('ic_time@2x');
    width: .7rem;
    height: .7rem;
    margin: 3px;
  }

  .ico-address {
    .bg-image('icon_place@2x');
    width: 1rem;
    height: 1rem;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2.5rem;
    background: #1c1c1c;
    border-bottom: 1px solid @border-color;
    .ico-back {
      flex: 0 0 2rem;
      width: .8rem;
      height: .8rem;
      .bg-image('back_white');
    }
    .input-kw-form {
      display: flex;
      width: 75%;
      height: 1.5rem;
      background: #EEEEEE;
      border-radius: 20px;
      padding: 0 1rem;
      margin: 0 .5rem;
    }
    .form-input {
      align-self: center;
      width: 98%;
      background: #EEEEEE;
      font-size: @font-s;
      border: none;
      &:focus {
        outline: none;
      }
    }
  }

  .map {
    width: 100%;
    height: 43%;
  }

  .shop-card {
    margin: 0 .5rem;
    font-size: @font-xs;
    li {
      display: flex;
      padding: .5rem 0;
      border-bottom: 1px solid @border-color;
      .img-box {
        flex: 0 0 4rem;
        display: inline-block;
        border-radius: 10px;
        .box-img(4rem, 4rem);
        /*margin-left: .5rem;*/
        /*background: red;*/
        img {
          border-radius: 10px;
          width: 100%;
          height: 100%;
        }
      }
      .right {
        flex: 1;
        margin-left: .5rem;
        .lineHeight {
          min-height: 1.1rem;
          line-height: 1.1rem;
        }
        .title {
          font-size: .8rem;
          margin-bottom: .3rem;
          /*font-weight: bold;*/
        }
        .address {
          color: #39b2ff;
          line-height: .7rem;
          .gray {
            color: #878787;
            margin: 0 .3rem;
          }
          .road {
            display: inline-block;
            width: 7rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        .star {
          color: #878787;
          margin-left: 3px;
          vertical-align: center;
          .num {
            margin-left: .6rem;
          }
        }
        .time {
          color: #878787;
        }
      }
    }
    .star {
      padding: 0;
      /*text-align: center;*/
      i {
        display: inline-block;
        vertical-align: middle;
        width: .7rem;
        height: .7rem;
      }
    }
  }
</style>
