import Vue from 'vue'
import App from './scripts/app/App.vue'
Vue.config.productionTip = false
Vue.use(require('vue-shortkey'))

new Vue({
  render: h => h(App),
}).$mount('#app')
