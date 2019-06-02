<template lang="html">
<div class="map" id="allMap">

</div>
</template>

<script>
import BMap from 'BMap'
export default {
	name: 'SMap',
	data() {
		return {
			latitude: '',
			longitude: '',
			address: '',
			name: '',
		}
	},
	created() {
		this.loadMap()
	},
	mounted() {
		this.ready()
	},
	methods: {
		loadMap() {
			const { latitude, longitude, name, address } = this.$route.params
			this.latitude = Number(latitude)
			this.longitude = Number(longitude)
			this.name = name
			this.address = address
		},
		ready() {
			const map = new BMap.Map('allMap')
			const point = new BMap.Point(this.longitude, this.latitude)
			//map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
			const marker = new BMap.Marker(point) // 创建标注
			map.addOverlay(marker) // 将标注添加到地图中
			map.centerAndZoom(point, 15)
			map.enableScrollWheelZoom(true)
			map.enableDragging()
			const opts = {
				width: 200, // 信息窗口宽度
				height: 100, // 信息窗口高度
				title: this.name, // 信息窗口标题
				enableMessage: true //设置允许信息窗发送短息
			}
			const address = `地址：${this.address}`
			const infoWindow = new BMap.InfoWindow(address, opts) // 创建信息窗口对象
			marker.addEventListener('click', () => {
				map.openInfoWindow(infoWindow, point) //开启信息窗口
			})
			map.openInfoWindow(infoWindow, point) //开启信息窗口
		}
	}
}
</script>

<style scoped lang="less">
.map {
    width: 100%;
    height: 100%;
}
</style>
