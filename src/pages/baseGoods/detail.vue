<template>
  <div>
    <div class="title-box">
      新增后台商品
    </div>
    <div class="section-box">
      <div class="item-box">
        <p>当前选择类目：环球美食 > 粮油副食 > 方便速食 > 方便面</p>
        <p>货品归属商家：杭州樱之梦食品有限公司</p>
      </div>
      <div class="item-box">
        <div class="sub-title-box">
          基本信息
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  export default{
    name:'baseGoodsDetail',
    data:()=>({
      productOpts:{
        categoryId:'',//	类目Id	Integer	是
        sellerMainId:'',//	货品归属商家Id	Integer	是
        name:'',//	商品名称	String	是
        longTitle:'',//	销售长名称	String	是
        shortTitle:'',//	销售短名称	String	是
        sellingPoint:'',//	卖点	String	是
        deliverAreas:'',//	发货地信息	Array	是
        propertyPairId:'',//	属性对Id	Integer	是
        propertyType:'',//	属性类型，1关键属性，2销售属性，3商品属性	Integer	是
        detail:'',//	商品详情	String	是
        skus:[

        ],//	SKU	Array	是
        skuImages:[

        ],//	SKU主图	Array
        isRequiredImage:'',//=1时，必填
        images:[

        ],//	商品主图	Array	是
      },
      configProduct:{
        baseConfig:[
          {
            label:'商品名称',
            type:'input',
            key:'name'
          },
          {
            label:'品牌',
            type:'select',
            key:'name',
            options:[
              {
                value:'',
                label:''
              }
            ]
          },
          {
            label:'商品货号',
            type:'input',
            key:'name'
          },
          {
            label:'销售长名称',
            type:'input',
            key:'longTitle'
          },
          {
            label:'销售短名称',
            type:'input',
            key:'shortTitle'
          },
          {
            label:'卖点文案'
          }

        ]
      },
    })
  }
</script>
