import * as types from '../types'
import * as api from '@/api'

const state = {
  zone: {},
  clientInfo: {},
  KCIList: [],
  KCICount: 0,
  orderList: [],
  order: {},
  orderCount: 0,
  userOrderList: [],
  userOrder: {},
  userOrderCount: 0,
  addressList: [],
  address: {},//默认地址
  orderAddress: {},
  banks: [],
  bankCardList: [],
  bankCard: {},
  rankList: [],
  score: {},
  scoreDetail: {},
  scoreList: [],
  scoreCount: 0,
  qrcode: 0,
  service: {},
  team: {},
  signature: {},
  percent: {},
  backScoreList: [],
  backScoreCount: 0,
  noticeList: [],
  noticeCount: 0,
  backScoreTotal: 0,
  businessType: [],
}

const getters = {
  zone: state => state.zone,
  clientInfo: state => state.clientInfo,
  orderList: state => state.orderList,  //兑换记录
  KCIList: state => state.KCIList,  //KCI兑换记录
  KCICount: state => state.KCICount,
  order: state => state.order,
  orderCount: state => state.orderCount,
  userOrderList: state => state.userOrderList,
  userOrder: state => state.userOrder,
  userOrderCount: state => state.userOrderCount,
  addressList: state => state.addressList,
  address: state => state.address,
  orderAddress: state => state.orderAddress,
  banks: state => state.banks,
  bankCardList: state => state.bankCardList,
  bankCard: state => state.bankCard,
  rankList: state => state.rankList,
  score: state => state.score,
  scoreDetail: state => state.scoreDetail,
  scoreList: state => state.scoreList,
  scoreCount: state => state.scoreCount,
  qrcode: state => state.qrcode,
  service: state => state.service,
  team: state => state.team,
  signature: state => state.signature,
  percent: state => state.percent,
  backScoreList: state => state.backScoreList,
  backScoreCount: state => state.backScoreCount,
  noticeList: state => state.noticeList,
  noticeCount: state => state.noticeCount,
  backScoreTotal: state => state.backScoreTotal,
  businessType: state => state.businessType,
}

