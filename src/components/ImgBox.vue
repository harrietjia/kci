<template lang="html">
<transition name="slider">
    <div class="img-box" v-if="visible" @click="onConfirm">
        <div class="box-img" >
            <img :src="url" alt="">
        </div>
        <div class="mask"></div>
    </div>
</transition>
</template>

<script>
export default {
	name: 'ImgBox',
	props: {
		url: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			visible: false
		}
	},
	methods: {
		onConfirm() {
			this.visible = false
			this.callback && this.callback.call(this, 'confirm')
		}
	}
}
</script>

<style scoped lang="less">
.img-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .box-img {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 80%;
        margin: 0 auto;
        overflow: hidden;
        z-index: 52;
        & > img {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }
    .mask {
        background: rgba(0,0,0,0.95);
    }
}
</style>
