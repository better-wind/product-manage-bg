import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetch-url'

export default {
  /*
  * 销售商品详情
  * */
  getSaleProductDetail({commit},rs){
    // console.log(rs)
    const params = {
      // data:Object.assign({},rs),
      method:fetchUrl.SALE_PRODUCT_DETAIL.method,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+'',
      url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SALE_PRODUCT_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  getCategoryPath({commit},rs){
    // console.log(rs)
    const params = {
      // data:Object.assign({},rs),
      method:fetchUrl.GET_CATEGORY_PATH.method,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+'',
      url:fetchUrl.GET_CATEGORY_PATH.url+rs.categoryId
    }
    const opts = Object.assign({},fetchUrl.GET_CATEGORY_PATH,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售商品列表
  * */
  getSaleProductList({commit},rs){
    if(rs.saleGoodsCode && Object.prototype.toString.call(rs.saleGoodsCode) == '[object String]'){
      rs.saleGoodsCode = [rs.saleGoodsCode]
    }
    if(rs.saleGoodsIds){
      rs.saleGoodsIds = rs.saleGoodsIds.split(/[,，、\s]/g).filter((item)=>item);
    }
    const params = {
      data:Object.assign({},rs),
      // method:fetchUrl.SALE_PRODUCT_LIST.method,
      url:fetchUrl.SALE_PRODUCT_LIST.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SALE_PRODUCT_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*快捷创建销售商品是否可以创建*/
  checkCreateBaseGoods({commit},rs){
    // console.log(rs)
    const params = {

      method:fetchUrl.CHECK_BASE_GOODS.method,
      url:fetchUrl.CHECK_BASE_GOODS.url+rs.baseGoodsCode,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.CHECK_BASE_GOODS,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  *下拉销售类型渠道
  * */
  getSaleListCode({commit},rs){
    const params = {
      // data:Object.assign({},rs),
      method:fetchUrl.GET_SALE_LIST_CODE.method,
      url:fetchUrl.GET_SALE_LIST_CODE.url+'/'+rs.channel,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_LIST_CODE,params)
    return baseActions.fetch(commit,opts,'SALE_WAY_LIST_CODE')
  },
  /*
  * 获取基本商品SKU
  * */
  getGoodsSkuList({commit},rs){
    // console.log(rs)
    const params = {
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // data:baseActions.formData(Object.assign({},rs)),
      data:Object.assign({},rs),
      method:fetchUrl.GOODS_SKU_LIST.method,
      url:fetchUrl.GOODS_SKU_LIST.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GOODS_SKU_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取已选择的基本SKU
  * */
  getUnitSkuList({commit},rs){
    // console.log(rs)
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
      // method:fetchUrl.GOODS_SKU_LIST.method,
      url:fetchUrl.GET_SALE_UNIT_LIST.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_UNIT_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*保存销售商品*/
  saveSaleGoods({commit},rs){
    // console.log(rs)
    const params = {
      data:Object.assign({},rs),
      // method:fetchUrl.GOODS_SKU_LIST.method,
      url:fetchUrl.SAVE_SALE_GOODS.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SAVE_SALE_GOODS,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取发货地
  * */
  getGoodsSellerDeliver({commit},rs){
    // console.log(rs)
    const params = {

      method:fetchUrl.GOODS_SELLER_DELIVER.method,
      url:fetchUrl.GOODS_SELLER_DELIVER.url+rs.sellerMainId,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GOODS_SELLER_DELIVER,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取主体ID 配送模板
  * */
  getGoodsSellerMainDeliver({commit},rs){
    // console.log(rs)
    const params = {

      method:fetchUrl.SELLER_MAIN_AREA_TEMP.method,
      url:fetchUrl.SELLER_MAIN_AREA_TEMP.url+rs.sellerMainId,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SELLER_MAIN_AREA_TEMP,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取品牌下拉框
  * */
  getBrandSearchList({commit},rs){
    // console.log(rs)
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
      method:'POST',
      url:fetchUrl.GOODS_BRAND_LIST.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GOODS_BRAND_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取发货地下拉列表
  * */
  getDeliverSearchList({commit},rs){
    // console.log(rs)
    const params = {

      method:fetchUrl.GOODS_DELIVER_LIST.method,
      url:fetchUrl.GOODS_DELIVER_LIST.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GOODS_DELIVER_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取商家主体ID
  * */
  getSellerMainSearchList({commit},rs){
    // console.log(rs)
    const params = {

      method:fetchUrl.GOODS_SELLER_MAIN_LIST.method,
      url:fetchUrl.GOODS_SELLER_MAIN_LIST.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GOODS_SELLER_MAIN_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取发货地
  * */
  getSellerArea({commit},rs){
    // console.log(rs)
    const params = {
      method:fetchUrl.GOODS_AREA_TEMP.method,
      url:fetchUrl.GOODS_AREA_TEMP.url,
      data:Object.assign({},rs),
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.GOODS_AREA_TEMP,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取收入运费 模板
  * */
  getSaleFreightTempList({commit},rs){
    const params = {
      data:Object.assign({},rs),
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_FREIGHT_TEMP_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  getSaleFreightTempListPage({commit},rs){
    const params = {
      data:Object.assign({},rs),
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_FREIGHT_TEMP_LIST_PAGE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 保存编辑收入运费模板
  * */
  saveSaleFreightTemp({commit},rs){
    let _rs = UtilTool.deepCopy(rs)
    const params = {
      data:Object.assign({},_rs)
    }
    const opts = Object.assign({},fetchUrl.SAVE_SALE_FREIGHT_TEMP,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取运费收入模板 省份 GET_SALE_FREIGHT_PROVINCE
  * */
  getSaleFreightProvince({commit},rs){

    const params = {
      url:fetchUrl.GET_SALE_FREIGHT_PROVINCE.url+rs.freightId
    }
    const opts = Object.assign({},fetchUrl.GET_SALE_FREIGHT_PROVINCE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 编辑省份运费  EDIT_SALE_FREIGHT_PROVINCE
  * */
  editSaleFreightProvince({commit},rs){
    const params = {
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // data:baseActions.formData(Object.assign({},rs)),
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},fetchUrl.EDIT_SALE_FREIGHT_PROVINCE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取发货地运费模板
  * */
  getProductFreightTemplate(){

  },
  /*
  * 运费模板详情
  * */
  getDeliverAreasTemplateDetail({commit},rs){
    const params = {

      url:fetchUrl.GET_DELIVER_AREAS_TEMP_DETAIL.url+rs.freightTemplateId,
    }
    const opts = Object.assign({},fetchUrl.GET_DELIVER_AREAS_TEMP_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 导出销售列表
  * params type 类型 1 商品 2 销售组合
  * */
  exportSaleGoodsList({commit},rs){
    // console.log(rs)
    let _opts = Object.assign({},rs.rs)
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

    // console.log(rs.type)
    let _url = rs.type == 1 ? fetchUrl.EXPORT_SALE_GOODS_LIST.url : fetchUrl.EXPORT_GROUP_LIST.url
    // console.log(rs.isBatch)
    if(rs.type == 1 && rs.isBatch){
      _obj = {
        saleGoodsCode:rs.batchList,
        channel:_opts.channel
      }
    }
    baseActions.fromPost(_url,_obj)
  },
  /*
  * 判断是否可以切换
  * */
  checkCateGoods({commit},rs){
    // console.log(rs)
    const params = {

      method:fetchUrl.SALE_GOODS_CHANGE_CATE.method,
      url:fetchUrl.SALE_GOODS_CHANGE_CATE.url+rs.saleGoodsId + '/'+ rs.categoryId,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SALE_GOODS_CHANGE_CATE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售组合列表
  * */
  getSaleGroupList({commit},rs){
    // if(rs.saleGoodsIds){
    //   rs.saleGoodsIds = rs.saleGoodsIds.split(/[,，、\s]/g).filter((item)=>item);
    // }
    const params = {
      data:Object.assign({},rs),
      // method:fetchUrl.SALE_PRODUCT_LIST.method,
      url:fetchUrl.SALE_GROUP_MANAGE.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SALE_GROUP_MANAGE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 保存销售组合 SAVE_GROUP
  * */
  saveGroup({commit},rs){
    const params = {
      data:Object.assign({},rs),
      // method:fetchUrl.SALE_PRODUCT_LIST.method,
      url:fetchUrl.SAVE_GROUP.url,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    const opts = Object.assign({},fetchUrl.SAVE_GROUP,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取组合详情
  * */
  getGroupDetail({commit},rs){
    const params = {
      url:fetchUrl.GET_GROUP_DETAIL.url+rs.id
    }
    const opts = Object.assign({},fetchUrl.GET_GROUP_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售商品加入销售组合SAVE_JOIN_IN_GROUP
  * */
  saveJoinGroup({commit},rs){
    const params = {
      data:Object.assign({},rs),
      url:fetchUrl.SAVE_JOIN_IN_GROUP.url,
    }
    const opts = Object.assign({},fetchUrl.SAVE_JOIN_IN_GROUP,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取销售渠道对应的销售组合 GROUP_BY_SALE_TYPE
  * */
  getGroupSaleTypeList({commit},rs){
    let params = {
      url:fetchUrl.GROUP_BY_SALE_TYPE.url+rs.channel
    }
    if(rs.saleTypeId){
      params.url += '/'+rs.saleTypeId
    }
    if(rs.title){
      params.data = baseActions.formData({title:rs.title})
    }
    const opts = Object.assign({},fetchUrl.GROUP_BY_SALE_TYPE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售组合排序 GROUP_PRODUCT_SORT
  * */
  groupProductSort({commit},rs){
    const params = {
      data:Object.assign({},rs),
      url:fetchUrl.GROUP_PRODUCT_SORT.url,
    }
    const opts = Object.assign({},fetchUrl.GROUP_PRODUCT_SORT,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售组合启用/停用 GROUP_MODIFY_STATUS
  * */
  setGroupStatus({commit},rs){
    const params = {
      data:Object.assign({},rs),
      url:fetchUrl.GROUP_MODIFY_STATUS.url,
    }
    const opts = Object.assign({},fetchUrl.GROUP_MODIFY_STATUS,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 获取基本销售组合信息
  * */
  getGroupBaseMsg({commit},rs){

    const params = {
      url:fetchUrl.GROUP_BASE_MSG.url+rs.saleSetsCode
    }
    const opts = Object.assign({},fetchUrl.GROUP_BASE_MSG,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售组合标签 GROUP_LABEL_SEARCH
  * */
  groupLabelSearch({commit},rs){
    const params = {
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.GROUP_LABEL_SEARCH,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 设置渠道信息
  * */
  setChannelConfig({commit},rs){
    const opts = rs
    commit('SET_CHANNEL_CONFIG',opts)
  },
  /*
  * 设置批量选择商品导出
  * */
  setBatchExport({commit},rs){
    commit('SET_BATCH_EXPORT',rs)
  },
  /*
  * 销售商品上下架
  * */
  setSaleGoodsSaleStatus({commit},rs){
    const params = {
      data:Object.assign({},rs),
    }
    const opts = Object.assign({},fetchUrl.SALE_GOODS_SALE_STATUS,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售商品排期 SALE_GOODS_SALE_STATUS_LOG
  * */
  getSaleStatusList({commit},rs){
    const params = {
      data:Object.assign({},rs),
    }
    const opts = Object.assign({},fetchUrl.SALE_GOODS_SALE_STATUS_LOG,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 销售商品可用停用
  * */
  setSaleGoodsUpdateStatus({commit},rs){
    const params = {
      // data:Object.assign({},rs),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.SALE_GOODS_UPDATE_STATUS,params)
    return baseActions.fetch(commit,opts)
  },

  /*
  * 修改爆品类目 EDIT_POPULAR_GOODS_CATE
  * */
  editPopularGoodsCate({commit},rs){
    const params = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseActions.formData(Object.assign({},rs)),
    }
    const opts = Object.assign({},fetchUrl.EDIT_POPULAR_GOODS_CATE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 商品活动列表
  * */
  getSaleActivityList({commit},{type,data}){

    const params = {
      data:Object.assign({},data),
    }
    let _opts = type == 1 ? fetchUrl.SALE_SKU_ACTIVITY_LIST : fetchUrl.SALE_UNIT_ACTIVITY_LIST
    const opts = Object.assign({},_opts,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 可提报活动列表 REPORT_ACTIVITY_LIST
  * */
  getReportActivityList({commit},data){
    const params = {
      params:Object.assign({},data),
    }
    const opts = Object.assign({},fetchUrl.REPORT_ACTIVITY_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 活动详情  GET_ACTIVITY_DETAIL
  * */
  getActivityDetail({commit},{id}){
    const params = {
      method:fetchUrl.GET_ACTIVITY_DETAIL.method,
      url:fetchUrl.GET_ACTIVITY_DETAIL.url+id
    }
    const opts = Object.assign({},fetchUrl.GET_ACTIVITY_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 活动提报 SUBMIT_ACTIVITY_REPORT
  * */
  submitActivityReport({commit},data){
    const params = {
      data:Object.assign({},data),
    }
    const opts = Object.assign({},fetchUrl.SUBMIT_ACTIVITY_REPORT,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 状态吗下拉列表
  * */
  getGoodsTagListCode({commit},data){

    const opts = Object.assign({},fetchUrl.GOODS_TAG_LIST_CODE)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 状态吗列表
  * */
  getGoodsTagListPage({commit},data){
    const params = {
      data:Object.assign({},data),
    }
    const opts = Object.assign({},fetchUrl.GOODS_TAG_LIST_PAGE,params)
    return baseActions.fetch(commit,opts)
  },
  /*
  * 导出
  * */
  exportGoodsTagList({commit},data){
    let _opts = Object.assign({},data)
    delete _opts.page
    delete _opts.rows
    let _obj = {}
    for(let i in _opts){
      if(_opts[i]){
        _obj[i] = _opts[i]
      }
    }
    baseActions.fromPost(fetchUrl.GOODS_TAG_LIST_EXPORT.url,_obj)
  },
  /*
  * 下载模版
  * */
  downGoodsTagExportTemp({commit},data){
    const opts = Object.assign({},fetchUrl.GOODS_TAG_EXPORT_TEMP)
    baseActions.fromPost(fetchUrl.GOODS_TAG_EXPORT_TEMP.url)
  },

  /*
  * 销售商品运费展示 GOODS_GET_SALLER_FEE
  * */
  getSellerFee({commit},{deliverAreaId}){
    const params = {
      url:fetchUrl.GOODS_GET_SELLER_FEE.url+deliverAreaId
    }
    const opts = Object.assign({},fetchUrl.GOODS_GET_SELLER_FEE,params)
    return baseActions.fetch(commit,opts)
  },


}
