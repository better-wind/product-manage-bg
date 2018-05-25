import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
  * 销售商品库存列表 SALE_STORAGE_LIST
  * */
  getSaleStorageList({commit},rs){
    const params = {
      method:fetchUrl.SALE_STORAGE_LIST.method,
      url:fetchUrl.SALE_STORAGE_LIST.url+rs.saleGoodsId
    }
    const opts = Object.assign({},fetchUrl.SALE_STORAGE_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 基础商品库库存列表
  * */
  getStorageList({commit},rs){
    const params = {
      method:fetchUrl.STORAGE_LIST.method,
      url:fetchUrl.STORAGE_LIST.url+rs.baseGoodsCode
    }
    const opts = Object.assign({},fetchUrl.STORAGE_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 基础商品库库存保存
  * */
  saveStorage({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.STORAGE_SAVE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 商品详情图&主图
  * */
  setProductUpload({commit},rs){
    commit('SET_PRODUCT_UPLOAD',rs)
  },
  /*
   * 后台商品列表
   * */
  getBaseGoodsList({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.BASE_GOODS_LIST,params)
    return baseActions.fetch(commit,opts)
  },

  getFrontGoodsList({commit},rs){

    const opts = Object.assign({},fetchUrl.GOODS_BELONG,params)
    return baseActions.fetch(commit,opts)
  },
  //货品商家归属
  getGoodsBelong({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GOODS_BELONG,params)
    return baseActions.fetch(commit,opts)
  },

  //获取发货地信息
  getShipArea({commit},rs){
    const params = {
      method:fetchUrl.SHIP_AREA.method,
      url:fetchUrl.SHIP_AREA.url+rs.sellerMainId
    }
    const opts = Object.assign({},fetchUrl.SHIP_AREA,params)
    return baseActions.fetch(commit,opts)
  },

  //获取商品详情
  getBaseGoodsDetail({commit},rs){
    const params = {
      method:fetchUrl.GET_BASE_GOODS_DETAIL.method,
      url:fetchUrl.GET_BASE_GOODS_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GET_BASE_GOODS_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },

  //根据发货地得到storageId
  getStorageId({commit},rs){
    const params = {
      method:fetchUrl.GET_STORAGE_ID.method,
      url:fetchUrl.GET_STORAGE_ID.url+'?sellerIds='+rs.sellerIds
    }
    const opts = Object.assign({},fetchUrl.GET_STORAGE_ID,params)
    return baseActions.fetch(commit,opts)
  },

  //获取可关联采购商品列表
  getPurchaseGoodsList({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_PURCHASE_GOODS_LIST,params)
    return baseActions.fetch(commit,opts)
  },

  //获取品牌列表
  getBrandList({commit},rs){
    const params = {
      method:fetchUrl.GET_BRAND_LIST.method,
      url:fetchUrl.GET_BRAND_LIST.url+'?name='+rs.name
    }
    const opts = Object.assign({},fetchUrl.GET_BRAND_LIST,params)
    return baseActions.fetch(commit,opts)
  },

  //根据id查询
  getPurchaseGood({commit},rs){
    const params = {
      method:fetchUrl.GET_PURCHASE_GOOD.method,
      url:fetchUrl.GET_PURCHASE_GOOD.url+rs.providerProductId
    }
    const opts = Object.assign({},fetchUrl.GET_PURCHASE_GOOD,params)
    return baseActions.fetch(commit,opts)
  },

  getPurchaseGoodsChangeRecord({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_PURCHASE_GOODS_CHANGE_RECORD,params)
    return baseActions.fetch(commit,opts)
  },

  getBaseGoodsChangeRecord({commit},rs){
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.GET_BASE_GOODS_CHANGE_RECORD,params)
    return baseActions.fetch(commit,opts)
  },

  exportSkuInfo({commit},rs){
    baseActions.fromPost(fetchUrl.EXPORT_SKU_INFO.url)
  },

  downloadChangePriceTpl({commit},rs){
    baseActions.fromPost(fetchUrl.DOWNLOAD_CHANGE_PRICE_TPL.url)
  },

  //保存后台商品
  saveBaseGoods({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.SAVE_BASE_GOODS,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 导出基础商品列表
  * */
  exportBaseGoodsList({commit},rs){
    let _opts = Object.assign({},rs)
    // _opts.pageIndex = _opts.page
    // _opts.pageSize = _opts.rows
    _opts.categoryId = _opts.fourthCategoryId || _opts.thirdCategoryId || _opts.secondCategoryId || _opts.firstCategoryId
    delete _opts.page
    delete _opts.rows
    delete _opts.fourthCategoryId
    delete _opts.thirdCategoryId
    delete _opts.secondCategoryId
    delete _opts.firstCategoryId
    let _obj = {}
    for(let i in _opts){
      if(_opts[i]){
        _obj[i] = _opts[i]
      }
    }
    baseActions.fromPost(fetchUrl.EXPORT_BASE_GOODS_LIST.url,_obj)
  },
  /*
   * 基础商品可用停用
   * */
  setBaseGoodsUpdateStatus({commit},rs){
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.BASE_GOODS_UPDATE_STATUS,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 商家品牌非自营 SALE_BRAND_EXTRA
  * */
  getExtraSaleBrand({commit},rs){
    const params = {
      // url:fetchUrl.SALE_BRAND_EXTRA.url
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.SALE_BRAND_EXTRA,params)
    return baseActions.fetch(commit,opts)
  }
}
