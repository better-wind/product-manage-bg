/*
* 接口地址配置
* method
* url
* */
import saleProduct from './fetchUrl/saleProduct'
import frontCate from './fetchUrl/frontCategory'
import saleFlag from './fetchUrl/saleFlag'
import saleBrand from './fetchUrl/saleBrand'
import virtual from './fetchUrl/virtual'

// const API = 'roleGoods'
// const API2 = 'roleGoods'
// const API3 = 'roleGoods'
// const API4 = 'roleGoods'
const API = 'goodsAdmin'
const API2 = 'goodsAdmin'
const API3 = 'goodsAdmin'
const API4 = 'goodsAdmin'

export default {
  ...saleProduct,
  ...frontCate,
  ...saleFlag,
  ...saleBrand,
  ...virtual,

  //权限控制 /goods/menu/
  ROLE_MENU: { method: 'POST', url: API+'/goods/user' },

  //顶部菜单 /goods/nav
  GOODS_NAV: { method: 'POST', url: API+'/goods/nav'},

  //退出登录 /login/logout
  LOGIN_OUT: { method: 'GET', url: API+'/login/logout'},
  //权限明细 /goods/user
  ROLE_DETAIL_MENU: { method: 'POST', url: API+'/goods/user' },

  //属性值列表 /goods/property/value/list
  PROPERTY_VAL__SEARCH_LIST: { method: 'POST', url: API+'/goods/property/value/list/page' },
  // PROPERTY_VAL__SEARCH_LIST: { method: 'GET', url: '/static/data/properValList.json' },
  //属性项列表
  ATTR_KEY_LIST:{ method: 'POST', url: API+'/goods/property/name/list/page'},
  // ATTR_KEY_LIST:{ method: 'GET', url: '/static/data/attrKey.json' },

  //属性项详情
  PROPERTY_DETAIL:{ method: 'POST', url: API+'/goods/property/name/detail'},
  //保存属性项
  PROPERTY_EDIT_SAVE: { method: 'POST', url: API+'/goods/property/name/save' },
  //编辑属性项
  PROPERTY_EDIT_UPDATE: { method: 'POST', url: API+'/goods/property/name/update' },
  //属性项属性值列表
  // PROPERTY_VAl_LIST:{ method: 'POST', url: 'adminGoods/goods/property/pair/list' },
  PROPERTY_VAl_LIST:{ method: 'POST', url: API+'/goods/property/pair/list' },
  // PROPERTY_VAl_LIST:{ method: 'GET', url: '/static/data/propertyVal.json' },

  //模糊匹配属性项名称
  MATCH_NAME_CODE:{ method: 'POST', url: API+'/goods/property/name/list/code' },
  //新增属性值
  SAVE_PROPERTY_VAl:{ method: 'POST', url: API+'/goods/property/value/save' },
  //保存属性值
  // UPDATE_PROPERTY_VAl:{ method: 'POST', url: API+'/goods/property/value/update' },
  UPDATE_PROPERTY_VAl:{ method: 'POST', url: API+'/goods/property/pair/value/update' },
  // UPDATE_PROPERTY_VAl:{ method: 'POST', url: 'adminGoods/goods/property/pair/value/update' },
  //下载属性值模板
  UPLOAD_PROPERTY_VAl:{ method: 'GET', url: API+'/goods/property/value/template' },
  //保存导入属性
  // PROPERTY_VALUE_IMPORT:{ method: 'POST', url: API+'/goods/property/value/import2' },
  PROPERTY_VALUE_IMPORT:{ method: 'POST', url: API+'/goods/property/value/import2' },

  //模糊匹配属性值名称
  MATCH_VALUE_CODE:{ method: 'POST', url: API+'/goods/property/value/list/code' },

  // MATCH_VALUE_CODE:{ method: 'GET', url: API+'/static/data/matchValue.json' },
  //保存属性值
  PROPERTY_VALUE_SAVE: { method: 'POST', url: API+'/goods/property/value/save' },
  //编辑属性值
  PROPERTY_VALUE_UPDATE: { method: 'POST', url: API+'/goods/property/value/update' },


  //类目属性管理列表
  PROPERTY_MANAGER_LIST: { method: 'POST', url: API+'/goods/category/property/list/page' },
  // PROPERTY_MANAGER_LIST: { method: 'GET', url: '/static/data/propertyManage.json' },
  // 类目属性项明细{categoryId}
  PROPERTY_MANAGER_DETAIL: { method: 'POST', url: API4+'/goods/category/property/list/' },
  // PROPERTY_MANAGER_DETAIL: { method: 'GET', url: '/static/data/propertyDetail.json' },
  // 类目明细属性项新增
  PROPERTY_MANAGER_DETAIL_NAME_SAVE: { method: 'POST', url: API+'/goods/category/property/name/save' },

  // 保存类目明细
  PROPERTY_MANAGER_DETAIL_SAVE: { method: 'POST', url: API+'/goods/category/property/save' },


  //商品经理类目管理列表
  CATE_MANAGER_LIST: { method: 'POST', url: API2+'/goods/managerGroup/list/page' },
  // CATE_MANAGER_LIST: { method: 'GET', url: '/static/data/cateManage.json' },
  //导出商品经理管理列表
  EXPORT_CATE_MANAGER_LIST: { method: 'POST',url:API2+'/goods/managerGroup/export'},
  //商品类目经理分组
  CATE_MANAGER_GROUP: { method: 'GET', url: API2+'/goods/managerGroup/list/code' },
  // CATE_MANAGER_GROUP: { method: 'GET', url: '/static/data/cateManageGroup.json' },
  //保存商品类目经理分组
  CATE_MANAGER_GROUP_SAVE: { method: 'POST', url: API+'/goods/managerGroup/update' },
  //类目经理分页 180413
  CATE_MANAGER_GROUP_LIST: { method: 'POST', url: API+'/goods/managerGroup/manager/list/page'},
  CATE_MANAGER_GROUP_UPDATE: { method: 'POST', url: API+'/goods/managerGroup/manager/update'},
  CATE_MANAGER_GROUP_GET: { method: 'POST', url: API+'/goods/managerGroup/manager/get'},


  //品牌库
  //品牌列表
  BRAND_LIST: { method: 'POST', url: API2+'/goods/brand/list/page' },
  // BRAND_LIST: { method: 'GET', url: '/static/data/brand.json' },
  //品牌类目类目
  BRAND_CATE_LIST: { method: 'POST', url: API2+'/goods/brand/name/list/page' },
  // BRAND_CATE_LIST: { method: 'GET', url: '/static/data/brandCate.json' },
  //编辑品牌名称
  BRAND_NAME_EDIT: { method: 'POST', url: API2+'/goods/brand/update' },
  //批量删除类目 /goods/category/delete
  DEL_BRAND_LIST: { method: 'POST', url: API2+'/goods/brand/brandCategory/delete' },
  //品牌类目（新增候选）
  BRAND_ADD_CATE_LIST: { method: 'POST', url: API2+'/goods/brand/category/list/page' },

  //保存品牌类目
  UPDATE_BRAND_CATE: { method: 'POST', url: API2+'/goods/brand/brandCategory/update' },
  //新增品牌类目
  SAVE_BRAND_CATE: { method: 'POST', url: API2+'/goods/brand/brandCategory/save' },
  // SAVE_BRAND_CATE: { method: 'POST', url: 'admin2Goods/goods/brand/brandCategory/save' },

  //类目列表{categoryId}
  CATEGORY_LIST:{ method: 'GET', url: API4+'/goods/category/name/list/code/' },
  // CATEGORY_LIST:{ method: 'GET', url: '/static/data/cate.json' },
  //类目列表数组{categoryId}
  CATEGORY_MULTIPLE_LIST:{ method: 'GET', url: API2+'/goods/category/nameByIds/list/code/' },

  //后台商品
  //后台商品列表 /goods/baseGoods/list/page
  BASE_GOODS_LIST: { method: 'POST', url: API+'/goods/baseGoods/list/page' },
  //BASE_GOODS_LIST: { method: 'GET', url: '/static/data/baseGoods.json' },

  //货品商家归属
  GOODS_BELONG: { method: 'GET', url: API3+'/goods/seller/sellerMain/list/code' },

  //获取发货地信息
  SHIP_AREA: { method: 'POST', url: API3+'/goods/seller/deliverAreas/' },

  //获取商品详情
  GET_BASE_GOODS_DETAIL: { method: 'GET', url: API3+'/goods/baseGoods/detail/' },

  //保存后台商品
  SAVE_BASE_GOODS: { method: 'POST', url: API3+'/goods/baseGoods/save' },
  // SAVE_BASE_GOODS: { method: 'POST', url: 'saveSaleGoods/goods/baseGoods/save' },

  //导出前台列表
  EXPORT_BASE_GOODS_LIST:{ method:'POST',url: API2+'/goods/baseGoods/export'},

  VALID_CATEGORY_ID_CHANGE:{ method:'POST',url: API2+'/goods/baseGoods/validCategoryIdChange/'},

   //获取StorageId
  GET_STORAGE_ID:{ method:'GET',url:API2+'/goods/purchase/commonStorage' },

  //获取可关联采购商品列表
  GET_PURCHASE_GOODS_LIST:{ method:'POST',url:API2+'/goods/purchase/goods/list' },

  //查询
  GET_PURCHASE_GOOD:{ method:'GET',url:API2+'/goods/purchase/goods/get/' },

  //获取品牌列表
  GET_BRAND_LIST:{ method:'GET',url:API2+'/goods/purchase/brand/list' },

  //获取采购商品调价记录
  GET_PURCHASE_GOODS_CHANGE_RECORD:{ method:'POST',url:API2+'/goods/baseGoods/costPrice/list' },

  //获取非自营商品调价记录
  GET_BASE_GOODS_CHANGE_RECORD:{ method:'POST',url:API2+'/goods/sellerGoods/costPrice/audit/list' },

  //导出SKU信息
  EXPORT_SKU_INFO:{ method:'GET',url:API2+'/goods/baseGoods/costPrice/self/export' },

  //下载调价模板
  DOWNLOAD_CHANGE_PRICE_TPL:{ method:'GET',url:API2+'/goods/baseGoods/costPrice/upload/template' },

  //库存列表
  STORAGE_LIST:{ method: 'POST', url: API+'/goods/baseGoods/storage/list/' },

  //保存库存
  STORAGE_SAVE:{ method: 'POST', url: API+'/goods/baseGoods/storage/save' },

  //销售商品库存列表

  SALE_STORAGE_LIST: {method: 'POST', url: API+'/goods/saleGoods/stock/'},

  //基础商品可用停用
  BASE_GOODS_UPDATE_STATUS: {method: 'POST', url: API+'/goods/baseGoods/disable'},

  //基础商品品牌非自营
  SALE_BRAND_EXTRA: {method: 'POST', url: API+'/goods/seller/brand/name/list/code'},
}
