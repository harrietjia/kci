<template lang="html">
  <div class="wrapper idCheck">
    <div class="header">
      <div class="seal" v-if="state !== -1">当前审核状态：<span>{{stateInfo}}</span></div>
      <li class="item">
        <p class="left">公司名称 <span class="red">*</span></p>
        <div class="right">
          <input class="input" maxlength="50" type="text" placeholder="请输入所属公司名称" v-model="companyName">
        </div>
      </li>
      <li class="item">
        <p class="left">营业城市 <span class="red">*</span></p>
        <div class="right sign">
          <p class="state " @click="cancel">{{site || '请选择城市'}}</p>
        </div>
      </li>
      <li class="item">
        <p class="left">法人姓名 <span class="red">*</span></p>
        <div class="right">
          <input class="input" type="text" placeholder="请输入法人姓名" v-model="name">
        </div>
      </li>
      <li class="item">
        <p class="left">联系方式 <span class="red">*</span></p>
        <div class="right">
          <input class="input" type="text" placeholder="请输入联系电话" v-model="phone">
        </div>
      </li>
    </div>
    <div class="body">
      <div class="item">
        <p class="left title">法人证件照 <span class="red">*</span></p>
      </div>
      <ul class="containBox">
        <li @click="touchImg(1)">
          <!--<p class="add">+ 添加身份证正面照</p>-->
          <upload-img :props-src="idCardUp.src" :loading="this.idCardUp.loading" @upload="getImg"/>
          <p class="tip">上传法人身份证正面照</p>
          <p class="err" v-show="idCardUp.err">{{idCardUp.err}}</p>
        </li>
        <li @click="touchImg(2)">
          <!--<p class="add">+ 添加身份证反面照</p>-->
          <upload-img :props-src="idCardDown.src" @upload="getImg"/>
          <p class="tip">上传法人身份证反面照</p>
          <p class="err" v-show="idCardDown.err">{{idCardDown.err}}</p>
        </li>
        <li @click="touchImg(3)">
          <!--<p class="add">+ 添加营业执照</p>-->
          <upload-img :props-src="license.src" @upload="getImg"/>
          <p class="tip">上传营业执照</p>
          <p class="err" v-show="license.err">{{license.err}}</p>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="nctouch-inp-con mb25" v-if="state !== 0 && state !== 1">
        <div class="form-btn ok" @click="submit">
          <a href="javascript:void(0);" class="btn">确认</a>
        </div>
      </div>
      <div class="nctouch-inp-con mb25" v-if="state === 0">
        <div class="form-btn" @click="submit">
          <a href="javascript:void(0);" class="btn">等待审核</a>
        </div>
      </div>
      <!--<div class="confirm" @click="submit">确认</div>-->
    </div>
    <vue-pickers
      :show="showPickers"
      :selectData="pickData3"
      @cancel="cancel"
      @confirm="confirm"
      v-if="renderPickers"
    />

  </div>
