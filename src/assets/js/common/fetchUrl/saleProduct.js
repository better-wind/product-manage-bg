const API = 'goodsAdmin'
const API2 = 'goodsAdmin'
const API_MOCK = 'mock/11'
// const API = 'saveSaleGoods'
// const API2 = 'saveSaleGoods'


export default {
  // SALE_PRODUCT_DETAIL:{ method: 'GET', url: 'saveSaleGoods/goods/saleGoods/detail/'},
  SALE_PRODUCT_DETAIL:{ method: 'GET', url: API+'/goods/saleGoods/detail/'},
  // SALE_PRODUCT_DETAIL:{ method: 'GET', url: '/static/data/frontProductDetail.json' },

  // SALE_PRODUCT_LIST:{ method: 'GET', url: '/static/data/frontProductList.json' },
  SALE_PRODUCT_LIST:{ method: 'POST', url:API+'/goods/saleGoods/list/page' },

  GOODS_SKU_LIST: { method: 'POST', url:API+'/goods/sku/list' },

  SALE_GOODS_SKU_LIST: { method: 'GET', url: '/static/data/frontProductSku.json' },

  GET_CATEGORY_PATH:{ method:'GET',url:API+'/goods/category/get/'},

  GET_SALE_UNIT_LIST:{ method:'POST',url:API+'/goods/saleUnit/sku/list'},

  //销售渠道类型
  GET_SALE_LIST_CODE:{ method:'POST',url:API+'/sale/type/list/code'},

  //前台商品编辑保存API2+

  // SAVE_SALE_GOODS: { method:'POST',url:'saveSaleGoods/goods/saleGoods/saveSaleGoods'},
  SAVE_SALE_GOODS: { method:'POST',url: API2+'/goods/saleGoods/saveSaleGoods'},
  //获取发货地
  GOODS_SELLER_DELIVER: { method:'GET',url: API2+'/goods/seller/deliverAreas/'},

  //品牌库下拉列表
  GOODS_BRAND_LIST: { method:'POST',url: API2+'/goods/brand/name/list/code'},

  //发货地下拉列表
  GOODS_DELIVER_LIST:{method:'GET',url: API2+'/goods/seller/deliverArea/list/code'},

  //货品商家归属
  GOODS_SELLER_MAIN_LIST:{method:'GET',url: API2+'/goods/seller/sellerMain/list/code'},

  //获取发货地 运费模板
  GOODS_AREA_TEMP:{ method:'POST',url: API2+'/goods/seller/deliverAreas' },

  //获取商家主体ID 配送模板
  SELLER_MAIN_AREA_TEMP:{ method:'POST',url: API2+'/goods/seller/deliverAreasTemplate/'},

  //获取运费模板详情
  GET_DELIVER_AREAS_TEMP_DETAIL: {method:'POST',url: API2+'/goods/seller/detail/deliverAreasTemplate/'},

  //获取运费收入模板列表 /goods/saleGoods/list/freightTemplate
  GET_SALE_FREIGHT_TEMP_LIST:{ method:'POST',url: API2+'/goods/saleGoods/list/freightTemplate'},
  GET_SALE_FREIGHT_TEMP_LIST_PAGE:{ method:'POST',url: API2+'/goods/saleGoods/list/page/freightTemplate'},
  //保存编辑收入运费模板列表
  SAVE_SALE_FREIGHT_TEMP:{ method:'POST',url: API2+'/goods/saleGoods/save/freightTemplate'},
  //获取收入模板省份信息
  GET_SALE_FREIGHT_PROVINCE: { method:'POST',url: API2+'/goods/saleGoods/list/provinceFreight/'},
  //保存省份运费修改
  EDIT_SALE_FREIGHT_PROVINCE: { method:'POST',url: API2+'/goods/saleGoods/save/provinceFreight'},

  //导出前台列表
  EXPORT_SALE_GOODS_LIST:{ method:'POST',url: API2+'/goods/saleGoods/list/export'},
  EXPORT_GROUP_LIST:{ method:'POST',url: API2+'/goods/sets/list/export'},
  //判断类目是否可以切换
  ///goods/saleGoods/validCategoryIdChange/{saleGoodsId}/{categoryId}
  SALE_GOODS_CHANGE_CATE:{ method:'POST',url: API2+'/goods/saleGoods/validCategoryIdChange/'},

  //销售商品快捷创建 基础商品是否存在 goods/baseGoods/exist/{baseGoodsCode}
  CHECK_BASE_GOODS:{ method:'GET',url:API2+'/goods/baseGoods/exist/' },
  // CHECK_BASE_GOODS:{ method:'GET',url:'saveSaleGoods/goods/baseGoods/exist/' }

  //组合商品管理列表
  SALE_GROUP_MANAGE:{ method:'POST',url:API2+'/goods/sets/list/page' },

  //组合商品管理
  SAVE_GROUP:{ method:'POST',url:API2+'/goods/sets/save' },
  //组合管理详情 {id}
  GET_GROUP_DETAIL: { method:'POST',url:API2+'/goods/sets/detail/' },

  //销售商品加入组合
  SAVE_JOIN_IN_GROUP:{ method:'POST',url:API2+'/goods/sets/saveSaleGoodsToSets' },

  //销售商品组合筛选
  GROUP_BY_SALE_TYPE:{ method:'POST',url:API2+'/goods/sets/listCode/' },

  //销售商品排序
  GROUP_PRODUCT_SORT:{ method:'POST',url:API2+'/goods/sets/modifySetsGoods/' },
  //销售组合启用停用
  GROUP_MODIFY_STATUS:{ method:'POST',url:API2+'/goods/sets/modifyStatus' },

  //获取销售组合标题 id

  GROUP_BASE_MSG:{ method:'GET',url:API2+'/goods/sets/getSaleSets/' },

  //销售组合标签搜索
  GROUP_LABEL_SEARCH:{ method:'POST',url:API2+'/goods/sets/list/lable' },

  //销售商品上下架
  SALE_GOODS_SALE_STATUS:{ method:'POST',url:API2+'/goods/saleGoods/updateSaleStatus' },

  //销售商品可用
  SALE_GOODS_UPDATE_STATUS:{ method:'POST',url:API2+'/goods/saleGoods/updateStatus' },
  //销售排期
  SALE_GOODS_SALE_STATUS_LOG:{ method:'POST',url:API2+'/goods/saleGoods/list/saleGoodsScheduleLog' },

  //修改爆品类目
  EDIT_POPULAR_GOODS_CATE:{ method:'POST',url:API2+'/goods/saleGoods/updateManagerGroupId' },

  //销售单元 sku 活动列表 API_MOCK
  SALE_SKU_ACTIVITY_LIST:{ method:'POST',url:API2+'/goods/sellerActivity/sku/list/page'},

  SALE_UNIT_ACTIVITY_LIST:{ method:'POST',url:API2+'/goods/sellerActivity/saleUnit/list/page'},

  //已提报活动列表
  REPORT_ACTIVITY_LIST: { method:'GET',url:API2+'/goods/sellerActivity/code/list' },

  //活动详情
  GET_ACTIVITY_DETAIL: { method:'GET',url:API2+'/goods/sellerActivity/get/' },
  // 提交活动
  SUBMIT_ACTIVITY_REPORT: { method:'POST',url:API2+'/goods/sellerActivity/submit' },
  /*
  * 2018-05-03 销售商品状态码接口
  * */
  // 状态码下拉列表
  GOODS_TAG_LIST_CODE:{ method:'GET',url:API2+'/goods/saleUnit/tag/list/code' },
  // 列表下拉列表
  GOODS_TAG_LIST_PAGE:{ method:'POST',url:API2+'/goods/saleUnit/tag/list/page' },
  // 列表导出
  GOODS_TAG_LIST_EXPORT:{ method:'POST',url:API2+'/goods/saleUnit/tag/export' },
  // 导入下载
  GOODS_TAG_EXPORT_TEMP:{ method:'GET',url:API2+'/goods/saleUnit/tag/export/template' },

  //销售商品运费展示
  GOODS_GET_SELLER_FEE:{method:'POST',url:API2+'/goods/saleGoods/getSellerFee/'}
}
