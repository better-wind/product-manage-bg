import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex'
import Element from 'element-ui'
// import VueQuillEditor from 'vue-quill-editor'
// import 'element-ui/lib/theme-default/index.css'
import './assets/css/theme/index.css'
import './assets/js/common/utils'

Vue.use(Element)
// Vue.use(VueQuillEditor)
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
