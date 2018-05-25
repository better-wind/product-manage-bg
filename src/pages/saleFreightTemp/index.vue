<template>
  <div>
    <div class="title-box">
      运费收入模板管理
    </div>
    <div class="section-box">
      <v-search />
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/saleFreightTemp/result'
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
            label:'模板名称',
            placeholder:'模板名称',
            key:'name',
            intKey:'',
          },
          {
            type:'select',
            label:'状态',
            placeholder:'状态',
            key:'isAvailable',
            width:'180px',
            intKey:'',
            options:[
              {
                label:'停用',
                value:'0'
              },
              {
                label:'启用',
                value:'1'
              },
            ]
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
            label: '模板名称',
            key: 'name',
            type:'',
          },
          {
            label: '备注',
            key: 'desc',
            type:'',
          },
          {
            label: '状态',
            key: 'isAvailable',
            width:'',
            type:'type',
            typeConfig:{
              0:'停用',
              1:'启用'
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
