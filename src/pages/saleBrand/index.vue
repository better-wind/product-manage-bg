<template>
  <div>
    <div class="title-box">
      品牌管理
    </div>
    <div class="section-box">
      <v-search />
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vResult from '@/components/saleBrand/result'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','saleFlagNameList','saleFrontCateList'])
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
            label:'品牌名称',
            placeholder:'品牌名称',
            key:'name',
            intKey:'',
          },
          {
            type:'input',
            label:'品牌英文名称',
            placeholder:'品牌英文名称',
            key:'nameEn',
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
            type:'select',
            label:'品牌囯家',
            placeholder:'品牌囯家',
            key:'stateId',
            width:'180px',
            intKey:'',
            options:[]
          },
          // {
          //   type:'select',
          //   label:'品牌类目',
          //   placeholder:'品牌类目',
          //   key:'frontCategoryId',
          //   width:'180px',
          //   intKey:'',
          //   options:[]
          // },
          {
            type:'select',
            label:'是否自有',
            placeholder:'状态',
            key:'isSelfOwn',
            width:'180px',
            intKey:'',
            options:[
              {
                label:'否',
                value:'0'
              },
              {
                label:'是',
                value:'1'
              },
            ]
          },
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
            label: 'ID',
            key: 'id',
            type:'',
            width:'60'
          },
          {
            label: '品牌名称',
            key: 'name',
            type:'',
          },
          {
            label: '英文名',
            key: 'nameEn',
            type:'',
            type:'introduce',
          },
          {
            label: '广告图',
            key: 'imageAd',
            width:'',
            type:'image',
            imageW:100,
            imageH:48,
          },
          {
            label: '品牌卖点',
            key: 'hotSpots',
            type:'',
            type:'introduce',
            width:'200'
          },
          {
            label: '品牌介绍',
            key: 'introduce',
            type:'introduce',
            width:'300'
          },
          {
            label: 'logo',
            key: 'image',
            width:'60',
            type:'image',
            imageW:48,
            imageH:48,
          },
          {
            label: '品牌国家',
            key: 'stateId',
            width:'',
            type:'stateId',
            width:''
          },
          // {
          //   label: '品牌类目',
          //   key: 'stateId',
          //   width:'',
          //   type:'category'
          // },
          {
            label: '是否自有',
            key: 'isSelfOwn',
            width:'',
            type:'type',
            typeConfig:{
              0:'否',
              1:'是'
            }
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
            label: '是否展示',
            key: 'isShow',
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
            width:'',
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
      ...mapActions(['setSearchConfig','setSearchParams','getBrandFlagName','getBrandFrontCateList']),
      initView(){
        this.getBrandFlagName()
          .then(()=>{
            this.searchPage.searchItem[5].options = this.saleFlagNameList
          })
        // this.getBrandFrontCateList()
        //   .then(()=>{
        //     this.searchPage.searchItem[6].options = this.saleFrontCateList
        //   })
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
