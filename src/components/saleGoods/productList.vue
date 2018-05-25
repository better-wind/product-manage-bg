<template>
  <div class="section-box search-goods-box">
    <v-search>
      <template slot="private-item">
        <v-cate />
      </template>
      <template slot="private-sellerMainId">
        <div>
          <span class="label-sign">货品归属商家</span>
          <el-select filterable
                     remote
                     :remote-method="remoteMethod"
                     :clearable="true"
                     v-model="searchParams.sellerMainId" @change="selectSellerMainId" class="input-item-middle" size="small"  placeholder="货品归属商家">
            <template v-for="subItem in sellerMainIdList">
              <el-option :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>
        </div>
      </template>
      <!--<template v-if="!salGroupConfig.isGroup" slot="saleSetsTitle-item">-->
        <!--<div>-->
          <!--<span class="label-sign">组合标题</span>-->
          <!--<el-input  v-model.trim="searchParams.saleSetsTitle" class="input-item-middle" size="small" placeholder="组合标题"></el-input>-->
        <!--</div>-->
      <!--</template>-->
      <template v-if="!salGroupConfig.isGroup" slot="saleSetsCode-item">
        <div>
          <span class="label-sign">销售组合码(G)</span>
          <el-input  v-model.trim="searchParams.saleSetsCode" class="input-item-middle" size="small" placeholder="销售组合码(G)"></el-input>
        </div>
      </template>
      <template v-if="!salGroupConfig.isGroup" slot="saleTypeId-item">
        <div>
          <span class="label-sign">销售渠道类型</span>
          <el-select v-model="searchParams.saleTypeId"  class="input-item-middle" size="small"  placeholder="销售渠道类型">
            <template v-for="subItem in saleTypeIdList">
              <el-option :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>
        </div>
      </template>
      <template v-if="salGroupConfig.isGroup" slot="isShow-item">
        <div>
          <span class="label-sign">展现状态</span>
          <el-select v-model.trim="searchParams.isShow" class="input-item-middle" size="small" placeholder="展现状态">
            <el-option value="1" label="展现"></el-option>
            <el-option value="0" label="不展现"></el-option>
          </el-select>
        </div>
      </template>
      <template slot="deliver-item">
        <div>
          <span class="label-sign">发货地</span>
          <el-select filterable :disabled="sellerDeliverList.length ? false : true" v-model="searchParams.deliverAreaId" class="input-item-middle" size="small"  :placeholder="sellerDeliverList.length ? '请选择发货地' : '请先选择货品归属商家'">
            <template v-for="subItem in sellerDeliverList">
              <el-option :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>
        </div>
      </template>
      <template slot="private-menu">
        <el-button size="small" @click="exportSearch">导出结果</el-button>
      </template>
    </v-search>
    <v-result :salGroupConfig="salGroupConfig" />
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vCate from '@/components/search/category'
  import vResult from '@/components/saleGoods/result'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','channelConfigStates','batchExport'])
    },
    props:['salGroupConfig'],
    created(){
      this.initView()
    },
    data:()=>({
      sellerMainIdList:[],
      sellerDeliverList:[],
      sellerMainIdListBase:[],
      saleTypeIdList:[],
      searchPage:{
        searchItem:[
          {
            type:'',
            key:'page',
            intKey:1
          },
          {
            type:'',
            key:'rows',
            intKey:20
          },
          {
            private:true,
            type:'cate',
            label:'类目筛选',
            isSlot:true,
            slotName:'private-item',
            items:[
              {
                type:'select',
                label:'',
                key:'firstCategoryId',
                intKey:'',
                placeholder:'一级分类',
                options:[]
              },
              {
                type:'select',
                label:'',
                key:'secondCategoryId',
                intKey:'',
                placeholder:'二级分类',
                options:[]
              },
              {
                type:'select',
                label:'',
                key:'thirdCategoryId',
                intKey:'',
                placeholder:'三级分类',
                options:[]
              },
              {
                type:'select',
                label:'',
                key:'fourthCategoryId',
                intKey:'',
                placeholder:'四级分类',
                options:[]
              }
            ],
          },
          {
            type:'input',
            label:'销售商品码(SG)',
            placeholder:'销售商品码',
            key:'saleGoodsCode',
            intKey:'',
//            regType:[
//              {
//                type:'Num',
//                msg:'ID请输入数字'
//              }
//            ],
          },
          {
            type:'input',
            label:'销售商品ID',
//            placeholder:'多个用,分割',
            placeholder:'销售商品ID',
            key:'saleGoodsIds',
            intKey:'',
          },
          {
            type:'input',
            label:'商品名称',
            placeholder:'通过销售长名称筛选',
            key:'longTitle',
            intKey:''
          },
          {
            type:'select',
            label:'商品类目分组',
            placeholder:'商品类目分组',
            key:'managerGroupId',
            intKey:'',
            options:[]
          },
          {
            type:'saleTypeId-select',
            label:'渠道销售类型',
            placeholder:'渠道销售类型',
            key:'saleTypeId',
            intKey:'',
            isSlot:true,
            slotName:'saleTypeId-item',
            options:[]
          },
          {
            type:'select',
            label:'销售状态',
            placeholder:'销售状态',
            key:'saleStatus',
            intKey:'',
            options:[
              {
                label:'上架',
                value:'1'
              },
              {
                label:'下架',
                value:'0'
              }
            ]
          },
          {
            type:'select',
            label:'可用状态',
            placeholder:'可用状态',
            key:'status',
            intKey:'1',
            options:[
              {
                label:'可用',
                value:'1'
              },
//              {
//                label:'停用',
//                value:'0'
//              },
              {
                label:'删除',
                value:'2'
              }
            ]
          },
          {
            type:'select-filterable-seller',
            label:'货品归属商家',
            placeholder:'货品归属商家',
            key:'sellerMainId',
            intKey:'',
            isSlot:true,
            slotName:'private-sellerMainId',
            options:[]
          },
          {
            type:'select-filterable-deliver',
//            type:'select-filterable',
            label:'发货地',
            placeholder:'发货地',
            key:'deliverAreaId',
            intKey:'',
            isSlot:true,
            slotName:'deliver-item',
            options:[
              {
                label:'发货地数据太多，方案再定',
                value:'1'
              },
            ]
          },
          {
            type:'select-property-brand',
            label:'品牌',
            placeholder:'品牌',
            key:'brandId',
            intKey:'',
            options:[
              {
                label:'A',
                value:'BB'
              },
            ]
          },
          {
            type:'input',
            label:'销售单元码(U)',
            placeholder:'销售单元码',
            key:'saleUnitCode',
            intKey:''
          },
          {
            type:'input',
            label:'基础商品码(BG)',
            placeholder:'基础商品码',
            key:'baseGoodsCode',
            intKey:''
          },
          {
            type:'input',
            label:'SKU码',
            placeholder:'SKU码',
            key:'skuCode',
            intKey:''
          },
          {
            type:'input',
            label:'定价毛利率',
            placeholder:'定价毛利率',
            key:'marginGrossStart',
            intKey:'',
            intKey:'',
//            regType:[
//              {
//                type:'Price',
//                msg:'定价毛利率格式错误'
//              }
//            ],
          },
          {
            type:'input',
            label:'-',
            placeholder:'定价毛利率',
            key:'marginGrossEnd',
            intKey:'',
            intKey:'',
//            regType:[
//              {
//                type:'Price',
//                msg:'定价毛利率格式错误'
//              }
//            ],
          },
          {
            type:'input',
            label:'发货编码',
            placeholder:'发货编码',
            key:'deliverCode',
            intKey:''
          },
          {
            type:'saleSetsCode-input',
            label:'销售组合码(G)',
            placeholder:'销售组合码(G)',
            key:'saleSetsCode',
            intKey:'',
            isSlot:true,
            slotName:'saleSetsCode-item',
          },
          {
            type:'select-saleSetsTitle',
            label:'',
            placeholder:'组合标题',
            key:'saleSetsTitle',
            intKey:'',
//            isSlot:true,
//            slotName:'saleSetsTitle-item',
          },
          {
            type:'isShow-input',
            label:'展现状态',
            placeholder:'展现状态',
            key:'isShow',
            intKey:'',
            isSlot:true,
            slotName:'isShow-item',
          },
        ],
        searchMenu:[
          {
            label:'查询',
            type:'search',
            style:'primary',
          },
          {
            isSlot:true,
            slotName:'private-menu',
          }
        ],
        searchResult:[
          {
            label:'主图',
            key:'imageUrl',
            width:'120',
            type:'image'
          },
          {
            label:'基础信息',
            key:'',
            width:'260',
            type:'base'
          },
          {
            label:'商品名称',
            key:'name',
//            width:'270',
            minWidth:'270',
            type:'name',
          },
          {
            label:'详细信息',
            key:'categoryFirstName',
            width:'220',
            type:'detail',
          },
          {
            label:'销售单元码-销售单元-销售价-供货价-定价毛利率',
            key:'saleUnits',
            width:'752',
            type:'sku',
            saleMap:{
              saleGoodsGGJ:{
                label:'销售单元码-销售单元-销售价-供货价-定价毛利率',
                key:'saleUnits',
                width:'552',
                splitWidth:'150',
                splitFirstWidth:'150'
              },
              saleGoodsHQBS:{
                label:'销售单元码-销售单元-销售价-供货价-定价毛利率-总分出利润-可售库存-近30日销量',
                key:'saleUnits',
                width:'852',
                splitWidth:'92',
                splitFirstWidth:'106'
              },
              saleGoodsMSMS:{
                label:'销售单元码-销售单元-销售价-供货价-定价毛利率-可售库存-近30日销量',
                key:'saleUnits',
                width:'752',
                splitWidth:'106',
                splitFirstWidth:'106'
              }
            }
          },
//          {
//            label:'销售组合',
//            key:'saleSets',
////            subKeys:['saleUnitCode','name','price','marginGross'],
//            width:'200',
//            type:'saleSets'
//          },
//          {
//            label:'销售单元码',
//            key:'saleUnits',
//            subKey:'saleUnitCode',
//            width:'120',
//            type:'sku'
//          },
//          {
//            label:'销售单元',
//            key:'saleUnits',
//            subKey:'name',
//            width:'120',
//            type:'sku'
//          },
//          {
//            label:'销售价',
//            key:'saleUnits',
//            subKey:'price',
//            width:'140',
//            type:'sku'
//          },
//          {
//            label:'定价毛利率',
//            key:'saleUnits',
//            subKey:'marginGross',
//            width:'100',
//            type:'sku'
//          },
          {
            label:'操作',
            key:'saleUnits',
            subKey:'marginGross',
            width:'100',
            type:'opera'
          },
        ],
      },
    }),
    methods:{
      ...mapActions(['getGoodsSellerDeliver','setSearchConfig','setSearchParams','getSaleListCode','getManagerGroupList','getBrandSearchList','getDeliverSearchList','getSellerMainSearchList','exportSaleGoodsList']),
      initView(){
        this.setSearchConfig(this.searchPage)
        let params = {}
        this.searchPage.searchItem.map((item)=>{
          if(item.items){
            item.items.map((subItem)=>{
              params[subItem.key] = subItem.intKey
            })
          } else {
            params[item.key] = item.intKey
          }

        })
        this.getManagerGroupList()
          .then((rs)=>{
            let list = []
            rs.map((item)=>{
              let _opts = {
                label:item.groupName+'-'+item.managerName,
                value:item.id+''
              }
              list.push(_opts)
            })
            let _idx = this.mapSearchIdx('managerGroupId')
            this.searchPage.searchItem[_idx].options = list
          })
        if(!this.salGroupConfig.isGroup){
          this.getSaleListCode({channel:this.channelConfigStates.channel})
            .then((rs)=>{
              let list = []
              rs.map((item)=>{
                let _opts = {
                  label:item.name,
                  value:item.code+''
                }
                list.push(_opts)
              })
              this.saleTypeIdList = list
            })
        }
        this.getSellerMainSearchList()
          .then((rs)=>{
            let list = []
            rs.map((item)=>{
              let _opts = {
                label:item.name,
                value:item.code
              }
              list.push(_opts)
            })
            this.sellerMainIdListBase = list
            let sellerMainId = this.$route.query.sellerMainId
            if(sellerMainId){
              this.sellerMainIdList = this.sellerMainIdListBase.filter((item)=>item.value == sellerMainId)

            }
//            this.sellerMainIdList = list
//            let _idx = this.mapSearchIdx('sellerMainId')
//            this.searchPage.searchItem[_idx].options = list
          })

        if(this.salGroupConfig.isGroup){
          let _idx = this.mapSearchIdx('saleTypeId')
          this.searchPage.searchItem[_idx].isSearchHide = true
        }
        this.setSearchParams(params)
      },
      mapSearchIdx(key){
        let i = 0;
        while(this.searchPage.searchItem[i].key != key){
           i++
        }
        return i
      },
      remoteMethod(query){
        if(!query){
          this.sellerMainIdList = []
          return false
        }
        this.sellerMainIdList = this.sellerMainIdListBase.filter((item)=>item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
      },
      selectSellerMainId(id){
        if(id == null || id == ''){
          this.searchParams.deliverAreaId = ''
          this.sellerDeliverList = []
          return false
        }
        this.getGoodsSellerDeliver({sellerMainId:id})
          .then((rs)=>{
            this.sellerDeliverList = []
            this.searchParams.deliverAreaId = ''
            rs.map((item)=>{
              let _opt = {
                label:item.deliverAreaName,
                value:item.deliverAreaId
              }
              this.sellerDeliverList.push(_opt)
            })
          })
      },
      exportSearch(){
        const _opts = {
          rs:this.searchParams,
          type:1,
          ...this.batchExport
        }
        this.exportSaleGoodsList(_opts)
      },
    },
    watch:{
      '$route.name':function(){
        this.initView()
      }
    },
    components:{
      vSearch,
      vCate,
      vResult
    },
  }
</script>
