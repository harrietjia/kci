<template>
<transition name="fade">
	<div class="loading" v-show="isShow">
		<div class="box-loading" :class="[active]">
			<i class="ico-loading"></i>
		</div>
	</div>
</transition>
</template>
<script>
export default {
	name: 'Loading',
	data() {
		return {
			isShow: false,
			active: ''
		}
	},
	methods: {
		open(data) {
			this.isShow = true
			this.active = ''
		},
		close() {
			this.active = 'leave'
			this.isShow = false
		}
	}
}
</script>
<style scoped lang="less">
@import "~@/assets/styles/mixin";

.loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 53;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    & .box-loading {
        padding: 1rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 4px;
        animation: enter 0.3s cubic-bezier(.55, 0, .1, 1) forwards;
    }
    & .leave {
        animation: leave 0.3s cubic-bezier(.55, 0, .1, 1) forwards;
    }
    & .ico-loading {
        display: inline-block;
        vertical-align: middle;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        .bg-image(loading);
        animation: loading 1.5s ease-in-out infinite;
    }
}
@keyframes loading {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes enter {
    from {
        opacity: 0;
        transform: scale(2, 2);
    }
    to {
        opacity: 1;
        transform: scale(1, 1);
    }
}
@keyframes leave {
    from {
        opacity: 1;
        transform: scale(1, 1);
    }
    to {
        opacity: 0;
        transform: scale(0, 0);
    }
}
</style>
