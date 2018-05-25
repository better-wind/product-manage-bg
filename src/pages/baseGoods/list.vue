<template>
  <div>
    <div class="title-box">
      基础商品库列表
    </div>
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
      <v-result />
    </div>
  </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vCate from '@/components/search/category'
  import vResult from '@/components/baseGoods/result'

  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    data:()=>({
      sellerMainIdList:[],
      sellerDeliverList:[],
      sellerMainIdListBase:[],

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
            label:'基础商品编码',
            placeholder:'基础商品编码',
            key:'baseGoodsCode',
            intKey:'',

          },
          {
            type:'input',
            label:'商品名称',
            placeholder:'商品名称',
            key:'name',
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
          // {
          //   type:'select',
          //   label:'销售状态',
          //   placeholder:'销售状态',
          //   key:'name',
          //   intKey:'',
          //   options:[
          //     {
          //       label:'A',
          //       value:'BB'
          //     },
          //   ]
          // },
          // {
          //   type:'select',
          //   label:'货品归属商家',
          //   placeholder:'货品归属商家',
          //   key:'sellerMainId',
          //   intKey:'',
          //   options:[
          //     {
          //       label:'A',
          //       value:'BB'
          //     },
          //   ]
          // },
          {
            type:'select-filterable-seller',
            label:'货品归属商家',
            placeholder:'货品归属商家',
            key:'sellerMainId',
            intKey:'',
            isSlot:true,
            slotName:'private-sellerMainId',
            options:[
              {
                label:'A',
                value:'BB'
              },
            ]
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
            label:'SKU码',
            placeholder:'SKU码',
            key:'skuCode',
            intKey:''
          },
          {
            type:'input',
            label:'发货编码',
            placeholder:'发货编码',
            key:'deliverCode',
            intKey:''
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
              {
                label:'删除',
                value:'2'
              },
            ]
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
            key:'baseGoodsId',
            width:'180',
            type:'base'
          },
          {
            label:'商品名称',
            key:'name',
            minWidth:'220',
            type:'name',
          },
          {
            label:'详细信息',
            key:'categoryFirstName',
            width:'220',
            type:'detail',
          },
          {
            label:'SKU码-销售属性值-发货编码-成本价(不含邮)',
            key:'skuArray',
            width:'608',
            type:'sku'
          },
          // {
          //   label:'SKU码',
          //   key:'skuArray',
          //   subKey:'skuCode',
          //   subSubKey: '',
          //   width:'100',
          //   type:'sku'
          // },
          // {
          //   label:'销售属性值',
          //   key:'skuArray',
          //   subKey:'properties',
          //   subSubKey: 'pvName',
          //   width:'120',
          //   type:'sku'
          // },
          // {
          //   label:'发货编码',
          //   key:'skuArray',
          //   subKey:'deliverAreas',
          //   subSubKey: 'deliverCode',
          //   width:'160',
          //   type:'sku'
          // },
          // {
          //   label:'成本价(不含邮)',
          //   key:'skuArray',
          //   subKey:'costPrice',
          //   subSubKey: 'costPrice',
          //   width:'140',
          //   type:'sku'
          // },
          {
            label:'销售渠道',
            key:'channels',
            width:'100',
            type:'channels'
          },
          {
            label:'操作',
            key:'operate',
            width:'100',
            type:'operate'
          }
        ],
      },
    }),
    computed:{
      ...mapState(['searchParams'])
    },
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams','getGoodsSellerDeliver','getManagerGroupList','getBrandSearchList','getDeliverSearchList','getGoodsBelong','exportBaseGoodsList']),
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
            this.searchPage.searchItem[5].options = list
          })
        this.getGoodsBelong()
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
//            this.searchPage.searchItem[6].options = list
          })
        // this.getDeliverSearchList()
        //   .then((rs)=>{
        //     let list = []
        //     rs.map((item)=>{
        //       let _opts = {
        //         label:item.name,
        //         value:item.code
        //       }
        //       list.push(_opts)
        //     })
        //     this.searchPage.searchItem[7].options = list
        //   })
        // this.getBrandSearchList()
        //   .then((rs)=>{
        //     let list = []
        //     rs.map((item)=>{
        //       let _opts = {
        //         label:item.name,
        //         value:item.id
        //       }
        //       list.push(_opts)
        //     })
        //     this.searchPage.searchItem[9].options = list
        //   })
        this.setSearchParams(params)
      },
      selectSellerMainId(id){
        if(id == null || id == ''){
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
      remoteMethod(query){
        if(!query){
          this.sellerMainIdList = []
          return false
        }
        this.sellerMainIdList = this.sellerMainIdListBase.filter((item)=>item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
      },
      exportSearch(){
        this.exportBaseGoodsList(this.searchParams)
      },
    },
    components:{
      vSearch,
      vCate,
      vResult
    },
  }
</script>

