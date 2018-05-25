const API = 'goodsAdmin'

export default {
  /*品牌列表*/
  GET_SALE_BRAND_LIST:{ method:'POST',url: API+'/goods/brand/list/page' },
  /*品牌可用*/
  SET_SALE_BRAND_ABLE:{ method:'POST',url: API+'/goods/brand/enable' },
  /*品牌保存*/
  SAVE_SALE_BRAND:{ method:'POST',url: API+'/goods/brand/save' },
  /*囯家列表*/
  GET_BRAND_FLAG_NAME:{ method:'POST',url: API+'/goods/saleFlag/name/list/code' },
  /*品牌列表*/
  GET_SALE_BRAND_NAME_LIST:{ method:'POST',url: API+'/goods/brand/name/list/code' }
}
