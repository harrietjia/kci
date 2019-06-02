import http from './http.js'

/**
 * get, add, del, put
 */

// 获取kci兑换率
export const getChangeNum = params => {
  return http.post('client/get_convert_ratio', params)
}
// 注册
export const addUser = params => {
  return http.post('site/register', params)
}
// 异步注册参数判断
export const getRegisterInfo = params => {
  return http.post('site/pd_register_data', params)
}
// 获取手机验证码
export const getMobileCode = params => {
  return http.post('site/get_mobilephone_code', params)
}
// 登录
export const login = params => {
  return http.post('site/mobilephone_login', params)
}
// 忘记密码
export const forgotPassword = params => {
  return http.post('site/forget_password', params)
}
// 获取session
export const getSession = params => {
  return http.post('site/get_session_id', params)
}
// 获取商城首页
export const getShopHome = params => {
  return http.post('shop/home', params)
}
// 获取首页轮播图
export const getHomePic = params => {
  return http.post('user/get_user_data', params)
}
// 获取C2C出售或求购列表
export const getC2CList = params => {
  return http.post('order/get_c2c_list', params)
}
// 获取我的订单
export const getMyList = params => {
  return http.post('order/get_client_c2c_list', params)
}
// 获取购买金额
export const getBuyNum = params => {
  return http.post('order/get_c2c_buy_num', params)
}
// 获取出售金额
export const getSaleNum = params => {
  return http.post('order/get_c2c_sale_num', params)
}
// 已经完成线下付款
export const offlinePlay = params => {
  return http.post('order/offline_play', params)
}
// 确认收款
export const confirmPayment = params => {
  return http.post('order/confirm_payment', params)
}
// 获取商品详情
export const getGoods = params => {
  return http.post('goods/get_goods_detail', params)
}
// 获取转出信息
export const changeBalanceInfo = params => {
  return http.post('client/change_balance_get_client_info', params)
}
// 获取个人信息
export const getClientInfo = params => {
  return http.post('client/get_client_info', params)
}
// 修改个人信息
export const putClientInfo = params => {
  return http.form('client/edit_client_info', params)
}
// 上传打款凭证
export const upload_payment_voucher = params => {
  return http.post('order/upload_payment_voucher', params)
}
// 通贝兑换貔貅
export const addScore = params => {
  return http.post('/client/balance_to_score', params)
}
// 通贝兑换KCI
export const addKCI = params => {
  return http.post('market/balance_to_kci_balance', params)
}
// KCI兑换通贝
export const addBalance = params => {
  return http.post('/market/kci_balance_to_balance', params)
}
// 获取会员类型
export const getRank = params => {
  return http.post('rank/get_rank_rule', params)
}
// 会员升级
export const putRank = params => {
  return http.post('order/submit_rank_order', params)
}
// 获取通贝兑换记录
export const getChangeRecord = params => {
  return http.post('/order/get_balance_change_record', params)
}
// 获取KCI兑换记录
export const getKCIRecord = params => {
  return http.post('/market/get_kci_balance_record', params)
}
// 获取C2C订单详情
export const getOrderDetail = params => {
  return http.post('order/get_c2c_details', params)
}
// 取消订单
export const delOrder = params => {
  return http.post('order/cancel_order', params)
}
// 取消挂卖
export const initOrder = params => {
  return http.post('order/init_c2c_order', params)
}

// 获取通贝貔貅修改记录
export const getScoreRecord = params => {
  return http.post('client/get_score_record', params)
}
// 获取我的订单
export const getOrderList = params => {
  return http.post('goods/get_order_list', params)
}
// 取消商品订单
export const delGood = params => {
  return http.post('goods/cancel_order', params)
}
// 确认收货
export const confirmOrder = params => {
  return http.post('goods/confirm_order', params)
}
// 获取订单详情
export const getUserOrder = params => {
  return http.post('goods/get_order_detail', params)
}
// 取消会员升级订单
export const delUserOrder = params => {
  return http.post('goods/cancel_rank_order', params)
}

