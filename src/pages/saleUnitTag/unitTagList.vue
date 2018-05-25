<template>
  <div>
    <div class="title-box">
      商品状态码
    </div>
    <div class="section-box">
      <v-search>
        <template slot="private-menu">
          <el-button  size="small" @click="exportSearch">导出</el-button>
        </template>
      </v-search>
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/pages/saleUnitTag/components/result'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','managerGroupList'])
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
            type:'select',
            label:'销售渠道',
            placeholder:'销售渠道',
            key:'channel',
            width:'180px',
            intKey:'',
            options:[
              {
                label:'格格家',
                value:'1'
              },
              {
                label:'环球捕手',
                value:'2'
              },
              {
                label:'美食买手',
                value:'8'
              },
            ]
          },
          {
            type:'input',
            label:'销售单元码',
            placeholder:'销售单元码',
            key:'saleUnitCode',
            intKey:'',
          },
          {
            type:'select',
            label:'类目分组',
            placeholder:'类目分组',
            key:'managerGroupId',
            width:'180px',
            intKey:'',
            options:[]
          },
          {
            type:'select',
            label:'爆品分组',
            placeholder:'爆品分组',
            key:'hotManagerGroupId',
            width:'180px',
            intKey:'',
            options:[]
          },
          {
            type:'select',
            label:'状态码',
            multiple:true,
            placeholder:'状态码',
            key:'tagIds',
            width:'180px',
            intKey:[],
            options:[]
          },
          {
            type:'select',
            label:'是否可用',
            placeholder:'是否可用',
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
            label: '销售单元码',
            key: 'saleUnitCode',
            type:'',
            width:'120'
          },
          {
            label: '销售单元名称',
            key: 'name',
            type:'',
          },
          {
            label: '销售渠道',
            key: 'channel',
            width:'100',
            type:'type',
            typeConfig:{
              1:'格格家',
              2:'环球捕手',
              8:'美食买手'
            }
          },
          {
            label: '类目分组',
            key: 'managerGroupName',
            width:'120',
            type:'',
          },
          {
            label: '爆品分组',
            key: 'hotManagerGroupName',
            width:'160',
            type:'',
          },
          {
            label: '原状态码',
            key: 'originalTagCodes',
            type:'',
            width:''
          },
          {
            label: '更新后状态码',
            key: 'currentTagCodes',
            type:'',
            width:''
          },
          {
            label: '创建时间',
            key: 'createTime',
            width:'150',
            type:'',
          },
          {
            label: '更新时间',
            key: 'updateTime',
            width:'150',
            type:'',
          }
        ],
      },
    }),
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams','getManagerGroupList','getGoodsTagListCode','exportGoodsTagList']),
      initView(){
        this.getManagerGroupList()
          .then(()=>{
            this.searchPage.searchItem[4].options = this.managerGroupList
            this.searchPage.searchItem[5].options = this.managerGroupList
          })
        this.getGoodsTagListCode()
          .then((rs)=>{
            let _rs = rs || [],_list = []
            _rs.forEach((item)=>{
              let _opts = {
                label:item.name,
                value:item.code+''
              }
              _list.push(_opts)

            })
            this.searchPage.searchItem[6].options = _list
          })
        this.setSearchConfig(this.searchPage)
        let params = {}
        this.searchPage.searchItem.map((item)=>{
          item.key ? params[item.key] = item.intKey
            : item.items.map((subItem)=>{
              params[subItem.key] = subItem.intKey
            })
        })
        this.setSearchParams(params)
      },
      exportSearch(){
        this.exportGoodsTagList(this.searchParams)
      }
    },
    components:{
      vSearch,
      vResult
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
