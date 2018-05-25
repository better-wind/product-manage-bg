<template>
  <div>
    <div class="title-box">
      流量商品管理
    </div>
    <div class="section-box search-goods-box">
      <v-search >
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
  import vResult from '@/components/virtualGoods/phoneResult'
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
            label:'销售单元码(U)',
            placeholder:'销售单元码(U)',
            key:'saleUnitCode',
            intKey:'',
          },
          {
            type:'datetime',
            label:'创建时间',
            placeholder:'创建时间',
            key:'startCreateTime',
            intKey:'',
          },
          {
            type:'datetime',
            label:'-',
            placeholder:'创建时间',
            key:'endCreateTime',
            intKey:'',
          },
          {
            type:'select',
            label:'运营商',
            placeholder:'运营商',
            key:'operatorId',
            intKey:'',
            options:[]
          },
          {
            type:'select',
            label:'充值范围',
            placeholder:'充值范围',
            key:'rechargeProvinceId',
            intKey:'',
            options:[]
          },
          {
            type:'select',
            label:'可用状态',
            placeholder:'可用状态',
            key:'status',
            width:'180px',
            intKey:'',
            options:[
              {
                label:'停用',
                value:'0'
              },
              {
                label:'可用',
                value:'1'
              },
            ]
          },
          {
            type:'datetime',
            label:'最新更新时间',
            placeholder:'最新更新时间',
            key:'startUpdateTime',
            intKey:'',
          },
          {
            type:'datetime',
            label:'-',
            placeholder:'最新更新时间',
            key:'endUpdateTime',
            intKey:'',
          },
          {
            type:'select',
            label:'适用范围',
            placeholder:'适用范围',
            key:'availableProvinceId',
            intKey:'',
            options:[]
          },
          {
            type:'select',
            label:'面值',
            placeholder:'面值',
            key:'faceValueId',
            intKey:'',
            options:[]
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
            label: '销售单元码',
            key: 'saleUnitCode',
            type:'',
          },
          {
            label:'运营商',
            key:'pnYYS',
          },
          {
            label:'充值范围',
            key:'pnCZFW',
          },
          {
            label:'适用范围',
            key:'pnSYFW',
          },
          {
            label:'面值(元)',
            key:'pnMZ',
          },
          {
            label:'售价(元)',
            key:'price',
            type:'price',
            width:'170'
          },
          {
            label:'可用状态',
            key:'status',
            type:'map',
            map:{
              0:'停用',
              1:'可用'
            }
          },
          {
            label: '创建时间',
            key: 'createTime',
            type:'',
          },
          {
            label: '最新更新时间',
            key: 'updateTime',
            width:'',
          },
          {
            label: '操作',
            key: 'opera',
            type: 'opera',
            width:'250',
            items:[
              {
                type:'edit',
                label:'编辑'
              },
            ]
          }
        ],
      },
    }),
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams','exportVirtualList','getVirtualSearchItem']),
      initView(){
        this.routerName = this.$route.name
        const query = UtilTool.parseQuery(this.$route.query)
        this.setSearchConfig(this.searchPage)
        let params = {}
        this.searchPage.searchItem.map((item)=>{
          item.key ? params[item.key] = item.intKey
            : item.items.map((subItem)=>{
              params[subItem.key] = subItem.intKey
            })
        })
        let _map = {
          operator:'operatorId',
          rechargeProvince:'rechargeProvinceId',
          availableProvince:'availableProvinceId',
          trafficFaceValue:'faceValueId'
        }
        for(let key in _map){
          this.getVirtualSearchItem(key)
            .then((rs)=>{
            let _list = []
            rs.map((item)=>{
            let _opts = {
              label:item.pvName,
              value:item.id+''
            }
            _list.push(_opts)
          })
          this.searchPage.searchItem[this.mapSearchIdx(_map[key])].options = _list
        })
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
      exportSearch(){
        let _opts = {
          rs:this.searchParams,
          routerName:this.routerName
        }
        this.exportVirtualList(_opts)
      },
    },
    components:{
      vSearch,
      vResult
    },
  }
</script>

