import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'

//注册插件
import loading from './plugins/loading'
import imgBox from './plugins/imgBox'
import toast from './plugins/toast/toast.js'
import validator from './plugins/validator/validator.js'
import message from './plugins/message/message.js'
import dialog from './plugins/dialog/dialog.js'
//第三方工具
import VueScroller from 'vue-scroller'
import echarts from 'echarts'
import './utils/init'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n) // 通过插件的形式挂载
const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./assets/lang/zh'),   // 中文语言包
    'en-US': require('./assets/lang/en')    // 英文语言包
  }
})
//全局样式
import 'swiper/dist/css/swiper.css'
import '@/assets/styles/base.css'
import '@/assets/styles/layout.less'
// import '@/assets/js/rem.js'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(toast)
Vue.use(loading)
Vue.use(VueScroller)
Vue.use(imgBox)
Vue.use(dialog)
Vue.use(validator)
Vue.use(message)

new Vue({
	el: '#app',
  i18n,
	router,
	store,
	components: { App },
	template: '<App/>'
})
