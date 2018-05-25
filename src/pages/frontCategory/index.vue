<template>
  <div>
    <div class="title-box">
      {{frontCateManageTitle}}
    </div>
    <div class="section-box">
      <v-search />
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/frontCategory/result'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','frontCateManageTitle'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      labelLevel:1,
      searchPage:{
        searchItem:[
          {
            type:'',
            key:'page',
            intKey:1
          },
          {
            type:'',
            key:'parentId',
            intKey:0
          },
          {
            type:'',
            key:'level',
            intKey:1
          },
          {
            type:'',
            key:'rows',
            intKey:20
          },
          {
            type:'input',
            label:'类目名称',
            placeholder:'类目名称',
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
          },
          {
            type:'check-group',
            label:'展示渠道',
            placeholder:'',
            items:[
              {
                label:'格格家',
                placeholder:'格格家',
                key:'isGgj',
                intKey:'',
              },
              {
                label:'环球捕手',
                placeholder:'环球捕手',
                key:'isHqbs',
                intKey:'',
              },
              {
                label:'美食买手',
                placeholder:'美食买手',
                key:'isMsms',
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
            label: '类目名称',
            key: 'name',
            type:'',
            level:[1,2,3],
            width:''
          },
          {
            label: '类目图标',
            key: 'image',
            level:[2,3],
            width:'',
            type:'image'
          },
          {
            label: '状态',
            key: 'isAvailable',
            level:[1,2,3],
            width:'80',
            type:'type',
            typeConfig:{
              0:'停用',
              1:'启用'
            }
          },
          {
            label: '是否HOT',
            key: 'isHot',
            level:[3],
            width:'',
            type:'type',
            typeConfig:{
              0:'否',
              1:'是'
            }
          },
          {
            label: '是否高亮',
            key: 'isHighlight',
            level:[3],
            width:'',
            type:'type',
            typeConfig:{
              0:'否',
              1:'是'
            }
          },
          {
            label: '是否展示品牌',
            key: 'isShowBrand',
            level:[1],
            width:'',
            type:'type',
            typeConfig:{
              0:'否',
              1:'是'
            }
          },
          {
            label: '商品排序规则',
            key: 'sortMethod',
            level:[2,3],
            width:'',
            type:'type',
            typeConfig:{
              1:'按销量排序',
              2:'按所包含三级类目的顺序排序',
              3:'按类目的顺序排序'
            }
          },
          {
            label: '排序值',
            key: 'sortOrder',
            level:[1,2,3],
            width:'120',
            type:'',
          },
          {
            label: '包含三级类目数量',
            key: 'subCategoryCount',
            level:[2],
            width:'',
            type:'',
          },
          {
            label: '展示渠道',
            key: 'isGgj',
            level:[1,2,3],
            width:'',
            type:'chanel',
          },

          {
            label: '操作',
            key: 'opera',
            type: 'opera',
            fixed:'right',
            level:[1,2,3],
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