const actions = {
  zone({commit}, opt) {
    return api.getZone(opt).then(res => {
      const zone = res.data
      commit(types.RECEIVE_ZONE, {zone})
    })
  },
  changeRecord({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getChangeRecord(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_ORDER_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_ORDER_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_ORDER_COUNT, {count: state.orderCount + 1})
      } else if (isRefresh) {
        commit(types.SET_ORDER_COUNT, {count: 1})
      }
    })
  },
  KCIChangeRecord({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getKCIRecord(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_KCI_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_KCI_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_KCI_COUNT, {count: state.KCICount + 1})
      } else if (isRefresh) {
        commit(types.SET_KCI_COUNT, {count: 1})
      }
    })
  },
  getOrderDetail({commit, state}, opt) {
    return api.getOrderDetail(opt).then(res => {
      const order = res.data
      commit(types.RECEIVE_ORDER, {order})
    })
  },
  delOrder({commit, state}, opt) {
    return api.delOrder(opt)
  },
  getScoreRecord({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getScoreRecord(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_USER_ORDER_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_USER_ORDER_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_USER_ORDER_COUNT, {count: state.userOrderCount + 1})
      } else if (isRefresh) {
        commit(types.SET_USER_ORDER_COUNT, {count: 1})
      }
    })
  },
  userOrder({commit, state}, opt) {
    return api.getUserOrder(opt).then(res => {
      const order = res.data
      commit(types.RECEIVE_USER_ORDER, {order})
    })
  },
  delUserOrder({commit, state}, opt) {
    return api.delUserOrder(opt)
  },
  addressList({commit}) {
    return api.getAddressList().then(res => {
      const list = res.data.address_list
      commit(types.RECEIVE_ADDRESS_LIST, {list})
    })
  },
  defaultAddress({commit}, opt) {
    return api.putDefaultAddress(opt).then(res => {
      const id = opt.dev_id
      commit(types.SET_DEFAULT_ADDRESS, {id})
    })
  },
  delAddress({commit}, opt) {
    return api.delAddress(opt).then(res => {
      const id = opt.dev_id
      commit(types.DELETE_ADDRESS, {id})
    })
  },
  addAddress({commit}, opt) {
    return api.addAddress(opt)
  },
  editAddress({commit}, opt) {
    return api.putAddress(opt)
  },
  banks({commit}) {
    return api.getBankList().then(res => {
      const list = res.data.bank_list
      commit(types.RECEIVE_BANKS, {list})
    })
  },
  bankCardList({commit}) {
    return api.getBankCardList().then(res => {
      const list = res.data.bank_card_list
      commit(types.RECEIVE_BANK_CARD_LIST, {list})
    })
  },
  defaultBankCard({commit}, opt) {
    return api.putDefaultBankCard(opt).then(res => {
      const id = opt.card_id
      commit(types.SET_DEFAULT_BANK_CARD, {id})
    })
  },
  delBankCard({commit}, opt) {
    return api.delBankCard(opt).then(res => {
      const id = opt.card_id
      commit(types.DELETE_BANK_CARD, {id})
    })
  },
  addBankCard({commit}, opt) {
    return api.addBankCard(opt)
  },
  editBankCard({commit}, opt) {
    return api.putBankCard(opt)
  },
  rankList({commit}, opt) {
    return api.getRank(opt).then(res => {
      const list = res.data.rank_rule
      commit(types.RECEIVE_RANK_LIST, {list})
    })
  },
  upgrade({commit}, opt) {
    return api.putRank(opt).then(res => {
      return res.data.url
    })
  },
  personalAuth({commit}, opt) {
    return api.putPersonalAuth(opt)
  },
  getPersonalAuth({commit}, opt) {
    return api.getPersonalAuth(opt)
  },
  companyAuth({commit}, opt) {
    return api.alliance_apply(opt)
  },
  getCompanyAuth({commit}, opt) {
    return api.getCompanyAuth(opt)
  },
  score({commit}, opt) {
    return api.getScore(opt).then(res => {
      const score = res.data
      commit(types.RECEIVE_SCORE, {score})
    })
  },
  scoreDetail({commit}, opt) {
    return api.getScoreDetail(opt).then(res => {
      const score = res.data
      commit(types.RECEIVE_SCORE_DETAIL, {score})
    })
  },
  scoreList({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getScoreList(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_SCORE_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_SCORE_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_SCORE_COUNT, {count: state.scoreCount + 1})
      } else if (isRefresh) {
        commit(types.SET_SCORE_COUNT, {count: 1})
      }
    })
  },
  clientInfo({commit}, opt) {
    return api.getClientInfo(opt).then(res => {
      const info = res.data
      commit(types.RECEIVE_CLIENT_INFO, {info})
    })
  },
  putClientInfo({commit}, opt) {
    return api.putClientInfo(opt)
  },
  getPayUrl({commit}, opt) {
    return api.getPayUrl(opt).then(res => {
      return res.data.url
    })
  },
  qrcode({commit}, opt) {
    return api.getQrcode(opt).then(res => {
      const qrcode = res.data
      commit(types.RECEIVE_QRCODE, {qrcode})
    })
  },
  service({commit}, opt) {
    return api.getService(opt).then(res => {
      const service = res.data
      commit(types.RECEIVE_SERVICE, {service})
    })
  },
  team({commit}, opt) {
    return api.getTeam(opt).then(res => {
      const team = res.data
      commit(types.RECEIVE_TEAM, {team})
    })
  },
  getSignature({commit}, opt) {
    return api.getSignature(opt).then(res => {
      const data = res.data
      commit(types.RECEIVE_SIGNATURE, {data})
    })
  },
  addScore({commit}, opt) {
    return api.addScore(opt)
  },
  addKCI({commit}, opt) {
    return api.addKCI(opt)
  },
  addBalance({commit}, opt) {
    return api.addBalance(opt)
  },
  // turnOutBalance({commit}, opt) {
  //   return api.turnOutBalance(opt)
  // },
  marketTrend({commit}, opt) {
    return api.marketTrend(opt)
  },
  getPercent({commit}, opt) {
    return api.getPercent(opt).then(res => {
      const percent = res.data
      commit(types.RECEIVE_PERCENT, {percent})
    })
  },
  getShareRecord({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getShareRecord(opt).then(res => {
      // const total = res.data.total_num

      // commit(types.RECEIVE_BACK_SCORE_TOTAL, {total})

      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_BACK_SCORE_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_BACK_SCORE_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_BACK_SCORE_COUNT, {count: state.backScoreCount + 1})
      } else if (isRefresh) {
        commit(types.SET_BACK_SCORE_COUNT, {count: 1})
      }
    })
  },
  getNotice({commit, state}, opt) {
    const isRefresh = opt.isRefresh
    delete opt.isRefresh
    return api.getNotice(opt).then(res => {
      const list = res.data
      if (opt.page === 1) {
        commit(types.RECEIVE_NOTICE_LIST, {list})
      } else if (opt.page > 1) {
        commit(types.PUSH_NOTICE_LIST, {list})
      }
      if (!isRefresh && list.length > 0) {
        commit(types.SET_NOTICE_COUNT, {count: state.noticeCount + 1})
      } else if (isRefresh) {
        commit(types.SET_NOTICE_COUNT, {count: 1})
      }
    })
  },
  putBackScore({commit}, opt) {
    return api.putBackScore(opt)
  },
  putScore({commit}, opt) {
    return api.putScore(opt)
  },
}

