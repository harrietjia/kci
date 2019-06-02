import * as types from '../types'
import * as api from '@/api'

const state = {
  app_sms_sercret: '04c7a1e829ba287bee2b5aac0e88e561',
  isLogin: false,
  user: {},
  smsToken: '',
  sessionId: '',
  signUpInfo: {},
}

const getters = {
  sercret: state => state.app_sms_sercret,
  isLogin: state => state.isLogin,
  user: state => state.user,
  smsToken: state => state.smsToken,
  sessionId: state => state.sessionId,
  signUpInfo: state => state.signUpInfo,
}

const actions = {
  login({commit, dispatch}, opt) {
    return api.login(opt).then(res => {
      const user = res.data.client_info
      const loginInfo = {
        'login_client_id': res.data.login_client_id,
        'login_time': res.data.login_time,
        'login_token': res.data.login_token,
        'session_id': res.data.session_id
      }
      dispatch('setLoginStore', loginInfo, {root: true})
      dispatch('setUserInfo', opt, { root: true })
      commit(types.LOGIN, {user})
    })
  },
  mobileCode({commit}, opt) {
    return api.getMobileCode(opt).then(res => {
      const smsToken = res.data.sms_token
      commit(types.RECEIVE_SMS_TOKEN, {smsToken})
    })
  },
  register({commit}, opt) {
    return api.addUser(opt)
  },
  asyncSignUp({commit}, opt) {
    return api.getRegisterInfo(opt)
  },
  session({commit}, opt) {
    return api.getSession(opt).then(res => {
      const session = res.data.session_id
      commit(types.RECEIVE_SESSION, {session})
    })
  },
  forgot({commit}, opt) {
    return api.forgotPassword(opt)
  },
}

const mutations = {
  [types.LOGIN](state, {user}) {
    state.user = user
    state.isLogin = true
  },
  [types.RECEIVE_SMS_TOKEN](state, {smsToken}) {
    state.smsToken = smsToken
  },
  [types.RECEIVE_SESSION](state, {session}) {
    state.sessionId = session
  },
  [types.SAVE_SIGN_UP_INFO](state, {info}) {
    state.signUpInfo = info
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
