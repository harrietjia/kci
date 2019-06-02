import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

const Home = () =>
  import ('@/pages/Home')
const Register = () =>
  import ('@/pages/Register')
const Login = () =>
  import ('@/pages/Login')
const Forget = () =>
  import ('@/pages/Forget')
const Exchange = () =>
  import ('@/pages/Exchange')
const PackageUrl = () =>
  import ('@/pages/PackageUrl')
const KModification = () =>
  import ('@/pages/KModification')
const GSC = () =>
  import ('@/pages/GSC')
const PModification = () =>
  import ('@/pages/PModification')
const SwitchInRecord = () =>
  import ('@/pages/SwitchInRecord')
const SwitchOutRecord = () =>
  import ('@/pages/SwitchOutRecord')
const ExchangeRecord = () =>
  import ('@/pages/ExchangeRecord')
const KCIRecord = () =>
  import ('@/pages/KCIRecord')
const SwitchIn = () =>
  import ('@/pages/SwitchIn')
const SwitchOut = () =>
  import ('@/pages/SwitchOut')
const SwitchOut2 = () =>
  import ('@/pages/SwitchOut2')
const C2C = () =>
  import ('@/pages/C2C')
const Publish = () =>
  import ('@/pages/Publish')
const C2C2 = () =>
  import ('@/pages/C2C2')
const PublishC2C = () =>
  import ('@/pages/PublishC2C')
const Sale = () =>
  import ('@/pages/Sale')
const Order = () =>
  import ('@/pages/Order')
const OrderDetail = () =>
  import ('@/pages/OrderDetail')
const OverOrder = () =>
  import ('@/pages/OverOrder')
const NoOrder = () =>
  import ('@/pages/NoOrder')
const GetMoney = () =>
  import ('@/pages/GetMoney')
const Mine = () =>
  import ('@/pages/Mine')
const ChangName = () =>
  import ('@/pages/ChangName')
const BankCardList = () =>
  import ('@/pages/BankCardList')
const BankCardEdit = () =>
  import ('@/pages/BankCardEdit')
const ShareCode = () =>
  import ('@/pages/ShareCode')
const ShareDetail = () =>
  import ('@/pages/ShareDetail')
const ChangePassword = () =>
  import ('@/pages/ChangePassword')
const ChangePay = () =>
  import ('@/pages/ChangePay')
const Notice = () =>
  import ('@/pages/Notice')
const NoticeDetail = () =>
  import ('@/pages/NoticeDetail')
const Setting = () =>
  import ('@/pages/Setting')
const Complaint = () =>
  import ('@/pages/Complaint')
const Market = () =>
  import ('@/pages/Market')
const AllList = () =>
  import ('@/pages/AllList')
const ExchangeKCI = () =>
  import ('@/pages/ExchangeKCI')
const ExchangeKTong = () =>
  import ('@/pages/ExchangeKTong')
const ExchangeAll = () =>
  import ('@/pages/ExchangeAll')
const KCharts = () =>
  import ('@/pages/KCharts')
const ETPCheck = () =>
  import ('@/pages/ETPCheck')
const News = () =>
  import ('@/pages/News')
const Talk = () =>
  import ('@/pages/Talk')
const Shop = () =>
  import ('@/pages/shopping/Shop')
const AddressEdit = () =>
  import ('@/pages/shopping/AddressEdit')
const AddressList = () =>
  import ('@/pages/shopping/AddressList')
const Cart = () =>
  import ('@/pages/shopping/Cart')
const ConfirmOrder = () =>
  import ('@/pages/shopping/ConfirmOrder')
const GoodsDetail = () =>
  import ('@/pages/shopping/GoodsDetail')
const OrdersDetail = () =>
  import ('@/pages/shopping/OrdersDetail')
const OrderList = () =>
  import ('@/pages/shopping/OrderList')
const Category = () =>
  import ('@/pages/shopping/Category')
const KCIshop = () =>
  import ('@/pages/shopping/KCIshop')
const CityHotelMap = () =>
  import ('@/pages/shopping/CityHotelMap')
const Seller = () =>
  import ('@/pages/shopping/Seller')
const SignOn = () =>
  import ('@/pages/shopping/SignOn')
const Collect = () =>
  import ('@/pages/shopping/Collect')
const Review = () =>
  import ('@/pages/shopping/Review')
const MyAssets = () =>
  import ('@/pages/MyAssets')
