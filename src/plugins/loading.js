import Loading from '@/components/Loading'

export default {
	install(Vue, options = {}) {
		let loading = null
		Vue.prototype.$loading = (bool = true) => {
			if (!loading) {
				const com = Vue.extend(Loading)
				loading = new com
				if (!loading.$el) {
					document.body.appendChild(loading.$mount().$el)
				}
			}

			if (bool) {
				loading.open()
			} else {
				loading.close()
			}
		}
	}
}
