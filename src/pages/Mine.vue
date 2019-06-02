<template>
  <div class="mine">

    <!--<div class="m-top">-->
    <!--<p class="title">我的</p>-->
    <!--</div>-->

    <scroller
      :on-refresh="refresh"
      :on-infinite="loading"
      class="scroller"
      ref="scroller"
    >
      <div class="head">
        <div class="center" @click="openAvatar">
          <div class="head-bg" v-if="clientInfo.is_super_node === '1'"></div>
          <div class="img-bg" v-if="clientInfo.is_super_node === '1'"></div>
          <img :src="clientInfo.head_img_url" alt="">
          <p class="head-text">UID:({{clientInfo.client_code || 'xxx'}})</p>
        </div>
        <div class="credit">
          <p class="head-text">{{$t('m.credit')}}：</p>
          <i v-for="(itemClass,index) of itemClasses" :class="itemClass"></i>
        </div>
      </div>

      <div class="middle">
        <ul>
          <li class="part0" @click="goNext('MyAssets')">
            <div >
              <i class="ico ico-n12"></i>
              <p class="bottom-text ">{{$t('m.myassets')}}</p>
              <!--<p class="top">收货人： {{$t('m.name')}} <span class="iphone">{{$t('m.name')}}</span></p>-->
              <!--<p class="address">收货地址： {{$t('m.name')}}</p>-->
            </div>
          </li>

          <li  class="part0" @click="goNext('OrderList')">
            <div>
              <i class="ico ico-n13"></i>
              <p class="bottom-text">{{$t('m.orderlist')}}</p>
              <!--<p class="top">收货人： {{$t('m.name')}} <span class="iphone">{{$t('m.name')}}</span></p>-->
              <!--<p class="address">收货地址： {{$t('m.name')}}</p>-->
            </div>
          </li>

          <li  class="part0" @click="goNext('Collect')">
            <div>
              <i class="ico ico-n14"></i>
              <p class="bottom-text">{{$t('m.collection')}}</p>
              <!--<p class="top">收货人： {{$t('m.name')}} <span class="iphone">{{$t('m.name')}}</span></p>-->
              <!--<p class="address">收货地址： {{$t('m.name')}}</p>-->
            </div>
          </li>
        </ul>
      </div>

      <div class="content">

        <div class="part1">
          <ul class="items">
            <li class="item" @click="goNext('ChangName')">
              <div class="left">
                <i class="ico ico-n1"></i>
                <p class="left-text">{{$t('m.name')}}</p>
              </div>
              <div class="right">
                <p>{{clientInfo.client_name || 'xxx'}}</p>
                <i class="ico ico-n0"></i>
              </div>
              <!--<div class="bottom"></div>-->
            </li>


            <li class="item" @click="goNext('BankCardList')">
              <div class="left">
                <i class="ico ico-n2"></i>
                <p class="left-text">{{$t('m.bankcard')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>

            <li class="item" @click="goNext('AddressList')">
              <div class="left">
                <i class="ico ico-n9"></i>
                <p class="left-text">{{$t('m.address')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>
            <li class="item" @click="goNext('ChangePassword')">
              <div class="left">
                <i class="ico ico-n3"></i>
                <p class="left-text">{{$t('m.loginpassword')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>

            <li class="item" @click="goNext('ChangePay')">
              <div class="left">
                <i class="ico ico-n4"></i>
                <p class="left-text">{{$t('m.paypassword')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>


          </ul>
        </div>

        <div class="part1">
          <ul class="items">
            <li class="item" @click="goNext('Notice')">
              <div class="left">
                <i class="ico ico-n5"></i>
                <p class="left-text">{{$t('m.notice')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>
            <li class="item" @click="goNext('ShareCode')">
              <div class="left">
                <i class="ico ico-n6"></i>
                <p class="left-text">{{$t('m.share')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>

            <li class="item" @click="goNext('Complaint')">
              <div class="left">
                <i class="ico ico-n15"></i>
                <p class="left-text">{{$t('m.complaint')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>

              <!--<div class="content">-->
                <!--<div class="text" @click="toNext('Complaint')">-->
                  <!--<i class="ico ico-n1"></i>-->
                  <!--<p class="title">{{$t('m.complaint')}}</p>-->
                <!--</div>-->

            <li class="item" @click="goNext('Setting')">
              <div class="left">
                <i class="ico ico-n7"></i>
                <p class="left-text">{{$t('m.setting')}}</p>
              </div>
              <div class="right">
                <i class="ico ico-n0"></i>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </scroller>

    <KDialog :title="'修改头像'" :props-show="showAvatar" @close="openAvatar" @onConfirm="submitAvatar">
      <UploadImg class="box-avatar" :loading="show" @upload="getImg"></UploadImg>
    </KDialog>

    <KFooter :tag="5" ref="footer"/>
  </div>
</template>
<script type="text/ecmascript-6">
  import KFooter from '@/components/KFooter'
  import KDialog from '@/components/KDialog'
  import UploadImg from '@/components/UploadImg'
  import axios from 'axios'
  import * as api from '@/api/index'
  import BScroll from 'better-scroll'
  import {mapGetters} from 'vuex'

  const CLS_ON = 'ico-n10'
  const CLS_OFF = 'ico-n11'
  const LENGTH = 5

  export default {
    name: "Mine",
    components: {
      KFooter,
      KDialog,
      UploadImg
    },
    data() {
      return {
        avatar: {},
        showAvatar: false,
        show: false,
        credit: 0
      }
    },
    computed: {
      ...mapGetters(['clientInfo', 'loginInfo', 'signature']),
      itemClasses() {
        let result = []; // 返回的是一个数组,用来遍历输出星星
        let score = Number(this.credit); // 计算所有星星的数量
        for (let i = 0; i < score; i++) { // 整数星星使用on
          result.push(CLS_ON);// 一个整数星星就push一个CLS_ON到数组
        }
        while (result.length < LENGTH) { // 余下的用无星星补全,使用off
          result.push(CLS_OFF);// 类似
        }
        return result;
      },
    },
    created() {
      if (!this.signature.host) {
        this.$store.dispatch('getSignature')
      }

      if (!this.clientInfo.client_id) {
        this.$store.dispatch('clientInfo').then(() => {
          this.credit = this.clientInfo.credit
        })
      } else {
        this.credit = this.clientInfo.credit
      }

    },
    mounted() {

      this.setTableHeight()
      window.onresize = () => setTimeout(() => this.setTableHeight(), 300)
    },
    methods: {
      goNext(where) {
        this.$router.push(`/${where}`)
      },
      getImg(file) {
        this.avatar = file
        // console.log(this.avatar)
        this.syncSubmit()
      },
      openAvatar() {
        this.showAvatar = !this.showAvatar
      },
      showloading() {
        this.show = !this.show
      },
      syncSubmit() {
        const self = this
        self.show = true
        const form = new FormData()
        const filename = this.signature.client_id + new Date().getTime() + this.avatar.name
        form.append('name', filename)
        form.append('key', this.signature.dir + filename)
        form.append('policy', this.signature.policy)
        form.append('OSSAccessKeyId', this.signature.accessid)
        form.append('success_action_status', 200)
        form.append('signature', this.signature.signature)
        form.append('file', this.avatar)
        axios.post(this.signature.host, form, this.config).then(res => {
          this.show = false
          self.avatar.err = ''
          self.avatar.src = `${this.signature.host}/${this.signature.dir}${filename}`
        }).catch(err => {
          self.show = false
          self.avatar.err = '上传图片失败'
        })
      },
      submitAvatar() {
        if (!this.avatar) {
          this.$toast('请选择头像')
          return
        }
        if (this.show) {
          return
        }
        const formData = new FormData()
        formData.append('head_img_url', this.avatar.src)
        this.$store.dispatch('putClientInfo', formData).then(() => {
          this.$store.dispatch('clientInfo')
          this.openAvatar()
        })
      },
      refresh(done) {
        setTimeout(() => {
          this.$store.dispatch('clientInfo').then(() => {
            this.credit = this.clientInfo.credit
          })
          done()
        }, 300)
      },
      loading(done) {
        done()
        // this.$refs.scroller && this.$refs.scroller.finishInfinite(2)
      },
      setTableHeight() {
        // const headHeight = document.querySelector('.m-header').offsetHeight
        const headHeight = 0
        const footerHeight = this.$refs.footer.offsetHeight
        const scroller = this.$refs.scroller.$el
        scroller.style.height = `${window.innerHeight - headHeight - footerHeight}px`
        // scroller.style.marginTop = `${headHeight}px`
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n0 {
    .bg-image('my_enter@2x');
  }

  .ico-n1 {
    .bg-image('my_nickname@2x');
  }

  .ico-n2 {
    .bg-image('my_card@2x');
  }

  .ico-n3 {
    .bg-image('my_password@2x');
  }

  .ico-n4 {
    .bg-image('my_pay@2x');
  }

  .ico-n5 {
    .bg-image('my_announcement@2x');
  }

  .ico-n6 {
    .bg-image('my_share@2x');
  }

  .ico-n7 {
    .bg-image('my_setting@2x');
  }

  .ico-n8 {
    .bg-image('icon_order@2x');
  }

  .ico-n9 {
    .bg-image('my_address@2x');
  }

  .ico-collect {
    .bg-image('shoucang@2x');
  }

  .ico-n11 {
    .bg-image('icon_diamond@2x_88')
  }

  .ico-n10 {
    .bg-image('icon_diamond@2x')
  }

  .ico-n12 {
    .bg-image('my_assets@2x')
  }

  .ico-n13 {
    .bg-image('my_order@2x')
  }

  .ico-n14 {
    .bg-image('my_collection@2x')
  }
  .ico-n15 {
    .bg-image('my_feedback@2x')
  }
  .mine {
    width: 100%;
    height: 100%;
    .m-top {
      position: sticky;
      top: 0;
      left: 0;
      box-sizing: border-box;
      height: 2.5rem; // 44 + 20 : top, 98 : bottom
      background: #020202;
      // border-bottom: 1px solid @border-color;
      color: #fff;
      z-index: 52;
      .title {
        line-height: 2.5rem;
        text-align: center;
        color: #fff;
        font-size: @font-xm;
      }
    }
    .head {
      position: relative;
      width: 100%;
      height: 10.5rem;
      background: url("http://kci-pic.oss-cn-hangzhou.aliyuncs.com/static/img/layer_filter@2x.08a07b1.png") no-repeat;
      background-size: cover;
      .img-bg {
        position: absolute;
        left: 50%;
        top: 37%;
        transform: translate(-50%, -50%);
        width: 3.25rem;
        height: 3.25rem;
        border-radius: 50%;
        border: 3px solid #f0daa6;
      }
      .head-bg {
        position: absolute;
        left: 50%;
        top: -7%;
        transform: translate(-50%, -50%);
        width: 2rem;
        height: 2rem;
        z-index: -3;
        .bg-image('head');
      }
      .center {
        position: absolute;
        left: 50%;
        top: 43%;
        transform: translate(-50%, -50%);
        text-align: center;
        img {
          width: 3.3rem;
          height: 3.3rem;
          border-radius: 50%;
        }
        .head-text {
          margin-top: .3rem;
          font-size: @font-s;
          color: @white-color;
        }
      }
      .credit {
        position: absolute;
        left: 50%;
        top: 70%;
        transform: translate(-50%, -50%);
        text-align: center;
        margin: .2rem 0;
        p {
          display: inline-block;
          font-size: .7rem;
          color: @white-color;
        }
        i {
          display: inline-block;
          vertical-align: middle;
          width: .8rem;
          height: .8rem;
        }
      }
    }

    .middle {
      position: relative;
      top: -2.5rem;
      background: #fff;
      padding: 0 .5rem;
      font-size: @font-s;
      margin: .8rem;
      box-shadow: 0 5px 20px 0 rgba(51, 51, 51, 0.1);
      border-radius: 10px;

      ul {
        display: flex;
      }

      .part0 {
        width: 5rem;
        flex:1;
        /*background: red;*/

        i {
          width: 2rem;
          height: 2rem;
          display: block;
          margin: 0.5rem auto 0.1rem;
        }
        p {
          text-align: center;
          margin-bottom: 0.5rem;
          /*padding-bottom: 2rem;*/
        }
      }

    }

    .content {
      position: relative;
      top: -2.5rem;
      margin: 0 .8rem;
      .part1 {
        background-color: @white-color;
        border-radius: 10px;
        .items {
          .item {
            display: flex;
            justify-content: space-between;
            padding: .7rem .5rem;
            //border-bottom: 1px solid @border-color;
            font-size: .7rem;
            color: @text-color;
            &:last-child {
              border: none;
            }
            .left {
              display: flex;
              justify-content: space-between;
              i {
                align-self: center;
                width: 1rem;
                height: 1rem;
              }
              p {
                align-self: center;
                margin-left: .3rem;
              }
            }
            .right {
              display: flex;
              justify-content: space-between;
              p {
                align-self: center;
                margin-right: .3rem;
                color: @gray-color;
              }
              i {
                align-self: center;
                width: 0.5rem;
                height: 0.5rem;
              }
            }
            /*.bottom {*/
              /*width: 15rem;*/
              /*height: 1px;*/
              /*background: #e9e9e9;*/
              /*display: flex;*/
              /*align-items:flex-end*/
            /*}*/
          }

        }
      }
      .part1:first-child {
        margin-bottom: .5rem;
      }
    }
  }

</style>
