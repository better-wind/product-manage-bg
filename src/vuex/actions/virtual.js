import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'
const searchMap = {
  rechargeProvince:'/goods/recharge/rechargeProvince/values/list', //充值范围
  availableProvince:'/goods/recharge/availableProvince/values/list', //适用范围
  province:'/goods/recharge/province/values/list', //省份
  operator:'/goods/recharge/operator/values/list', //运营商
  trafficFaceValue:'/goods/recharge/trafficFaceValue/values/list', //流量面额
  feeFaceValue:'/goods/recharge/feeFaceValue/values/list' //话费面额
}
const keys = ['startCreateTime','endCreateTime','startUpdateTime','endUpdateTime']
export default {
  // 虚拟商品初始化 搜索选项
  getVirtualSearchItem({commit},type){
    const params = {
      url:fetchUrl.VIRTUAL_SEARCH_MAP.url+searchMap[type]
    }
    const opts = Object.assign({},fetchUrl.VIRTUAL_SEARCH_MAP,params)
    return baseActions.fetch(commit,opts)
  },
  //获取 话费商品信息
  getVirtualPhoneList({commit},rs){
    keys.map((item)=>{
      // rs.params[item] = rs.params[item] ? new Date(rs.params[item]) : ''
      rs.params[item] = rs.params[item] ? UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',new Date(rs.params[item])) : ''
    })
    const params = {
      data:Object.assign({},rs.params),
      // method:'GET',
      // url:'/static/data/virtual.json'
    }
    let _opts = rs.routerName == 'virtualPhone' ? fetchUrl.VIRTUAL_PHONE_LIST : fetchUrl.VIRTUAL_FLOW_LIST
    const opts = Object.assign({},_opts,params)
    return baseActions.fetch(commit,opts)
  },
  //更新话费虚拟商品 /goods/recharge/trafficGoods/update
  updateVirtualPhone({commit},rs){
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs.opt)),
      // data:rs,
    }
    //type 1 状态  2
    const opts = Object.assign({},rs.type == 1 ? fetchUrl.VIRTUAL_PHONE_UPDATE_STATUS : fetchUrl.VIRTUAL_PHONE_UPDATE_PRICE,params)
    return baseActions.fetch(commit,opts)
  },
  //话费虚拟商品日志
  getVirtualPhoneLogList({commit},rs){
    const params = {
      data:Object.assign({},rs),
      // method:'GET',
      // url:'/static/data/virtualLog.json'
    }
    const opts = Object.assign({},fetchUrl.VIRTUAL_PHONE_LOG,params)
    return baseActions.fetch(commit,opts)
  },
  //导出
  exportVirtualList({commit},rs){
    let _rs = UtilTool.deepCopy(rs.rs)
    delete _rs.page
    delete _rs.size
    let _url = rs.routerName == 'virtualPhone' ?
      fetchUrl.EXPORT_VIRTUAL_PHONE_LIST.url :
      fetchUrl.EXPORT_VIRTUAL_FLOW_LIST.url

    keys.map((item)=>{
      _rs[item] = _rs[item] ? UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',new Date(_rs[item])) : ''
    })
    baseActions.fromPost(_url,_rs)
  },
  // 价格模板
  downVirtualTemp(){
    baseActions.fromPost(fetchUrl.VIRTUAL_PRICE_TEMP.url)
  },

}
