const API = 'goodsAdmin'

export default {
  /*国旗列表*/
  GET_SALE_FLAG_LIST:{ method:'POST',url: API+'/goods/saleFlag/list/page' },
  /*国旗可用*/
  SET_SALE_FLAG_ABLE:{ method:'POST',url: API+'/goods/saleFlag/enable' },
  /*国旗保存*/
  SAVE_SALE_FLAG:{ method:'POST',url: API+'/goods/saleFlag/save' }
}
