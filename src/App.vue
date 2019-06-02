<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {mapGetters} from 'vuex'

  export default {
    name: 'app',
    data() {
      return {
        transitionName: 'slide-left'
      }
    },
    created() {
      // const url = location.pathname == '/' ? `${location.href}Home` : location.href
      // this.$store.dispatch('weixin', {
      // 	'url': url
      // }).then(res => {
      // 	this.$nextTick(() => this.ready())
      // })

      this.$store.dispatch('getLoginStore')
    },
    watch: {
      ['$route'](to, from) {
        const flag = ~this.pageList.indexOf(to.name)
        this.transitionName = flag ? 'slide-right' : 'slide-left'
        this.$store.commit('SET_PAGE', {
          page: to.name
        })

        const url = location.pathname == '/' ? `${location.href}Home` : location.href
        this.$store.dispatch('weixin', {
        	'url': url
        }).then(res => {
        	this.$nextTick(() => this.ready())
        })
      }
    },
    computed: {
      ...mapGetters(['pageList', 'weixinData'])
    },
    methods: {
      ready() {
      	const self = this
      	wx.config({
      		debug: false,
      		appId: self.weixinData.appid,
      		timestamp: self.weixinData.timestamp,
      		nonceStr: self.weixinData.noncestr,
      		signature: self.weixinData.signature,
      		jsApiList: [
      			'scanQRCode',
      			'onMenuShareTimeline',
      			'onMenuShareAppMessage',
      			'onMenuShareQQ',
      			'onMenuShareWeibo',
      			'chooseImage',
      			'uploadImage',
      			'getLocalImgData',
      		]
      	});
      	wx.ready(function() {
      		wx.checkJsApi({
      			jsApiList: [
      				'scanQRCode',
      				'onMenuShareTimeline',
      				'onMenuShareAppMessage',
      				'onMenuShareQQ',
      				'onMenuShareWeibo',
      				'chooseImage',
      				'uploadImage',
      				'getLocalImgData',
      			]
      		});
      		// const BASE_URL = window.location.origin + '/'
      		// const path = 'images/login_logo.png'
      		// const opt = {
      		// 	title: 'gsc',
      		// 	link: window.location.href,
      		// 	imgUrl: process.env.NODE_ENV === 'production' ? `${BASE_URL}${path}` : `http://dev-kci.ffun360.com/${path}`,
      		// 	desc: 'gsc',
      		// }
      		// wx.onMenuShareTimeline(opt)
      		// wx.onMenuShareAppMessage(opt)
      		// wx.onMenuShareQQ(opt)
      		// wx.onMenuShareWeibo(opt)
      	});
      },
    }
  }
</script>

<style lang="css">
  /* * {
    touch-action: none;
  } */

  #app {
    position: relative;
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .loading-layer {
    height: 0 !important;
  }

  .area_ctrl {
    position: fixed !important;
  }

  .child-view {
    position: absolute;
    transition: all .3s cubic-bezier(.55, 0, .1, 1);
  }

  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    transform: translate(30%, 0);
  }

  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    transform: translate(-30%, 0);
  }
</style>
