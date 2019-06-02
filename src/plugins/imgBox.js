import Vue from 'vue'
import ImgBox from '@/components/ImgBox'

const ImgBoxConstructor = Vue.extend(ImgBox)
let instance = null

const callback = (action) => {
	if (action == 'confirm') {
		instance.resolve(action)
	} else {
		instance.reject(action)
	}
	instance = null
}

const showImgBox = (url) => new Promise((resolve, reject) => {
	!!instance && (instance.visible = false)
	const propsData = { url }
	instance = new ImgBoxConstructor({ propsData }).$mount()
	instance.reject = reject
	instance.resolve = resolve
	instance.callback = callback
	document.body.appendChild(instance.$el)
	Vue.nextTick(() => instance.visible = true)
})

export default {
	install(Vue) {
		Vue.prototype.$showImgBox = showImgBox
	}
}