const LanguageSetting = () =>
  import ('@/pages/LanguageSetting')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '*',
    redirect: '/Home'
  }, {
    path: '/Home',
    name: 'Home',
    component: Home,
    // meta: {
    //   requireAuth: true
    // }
  }, {
    path: '/Register',
    name: 'Register',
    component: Register,
  }, {
    path: '/Login',
    name: 'Login',
    component: Login,
  }, {
    path: '/Forget',
    name: 'Forget',
    component: Forget,
  }, {
    path: '/Exchange',
    name: 'Exchange',
    component: Exchange,
  }, {
    path: '/PackageUrl',
    name: 'PackageUrl',
    component: PackageUrl,
  }, {
    path: '/KModification',
    name: 'KModification',
    component: KModification,
  }, {
    path: '/KCIshop',
    name: 'KCIshop',
    component: KCIshop,
  }, {
    path: '/GSC',
    name: 'GSC',
    component: GSC,
  }, {
    path: '/PModification',
    name: 'PModification',
    component: PModification,
  }, {
    path: '/SwitchIn',
    name: 'SwitchIn',
    component: SwitchIn,
  }, {
    path: '/SwitchOut',
    name: 'SwitchOut',
    component: SwitchOut,
  }, {
    path: '/SwitchOut2',
    name: 'SwitchOut2',
    component: SwitchOut2,
  }, {
    path: '/ExchangeRecord',
    name: 'ExchangeRecord',
    component: ExchangeRecord,
  }, {
    path: '/KCIRecord',
    name: 'KCIRecord',
    component: KCIRecord,
  }, {
    path: '/SwitchInRecord',
    name: 'SwitchInRecord',
    component: SwitchInRecord,
  }, {
    path: '/SwitchOutRecord',
    name: 'SwitchOutRecord',
    component: SwitchOutRecord,
  }, {
    path: '/C2C',
    name: 'C2C',
    component: C2C,
  }, {
    path: '/Publish',
    name: 'Publish',
    component: Publish,
  }, {
    path: '/C2C2',
    name: 'C2C2',
    component: C2C2,
  }, {
    path: '/PublishC2C',
    name: 'PublishC2C',
    component: PublishC2C,
  }, {
    path: '/Sale',
    name: 'Sale',
    component: Sale,
  }, {
    path: '/Order',
    name: 'Order',
    component: Order,
  }, {
    path: '/NoOrder',
    name: 'NOOrder',
    component: NoOrder,
  }, {
    path: '/OverOrder',
    name: 'OverOrder',
    component: OverOrder,
  }, {
    path: '/OrderDetail',
    name: 'OrderDetail',
    component: OrderDetail,
  }, {
    path: '/GetMoney',
    name: 'GetMoney',
    component: GetMoney,
  }, {
    path: '/Mine',
    name: 'Mine',
    component: Mine,
  }, {
    path: '/ChangName',
    name: 'ChangName',
    component: ChangName,
  }, {
    path: '/BankCardList',
    name: 'BankCardList',
    component: BankCardList,
  }, {
    path: '/BankCardEdit',
    name: 'BankCardEdit',
    component: BankCardEdit,
  }, {
    path: '/ShareCode',
    name: 'ShareCode',
    component: ShareCode,
  }, {
    path: '/ShareDetail',
    name: 'ShareDetail',
    component: ShareDetail,
  }, {
    path: '/ChangePassword',
    name: 'ChangePassword',
    component: ChangePassword,
  }, {
    path: '/ChangePay',
    name: 'ChangePay',
    component: ChangePay,
  }, {
    path: '/Notice',
    name: 'Notice',
    component: Notice,
  }, {
    path: '/NoticeDetail',
    name: 'NoticeDetail',
    component: NoticeDetail,
  }, {
    path: '/Setting',
    name: 'Setting',
    component: Setting,
  }, {
    path: '/Complaint',
    name: 'Complaint',
    component: Complaint,
  }, {
    path: '/Market',
    name: 'Market',
    component: Market,
  }, {
    path: '/AllList',
    name: 'AllList',
    component: AllList,
  }, {
    path: '/ExchangeKCI',
    name: 'ExchangeKCI',
    component: ExchangeKCI,
  }, {
    path: '/ExchangeKTong',
    name: 'ExchangeKTong',
    component: ExchangeKTong,
  }, {
    path: '/ExchangeAll',
    name: 'ExchangeAll',
    component: ExchangeAll,
  }, {
    path: '/KCharts',
    name: 'KCharts',
    component: KCharts,
  }, {
    path: '/News',
    name: 'News',
    component: News,
  }, {
    path: '/Talk',
    name: 'Talk',
    component: Talk,
  }, {
    path: '/ETPCheck',
    name: 'ETPCheck',
    component: ETPCheck,
  }, {
    path: '/Shop',
    name: 'Shop',
    component: Shop,
  }, {
    path: '/AddressEdit',
    name: 'AddressEdit',
    component: AddressEdit,
  }, {
    path: '/AddressList',
    name: 'AddressList',
    component: AddressList,
  }, {
    path: '/Cart',
    name: 'Cart',
    component: Cart,
  }, {
    path: '/ConfirmOrder',
    name: 'ConfirmOrder',
    component: ConfirmOrder,
  }, {
    path: '/GoodsDetail',
    name: 'GoodsDetail',
    component: GoodsDetail,
  }, {
    path: '/OrdersDetail',
    name: 'OrdersDetail',
    component: OrdersDetail,
  }, {
    path: '/OrderList',
    name: 'OrderList',
    component: OrderList,
  }, {
    path: '/Category',
    name: 'Category',
    component: Category,
  }, {
    path: '/CityHotelMap',
    name: 'CityHotelMap',
    component: CityHotelMap,
  }, {
    path: '/Seller',
    name: 'Seller',
    component: Seller,
  }, {
    path: '/SignOn',
    name: 'SignOn',
    component: SignOn,
  }, {
    path: '/Collect',
    name: 'Collect',
    component: Collect,
  }, {
    path: '/Review',
    name: 'Review',
    component: Review,
  }, {
    path: '/MyAssets',
    name: 'MyAssets',
    component: MyAssets,
  },{
    path: '/LanguageSetting',
    name: 'LanguageSetting',
    component: Review,
  }]
})

// router.beforeEach((to, from, next) => {
// 	if (to.meta.requireAuth) { //需要登录
// 		if (!store.state.loginInfo || !store.state.userInfo) next('/Login')
// 		if (to.meta.requireLocation) {
// 			store.state.location ? next() : next('/Home')
// 		} else if (to.meta.requireGoods) {
// 			Object.keys(store.getters.goods).length > 0 ? next() : next('/Home')
// 		} else if (to.meta.requireCart) {
// 			store.getters.currentCart.length > 0 ? next() : next('/Home')
// 		} else {
// 			next()
// 		}
// 	} else {
// 		next()
// 	}
// 	next()
// })

export default router
