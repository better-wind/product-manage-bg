<template>
  <div>
    <div class="title-box">
      品牌库管理
    </div>
    <div class="section-box">

        <v-search >
          <template slot="private-item">
            <v-cate />
          </template>
        </v-search>

      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vCate from '@/components/search/category'
  import vResult from '@/components/brand/result'
  import {mapActions,mapState} from 'vuex'
  export default {
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
            label:'品牌ID',
            placeholder:'品牌ID',
            key:'brandId',
            intKey:'',
            regType:[
              {
                type:'Num',
                msg:'ID请输入数字'
              }
            ],
          },
//          {
//            type:'input',
//            label:'品牌名称',
//            placeholder:'品牌名称',
//            key:'brandName',
//            intKey:'',
//          },
          {
            type:'select-property-brand-name',
            optionType:'name',
            label:'品牌名称',
            placeholder:'品牌名称',
            key:'brandName',
            intKey:'',
            options:[
              {
                label:'A',
                value:'BB'
              },
            ]
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
            label:'品牌ID',
            key:'id',
            width:'100'
          },
          {
            label:'品牌名称(中/英)',
            key:'name',
            width:'200'
          },
          {
            label:'品牌经营类目',
            key:'brandCategoryNameArr',
            width:''
          },
          {
            label:'操作',
            key:'opera',
            width:'180',
            items:[
              {
                type:'edit',
                label:'编辑'
              },
              {
                type:'manage',
                label:'管理'
              }
            ]
          },
        ],
      }
    }),
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams']),
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
        this.setSearchParams(params)
      },
    },
    components:{
      vSearch,
      vResult,
      vCate
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .no-search{
      .item-box,.block-box,inline-box{
        margin: 0!important;
        padding: 0!important;
      }
    }
</style>
