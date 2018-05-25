<template>
  <div>
    <div class="title-box">
      商品初审列表
    </div>
    <div class="section-box">
      <v-search >
        <template slot="private-sellerMainId">
          <div>
            <span class="label-sign">货品归属商家</span>
            <el-select
              filterable
              remote
              :remote-method="remoteMethod"
              v-model="searchParams.sellerMainId"
              class="input-item-middle"
              size="small"
              :clearable="true"
              placeholder="货品归属商家">
              <template v-for="subItem in sellerMainIdList">
                <el-option :label="subItem.label" :value="subItem.value"></el-option>
              </template>
            </el-select>
          </div>
        </template>
      </v-search>
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/baseGoods/auditResult'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams'])
    },
    created(){
      this.initView()
    },
    data:()=>({
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
            type:'input',
            label:'基础商品码',
            placeholder:'请输入基础商品码',
            key:'baseGoodsCode',
            intKey:'',
          },
          {
            type:'input',
            label:'商品名称',
            placeholder:'请输入商品名称',
            key:'name',
            intKey:'',
          },
          {
            type:'select-filterable',
            label:'商品类目分组',
            placeholder:'请选择商品类目分组',
            key:'managerGroupId',
            intKey:'',
            options:[]
          },
//          {
//            type:'select-filterable',
//            label:'货品归属商家',
//            placeholder:'请选择货品归属商家',
//            key:'sellerMainId',
//            intKey:'',
//            options:[]
//          },
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
            type:'check-group',
            label:'审核状态',
            placeholder:'',
            items:[
              {
                label:'待初审',
                placeholder:'待初审',
                key:'isAudit',
                intKey:true,
                isClear:false,
                isDisabled:true
              },
//              {
//                label:'待复审',
//                placeholder:'待复审',
//                key:'isAuditAgain',
////                intKey:true,
////                isClear:true
//              },
              {
                label:'通过',
                placeholder:'通过',
                key:'isPass',
                intKey:'',
              },
              {
                label:'失败',
                placeholder:'失败',
                key:'isFail',
                intKey:'',
              }
            ],
          }
        ],
        searchMenu:[
          {
            label:'查询',
            type:'search',
            style:'primary',
          }
        ],
        searchResult:[
          {
            label: '提交审核信息',
            type: 'auditMsg',
          },
          {
            label: '基础商品信息',
            type: 'goodsMsg',
            width: '400'
          },
          {
            label: '初审信息',
            type: 'auditFir',
          },
          {
            label: '复审信息',
            type: 'auditSec',
          },
          {
            label: '操作',
            key: 'opera',
            width:'120'
          }
        ],
      },
      sellerMainIdList:[],
      sellerMainIdListBase:[]
    }),
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams','getManagerGroupList','getGoodsBelong']),
      initView(){
        this.setSearchConfig(this.searchPage)
        let params = {}
        this.searchPage.searchItem.map((item)=>{
          item.key ? params[item.key] = item.intKey
            : item.items.map((subItem)=>{
              params[subItem.key] = subItem.intKey
            })
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
            this.searchPage.searchItem[4].options = list
          })
        this.getGoodsBelong()
          .then((rs)=>{
            let list = []
            rs.map((item)=>{
              let _opts = {
                label:item.name,
                value:item.code+''
              }
              list.push(_opts)
            })
            this.sellerMainIdListBase = list
            let sellerMainId = this.$route.query.sellerMainId
            if(sellerMainId){
              this.sellerMainIdList = this.sellerMainIdListBase.filter((item)=>item.value == sellerMainId)

            }
//            this.searchPage.searchItem[5].options = list
          })
        this.setSearchParams(params)
      },
      remoteMethod(query){
        if(!query){
          this.sellerMainIdList = []
          return false
        }
        this.sellerMainIdList = this.sellerMainIdListBase.filter((item)=>item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
      },
    },
    components:{
      vSearch,
      vResult
    },
  }
</script>
