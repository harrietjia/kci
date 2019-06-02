import Toast from './toast.vue'

export default {
	install(Vue, options = {}) {
		let toast = null
		Vue.prototype.$toast = (msg, mask = true, ms = 1500) => {
			if (!toast) {
				const com = Vue.extend(Toast)
				toast = new com
				if (!toast.$el) {
					toast.$mount()
					document.querySelector('body').appendChild(toast.$el)
				}
			}

      toast.show = true
			toast.delayed(msg, mask, ms)
		}
	}
}
