<template>
  <div class="item-box">
    <div class="item-table">
      <div class="item-table">
        <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;" >
          <template v-for="(item,index) in searchConfig.searchResult">
            <el-table-column :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
        </el-table>
      </div>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </div>
  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      loading:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{}
    }),
    methods:{
      ...mapActions(['setSearchParams','getValAttrList','setStartToast']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getValAttrList(params)
          .then((item)=>{
            this.searchResult = item
            this.setPage()
          },()=>{
            this.loading = false
          })
      },
      setPage(){
        this.paging.pageSize = Number(this.searchParams.rows)
        this.paging.currentPage = Number(this.searchParams.page)
        this.paging.total = this.searchResult.total
        this.pagingShow = true
        this.loading = false
      },
      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
          this.initView();
        }
      }
    },
    components: {
      vPagination,
    },

  }
</script>
