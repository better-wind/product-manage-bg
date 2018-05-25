<template>
  <div>
    <div class="title-box">
      商品经理分组与类目关系
    </div>
    <div class="section-box">
      <v-search>
        <template slot="private-item">
          <v-cate />
        </template>
        <template slot="private-menu">
          <el-button  size="small" @click="exportSearch">导出结果</el-button>
        </template>
      </v-search>
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/search/search'
  import vCate from '@/components/search/category'
  import vResult from '@/components/category/result'
  import {mapActions,mapState} from 'vuex'

  export default{
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['managerGroupList','searchParams'])
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
           },
           {
             type:'select',
             label:'商品类目分组',
             placeholder:'请选择商品类目分组',
             key:'managerGroupId',
             intKey:'',
             width:'200px',
             options:[
               {
                 label:'',
                 value:''
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
             label:'叶子类目',
             key:'pathName',
             width:''
           },
           {
             label:'所属商品分组',
             key:'groupName',
             width:''
           },
           {
             label:'商品经理',
             key:'managerName',
             width:''
           },
         ],
       }
    }),
    methods:{
      ...mapActions(['setSearchConfig','setSearchParams','getManagerGroupList','exportManagerGroup']),
      initView(){
        this.getManagerGroupList()
          .then(()=>{
            this.searchPage.searchItem[3].options = this.managerGroupList
          })
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
      exportSearch(){
        this.exportManagerGroup(this.searchParams)
      }
    },
    components:{
      vSearch,
      vCate,
      vResult
    },
  }
</script>