// 获取次日红包
export const getHB = params => {
  return http.post('client/get_score_crontab', params)
}
// 领取次日红包
export const OpenHB = params => {
  return http.post('client/receive_score_crontab', params)
}

// 获取地址信息
export const getZone = params => {
  return http.post('site/get_zone', params)
}

// 联盟商申请
export const alliance_apply = params => {
  return http.post('client/alliance_apply', params)
}
// 请求首页的数据
export const home = params => {
  return http.post('user/home', params)
}
// 请求文章资讯
export const index = params => {
  return http.post('topic/index', params)
}
// 点赞
export const like = params => {
  return http.post('topic/like_topic', params)
}
// 发布评论
export const publish_comment = params => {
  return http.post('topic/publish_comment', params)
}
// 评论列表
export const comment_list = params => {
  return http.post('topic/comment_list', params)
}

// 请求文章资讯详情
export const showIndex = params => {
  return http.post('topic/show', params)
}
// 获取收货地址列表
export const getAddressList = params => {
  return http.post('client/get_address_list', params)
}
// 添加收货地址
export const addAddress = params => {
  return http.post('client/add_address', params)
}
// 修改收货地址
export const putAddress = params => {
  return http.post('client/edit_address', params)
}
// 删除收货地址
export const delAddress = params => {
  return http.post('client/delete_address', params)
}
// 默认收货地址
export const defaultAddress = params => {
  return http.post('client/get_default_address', params)
}
// 修改默认收货地址
export const putDefaultAddress = params => {
  return http.post('client/set_default_address', params)
}
// 获取默认收货地址
export const getDefaultAddress = params => {
  return http.post('client/get_default_address', params)
}
// 获取银行列表
export const getBankList = params => {
  return http.post('client/get_bank_list', params)
}
// 获取银行卡列表
export const getBankCardList = params => {
  return http.post('client/get_bank_card', params)
}
// 添加银行卡
export const addBankCard = params => {
  return http.post('client/bind_bank_card', params)
}
// 修改银行卡
export const putBankCard = params => {
  return http.post('client/edit_bank_card', params)
}
// 删除银行卡
export const delBankCard = params => {
  return http.post('client/delete_bank_card', params)
}
// 修改默认银行卡
export const putDefaultBankCard = params => {
  return http.post('client/set_default_bank_card', params)
}

