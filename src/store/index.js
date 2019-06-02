import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '@/api'
import * as types from './types'
import commodity from './modules/commodity'
import goods from './modules/goods'
import mine from './modules/mine'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  timeInfo: null,
	loginInfo: null,
	userInfo: null,
	pageList: ['Home'],
	weixinData: {},
}

const getters = {
  timeInfo: state => state.timeInfo,
	loginInfo: state => state.loginInfo,
	userInfo: state => state.userInfo,
	pageList: state => state.pageList,
	weixinData: state => state.weixinData,
}

const actions = {
  getTimeStore({ commit }) {
    const data = localStorage.getItem('timeInfo')
    if (data === 'undefined' || !data) return
    const timeInfo = JSON.parse(data)
    commit(types.SET_TIME_INFO, { timeInfo })
  },
  setTimeStore({ commit }, timeInfo) {
    const data = JSON.stringify(timeInfo)
    localStorage.setItem('timeInfo', data)
    commit(types.SET_TIME_INFO, { timeInfo })
  },
	getLoginStore({ commit }) {
		const data = localStorage.getItem('loginInfo')
		if (data === 'undefined' || !data) return
		const loginInfo = JSON.parse(data)
		commit(types.SET_LOGIN_INFO, { loginInfo })
	},
	setLoginStore({ commit }, loginInfo) {
		const data = JSON.stringify(loginInfo)
		localStorage.setItem('loginInfo', data)
		commit(types.SET_LOGIN_INFO, { loginInfo })
	},
	clearLoginStore({ commit }) {
		localStorage.removeItem('loginInfo')
    localStorage.removeItem('timeInfo')
		commit(types.CLEAR_LOGIN_INFO)
    commit(types.CLEAR_TIME_INFO)
	},
	getUserInfo({ commit }) {
		// const data = localStorage.getItem('userInfo')
		// if (data === 'undefined' || !data) return
		const userInfo = JSON.parse(data)
		commit(types.SET_USER_INFO, { userInfo })
	},
	setUserInfo({ commit }, userInfo) {
		const data = JSON.stringify(userInfo)
		// localStorage.setItem('userInfo', data)
		commit(types.SET_USER_INFO, { userInfo })
	},
	clearUserInfo({ commit }) {
		localStorage.removeItem('userInfo')
		commit(types.CLEAR_USER_INFO)
	},
	weixin({ commit }, opt) {
		return api.getWeixin(opt).then(res => {
			const data = res.data
			commit(types.RECEIVE_WEIXIN_DATA, { data })
		})
	},

}

const mutations = {
  [types.SET_TIME_INFO](state, { timeInfo }) {
    state.timeInfo = timeInfo
  },
  [types.CLEAR_TIME_INFO](state) {
    state.timeInfo = null
  },
	[types.SET_LOGIN_INFO](state, { loginInfo }) {
		state.loginInfo = loginInfo
	},
	[types.CLEAR_LOGIN_INFO](state) {
		state.loginInfo = null
	},
	[types.SET_USER_INFO](state, { userInfo }) {
		state.userInfo = userInfo
	},
	[types.CLEAR_USER_INFO](state) {
		state.userInfo = null
	},
	[types.SET_PAGE](state, { page }) {
		const index = state.pageList.indexOf(page)
		if (index < 0) {
			state.pageList.push(page)
			return
		}
		const list = state.pageList.slice(0, index)
		list.push(page)
		state.pageList = list
	},
	[types.RECEIVE_WEIXIN_DATA](state, { data }) {
		state.weixinData = data
	}
}

const store = new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	strict: debug,
	modules: {
    commodity,
		goods,
		mine,
		user,
	}
})

// vuex 热重载
if (module.hot) {
	module.hot.accept([
    './modules/commodity',
		'./modules/goods',
		'./modules/mine',
		'./modules/user',
	], () => {
    const newCommodity = require('./modules/commodity').default
		const newGoods = require('./modules/goods').default
		const newMine = require('./modules/mine').default
		const newUser = require('./modules/user').default
		store.hotUpdate({
			modules: {
        commodity: newCommodity,
				goods: newGoods,
				mine: newMine,
				user: newUser,
			}
		})
	})
}

export default store
