<template lang="html">
  <div class="category-item">
    <div class="head">
      <p class="title">{{title}}</p>
    </div>
    <ul class="category-list">
      <li
        class="item"
        v-for="l of list" :key="l.category_id"
        @click="touchItem(l.category_id)"
      >
        <img class="category-img" :src="l.category_pic_url" alt="ico">
        <p class="item-txt">{{l.category_name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'CategoryItem',
    props: {
      title: {
        type: String,
        default: '',
      },
      list: {
        type: Array,
        default: [],
      },
    },
    methods: {
      touchItem(id) {
        this.$emit('onConfirm', id)
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/styles/varible";
  @import "~@/assets/styles/mixin";

  .category-item {
    padding: 1rem 0;
    font-size: @font-s;
    .head {
      display: flex;
      justify-content: center;
    }
    .title {
      display: inline-block;
      position: relative;
      text-align: center;
      &::after,
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        display: block;
        width: 100%;
        height: 1px;
        background: #ccc;
      }
      &::before {
        transform: translate(-120%, -50%);
      }
      &::after {
        transform: translate(120%, -50%);
      }
    }
    .category-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item {
        width: 33.3%;
        box-sizing: border-box;
        text-align: center;
        padding-top: 1rem;
      }
    }
    .category-img {
      width: 2rem;
      height: 2rem;
      background: #fff;
      margin-bottom: .3rem;
      /*border-radius: 50%;*/
    }
    .item-txt {
      color: @disable-color;
    }
  }
</style>
