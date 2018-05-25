import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
  * 国旗列表
  * */
  getSaleFlagList({commit},rs){

    const params = {
      // method:'GET',
      // url:'/static/data/frontCate.json',
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_FLAG_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 设置国旗状态 SET_SALE_FLOG_ABLE
  * */
  setSaleFlagAble({commit},rs){
    const params = {
      method:'POST',
      // url:'/static/data/frontCate.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.SET_SALE_FLAG_ABLE,params)
    return baseActions.fetch(commit,opts)
  },
  /*保存*/
  createFlag({commit},rs){
    let _rs = UtilTool.deepCopy(rs)
    const params = {
      data:Object.assign({},_rs)
    }
    const opts = Object.assign({},fetchUrl.SAVE_SALE_FLAG,params)
    return baseActions.fetch(commit,opts)
  },
}
