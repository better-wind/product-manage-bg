<template>
  <div>
    <div class="title-box">
      类目经理列表
    </div>
    <div class="section-box">
      <v-search />
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/category/cateManagerResult'
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
            label:'类目分组名称',
            placeholder:'类目分组名称',
            key:'groupName',
            intKey:'',
          },
          {
            type:'input',
            label:'商品经理名称',
            placeholder:'商品经理名称',
            key:'managerName',
            intKey:'',
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
            label: '类目分组名称',
            key: 'groupName',
            type:'',
          },
          {
            label: '商品经理名称',
            key: 'managerName',
            type:'',
          },
          {
            label: '联系人手机号码',
            key: 'contactPhone',
            type:'',
          },
          {
            label: '是否开启库存预警',
            key: 'stockWarning',
            width:'',
            type:'type',
            typeConfig:{
              0:'否',
              1:'是'
            }
          },
          {
            label: '预警值',
            key: 'stockWarningThreshold',
            width:'',
            type:'stockWarningThreshold'
          },
          {
            label: '库存为0是否自动下架',
            key: 'autoOffSale',
            width:'',
            type:'type',
            typeConfig:{
              0:'否',
              1:'是'
            }
          },
          {
            label: '操作',
            key: 'opera',
            type: 'opera',
            fixed:'right',
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
      ...mapActions(['setSearchConfig','setSearchParams']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        this.labelLevel = query.level ? Number(query.level) : 1
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
    },
    components:{
      vSearch,
      vResult
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
