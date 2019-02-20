import Vue from 'vue'
import VueProjectTimeline from './App.vue'
import VuePlyr from 'vue-plyr'

Vue.use(VuePlyr)
Vue.config.productionTip = false

new Vue({
  render: h => h(VueProjectTimeline)
}).$mount('#vue-project-timeline')
