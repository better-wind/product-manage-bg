import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
  * 属性值列表
  * */
  getValAttrList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_VAL__SEARCH_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 属性项列表
  * */
  getKeyAttrList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.ATTR_KEY_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 属性项详情
  * */
  getPropertyListDetail({commit},rs){
    // console.log(rs)
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs))
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 模糊匹配属性项名称
  * */
  matchNameList({commit},rs){
    // console.log(rs)
    // const params = {
    //   data:Object.assign({},rs)
    // }

    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs))
    }
    const opts = Object.assign({},fetchUrl.MATCH_NAME_CODE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 保存编辑属性项
  * */
  saveProperty({commit},rs,type){
    // console.log(rs)
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs.rs))
    }
    const url = rs.type  == 1 ? fetchUrl.PROPERTY_EDIT_SAVE : fetchUrl.PROPERTY_EDIT_UPDATE
    const opts = Object.assign({},url,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取属性项 属性值列表
  * */
  getPropertyValList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_VAl_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 保存编辑属性值
  * */
  savePropertyVal({commit},rs){
    // console.log(rs.rs)
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs.rs))
    }
    const url = rs.type == 1 ? fetchUrl.SAVE_PROPERTY_VAl : fetchUrl.UPDATE_PROPERTY_VAl
    const opts = Object.assign({},url,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 下载导入模板
  * */
  downTemp(){
    baseActions.fromPost(fetchUrl.UPLOAD_PROPERTY_VAl.url)
  },
  /*
  * 保存导入数据
  * */
  propertyValueImport({commit},rs){
    // console.log(rs)
    var formData = new FormData();
    for(let i in rs){
      formData.append(i, rs[i]);
    }
    const params = {
      method:fetchUrl.PROPERTY_VALUE_IMPORT.method,
      url:fetchUrl.PROPERTY_VALUE_IMPORT.url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:formData
    }
    // return false
    // baseActions.fromPost(fetchUrl.PROPERTY_VALUE_IMPORT.url,rs,'','file')
    const opts = Object.assign({},fetchUrl.PROPERTY_VALUE_IMPORT,params)
    return baseActions.fetch(commit,params,'','file')
  },
  /*
  * 模糊匹配属性值名称
  * */
  matchValueList({commit},rs){
    // console.log(rs)
    // const params = {
    //   data:Object.assign({},rs)
    // }

    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs))
    }
    const opts = Object.assign({},fetchUrl.MATCH_VALUE_CODE,params)
    return baseActions.fetch(commit,opts)
  },

  /*
  * 类目属性管理列表
  * */
  getPropertyManagerList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_MANAGER_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 类目属性项明细
  * */
  getPropertyDetail({commit},rs){
    // console.log(rs)
    const params = {
      // data:Object.assign({},rs),
      method:fetchUrl.PROPERTY_MANAGER_DETAIL.method,
      url:fetchUrl.PROPERTY_MANAGER_DETAIL.url+rs.categoryId
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_MANAGER_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  /*
   * 类目属性明细新增属性项
   * */
  savePropertyName({commit},rs){
    // console.log(rs)
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs))
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_MANAGER_DETAIL_NAME_SAVE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
   * 类目属性明细新增属性项
   * */
  savePropertyDetail({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.PROPERTY_MANAGER_DETAIL_SAVE,params)
    return baseActions.fetch(commit,opts)
  },

}
