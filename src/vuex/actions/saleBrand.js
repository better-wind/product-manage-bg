import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
   * 品牌列表
   * */
  getSaleBrandList({commit},rs){

    const params = {
      // method:'GET',
      // url:'/static/data/frontCate.json',
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_BRAND_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取品牌下拉列表 GET_SALE_BRAND_NAME_LIST
  * */
  getSaleBrandNameList({commit},rs){
    const params = {
      method:'POST',
      // url:'/static/data/frontCate.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_BRAND_NAME_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
   * 设置品牌状态
   * */
  setSaleBrandAble({commit},rs){
    const params = {
      method:'POST',
      // url:'/static/data/frontCate.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.SET_SALE_BRAND_ABLE,params)
    return baseActions.fetch(commit,opts)
  },
  /*保存*/
  createBrand({commit},rs){
    let _rs = UtilTool.deepCopy(rs)
    const params = {
      data:Object.assign({},_rs)
    }
    const opts = Object.assign({},fetchUrl.SAVE_SALE_BRAND,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取囯家 GET_BRAND_FLAG_NAME
  * */
  getBrandFlagName({commit}){
    const params = {
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData({countryName:''}),
    }
    const opts = Object.assign({},fetchUrl.GET_BRAND_FLAG_NAME,params)
    return baseActions.fetch(commit,opts,'SET_SALE_FLAG_NAME_LIST')
  },
  getBrandFrontCateList({commit},rs){
    const params = {
      method:'POST',
      url:fetchUrl.GET_FRONT_CATE_CHILD.url+0,
    }
    const opts = Object.assign({},params)
    return baseActions.fetch(commit,opts,'SET_SALE_FRONT_CATE_LIST')
  }
}
