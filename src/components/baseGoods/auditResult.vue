<template>
  <div class="item-box">
    <div class="item-box">
      <el-button size="small" type="primary" @click="batchAudit">批量{{auditStatus == 0 ? '初审' : '复审'}}</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="searchResult.rows" @selection-change="handleSelectionChange" style="width: 100%;" >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
          align="center">
        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.type == 'auditMsg'"  :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="msg-item">
                <p>提交审核时间：{{scope.row.createTime}}</p>
                <p>审核状态：{{mapType.status[scope.row.status]}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'goodsMsg'"  :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="msg-item">
                <p>商品名称：{{scope.row.name}}</p>
                <p>基础商品码：{{scope.row.baseGoodsCode}}</p>
                <p>货品归属商家：{{scope.row.sellerMainName ? scope.row.sellerMainName : '无'}}</p>
                <!--<p>商品类目分组：{{scope.row.groupName+'-'+scope.row.managerName}}</p>-->
                <p>商品类目分组：
                  <span v-if="scope.row.groupName && scope.row.managerName">{{scope.row.groupName+'-'+scope.row.managerName}}</span>
                  <span v-else>无</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'auditFir'"  :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="msg-item">
                <p>初审结果：{{mapType.firstStatus[scope.row.firstAudit]}} <span v-if="scope.row.firstAudit > 0 && scope.row.firstAuditPerson">({{scope.row.firstAuditPerson}})</span>  </p>
                <p v-if="scope.row.firstAuditTime">初审时间：{{scope.row.firstAuditTime}}</p>
                <p v-if="scope.row.firstAudit == 2 && scope.row.comment">原因：{{scope.row.comment}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'auditSec'"  :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="msg-item">
                <p>复审结果：{{mapType.secondStatus[scope.row.secondAudit]}} <span v-if="scope.row.secondAudit > 0 && scope.row.secondAuditPerson">({{scope.row.secondAuditPerson}})</span>  </p>
                <p v-if="scope.row.secondAuditTime">复审时间：{{scope.row.secondAuditTime}}</p>
                <p v-if="scope.row.secondAudit == 2 && scope.row.comment">原因：{{scope.row.comment}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <a :href="'/#/baseGoodsConsult?goodsId='+scope.row.id" target="_blank">
                <el-button v-if="scope.row.status == 0"  size="small" type="primary" >初审</el-button>
                <el-button v-else-if="scope.row.status == 1" size="small" type="primary">复审</el-button>
                <el-button v-else size="small"  >查看</el-button>
              </a>
              <!--<el-button v-if="scope.row.status == 0"  size="small" type="primary" @click="editShow(scope.row.id)">初审</el-button>-->
              <!--<el-button v-else-if="scope.row.status == 1" size="small" type="primary" @click="editShow(scope.row.id)">复审</el-button>-->
              <!--<el-button v-else size="small"  @click="editShow(scope.row.id)">查看</el-button>-->
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog title="批量审核" size="tiny" v-model="goodAuditModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="section-box">
        <div class="block-box">
          <el-radio v-model="goodAuditModel.opts.action" label="1">审核通过</el-radio>
          <el-radio v-model="goodAuditModel.opts.action" label="2">审核不通过</el-radio>

        </div>
        <div class="block-box" v-if="goodAuditModel.opts.action == 2">
          <el-input placeholder="请输入审核不通过原因" v-model.trim="goodAuditModel.opts.comments" style="width: 400px" type="textarea" :maxlength="150" :rows="4"></el-input>
          <span><span class="c-red">{{goodAuditModel.opts.comments.length}}</span>/150</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!goodAuditModel.opts.action" @click="submitGoodAudit">确认</el-button>
        <el-button @click="cancelGoodAudit">取 消</el-button>
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
      loading:false,
      mapType:{
        status:{
          0:'待初审',
          1:'待复审',
          2:'通过',
          4:'失败',
        },
        firstStatus:{
          0:'待初审',
          1:'通过',
          2:'失败',
        },
        secondStatus:{
          0:'待复审',
          1:'通过',
          2:'失败',
        }
      },
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},
      goodAuditModel:{
        isShow:false,
        opts:{
          auditList:'',
          action:'',
          auditStatus:'',
          comments:''
        }
      },
      multipleSelection:[],
      auditStatus:''
    }),
    methods:{
      ...mapActions(['setSearchParams','getGoodsAuditList','setStartToast','actionGoodAudit']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        this.auditStatus = this.$route.name === 'goodsAuditAgain' ? 1 : 0
        for(let i in params){
          if(params[i] == 'true'){
            params[i] = true
          } else if(params[i] == 'false'){
            params[i] = false
          }
        }
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getGoodsAuditList(params)
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
      editShow(id,code,type){
        this.$router.push({
          name: 'baseGoodsConsult',
          query: {
            goodsId: id,
          }
        })
      },
      selectable(row){
        let able = true
        able = row.status == this.auditStatus ? true : false
        return able
      },
      batchAudit(){
        if(!this.multipleSelection.length){
          this.getToast('请选择批量审核的商品')
          return false
        }
        let auditList = []
        this.multipleSelection.forEach((item)=>{
          auditList.push(item.id)
        })
        this.goodAuditModel.opts.auditStatus = this.auditStatus //0 1
        this.goodAuditModel.opts.action = '' //0 1
        this.goodAuditModel.opts.auditList = auditList
        this.goodAuditModel.opts.comments = ''
        this.goodAuditModel.isShow = true
      },
      submitGoodAudit(){


        if(this.goodAuditModel.opts.action == 2 && !this.goodAuditModel.opts.comments){
          this.getToast('请输入审核不通过原因')
          return false
        }
        if(this.goodAuditModel.opts.action == 2 && this.goodAuditModel.opts.comments.length > 150){
          this.getToast('审核不通过原因字数限制150')
          return false
        }
        if(this.goodAuditModel.opts.action == 1){
          this.goodAuditModel.opts.comments = ''
        }
        this.actionGoodAudit(this.goodAuditModel.opts)
          .then((rs)=>{
            this.setStartToast({
              isShow:true,
              msg:'审核成功',
              type:'success'
            })
            this.cancelGoodAudit()
            this.initView()
          },()=>{
            this.cancelGoodAudit()
            this.initView()
          })


      },
      cancelGoodAudit(){
        this.goodAuditModel.opts.auditStatus = ''
        this.goodAuditModel.opts.action = ''
        this.goodAuditModel.opts.auditList = []
        this.goodAuditModel.opts.comments = ''
        this.goodAuditModel.isShow = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
<style lang="scss" rel="stylesheet/scss" scoped>
  .msg-item{
    padding: 10px;
    text-align: left;
  }
</style>
