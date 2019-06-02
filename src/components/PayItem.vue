<template lang="html">
<div class="order" @click="confirm">
    <ul class="flex">
        <li class="box-left">
            <div class="box-img">
                <img :src="item.store_logo_url" alt="logo">
            </div>
        </li>
        <li class="box-right">
            <p class="name">{{item.store_name}}</p>
            <p class="level">好:{{item.score}}分
                <span class="info">{{item.order_total}}+人消费</span>
            </p>
            <p class="map">{{item.city}}，{{item.distance}}，{{item.detail_address}}</p>
            <p class="price">&yen;<span>{{item.minimum_price}}</span>起</p>
            <ul class="box-tag flex">
                <!-- <span class="tag">{{order.attrs}}</span> -->
                <li v-for="t of item.hotel_label"><span class="tag yellow">{{t}}</span></li>
                <!-- <li><span class="tag blue">购物便捷</span></li> -->
            </ul>
        </li>
    </ul>
</div>
</template>

<script>
export default {
	name: 'PayItem',
	props: {
		item: {
			type: Object,
			default () {
				return {
					store_logo_url: '',
					store_name: '',
					score: '',
					order_total: '',
					city: '',
					distance: '',
					detail_address: '',
					minimum_price: '',
					hotel_label: [],
				}
			}
		}
	},
	methods: {
		confirm() {
			this.$emit('onConfirm')
		}
	}
}
</script>

<style scoped lang="less">
@import "~@/assets/styles/varible";
@import "~@/assets/styles/mixin";
.order {
    position: relative;
    background: white;
    padding: 1rem;
    overflow: hidden;
    border-top: 1px solid @border-color;
    border-bottom: 1px solid @border-color;
}

.box-left {
    width: 10rem;
}

.box-img {
    position: relative;
    width: 10rem;
    height: 0;
    padding-bottom: 100%;
}

.box-img > img {
    position: absolute;
    width: 100%;
    height: 100%;
    // border-radius: 4px;
}

.box-right {
    width: 100%;
    margin-left: 1rem;
    overflow: hidden;
}

.name {
    font-size: @font-xxl;
    .no-wrap();
}

.level {
    font-size: @font-xl;
    color: #FF9800;
}

.info {
    color: #BDBDBD;
    font-size: @font-s;
}

.map {
    font-size: @font-s;
    color: #BDBDBD;
}

.box-tag {
    flex-wrap: wrap;
    align-items: center;
    padding: 2px 0;
    margin-bottom: -5px;
    & > li {
        font-size: @font-xs;
        text-align: center;
        width: 25%;
        box-sizing: border-box;
        margin-bottom: 5px;
        padding: 0 0.2rem;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
    }
    & .tag {
        display: inline-block;
        width: 100%;
        color: @gray-color;
        border-color: @gray-color;
        border: 1px solid @border-color;
    }
    & .yellow {
        color: @warning-color;
        border-color: @warning-color;
    }

    & .blue {
        color: @primary-color;
        border-color: @primary-color;
    }
}

.price {
    font-size: @font-m;
    color: #F44336;
    & > span {
        font-size: @font-xxl;
    }
}

.num {
    float: right;
    font-size: 1rem;
}
</style>
