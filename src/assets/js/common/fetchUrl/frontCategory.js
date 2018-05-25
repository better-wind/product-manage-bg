const API = 'goodsAdmin'

export default {
  /*前台类目列表*/
  GET_FRONT_CATE_LIST:{ method:'POST',url: API+'/goods/frontCategory/list/page'},
  /*前台类目启用停用*/
  GET_FRONT_CATE_ABLE:{ method:'POST',url: API+'/goods/frontCategory/enable'},
  /*创建类目*/
  CREATE_FRONT_CATE:{ method:'POST', url:API+'/goods/frontCategory/save'},
  /*获取当前子类目类目*/
  GET_FRONT_CATE_CHILD:{ method:'POST', url:API+'/goods/frontCategory/list/child/' }
}
