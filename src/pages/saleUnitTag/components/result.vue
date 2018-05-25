<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button size="small" @click="downGoodsTagExportTemp">下载导入模版</el-button>
      <el-button size="small" @click="openDialog" type="primary">导入修改</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;" >

        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column :key="item.key" v-if="item.type == 'type'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template  scope="scope">
              {{item.typeConfig[scope.row[item.key]]}}
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div style="padding:0 6px;">
                <span>{{scope.row[item.key]}}</span>
              </div>
            </template>
          </el-table-column>

        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog size="small" v-model="uploadShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <form method="post" id="importValue" ref="importValue" action="/goodsAdmin/goods/saleUnit/tag/import" enctype="multipart/form-data">
        <input type="file" ref="importFile" id="file" @change="changeFile" name="importFile"/>
      </form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="save" type="primary">确 定</el-button>
        <el-button size="small" @click="uploadShow=false">取 消</el-button>
      </div>
    </el-dialog>
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
      searchResult:{},
      loading:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      uploadShow: false,
    }),
    methods:{
      ...mapActions(['setSearchParams','getGoodsTagListPage','setStartToast','downGoodsTagExportTemp']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getGoodsTagListPage(params)
          .then((rs)=>{
            this.searchResult = rs
            this.setPage()
          })
      },
      setPage(){
        this.paging.pageSize = Number(this.searchParams.rows)
        this.paging.currentPage = Number(this.searchParams.page)
        this.paging.total = this.searchResult.total
        this.pagingShow = true
        this.loading = false
      },
      openDialog(){
        this.uploadShow = true
      },
      save(){
        let filePath = this.$refs.importFile.value;
        if(!filePath){
          this.getToast('请选择文件')
          return false
        }
        this.$refs.importValue.submit()
        this.uploadShow = false
        this.$refs.importFile.value = ''
      },
      changeFile(){
        let filePath = this.$refs.importFile.value;
        let sType = filePath.split('.').pop()
        let type = {
          xls:'xls',
          xlsx:'slsx'
        }
        if(!type[sType]){
          this.getToast('文件格式不正确')
          this.$refs.importFile.value = null
          return false
        }
      },
      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
    },
    components: {
      vPagination,
    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
          this.initView();
        }
      }
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
