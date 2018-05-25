import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
  * 类目
  * */
  getCateList({commit},rs){
    // console.log(rs)
    const params = {
      // data:Object.assign({},rs),
      method:fetchUrl.CATEGORY_LIST.method,
      url:fetchUrl.CATEGORY_LIST.url+rs.categoryId
    }
    const opts = Object.assign({},fetchUrl.CATEGORY_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  getMulCateList({commit},rs){
    // console.log(rs)
    const params = {
      // data:Object.assign({},rs),
      method:fetchUrl.CATEGORY_MULTIPLE_LIST.method,
      url:fetchUrl.CATEGORY_MULTIPLE_LIST.url+rs.categoryId.join(',')
    }
    const opts = Object.assign({},fetchUrl.CATEGORY_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 商品类目分组管理
  * */
  getManagerGroupList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.CATE_MANAGER_GROUP,params)
    return baseActions.fetch(commit,opts,'SET_CATE_MANAGER_GROUP')
  },
  /*
  * 导出类目商品经理组
  * */
  exportManagerGroup({commit},rs){
    // console.log(rs)
    let _obj = {}
    let _opts = Object.assign({},rs)
    // _opts.pageIndex = _opts.page
    // _opts.pageSize = _opts.rows
    _obj.categoryId = _opts.fourthCategoryId || _opts.thirdCategoryId || _opts.secondCategoryId || _opts.firstCategoryId
    _obj.managerGroupId = _opts.managerGroupId
    // delete _opts.page
    // delete _opts.rows
    baseActions.fromPost(fetchUrl.EXPORT_CATE_MANAGER_LIST.url,_obj)
    // const opts = Object.assign({},fetchUrl.EXPORT_CATE_MANAGER_LIST,params)
    // return baseActions.fetch(commit,opts)
  },
  /*
  * 商品类目分组
  * */
  getCateManageList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.CATE_MANAGER_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 保存商品类目分组
  * */
  saveCateManage({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.CATE_MANAGER_GROUP_SAVE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 校验是否而已修改类目
  * */
  validCategoryIdChange({commit},rs){
    // console.log(rs)
    const params = {
      method:fetchUrl.VALID_CATEGORY_ID_CHANGE.method,
      url:fetchUrl.VALID_CATEGORY_ID_CHANGE.url+rs.baseGoodsId+'/'+rs.categoryId
    }
    const opts = Object.assign({},fetchUrl.VALID_CATEGORY_ID_CHANGE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 类目经理分页 180413
  * */
  getCateManageGroupList({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.CATE_MANAGER_GROUP_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 类目经理更新180413
  * */
  setCateManageGroupUpdate({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.CATE_MANAGER_GROUP_UPDATE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 类目经理单条 180413
  * */
  getCateManageGroupGet({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.CATE_MANAGER_GROUP_GET,params)
    return baseActions.fetch(commit,opts)
  },

}