// 获取个人认证信息
export const getPersonalAuth = params => {
  return http.post('client/get_personal_auth_info', params)
}
// 提交个人认证信息
export const putPersonalAuth = params => {
  return http.form('client/edit_personal_auth_info', params)
}
// 获取联盟商信息
export const getCompanyAuth = params => {
  return http.post('client/get_alliance_info/client/get_alliance_info', params)
}
// 提交企业认证信息
export const putCompanyAuth = params => {
  return http.form('client/edit_company_auth_info', params)
}
// C2C发布出售
export const addSaleOrder = params => {
  return http.post('order/add_c2c_sale_order', params)
}
// C2C发布购买
export const addBuyOrder = params => {
  return http.post('order/add_c2c_buy_order', params)
}
// C2C确定购买
export const Buy = params => {
  return http.post('order/buy', params)
}
// C2C确定出售
export const Sale = params => {
  return http.post('order/sale', params)
}
// C2C确定取消订单
export const Cancel = params => {
  return http.post('order/cancel_c2c_order', params)
}
// 获取购物车列表
export const getCartList = params => {
  return http.post('goods/get_shop_cart', params)
}
// 获取积分
export const getScore = params => {
  return http.post('client/get_score', params)
}
// 获取积分详情
export const getScoreDetail = params => {
  return http.post('client/get_detail', params)
}
// 获取转入转出记录
export const getScoreList = params => {
  return http.post('/order/get_score_change_record', params)
}
// 添加到购物车
export const addCart = params => {
  return http.post('goods/add_shop_cart', params)
}
// 添加到购物车
export const putCart = params => {
  return http.post('goods/edit_shop_cart', params)
}
// 删除购物车中的商品
export const delCart = params => {
  return http.post('goods/del_shop_cart', params)
}
// 下单
export const addOrder = params => {
  return http.post('goods/submit_goods_order', params)
}
// 获取支付方式
export const getPayWay = params => {
  return http.post('goods/get_pay_way_list', params)
}
// 获取支付链接
export const getPayUrl = params => {
  return http.post('order/immediate_pay_order', params)
}
// 获取二维码
export const getQrcode = params => {
  return http.get('site/give_balance_qrcode', params)
}
// 获取微信签名
export const getWeixin = params => {
  return http.post('wechat/get_wechat_data', params)
}
// 获取客服信息
export const getService = params => {
  return http.post('client/get_runtime', params)
}
// 获取我的团队
export const getTeam = params => {
  return http.post('client/get_team_list', params)
}
// 获取OOS直传参数
export const getSignature = params => {
  return http.post('/client/get_oss_data', params)
}
// 转出通贝
export const turnOutBalance = params => {
  return http.post('client/trun_out_balance', params)
}
// 行情趋势
export const marketTrend = params => {
  return http.post('/market/market_trend', params)
}
// 获取手续费
export const getPercent = params => {
  return http.post('client/get_percent', params)
}
// 获取分享记录kci
export const getShareRecord = params => {
  return http.post('client/get_share_record', params)
}
// 获取分享记录kci
export const getNotice = params => {
  return http.post('user/get_sys_notice', params)
}
//待转换积分
export const putBackScore = params => {
  return http.post('client/back_score', params)
}
//投诉建议
export const sendFeedback = params => {
  return http.post('user/send_feedback', params)
}
//赠送流通宝
export const putScore = params => {
  return http.post('client/distribution_circulation_score', params)
}
// 获取商品列表
export const getGoodsList = params => {
  return http.post('goods/get_goods_data', params)
}
// 获取商品一级分类
export const getLevelOne = params => {
  return http.post('goods/get_goods_category_level1', params)
}
// 获取商品二三级分类
export const getLevelOther = params => {
  return http.post('goods/get_goods_category_level23', params)
}
//附近商家
export const nearbyStore = params => {
  return http.post('shop/get_nearby_store', params)
}
//商家详情
export const getHotel = params => {
  return http.post('shop/get_store_details', params)
}
//切换收藏
export const changeCollect = params => {
  return http.post('client/toggle_attention', params)
}
//收藏列表
export const getCollect = params => {
  return http.post('client/get_attention_info', params)
}
//签到记录
export const getReceive = params => {
  return http.post('client/get_receive_log', params)
}
//消费评价
export const Review = params => {
  return http.post('goods/goods_appraise', params)
}
//评价列表
export const getAppraise = params => {
  return http.post('goods/get_goods_appraise_list', params)
}
//点赞评价
export const likeAppraise = params => {
  return http.post('goods/like_goods_appraise', params)
}

//获取出售溢价可选值（GSC溢价）
export const getSalePremium = params => {
  return http.post('order/get_c2c_sale_premium', params)
}
//获取购买溢价可选值（GSC溢价）
export const getBuyPremium = params => {
  return http.post('order/get_c2c_buy_premium', params)
}
//发布出售->创建订单(GSC)
export const addGscSale = params => {
  return http.post('order/add_c2c_gsc_sale_order', params)
}
//发布出售->创建订单(GSC)
export const addGscBuy = params => {
  return http.post('order/add_c2c_gsc_buy_order', params)
}
//获取GSC订单当前价格
export const getGscPay = params => {
  return http.post('order/get_gsc_order_amount_pay', params)
}
//是否有设置支付密码
export const existPay = params => {
  return http.post('client/exist_pay_password', params)
}
//总换市场货币
export const marketCurrency = params => {
  return http.post('market/kci_to_market_currency', params)
}
//获取相应的币总换GSC所需的GSC枚数
export const getEquUnlock = params => {
  return http.post('market/get_equ_unlock_kci_balance', params)
}
//我的资产
export const getPersonalAssets = params => {
  return http.post('client/get_personal_assets_info', params)
}
