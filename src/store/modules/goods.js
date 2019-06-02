import * as types from '../types'
import * as api from '@/api'

const state = {
  ordersList: [],
  ordersCount: 0,
  commentList: [],
  commentCount: 0,
  newsList: [],
  newsCount: 0,
  goodsList: [],
  goodsCount: 0,
  goods: {},
  pics: [],
  levelOne: [],
  levelOther: [],
  cartList: [],
  payWay: [],
}

const getters = {
  ordersList: state => state.ordersList,  //商城的商品列表
  ordersCount: state => state.ordersCount,
  commentList: state => state.commentList,
  commentCount: state => state.commentCount,
  newsList: state => state.newsList,
  newsCount: state => state.newsCount,
  goodsList: state => state.goodsList,
  goodsCount: state => state.goodsCount,
  goods: state => state.goods,
  pics: state => state.pics,
  levelOne: state => state.levelOne,
  levelOther: state => state.levelOther,
  cartList: state => state.cartList,
  currentCart: state => state.cartList.filter(item => item.chosen),
  payWay: state => state.payWay,
}

const actions = {
  getOrdersList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getOrderList(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_ORDERS_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_ORDERS_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_ORDERS_COUNT, {count: state.ordersCount + 1})
      } else if (isRefresh) {
        commit(types.SET_ORDERS_COUNT, {count: 1})
      }
    })
  },
  getCommentsList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.comment_list(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_COMMENT_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_COMMENT_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_COMMENT_COUNT, {count: state.commentCount + 1})
      } else if (isRefresh) {
        commit(types.SET_COMMENT_COUNT, {count: 1})
      }
    })
  },
  getNewsList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.index(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_NEWS_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_NEWS_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_NEWS_COUNT, {count: state.newsCount + 1})
      } else if (isRefresh) {
        commit(types.SET_NEWS_COUNT, {count: 1})
      }
    })
  },
  getC2CList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getC2CList(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_GOODS_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_GOODS_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_GOODS_COUNT, {count: state.goodsCount + 1})
      } else if (isRefresh) {
        commit(types.SET_GOODS_COUNT, {count: 1})
      }
    })
  },
  getMyList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getMyList(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_GOODS_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_GOODS_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_GOODS_COUNT, {count: state.goodsCount + 1})
      } else if (isRefresh) {
        commit(types.SET_GOODS_COUNT, {count: 1})
      }
    })
  },
  HomePic({commit}, opt) {
    return api.getHomePic(opt).then(res => {
      const list = res.data.home_pic_url
      commit(types.RECEIVE_HOME_PIC, {list})
    })
  },
  levelOne({ commit }, opt) {
    return api.getLevelOne(opt).then(res => {
      const list = res.data
      commit(types.RECEIVE_LEVEL_ONE, { list })
    })
  },
  levelOther({ commit }, opt) {
    return api.getLevelOther(opt).then(res => {
      const list = res.data.category_level2
      commit(types.RECEIVE_LEVEL_OTHER, { list })
    })
  },
  goods({commit}, opt) {
    return api.getGoods(opt).then(res => {
      const goods = res.data
      commit(types.RECEIVE_GOODS, {goods})
    })
  },
  cartList({commit}, opt) {
    return api.getCartList(opt).then(res => {
      const list = res.data
      commit(types.RECEIVE_CART_LIST, {list})
    })
  },
  addCart({commit}, opt) {
    return api.addCart(opt)
  },
  putCart({commit}, opt) {
    return api.putCart(opt)
  },
  delCart({commit}, opt) {
    return api.delCart(opt).then(res => {
      const id = opt.cart_id
      commit(types.DEL_CART_ITEM, {id})
    })
  },
  addOrder({commit}, opt) {
    return api.addOrder(opt).then(res => {
      commit(types.RECEIVE_CART_LIST, {list: []})
      return res.data.url
    })
  },
  payWay({commit}, opt) {
    return api.getPayWay(opt).then(res => {
      const payWay = res.data
      commit(types.RECEIVE_PAY_WAY, {payWay})
    })
  },
}

const mutations = {
  CHANGE_COMMENT(state, {comment}) {
    for (let c of state.commentList) {
      if (c.comment_id === comment.comment_id) {
        c.is_like = comment.like
        if (c.is_like === 1) {
          c.like_count = Number(c.like_count) + 1
        } else {
          c.like_count = Number(c.like_count) - 1
        }

      }
    }
  },
  [types.RECEIVE_ORDERS_LIST](state, {list}) {
    state.ordersList = list
  },
  [types.SET_ORDERS_COUNT](state, {count}) {
    state.ordersCount = count
  },
  [types.PUSH_ORDERS_LIST](state, {list}) {
    state.ordersList = state.ordersList.concat(list)
  },
  [types.RECEIVE_COMMENT_LIST](state, {list}) {
    state.commentList = list
  },
  [types.SET_COMMENT_COUNT](state, {count}) {
    state.commentCount = count
  },
  [types.PUSH_COMMENT_LIST](state, {list}) {
    state.commentList = state.commentList.concat(list)
  },
  [types.RECEIVE_NEWS_LIST](state, {list}) {
    state.newsList = list
  },
  [types.SET_NEWS_COUNT](state, {count}) {
    state.newsCount = count
  },
  [types.PUSH_NEWS_LIST](state, {list}) {
    state.newsList = state.newsList.concat(list)
  },
  [types.RECEIVE_GOODS_LIST](state, {list}) {
    state.goodsList = list
  },
  [types.SET_GOODS_COUNT](state, {count}) {
    state.goodsCount = count
  },
  [types.PUSH_GOODS_LIST](state, {list}) {
    state.goodsList = state.goodsList.concat(list)
  },
  [types.RECEIVE_GOODS](state, {goods}) {
    state.goods = goods
  },
  [types.RECEIVE_HOME_PIC](state, {list}) {
    state.pics = list
  },
  [types.RECEIVE_LEVEL_ONE](state, {list}) {
    state.levelOne = list
  },
  [types.RECEIVE_LEVEL_OTHER](state, {list}) {
    state.levelOther = list
  },
  [types.RECEIVE_CART_LIST](state, {list}) {
    state.cartList = list
  },
  [types.CHANGE_SUM](state, {sum, id}) {
    state.cartList.forEach((val, idx, arr) => {
      if (val.cart_id != id) return
      arr[idx].goods_count = sum
    })
    state.cartList = [...state.cartList]
  },
  [types.CHOSEN_ITEM](state, {flag, id}) {
    state.cartList.forEach((val, idx, arr) => {
      if (val.cart_id != id) return
      val.chosen = flag
      arr[idx] = {...val}
    })
    state.cartList = [...state.cartList]
  },
  [types.CHOSEN_ALL_ITEM](state, {flag}) {
    state.cartList.forEach((val, idx, arr) => {
      val.chosen = flag
      arr[idx] = {...val}
    })
    state.cartList = [...state.cartList]
  },
  [types.DEL_CART_ITEM](state, {id}) {
    const list = state.cartList.filter(val => val.cart_id != id)
    state.cartList = [...list]
  },
  [types.RECEIVE_PAY_WAY](state, {payWay}) {
    state.payWay = payWay
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
