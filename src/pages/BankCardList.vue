<template>
  <div class="BankCardList">
    <KTop :title="'我的银行卡'"></KTop>

    <div class="card-box" v-if="bankCardList.length > 0">

      <div class="container"
           v-for="b in bankCardList"
           :key="b.card_id">
        <div
          class="card"
          @click="switchAddr(b.card_id)"
          :class="[bTag == b.card_id && 'z-index']"
          :style="{backgroundImage: color(b.rand_num)}"
        >
          <div class="top">
            <i class="ico ico-n1"></i>
            <!--<p class="num">{{b.card_num_end}}</p>-->
          </div>
          <div class="center">
            <p class="title">{{b.bank}}</p>
            <p class="card-num">{{b.card_num}}</p>
          </div>

        </div>
        <div class="box-btn" v-show="b.card_id == Id">
          <span class="default" @click.stop="sure(b.card_id)">设置默认</span>
          <!--<span class="edit" @click.stop="editBankCard(b)">编辑</span>-->
          <span class="del" @click.stop="delBankCard(b.card_id)">解除绑定</span>
        </div>
      </div>
    </div>

    <!--<div class="btn-sure" @click="sure">确认</div>-->

    <button class="band-btn" @click="toEdit()">+添加银行卡</button>
  </div>

</template>

<script type="text/ecmascript-6">
  import KTop from '@/components/KTop'
  import {mapGetters} from 'vuex'

  export default {
    name: "BankCardList",
    components: {
      KTop
    },
    data() {
      return {
        bTag: false,
        Id: '',
        delId: '',
      };
    },
    computed: {
      ...mapGetters(['bankCardList']),
    },
    created() {
      this.$store.dispatch('bankCardList').then(res => {
        this.bankCardList.forEach(item => {
          if (item['is_default'] == 1) this.bTag = item['card_id']
        })
      })
    },
    methods: {
      toEdit() {
        this.$router.push('/BankCardEdit')
      },
      switchAddr(id) {
        this.Id = id
      },
      sure(id) {
        // if (!this.bTag) {
        //   this.$toast('请选择银行卡')
        //   return;
        // }
        this.$store.dispatch('defaultBankCard', {
          'card_id': id
        }).then(res => this.$toast('设置成功'))
      },
      editBankCard(item) {
        this.$router.push({name: 'BankCardEdit', params: {item}})
      },
      delBankCard(id) {
        this.$dialog('是否解绑该银行卡？', () => {
          this.$store.dispatch('delBankCard', {
            'card_id': id
          }).then(res => {
            this.$toast('银行卡已解绑!')
            this.bTag == id && (this.bTag = '')
          })
        })
      },
      color(num) {
        switch (Number(num)) {
          case 1:
            return '#1E88E5'
          case 2:
            return 'linear-gradient(-90deg,#ff4c6a 0%,#ff5e9a 100%),linear-gradient(#e06820,#e06820)'
          case 3:
            return '#F0381F'
          case 4:
            return '#00ca9d'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .ico-n1 {
    .bg-image('tubiao@2x');
  }

  .BankCardList {
    width: 100%;
    height: 100%;
    background: #1c2022;
    .card-box {
      padding: .5rem 1rem;
      .card {
        height: 5rem;
        /*background: #fff;*/
        background-image: linear-gradient(-90deg, #42a5fe 0%, #41d5ff 100%), linear-gradient(#e06820, #e06820);
        box-shadow: 0 2px 16px 1px rgba(0, 0, 0, 0.35);
        border-radius: 8px;
        display: flex;
        margin-bottom: .5rem;
        .top {
          flex: 0 0 4rem;
          i {
            display: inline-block;
            position: relative;
            top: 1rem;
            left: .5rem;
            width: 2.5rem;
            height: 2.5rem;
          }
        }
        .center {
          /*margin-top: 2.5rem;*/
          /*display: flex;*/
          flex: 1;
          color: @white-color;
          position: relative;
          top: 1rem;
          .title {
            font-size: @font-s;
            margin-bottom: .5rem;
          }
          .card-num {
            font-size: @font-xm;
          }
        }
      }
    }
    .box-btn {
      margin: .6rem 0;
      font-size: @font-s;
      text-align: right;
      .default {
        padding: .2rem .5rem;
        background: @white-color;
        color: #5498ff;
        border: 1px solid #5498ff;
        border-radius: 1rem;
      }
      .del {
        padding: .2rem .5rem;
        background: @white-color;
        color: #5498ff;
        border: 1px solid #5498ff;
        border-radius: 1rem;
      }
    }
    .band-btn {
      width: 100%;
      position: fixed;
      bottom: 0;
      padding: .5rem;
      background: @white-color;
      font-size: @font-s;
    }
  }

  .btn-sure {
    font-size: @font-s;
    width: 90%;
    margin: 2rem auto;
    padding: .5rem 0;
    text-align: center;
    color: #fff;
    background: @primary-active;
    border-radius: 4px;
  }
</style>
