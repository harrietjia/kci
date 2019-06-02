<template>
  <div class="Setting">
    <KTop :title="'设置'"></KTop>

    <div class="content">
      <!--<div class="text" @click="toNext('Complaint')">-->
        <!--<i class="ico ico-n1"></i>-->
        <!--<p class="title">{{$t('m.complaint')}}</p>-->
      <!--</div>-->
      <div class="text" @click="changeLangEvent">
        <i class="ico ico-n1"></i>
        <p class="title">{{$t('m.changelanguages')}}</p>
        <i class="ico ico-n0 enter"></i>
      </div>

      <div class="text">
        <i class="ico ico-n2"></i>
        <p class="title">{{$t('m.about')}}</p>
        <i class="ico ico-n0 enter"></i>
      </div>

      <!--<div class="text">-->
        <!--<i class="ico ico-n3"></i>-->
        <!--<p class="title">{{$t('m.updata')}}</p>-->
        <!--<p class="v">当前为最新版本</p>-->
        <!--<i class="ico ico-n0 enter"></i>-->
      <!--</div>-->

    </div>

    <KButton :title="'退出登录'" @clickBtn="logout()"></KButton>
  </div>
</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import KButton from '@/components/KButton'
  import {mapGetters} from 'vuex'

  const BASE_URL = 'http://dev-kci.ffun360.com/'

  export default {
    // name:'More',
    name: "Setting",
    mounted() {
      this.setup()
    },
    components: {
      KTop,
      KButton
    },
    methods: {
      setup() {
        // const DEFAULT_LANG = 'zh-CN'
        this.lang = window.localStorage.getItem('localeLanguage')  //保留用户语言习惯

        if (!this.lang) {
          this.lang = navigator.language // 判断浏览器语言
          window.localStorage.setItem('localeLanguage', this.lang)
        }
        this.$i18n.locale = this.lang
      },
      logout() {
        const url = process.env.NODE_ENV === 'production' ? '/site/login_out' : `${BASE_URL}site/login_out`
        this.$store.dispatch('clearLoginStore')
        this.$store.dispatch('clearUserInfo')
        this.$store.commit('CLEAER_DATA')
        location.href = url
        // this.$router.push('/Login')
      },
      toNext(where) {
        this.$router.push(`/${where}`)
      },
      // changeLangEvent() {
      //   this.$dialog('确定切换语言吗?', () => {
      //     if (this.lang === 'zh-CN') {
      //       this.lang = 'en-US';
      //       this.$i18n.locale = this.lang;//关键语句
      //     } else {
      //       this.lang = 'zh-CN';
      //       this.$i18n.locale = this.lang;//关键语句
      //     }
      //     window.localStorage.setItem('localeLanguage', this.lang)
      //   })
      // }
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
    .bg-image('my_language@2x');
  }

  .ico-n2 {
    .bg-image('my_about@2x');
  }

  .ico-n3 {
    .bg-image('my_update@2x');
  }


  .Setting {
    width: 100%;
    height: 100%;
    .content {
      background: @white-color;

      .text {
        display: flex;
        padding: 1rem 1rem;
        border-bottom: 1px solid @border-color;
        i {
          width: 1.1rem;
          height: 1.1rem;
          /*line-height: 1.5rem;*/
          /*flex: 0 0 1rem;*/
          margin-right: .2rem;
          margin-left: -0.5rem;

        }
        .title {
          font-size: @font-s;
          color: @text-color;
          flex: 1;
        }
        .v {
          font-size: @font-s;
          /*color: #d5d5d5;*/
          /*line-height: 1.5rem;*/
          /*flex: 0 0 1rem;*/
          /*margin-right: 0.5rem;*/
        }
        i.enter {
          width: 0.5rem ;
          height: 0.5rem;
          margin-top: 0.2rem;
        }
      }
    }
  }
</style>
