<template>
  <div>
    <div class="title-box">
      类目属性管理
    </div>
    <div class="section-box">
      <v-search>
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
  import vResult from '@/components/category/propertyResult'
  import {mapActions,mapState} from 'vuex'

  export default{
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
            private:true,
            type:'cate',
            isSlot:true,
            slotName:'private-item',
            label:'类目筛选',
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
            label:'叶子类目',
            key:'pathName',
            width:'480'
          },
          {
            label:'关键属性',
            key:'keyPropertyGroupStr',
            width:''
          },
          {
            label:'销售属性',
            key:'sellPropertyGroupStr',
            width:''
          },
          {
            label:'商品属性',
            key:'goodsPropertyGroupStr',
            width:''
          },
          {
            label:'操作',
            key:'opera',
            type:'opera',
            width:''
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
      vCate,
      vResult
    },
  }
</script>
