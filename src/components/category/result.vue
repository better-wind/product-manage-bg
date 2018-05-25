<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button type="primary" @click="callEditCateManage" size="small">修改类目所属分组</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55">

        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.key == 'pathName'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              {{scope.row.pathName ? scope.row.pathName.split(',').join(' - ') : ''}}
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <el-dialog title="" size="tiny" v-model="editCateManage.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <span>已选择{{batchList.length}}个叶子类目，请选择要修改的类目所属商品分组：</span>
      <div class="block-box">
        <el-select  v-model="editCateManage.opts.managerGroupId" style="width:200px" class="input-item-middle" size="small"  placeholder="请选择商品类目分组">
          <template v-for="subItem in managerGroupList">
            <el-option :label="subItem.label" :value="subItem.value"></el-option>
          </template>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="callSaveCateManage()" size="small">保 存</el-button>
        <el-button size="small" @click="cancelCateManage()">取 消</el-button>
      </div>
    </el-dialog>

    <v-pagination v-if="pagingShow" :paging="paging" />
  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','managerGroupList'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      editCateManage:{
        isShow:false,
        num:'',
        opts:{
          categoryIds:[],
          managerGroupId:'',
        },


      },
      loading:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},
      batchList:[]
    }),
    methods:{
      ...mapActions(['setSearchParams','getCateManageList','setStartToast','saveCateManage']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getCateManageList(params)
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
      handleSelectionChange(list){
        this.batchList = list;
      },
      callEditCateManage(){
        if(!this.batchList.length){
          this.getToast('请选择叶子类目')
          return false
        }
        this.editCateManage.num = this.batchList.length
        this.batchList.map((item)=>{
          this.editCateManage.opts.categoryIds.push(item.leafCategoryId)
        })
        this.editCateManage.isShow = true

      },
      callSaveCateManage(){
        if(!this.editCateManage.opts.managerGroupId){
          this.getToast('请选择请选择商品类目分组')
          return false
        }
        this.saveCateManage(this.editCateManage.opts)
          .then((rs)=>{
            if(rs){
              this.cancelCateManage()
              this.initView()
            }
          })
      },
      cancelCateManage(){
        this.editCateManage.isShow = false
        this.editCateManage.num = ''
        this.editCateManage.opts.categoryIds = []
        this.editCateManage.opts.managerGroupId = ''
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