const mutations = {
  [types.RECEIVE_ZONE](state, {zone}) {
    state.zone = zone
  },
  [types.RECEIVE_CLIENT_INFO](state, {info}) {
    state.clientInfo = info
  },
  [types.RECEIVE_ORDER_LIST](state, {list}) {
    state.orderList = list
  },
  [types.PUSH_ORDER_LIST](state, {list}) {
    state.orderList = state.orderList.concat(list)
  },
  [types.SET_ORDER_COUNT](state, {count}) {
    state.orderCount = count
  },
  [types.RECEIVE_KCI_LIST](state, {list}) {
    state.KCIList = list
  },
  [types.SET_KCI_COUNT](state, {count}) {
    state.KCICount = count
  },
  [types.PUSH_KCI_LIST](state, {list}) {
    state.KCIList = state.KCIList.concat(list)
  },
  [types.RECEIVE_ORDER](state, {order}) {
    state.order = order
  },
  [types.DEL_ORDER](state, {id}) {
    state.orderList = state.orderList.filter(val => val.parent_order_id != id)
  },
  [types.RECEIVE_USER_ORDER_LIST](state, {list}) {
    state.userOrderList = list
  },
  [types.SET_USER_ORDER_COUNT](state, {count}) {
    state.userOrderCount = count
  },
  [types.PUSH_USER_ORDER_LIST](state, {list}) {
    state.userOrderList = state.userOrderList.concat(list)
  },
  [types.RECEIVE_USER_ORDER](state, {order}) {
    state.userOrder = order
  },
  [types.DEL_USER_ORDER](state, {id}) {
    state.userOrderList = state.userOrderList.filter(val => val.parent_order_id != id)
  },

  [types.SET_ADDRESS](state, {address}) {
    //设置地址
    state.orderAddress = address
  },
  [types.RECEIVE_ADDRESS_LIST](state, {list}) {
    state.addressList = list
    //默认地址
    state.address = list.filter(val => val.is_default == '1')[0] || {}
  },
  [types.SET_DEFAULT_ADDRESS](state, {id}) {
    state.addressList.forEach(item => {
      item.is_default = '0'
      if (item.dev_id == id) {
        item.is_default = '1'
        state.address = item
      }
    })
    state.addressList = [...state.addressList]
  },
  [types.DELETE_ADDRESS](state, {id}) {
    state.addressList.forEach((item, idx) => {
      if (item.dev_id == id) {
        state.addressList.splice(idx, 1)
      }
    })
    state.addressList = [...state.addressList]
  },

  [types.RECEIVE_BANKS](state, {list}) {
    state.banks = list
  },
  [types.RECEIVE_BANK_CARD_LIST](state, {list}) {
    state.bankCardList = list
    state.bankCard = list.filter(val => val.is_default == '1')[0] || {}
  },
  [types.SET_DEFAULT_BANK_CARD](state, {id}) {
    state.bankCardList.forEach(item => {
      item.is_default = '0'
      if (item.card_id == id) {
        item.is_default = '1'
        state.bankCard = item
      }
    })
    state.bankCardList = [...state.bankCardList]
  },
  [types.DELETE_BANK_CARD](state, {id}) {
    state.bankCardList.forEach((item, idx) => {
      if (item.card_id == id) {
        state.bankCardList.splice(idx, 1)
      }
    })
    state.bankCardList = [...state.bankCardList]
  },
  [types.CLEAR_BANK_CARD](state) {
    state.bankCard = {}
  },

  [types.RECEIVE_SCORE](state, {score}) {
    state.score = score
  },
  [types.RECEIVE_SCORE_DETAIL](state, {score}) {
    state.scoreDetail = score
  },
  [types.RECEIVE_SCORE_LIST](state, {list}) {
    state.scoreList = list
  },
  [types.SET_SCORE_COUNT](state, {count}) {
    state.scoreCount = count
  },
  [types.PUSH_SCORE_LIST](state, {list}) {
    state.scoreList = state.scoreList.concat(list)
  },
  [types.RECEIVE_RANK_LIST](state, {list}) {
    state.rankList = list
  },
  [types.RECEIVE_QRCODE](state, {qrcode}) {
    state.qrcode = qrcode
  },
  [types.RECEIVE_SERVICE](state, {service}) {
    state.service = service
  },
  [types.RECEIVE_TEAM](state, {team}) {
    state.team = team
  },
  [types.RECEIVE_SIGNATURE](state, {data}) {
    state.signature = data
  },
  [types.RECEIVE_PERCENT](state, {percent}) {
    state.percent = percent
  },
  [types.CLEAER_DATA](state) {
    state.clientInfo = {}
    state.addressList = []
    state.address = {}
    state.bankCardList = []
    state.bankCard = {}
    state.rankList = []
    state.score = {}
    state.scoreDetail = {}
    state.scoreList = []
    state.scoreCount = 0
    state.qrcode = 0
    state.team = {}
  },
  [types.RECEIVE_BACK_SCORE_TOTAL](state, {total}) {
    state.backScoreTotal = total
  },
  [types.RECEIVE_BACK_SCORE_LIST](state, {list}) {
    state.backScoreList = list
  },
  [types.RECEIVE_NOTICE_LIST](state, {list}) {
    state.noticeList = list
  },
  [types.SET_NOTICE_COUNT](state, {count}) {
    state.noticeCount = count
  },
  [types.PUSH_NOTICE_LIST](state, {list}) {
    state.noticeList = state.noticeList.concat(list)
  },
  [types.SET_BACK_SCORE_COUNT](state, {count}) {
    state.backScoreCount = count
  },
  [types.PUSH_BACK_SCORE_LIST](state, {list}) {
    state.backScoreList = state.backScoreList.concat(list)
  },
  [types.RECEIVE_BUSINESS_TYPE](state, {list}) {
    state.businessType = list
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
