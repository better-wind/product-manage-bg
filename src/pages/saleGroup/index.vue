<template>
  <div>
    <div class="title-box">
      销售组合管理
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
</template>
<script>
  import vSearch from '@/components/search/search'
  import vCate from '@/components/search/category'
  import vResult from '@/components/saleGroup/groupResult'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','channelConfigStates'])
    },
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
            label:'销售组合码(G)',
            placeholder:'销售组合码(G)',
            key:'saleSetsCode',
            intKey:''
          },
          {
            type:'select-saleSetsTitle',
            label:'',
            placeholder:'组合标题',
            key:'saleSetsTitle',
            intKey:''
          },
          {
            type:'select-labelIds',
            label:'组合标签',
            placeholder:'组合标签',
            key:'labelName',
            intKey:''
          },
          {
            type:'select',
            label:'渠道销售类型',
            placeholder:'渠道销售类型',
            key:'saleTypeId',
            intKey:'',
            options:[]
          },
          {
            type:'select',
            label:'启用状态',
            placeholder:'启用状态',
            key:'status',
            intKey:'',
            options:[
              {
                label:'启用',
                value:'1'
              },
              {
                label:'停用',
                value:'0'
              }
            ]
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
//          {
//            type:'input',
//            label:'销售商品ID',
////            placeholder:'多个用,分割',
//            placeholder:'销售商品ID',
//            key:'saleGoodsIds',
//            intKey:'',
//          },
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
            label:'销售单元码(U)',
            placeholder:'销售单元码',
            key:'saleUnitCode',
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
            label:'发货编码',
            placeholder:'发货编码',
            key:'deliverCode',
            intKey:''
          }
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
            label:'组合Banner图',
            key:'bannerUrl',
            width:'160',
            type:'image'
          },
          {
            label:'销售组合码',
            key:'saleSetsCode',
            width:'180',
          },
          {
            label:'启用状态',
            key:'status',
            width:'100',
            type:'status',
          },
          {
            label:'销售类型',
            key:'saleTypeName',
            width:'100',
            type:'saleType',
          },
          {
            label:'组合标题',
            key:'title',
            width:'160',
          },
          {
            label:'组合标签',
            key:'label',
            width:'',
            type:'saleLabels',
          },
          {
            label:'组合商品数',
            key:'count',
            width:'120',
          },
          {
            label:'操作',
            key:'saleUnits',
            subKey:'marginGross',
            width:'100',
            type:'opera'
          },
        ],
      },
      channelConfig:{
        channel:'',
        channelName:'',
        opts:[]
      }
    }),
    methods:{
      ...mapActions(['setChannelConfig','getGoodsSellerDeliver','setSearchConfig','setSearchParams','getSaleListCode','getManagerGroupList','getBrandSearchList','getDeliverSearchList','getSellerMainSearchList','exportSaleGoodsList']),
      initView(){
        const name = this.$route.name
        if(name == 'saleGroupGGJ'){
          this.channelConfig.channel = 1
          this.channelConfig.channelName = '格格家'
          this.channelConfig.opts = [{label:'常规',value:1},{label:'拼团',value:3},{label:'分销',value:2},{label:'积分换购',value:4}]
        }
        else if(name == 'saleGroupHQBS'){
          this.channelConfig.channel = 2
          this.channelConfig.channelName = '环球捕手'
          this.channelConfig.opts = [{label:'常规',value:1},{label:'拼团',value:3}]
        }
        else if (name == 'saleGroupMBYD'){
          this.channelConfig.channel = 6
          this.channelConfig.channelName = '脉宝云店'
          this.channelConfig.opts = [{label:'常规',value:1}]
        }
        else if (name == 'saleGroupMSMS'){
          this.channelConfig.channel = 8
          this.channelConfig.channelName = '美食买手'
          this.channelConfig.opts = [{label:'常规',value:1}]
        }
        this.setChannelConfig(this.channelConfig)
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
            let _idx = this.mapSearchIdx('saleTypeId')
            this.searchPage.searchItem[_idx].options = list
          })
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
          type:2
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

