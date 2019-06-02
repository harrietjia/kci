<template lang="html">
  <div class="wrapper">
    <KTop :title="'新增收货地址'"></KTop>
    <div class="box-edit">
      <div class="row bottom">
        <div class="left">收货人姓名</div>
        <div class="right">
          <input type="text" placeholder="请填写姓名" v-model="name">
        </div>
      </div>
      <div class="row bottom">
        <div class="left">手机号码</div>
        <div class="right">
          <input type="tel" placeholder="请填写手机号码" v-model="phone">
        </div>
      </div>
      <div class="row bottom">
        <div class="left">选择地址</div>
        <div class="right bottom addr">
          <input type="text" readonly placeholder="请选择地址" v-model="result" onfocus="this.blur()" @click="openArea">
        </div>
      </div>
      <div class="row bottom">
        <div class="left">详细地址</div>
        <div class="right bottom">
          <input type="text" placeholder="请具体到门牌号" v-model="detail">
        </div>
      </div>
    </div>
    <div class="submit" @click="comfirm">保存</div>
    <vue-pickers
      :show="show"
      :selectData="pickData3"
      @cancel="openArea"
      @confirm="getArea"
      v-if="renderPickers"
    />
  </div>
</template>

<script>
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'
  import vuePickers from 'vue-pickers'

  export default {
    name: 'AddressEdit',
    components: {
      vuePickers,
      KTop
    },
    data() {
      return {
        id: '',
        show: false,
        province: '',
        city: '',
        area: '',
        result: '',
        name: '',
        phone: '',
        detail: '',
        pickData3: {
          columns: 3,
          link: true,
          pData1: [],
          pData2: [],
          pData3: [],
        },
        renderPickers: false,
      }
    },
    created() {
      if (Object.keys(this.zone).length == 0) {
        this.$store.dispatch('zone').then(res => {
          this.setZone()
          this.renderPickers = true
        })
      } else {
        this.setZone()
        this.renderPickers = true
      }

      this.id = this.$route.params.id
      if (!this.id) return
      const item = this.addressList.filter(item => item['dev_id'] == this.id)[0]
      this.name = item['consignee']
      this.phone = item['mobilephone']
      this.detail = item['street']
      this.result = item['province'] + item['city'] + item['area']
      this.province = {
        'text': item['province'],
        'value': item['province_id']
      }
      this.city = {
        'text': item['city'],
        'value': item['city_id']
      }
      this.area = {
        'text': item['area'],
        'value': item['area_id']
      }
    },
    computed: {
      ...mapGetters(['addressList', 'zone'])
    },
    methods: {
      setZone() {
        this.pickData3.pData1 = this.zone.provs_data
        this.pickData3.pData2 = this.zone.citys_data
        this.pickData3.pData3 = this.zone.dists_data
      },
      openArea() {
        this.show = !this.show
      },
      getArea(result) {
        this.province = result.select1
        this.city = result.select2
        this.area = result.select3 || {value: '', text: ''}
        this.result = this.province.text + this.city.text + this.area.text
        this.openArea()
      },
      comfirm() {
        if (this.id) {
          this.$store.dispatch('editAddress', {
            'dev_id': this.id,
            'consignee': this.name,
            'mobilephone': this.phone,
            'province': this.province,
            'city': this.city,
            'area': this.area,
            'street': this.detail
          }).then(res => this.$router.go(-1))
          return
        }
        if (!this.name) {
          this.$toast('请输入联系人')
          return
        }
        const regx = /^(1)\d{10}$/
        if (!this.phone || !regx.test(this.phone)) {
          this.$toast('请输入正确的手机号码')
          return
        }
        if (!this.result) {
          this.$toast('请选择地址')
          return
        }
        if (!this.detail) {
          this.$toast('请输入详细地址')
          return
        }
        this.$store.dispatch('addAddress', {
          'consignee': this.name,
          'mobilephone': this.phone,
          'province': this.province,
          'city': this.city,
          'area': this.area,
          'street': this.detail
        }).then(res => this.$router.go(-1))
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .box-edit {
    padding: 0 1rem;
    background-color: #fff;
  }

  .row:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
    line-height: 0;
  }

  .left {
    float: left;
    width: 3.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: @font-s;
  }

  .right {
    position: relative;
    margin-left: 4rem;
  }

  .bottom {
    border-bottom: 1px solid @border-color;
  }

  .bottom:last-child {
    border: none;
  }

  .right > input {
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    border: none;
    &:focus {
      outline: none;
    }
  }

  .addr {
    position: relative;
  }

  .addr:after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    right: 0.5rem;
    transform: translateY(-50%);
    //.bg-image(right);
    background-size: cover;
    background-position: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  .submit {
    font-size: @font-s;
    width: 90%;
    padding: .5rem 0;
    text-align: center;
    color: @white-color;
    background-color: @primary-active;
    margin: 1rem auto;
    border-radius: 4px;
  }
</style>
