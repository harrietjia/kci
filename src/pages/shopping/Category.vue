<template lang="html">
  <div class="wrapper category">
    <div class="head">
      <i class="ico ico-back" @click="back"></i>
      <form action="#" onsubmit="return false;" class="input-kw-form">
        <input type="text" style="display:none;"/>
        <input
          type="search"
          class="form-input"
          v-model="keyword"
          placeholder="搜索你想要的商品"
          @keyup.enter.prevent="search"
        >
      </form>
    </div>
    <div class="body">
      <ul class="menu">
        <li class="menu-item"
            :class="[tabTag == c.category_id && 'active']"
            v-for="c of levelOne"
            @click="nav(c.category_id)"
        >{{c.category_name}}
        </li>
      </ul>
      <div class="content">
        <category-item
          :title="l.category_name"
          :list="l.level3"
          v-for="l of levelOther"
          :key="l.category_id"
          @onConfirm="touchItem"
        />
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CategoryItem from '@/components/CategoryItem'

  export default {
    name: 'Category',
    components: {
      CategoryItem,
    },
    data() {
      return {
        keyword: '',
        tabTag: '',
      }
    },
    created() {
      this.$store.dispatch('levelOne').then(res => {
        this.nav(this.levelOne[0].category_id)
      })
    },
    computed: {
      ...mapGetters(['levelOne', 'levelOther', 'pageList'])
    },
    methods: {
      back() {
        if (this.pageList.length <= 2) {
          this.$router.push('/Home')
        } else {
          this.$router.go(-1)
        }
      },
      search() {
        // const index = this.pageList.length - 2
        // const page = this.pageList[index]
        this.$router.push({path: '/KCIshop', query: {keyword: this.keyword}})
      },
      nav(id) {
        this.tabTag = id
        this.$store.dispatch('levelOther', {
          'category_id': id
        })
      },
      touchItem(id) {
        // const index = this.pageList.length - 2
        // const page = this.pageList[index]
        this.$router.push({path: '/KCIshop', query: {tag: id}})
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .category {
    display: flex;
    flex-direction: column;
    .head {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 2.5rem;
      background: #1c1c1c;
      border-bottom: 1px solid @border-color;
      .ico-back {
        flex: 0 0 2rem;
        width: .8rem;
        height: .8rem;
        .bg-image('back_white');
      }
      .input-kw-form {
        display: flex;
        width: 75%;
        height: 1.5rem;
        background: #EEEEEE;
        border-radius: 20px;
        padding: 0 1rem;
        margin: 0 .5rem;
      }
      .form-input {
        align-self: center;
        width: 98%;
        background: #EEEEEE;
        font-size: @font-s;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .body {
      flex: 1;
      background: #fff;
      overflow: hidden;
      display: flex;
    }
    .menu {
      /*float: left;*/
      flex: 0 0 3.5rem;
      height: 100%;
      box-sizing: border-box;
      text-align: center;
      border-right: 1px solid @border-color;
      overflow-y: auto;
      font-size: @font-xs;
      &::-webkit-scrollbar {
        display: none;
      }
      .menu-item {
        min-height: 2rem;
        line-height: 2rem;
        box-sizing: border-box;
        background: #f5f5f5;
        border-bottom: 1px solid white;
      }
      .menu-item.active {
        background: white;
        border-left: 5px solid @primary-active;
        color: @primary-active;
      }
    }
    .content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
