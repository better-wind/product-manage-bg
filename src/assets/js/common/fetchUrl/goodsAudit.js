const API = 'goodsAdmin'
// const API = 'roleGoods'

export default {
  GOODS_AUDIT_LIST:{ method: 'POST', url: API+'/goods/sellerGoods/audit/list' },
  PRICE_AUDIT_LIST:{ method: 'POST', url: API+'/goods/sellerGoods/costPrice/audit/list' },
  PRICE_AUDIT_ACTION:{ method: 'POST', url: API+'/goods/sellerGoods/costPrice/audit/action' },
  GOODS_AUDIT_DETAIL:{ method: 'POST', url: API+'/goods/sellerGoods/audit/detail/' },
  GOODS_CODE_DETAIL:{ method: 'POST', url: API+'/goods/baseGoods/detail/code/' },
  GOODS_AUDIT_ACTION:{ method: 'POST', url: API+'/goods/sellerGoods/audit/action' },
  AREA_TEMP_LIST:{ method: 'POST', url: API+'/goods/seller/deliverAreasTemplate/' },

  //库存列表
  // storageList
  STORAGE_LIST:{ method: 'POST', url: API+'/goods/baseGoods/storage/list/' }

}
