import baseActions from './base'
import attrActions from './attribute'
import cateActions from './category'
import brandActions from './brand'
import productActions from './product'
import saleProductActions from './saleProduct'
import goodsAuditActions from './goodsAudit'
import frontCateActions from './frontCate'
import saleFlagActions from './saleFlag'
import saleBrandActions from './saleBrand'
import virtualActions from './virtual'
import fetchUrl from '../../assets/js/common/fetch-url'

const JS_BASE_SESSION = 'da3a5ff3-d2bb-49cc-9857-56e441967063'
export default {
  ...baseActions,
  ...attrActions,
  ...cateActions,
  ...brandActions,
  ...productActions,
  ...saleProductActions,
  ...goodsAuditActions,
  ...frontCateActions,
  ...saleFlagActions,
  ...saleBrandActions,
  ...virtualActions,
  demoActions({commit},rs){
    const opts = Object.assign({},fetchUrl.DEMO_URL,rs)
    return baseActions.fetch(commit,opts)
  },
  webEnvAction({commit},rs){
    let _env = location.hostname == 'goods.admin.gegejia.com' ? 'prod' : 'dev'
    commit('SET_WEB_ENV',_env)
  },
  roleAction({commit},rs){
     if(location.hostname == 'localhost'){
      document.cookie = 'SESSION='+JS_BASE_SESSION
     }
    const params = {
      headers: {
        // 'cookie':'SESSION=46cc3ba6-0c38-409d-a677-7b83715f96cd',
      },
    }
    const opts = Object.assign({},fetchUrl.ROLE_MENU,params)
    return baseActions.fetch(commit,opts,'SET_ROLE_MENU')
  },
  /*
  * 顶部菜单接口
  * */
  goodsNav({commit}){
    const opts = Object.assign({},fetchUrl.GOODS_NAV)
    return baseActions.fetch(commit,opts,'SET_HEADER_NAV')
  },
  setLoginOut({commit}){
    const opts = Object.assign({},fetchUrl.LOGIN_OUT)
    return baseActions.fetch(commit,opts)
  },

  // roleDetailActions({commit},rs){
  //
  //   const opts = Object.assign({},fetchUrl.ROLE_DETAIL_MENU)
  //   return baseActions.fetch(commit,opts,'SET_ROLE_DETAIL_MENU')
  // },
  setSearchConfig({commit},rs){
    // const opts = UtilTool.deepCopy(rs)
    const opts = rs
    // let params = {}
    // opts.searchItem.map((item)=>{
    //   params[item.key] = item.intKey
    // })
    commit('SET_SEARCH_CONFIG',opts)
    // commit('SET_SEARCH_PARAMS',params)
  },
  setSearchParams({commit},rs){
    commit('SET_SEARCH_PARAMS',UtilTool.deepCopy(rs))
  },
  setViewImage ({commit},data) {
    commit('SET_VIEW_IMAGE',data)
  }
}
