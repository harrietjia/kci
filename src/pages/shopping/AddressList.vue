<template>
  <div class="wrapper AddressList">
    <KTop :title="'选择收货地址'"></KTop>
    <ul class="list-addr">
      <li class="addressBox" v-for="a in addressList" :key="a.dev_id" @click="choose(a)">
        <p class="name">收货人：{{a.consignee}} <span class="iphone-num">{{a.mobilephone}}</span></p>
        <p class="address-desc">收获地址：{{a.province + a.city + a.area + a.street}}</p>
        <div class="editBox clearfix">
          <div class="f-left" @click="sure(a.dev_id)">
            <p><i class="radius-icon " :class="[aTag == a.dev_id ? 'ico-checked' : 'ico-check' ]"></i>设置为默认地址</p>
          </div>
          <div class="f-right">
            <button class="edit-btn" @click.self.stop="editAddress(a.dev_id)">编辑</button>
            <button class="edit-btn" @click.self.stop="delAddress(a.dev_id)">删除</button>
          </div>
        </div>
      </li>
    </ul>
    <div class="li-addr">
      <!--<div class="add">＋</div>-->
      <div class="content">
        <router-link tag="div" :to="{ name: 'AddressEdit' }">新增收货地址</router-link>
      </div>
    </div>
    <!--<div class="btn-sure" @click="sure">确认</div>-->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import KTop from '@/components/KTop'

  export default {
    name: 'AddressList',
    data() {
      return {
        aTag: '',
      };
    },
    components: {
      KTop
    },
    created() {
      this.getAddress()
    },
    computed: {
      ...mapGetters(['addressList'])
    },
    methods: {
      choose(address) {
        if (!this.$route.query.confirmOrder) {
          return
        }
        this.$store.commit('SET_ADDRESS', {address})
        this.$router.go(-1)
      },
      getAddress() {
        this.$store.dispatch('addressList').then(res => {
          this.addressList.forEach(val => {
            if (val['is_default'] == '1') this.aTag = val['dev_id']
          })
        })
      },
      sure(aTag) {
        if (!aTag) {
          this.$toast('请选择地址')
          return;
        }
        if (this.aTag === aTag) {
          return
        }
        this.aTag = aTag
        this.$store.dispatch('defaultAddress', {
          'dev_id': aTag
        }).then(
          // res => this.$router.go(-1)
        )
      },
      editAddress(id) {
        this.$router.push({path: '/AddressEdit', name: 'AddressEdit', params: {id}})
      },
      delAddress(id = '') {
        this.$dialog('是否删除该地址？', (res) => {
          this.$store.dispatch('delAddress', {
            'dev_id': id
          }).then(res => {
            this.$toast('地址已删除!');
            this.aTag == id && (this.aTag = '')
            this.getAddress()
          })
        })
      },
    }
  };
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .iphone-num {
    font-size: @font-s;
  }

  .ico-check {
    border: 1px solid black;
    border-radius: 50%;
  }

  .ico-checked {
    //.bg-image(success);
    background: @primary-active;
    border-radius: 50%;
    .bg-image('check');
  }

  .radius-icon {
    /*border: 1px solid black;*/
    display: inline-block;
    width: .7rem;
    height: .7rem;
    margin-right: 0.5rem;
  }

  .addressBox {
    padding: 0 0.8rem;
    background-color: #fff;
    margin-bottom: .5rem;
    .name {
      font-size: @font-s;
      padding: .5rem 0;
    }
    .address-desc {
      font-size: @font-s;
      color: @disable-color;
      line-height: 1.1rem;
      padding-bottom: 0.5rem;
    }
    .editBox {
      border-top: 1px solid @border-color;
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: @font-s;
      .edit-btn {
        font-size: .6rem;
        padding: 0.2rem 1rem;
        background-color: #ffffff;
        border-radius: 4px;
        border: 1px solid @disable-color;
        &:focus {
          outline: none;
        }
      }
    }
  }

  .li-addr {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: 1px solid @border-color;
    background: @primary-active;
    color: white;
  }

  .li-addr:last-child {
    border: none;
  }

  .content {
    /*margin-left: 4rem;*/
    font-size: @font-s;
  }

  .add {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 1rem;
    font-weight: 700;
    color: @disable-color;
  }

  .btn-sure {
    font-size: @font-s;
    width: 90%;
    margin: .5rem auto;
    padding: .5rem 0;
    text-align: center;
    color: @white-color;
    background: @primary-active;
    border-radius: 4px;
  }
</style>
