import Dialog from './dialog.vue'

export default {
  install(Vue, options = {}) {
    let dialog = null
    //让它返回
    Vue.prototype.$dialog = (text, callback, need = 0, credit = 0, price = 0, realInput = '') => {
      if (!dialog) {
        const com = Vue.extend(Dialog)
        dialog = new com
        if (!dialog.$el) {
          dialog.$mount()
          document.querySelector('body').appendChild(dialog.$el)
        }

      }

      dialog.price = price
      dialog.realInput = realInput
      dialog.need = need
      dialog.credit = credit
      dialog.show = true
      dialog.text = text
      dialog.func = callback
    }
  }
}
