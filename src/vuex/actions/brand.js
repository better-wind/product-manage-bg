import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
   * 品牌列表
   * */
  getBrandManageList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.BRAND_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 品牌类目列表
  * */
  getBrandCateList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.BRAND_CATE_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 编辑品牌名称
  * */
  editBrandName({commit},rs){
    // console.log(rs)
    const params = {
      data:baseActions.formData(rs)
    }
    const opts = Object.assign({},fetchUrl.BRAND_NAME_EDIT,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 删除品牌类目
  * */
  delBrandCate({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.DEL_BRAND_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
   * 品牌类目候选列表
   * */
  getBrandAddCateList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.BRAND_ADD_CATE_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 保存品牌类目
  * */
  saveBrandCate({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs.rs)
    }
    // const url = rs.type == 1 ? fetchUrl.UPDATE_BRAND_CATE : fetchUrl.SAVE_BRAND_CATE
    const url =  fetchUrl.SAVE_BRAND_CATE

    const opts = Object.assign({},url,params)
    return baseActions.fetch(commit,opts)
  }
}
