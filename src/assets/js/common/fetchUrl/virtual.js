const API = 'goodsAdmin'

export default {
  //电话商品列表
  VIRTUAL_PHONE_LIST:{ method: 'POST', url: API+'/goods/recharge/feeGoods/list/page'},
  //话费商品更新
  VIRTUAL_PHONE_UPDATE:{ method: 'POST', url: API+'/goods/recharge/trafficGoods/update'},
  VIRTUAL_PHONE_UPDATE_STATUS:{ method: 'POST', url: API+'/goods/recharge/trafficGoods/updateStatus'},
  VIRTUAL_PHONE_UPDATE_PRICE:{ method: 'POST', url: API+'/goods/recharge/trafficGoods/updatePrice'},
  //话费列表查看日志
  VIRTUAL_PHONE_LOG:{ method: 'POST', url: API+'/goods/log/list/page'},
  //流量商品列表
  VIRTUAL_FLOW_LIST:{ method: 'POST', url: API+'/goods/recharge/trafficGoods/list/page'},

  //话费商品导出
  EXPORT_VIRTUAL_PHONE_LIST:{ method: 'POST', url: API+'/goods/recharge/feeGoods/export'},
  //流量商品导出
  EXPORT_VIRTUAL_FLOW_LIST:{ method: 'POST', url: API+'/goods/recharge/trafficGoods/export'},
  //虚拟商品价格模板
  VIRTUAL_PRICE_TEMP:{ method: 'POST', url: API+'/goods/recharge/trafficGoods/template'},

  VIRTUAL_SEARCH_MAP:{ method: 'GET', url: API}
  // 充值 范围 /goods/recharge/rechargeProvince/values/list

  // 适用 范围 /goods/recharge/availableProvince/values/list

  // 省份 /goods/recharge/province/values/list

  // 运营商 /goods/recharge/operator/values/list

  // 流量面额 /goods/recharge/trafficFaceValue/values/list

  // 话费面额 /goods/recharge/feeFaceValue/values/list

}