</template>
<script>
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import UploadImg from '@/components/UploadImg'
  import vuePickers from 'vue-pickers'
  import KButton from '@/components/KButton'
  import * as API from '@/api/index'

  export default {
    name: 'ETPCheck',
    components: {
      UploadImg,
      vuePickers,
      KButton
    },
    data() {
      return {
        state: -1,
        stateInfo: '',
        name: '',
        companyName: '',
        phone: '',
        imgTag: '',
        idCardUp: {
          file: null,
          src: '',
          loading: false,
          err: '',
        },
        idCardDown: {
          file: null,
          src: '',
          loading: false,
          err: '',
        },
        license: {
          file: null,
          src: '',
          loading: false,
          err: '',
        },
        pickData3: {
          columns: 3,
          link: true,
          pData1: [],
          pData2: [],
          pData3: [],
        },
        // isRequest: false,
        renderPickers: false,
        showPickers: false,
        result: null,
        config: {
          timeout: 60000,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        typeList: [],
        showType: false,
        type: {},
      }
    },
    async created() {
      // this.$store.dispatch('getSignature')
      const login = await  API.getSignature()

      if (login.errorCode === 0) {
        const data = login.data
        this.$store.commit('RECEIVE_SIGNATURE', {data})
      }

      if (login.data.errorCode < 0) {
        this.$router.push({path: '/Login', name: 'Login', params: {to_url: 1}})
        return
      }

      if (Object.keys(this.zone).length == 0) {
        this.$store.dispatch('zone').then(res => {
          this.setZone()
          this.renderPickers = true
        })
      } else {
        this.setZone()
        this.renderPickers = true
      }

      this.$store.dispatch('getCompanyAuth').then(res => {
        const data = res.data
        if (!data || data.length == 0) return
        this.state = Number(data.state)
        this.stateInfo = data.state_info
        this.name = data.legal_person_name
        this.companyName = data.company_name
        this.phone = data.mobilephone
        this.id = data.credit_code
        this.type = data.type

        this.result = {
          select1: {
            text: data.province,
            value: data.province_id,
          },
          select2: {
            text: data.city,
            value: data.city_id,
          },
          select3: {
            text: data.district,
            value: data.district_id,
          },
        }

        this.idCardUp.src = data.id_card_front_url
        this.idCardDown.src = data.id_card_rear_url
        this.license.src = data.business_license_url
      })

    },
    computed: {
      ...mapGetters(['zone', 'signature']),
      site() {
        if (!this.result) return ''
        const {select1, select2, select3} = this.result
        return `${select1.text} ${select2.text} ${select3 ? select3.text : ''}`
      }
    },
    methods: {
      setZone() {
        this.pickData3.pData1 = this.zone.provs_data
        this.pickData3.pData2 = this.zone.citys_data
        this.pickData3.pData3 = this.zone.dists_data
      },
      cancel() {
        this.showPickers = !this.showPickers
      },
      confirm(result) {
        this.result = result
        this.cancel()
      },
      touchImg(tag) {
        this.imgTag = tag
      },
      getImg(file) {
        switch (this.imgTag) {
          case 1:
            this.idCardUp.file = file
            this.syncSubmit(this.idCardUp, 'id_card_up')
            break
          case 2:
            this.idCardDown.file = file
            this.syncSubmit(this.idCardDown, 'id_card_down')
            break
          case 3:
            this.license.file = file
            this.syncSubmit(this.license, 'business_license_url')
            break
        }
      },
      syncSubmit(obj, name) {
        if (this.state === 0) {
          this.$toast('此操作不会上传图片，请等待审核结果')
          return
        }
        if (this.state === 1) {
          this.$toast('您已通过审核，无需再次上传')
          return
        }
        obj.loading = true
        const form = new FormData()
        const filename = this.signature.client_id + new Date().getTime() + obj.file.name
        form.append('name', filename)
        form.append('key', this.signature.dir + filename)
        form.append('policy', this.signature.policy)
        form.append('OSSAccessKeyId', this.signature.accessid)
        form.append('success_action_status', 200)
        form.append('signature', this.signature.signature)
        form.append('file', obj.file)
        axios.post(this.signature.host, form, this.config).then(res => {
          obj.loading = false
          obj.err = ''
          obj.src = `${this.signature.host}/${this.signature.dir}${filename}`
        }).catch(err => {
          obj.loading = false
          obj.err = '上传图片失败'
        })
      },
      checkName() {
        const regx = /^[\u4e00-\u9fa5]{2,5}$/i
        if (!this.name || !regx.test(this.name)) {
          this.$toast('请输入真实姓名')
          return false
        }
        return true
      },
      checkPhone() {
        const regx = /^(1)\d{10}$/
        if (!this.phone || !regx.test(this.phone)) {
          this.$toast('请输入正确的手机号码')
          return false
        }
        return true
      },
      checkFormData() {
        if (this.state === 0) {
          this.$toast('请等待审核结果')
          return false
        }
        if (this.state === 1) {
          this.$toast('已通过审核，无需再次申请')
          return false
        }
        if (!this.companyName) {
          this.$toast('请输入公司名称')
          return false
        }
        if (Object.keys(this.result.select1).length == 0) {
          this.$toast('请选择地址')
          return false
        }
        if (!this.idCardUp.src || this.idCardUp.err) {
          this.$toast('请确认法人身份证正面照')
          return false
        }
        if (!this.idCardDown.src || this.idCardDown.err) {
          this.$toast('请确认法人身份证反面照')
          return false
        }
        if (!this.license.src || this.license.err) {
          this.$toast('请确认营业执照')
          return false
        }
        return true
      },
      submit() {
        if (!this.checkName()) return
        if (!this.checkPhone()) return
        if (!this.checkFormData()) return
        // if (this.isRequest) return
        this.$loading()
        // this.isRequest = true
        const {select1, select2, select3} = this.result

        const form = {
          'legal_person_name': this.name,
          'company_name': this.companyName,
          'mobilephone': this.phone,
          'credit_code': this.id,
          'province': select1.text,
          'province_id': select1.value,
          'city': select2.text,
          'city_id': select2.value,
          'district': select3.text,
          'district_id': select3.value,
          'id_card_front_url': this.idCardUp.src,
          'id_card_rear_url': this.idCardDown.src,
          'business_license_url': this.license.src
        }

        this.$store.dispatch('companyAuth', form).then(res => {
          this.$loading(0)
          this.$toast('已提交申请')
          setTimeout(() => {
            this.$router.push('/Home')
          }, 1500)
        }).catch(err => {
          // this.isRequest = true
          this.$loading(0)
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .seal {
    display: inline-block;
    width: 100%;
    height: 2rem;
    padding-top: .5rem;
    text-align: center;
    font-size: .8rem;
    line-height: 2rem;
    background: @white-color;
    span {
      color: @primary-active;
    }
  }

  .header {
    position: relative;
  }

  .item {
    height: 3rem;
    display: flex;
    background: #fff;
    line-height: 3rem;
    margin-bottom: 1px;
    .left {
      width: 3.5rem;
      color: @black-color;
      font-size: @font-s;
      padding-left: 1rem;
      .red {
        color: red;
      }
    }
    .right {
      flex: 1;
      color: @text-color;
      font-size: @font-s;
      .input {
        border: none;
        padding: 0.7rem 1rem;
        &:focus {
          outline: none;
        }
      }
      .state {
        color: @text-color;
        font-size: @font-xs;
        font-weight: normal;
      }
    }
    .state {
      padding: 0 1rem;
      height: 3rem;
      line-height: 3rem;
    }
  }

  .body {
    margin-top: 13.3rem;
    .title {
      font-size: @font-s;
      color: @black-color;
      width: 100%;
    }
    .containBox {
      padding-bottom: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #fff;
      li {
        height: 11rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .add {
          width: 11rem;
          padding: .3rem 1rem;
          text-align: center;
          border: 1px solid @primary-active;
          color: @primary-active;
          font-size: @font-s;
        }
      }
      .tip {
        font-size: @font-s;
        color: @text-color;
        margin-top: 1rem;
        text-align: center;
      }
    }
    .err {
      text-align: center;
      color: @danger-color;
    }
  }

  .footer {
    margin: 1rem;
    .confirm {
      width: 100%;
      border: none;
      color: #fff;
      background: @primary-color;
      padding: 1.2rem 0;
      text-align: center;
      font-size: 1.7rem;
      border-radius: 4px;
    }
  }

  .sign {
    position: relative;
  }

  .sign:after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    right: 1.2rem;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    //.bg-image(right);
  }
</style>
