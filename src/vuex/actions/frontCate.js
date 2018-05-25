import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

const chanelList = ['isGgj','isHqbs','isMsms']
export default {
  /*
  * 设置前端类目标题
  * */
  setFrontCateManageTitle({commit},rs){
    commit('SET_FRONT_CAtE_MANAGE_TITLE',rs)
  },
  /*
  * 前台类目列表
  * 类目名称           状态                   是否展示品牌              排序值                   展示渠道  操作
   类目名称  类目图标  状态                               商品排序规则  排序值 包含三级类目数量   展示渠道  操作
   类目名称  类目图标  状态  是否HOT 是否高亮              商品排序规则  排序值                   展示渠道  操作

   类目名称  类目图标  状态  是否HOT 是否高亮  是否展示品牌 商品排序规则  排序值 包含三级类目数量    展示渠道  操作
   123      23        123  3       3        1           23           123   2                  123      123
  * */
  getFrontCateList({commit},rs){

    chanelList.map((item)=>{
      rs[item] = rs[item] ? 1 : 0
    })
    const params = {
      // method:'GET',
      // url:'/static/data/frontCate.json',
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_FRONT_CATE_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 设置启用停用
  * GET_FRONT_CATE_ABLE
  * application/x-www-form-urlencoded
  * */
  setFrontCateAble({commit},rs){
    const params = {
      method:'POST',
      // url:'/static/data/frontCate.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.GET_FRONT_CATE_ABLE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 编辑类目信息获取
  * GET_FRONT_CATE_MSG
  * */
  getFrontCateMsg({commit},rs){

    const params = {
      method:'GET',
      url:'/static/data/frontCateMsg.json',
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_FRONT_CATE_MSG,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 新建类目
  * CREATE_FRONT_CATE
  * */
  createFrontCate({commit},rs){
    let _rs = UtilTool.deepCopy(rs)
    chanelList.map((item)=>{
      _rs[item] = _rs[item] ? 1 : 0
    })
    const params = {
      data:Object.assign({},_rs)
    }
    const opts = Object.assign({},fetchUrl.CREATE_FRONT_CATE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 当前类目子类目
  * parentId
  * GET_FRONT_CATE_CHILD
  * */
  getFrontCateChildList({commit},rs){
    const params = {
      method:'POST',
      url:fetchUrl.GET_FRONT_CATE_CHILD.url+rs.parentId,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},{channel:rs.channel}))
    }
    const opts = Object.assign({},params)
    return baseActions.fetch(commit,opts)
  }
}
