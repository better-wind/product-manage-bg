import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const Home = resolve => require(['@/pages/common/Home'], resolve),
      Demo = resolve => require(['@/pages/Demo/Demo'], resolve),
      Welcome = resolve => require(['@/pages/welcome/index'], resolve),
      propertyKey = resolve => require(['@/pages/property/key'], resolve),
      propertyValue = resolve => require(['@/pages/property/value'], resolve),
      categoryIndex = resolve => require(['@/pages/category/index'], resolve),
      categoryProperty = resolve => require(['@/pages/category/property'], resolve),
      cateManager = resolve => require(['@/pages/category/cateManager'], resolve),
      baseGoodsList = resolve => require(['@/pages/baseGoods/list'], resolve),
      // baseGoodsEdit = resolve => require(['@/pages/baseGoods/edit'], resolve),
      baseGoodsEdit = resolve => require(['@/pages/baseGoods/edit-storage'], resolve),
      baseGoodsDetail = resolve => require(['@/pages/baseGoods/detail'], resolve),
      saleGoodsList = resolve => require(['@/pages/saleGoods/list'], resolve),
      // saleGoodsDetail = resolve => require(['@/pages/saleGoods/detail'], resolve),
      saleGoodsDetail = resolve => require(['@/pages/saleGoods/detail-storage'], resolve),
      saleGroupIndex = resolve => require(['@/pages/saleGroup/Index'], resolve),
      saleGroupList = resolve => require(['@/pages/saleGroup/list'], resolve),
      brandIndex = resolve => require(['@/pages/brand/index'], resolve),
      baseGoodsConsult = resolve => require(['@/pages/baseGoods/baseGoodsConsult'], resolve),
      editCostPrice = resolve => require(['@/pages/baseGoods/editCostPrice'], resolve),
      goodsAudit = resolve => require(['@/pages/baseGoods/goodsAudit'], resolve),
      goodsAuditAgain = resolve => require(['@/pages/baseGoods/goodsAuditAgain'], resolve),
      priceAudit = resolve => require(['@/pages/baseGoods/priceAudit'], resolve),
      frontCategory = resolve => require(['@/pages/frontCategory/index'], resolve),
      saleFlag = resolve => require(['@/pages/saleFlag/index'], resolve),
      saleBrand = resolve => require(['@/pages/saleBrand/index'], resolve),
      saleFreight = resolve => require(['@/pages/saleFreightTemp/index'], resolve),
      saleFreightProvince = resolve => require(['@/pages/saleFreightTemp/province'], resolve),
      virtualPhone = resolve => require(['@/pages/virtualGoods/phone'], resolve),
      virtualFlow = resolve => require(['@/pages/virtualGoods/flow'], resolve),
      editPopularGoodsCate = resolve => require(['@/pages/saleGoods/editPopularGoodsCate'], resolve),
      unitTagList = resolve => require(['@/pages/saleUnitTag/unitTagList'], resolve),
      activityReport = resolve => require(['@/pages/activityReport/activityList'], resolve);
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'Welcome',
          component: Welcome,
        },
        {
          path: '/property/key',
          name: 'propertyKey',
          component: propertyKey,
        },
        {
          path: '/property/value',
          name: 'propertyValue',
          component: propertyValue,
        },
        {
          path: '/category/index',
          name: 'categoryIndex',
          component: categoryIndex,
        },
        {
          path: '/category/property',
          name: 'categoryProperty',
          component: categoryProperty,
        },
        {
          path: '/category/manager',
          name: 'cateManager',
          component: cateManager,
        },
        {
          path: '/brand/index',
          name: 'brandIndex',
          component: brandIndex,
        },
        {
          path: '/baseGoods/list',
          name: 'baseGoodsList',
          component: baseGoodsList,
        },
        {
          path: '/baseGoods/edit',
          name: 'baseGoodsEdit',
          component: baseGoodsEdit,
        },
        {
          path: '/baseGoods/detail',
          name: 'baseGoodsDetail',
          component: baseGoodsDetail,
        },
        {
          path: '/saleGoods/detail',
          name: 'saleGoodsDetail',
          component: saleGoodsDetail,
        },
        {
          path: '/saleGoods/ggj',
          name: 'saleGoodsGGJ',
          component: saleGoodsList,
        },
        {
          path: '/saleGoods/hqbs',
          name: 'saleGoodsHQBS',
          component: saleGoodsList,
        },
        {
          path: '/saleGoods/mbyd',
          name: 'saleGoodsMBYD',
          component: saleGoodsList,
        },
        {
          path: '/saleGoods/msms',
          name: 'saleGoodsMSMS',
          component: saleGoodsList,
        },
        {
          path: '/saleGroup/ggj',
          name: 'saleGroupGGJ',
          component: saleGroupIndex,
        },
        {
          path: '/saleGroup/hqbs',
          name: 'saleGroupHQBS',
          component: saleGroupIndex,
        },
        {
          path: '/saleGroup/msms',
          name: 'saleGroupMSMS',
          component: saleGroupIndex,
        },
        {
          path: '/saleGroup/mbyd',
          name: 'saleGroupMBYD',
          component: saleGroupIndex,
        },
        {
          path: '/saleGroup/list',
          name: 'saleGroupList',
          component: saleGroupList,
        },
        {
          path: '/baseGoodsConsult',
          name: 'baseGoodsConsult',
          component: baseGoodsConsult,
        },
        {
          path: '/editCostPrice',
          name: 'editCostPrice',
          component: editCostPrice,
        },
        {
          path: '/priceAudit',
          name: 'priceAudit',
          component: priceAudit,
        },
        {
          path: '/goodsAudit',
          name: 'goodsAudit',
          component: goodsAudit,
        },
        {
          path: '/goodsAuditAgain',
          name: 'goodsAuditAgain',
          component: goodsAuditAgain,
        },
        {
          path: '/frontCategory',
          name: 'frontCategory',
          component: frontCategory,
        },
        {
          path: '/saleFlag',
          name: 'saleFlag',
          component: saleFlag,
        },
        {
          path: '/saleBrand',
          name: 'saleBrand',
          component: saleBrand,
        },
        {
          path: '/saleFreight',
          name: 'saleFreight',
          component: saleFreight,
        },
        {
          path: '/saleFreightProvince',
          name: 'saleFreightProvince',
          component: saleFreightProvince,
        },
        {
          path: '/virtual/phone',
          name: 'virtualPhone',
          component: virtualPhone,
        },
        {
          path: '/virtual/flow',
          name: 'virtualFlow',
          component: virtualFlow,
        },
        {
          path: '/edit/popular/cate',
          name: 'editPopularGoodsCate',
          component: editPopularGoodsCate,
        },
        {
          path:'/activity/report/:type/:goodsId',
          name:'activityReport',
          component:activityReport
        },
        {
          path:'unit/tag/list',
          name:'unitTagList',
          component:unitTagList
        }
      ]
    },
  ]
});
router.afterEach((to, from) => {
  document.body.scrollTop = document.documentElement.scrollTop = 0
})
export default router
