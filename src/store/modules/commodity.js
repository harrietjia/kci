import * as types from '../types'
import * as api from '@/api'

const state = {
  appraiseList: [],
  appraiseCount: 0,
  appraiseTotal: 0,
  collectList: [],
  collectCount: 0,
  commodityList: [],
  commodityCount: 0,
  orders: {},
  hotel: {},
}
const getters = {
  appraiseList: state => state.appraiseList,  //商品评价
  appraiseCount: state => state.appraiseCount,
  appraiseTotal: state => state.appraiseTotal,
  collectList: state => state.collectList,  //收藏列表
  collectCount: state => state.collectCount,
  commodityList: state => state.commodityList,  //商城的商品列表
  commodityCount: state => state.commodityCount,
  orders: state => state.orders,
  hotel: state => state.hotel,
}
const actions = {
  hotel({commit}, opt) {
    return api.getHotel(opt).then(res => {
      const item = res.data
      commit(types.RECEIVE_HOTEL_DETAIL, {item})
    })
  },
  delGood({commit, state}, opt) {
    return api.delGood(opt)
  },
  confirmOrder({commit, state}, opt) {
    return api.confirmOrder(opt)
  },
  getAppraiseList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getAppraise(opt).then(res => {
      const list = res.data.goods_appraise_list
      const total = res.data.total
      if (opt.page === 1) {
        commit(types.RECEIVE_APPRAISE_LIST, {list, total})
      } else if (opt.page > 1) {
        commit(types.PUSH_APPRAISE_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_APPRAISE_COUNT, {count: state.appraiseCount + 1})
      } else if (isRefresh) {
        commit(types.SET_APPRAISE_COUNT, {count: 1})
      }
    })
  },
  getCollectList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getCollect(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_COLLECT_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_COLLECT_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_COLLECT_COUNT, {count: state.collectCount + 1})
      } else if (isRefresh) {
        commit(types.SET_COLLECT_COUNT, {count: 1})
      }
    })
  },
  getCommodityList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getGoodsList(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_COMMODITY_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_COMMODITY_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_COMMODITY_COUNT, {count: state.commodityCount + 1})
      } else if (isRefresh) {
        commit(types.SET_COMMODITY_COUNT, {count: 1})
      }
    })
  },
  getOrdersDetail({commit, state}, opt) {
    return api.getUserOrder(opt).then(res => {
      const order = res.data
      commit(types.RECEIVE_ORDERS, {order})
    })
  },
}
const mutations = {
  [types.RECEIVE_APPRAISE_LIST](state, {list, total}) {
    state.appraiseList = list
    state.appraiseTotal = total
  },
  [types.SET_APPRAISE_COUNT](state, {count}) {
    state.appraiseCount = count
  },
  [types.PUSH_APPRAISE_LIST](state, {list}) {
    state.appraiseList = state.appraiseList.concat(list)
  },
  CHANGE_APPRAISE(state, {comment}) {
    for (let c of state.appraiseList) {
      if (c.goods_appraise_id === comment.goods_appraise_id) {
        c.is_like = comment.like
        if (c.is_like === 1) {
          c.like_count = Number(c.like_count) + 1
        } else {
          c.like_count = Number(c.like_count) - 1
        }

      }
    }
  },
  [types.RECEIVE_COLLECT_LIST](state, {list}) {
    state.collectList = list
  },
  [types.SET_COLLECT_COUNT](state, {count}) {
    state.collectCount = count
  },
  [types.PUSH_COLLECT_LIST](state, {list}) {
    state.collectList = state.collectList.concat(list)
  },
  [types.RECEIVE_HOTEL_DETAIL](state, {item}) {
    state.hotel = item
  },
  [types.RECEIVE_COMMODITY_LIST](state, {list}) {
    state.commodityList = list
  },
  [types.SET_COMMODITY_COUNT](state, {count}) {
    state.commodityCount = count
  },
  [types.PUSH_COMMODITY_LIST](state, {list}) {
    state.commodityList = state.commodityList.concat(list)
  },
  [types.RECEIVE_ORDERS](state, {order}) {
    state.orders = order
  },
  [types.DEL_ORDER](state, {id}) {
    state.ordersList = state.ordersList.filter(val => val.parent_order_id != id)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
