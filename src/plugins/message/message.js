import Message from './message.vue'
export default {
  install(Vue, options={}) {
    let mes = null
    //让它返回
    Vue.prototype.$message = (text, callback) => {
      if(!mes) {
        const com = Vue.extend(Message)
        mes = new com
        if(!mes.$el) {
          mes.$mount()
          document.querySelector('body').appendChild(mes.$el)
        }
      }

      mes.show = true
      mes.text = text
      mes.func = callback
    }
  }
}
