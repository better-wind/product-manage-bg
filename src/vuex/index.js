import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import mutations from './mutations'
import actions from './actions'


Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,  // 修改store方法
  actions
})
export default store
