<template>
  <div class="item-box">
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="searchResult.rows" style="width: 100%;" >
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.type == 'auditMsg'"  :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="msg-item">
                <p>提交审核时间：{{scope.row.createTime}}</p>
                <p>审核状态：{{mapType.status[scope.row.status]}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'goodsMsg'"  :label="item.label" :min-width="item.minWidth" :width="item.width" align="center">
            <template scope="scope">
              <div class="msg-item">
                <p>基础商品码：{{scope.row.baseGoodsCode}}</p>
                <p>商品名称：{{scope.row.name}}</p>
                <p>货品归属商家：{{scope.row.sellerMainName}}</p>
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
                <p>待启用日期：{{scope.row.effectiveDate}}</p>
                <p>调价原因：{{scope.row.reason}}</p>
                <p>审核结果：{{mapType.status[scope.row.status]}} <span v-if="scope.row.status > 0 && scope.row.auditPerson">({{scope.row.auditPerson}})</span>  </p>
                <p v-if="scope.row.auditTime">审核时间：{{scope.row.auditTime}}</p>
                <p v-if="scope.row.status == 2 && scope.row.auditResult">原因：{{scope.row.auditResult}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'sku'" :render-header="headerTitle" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="line-wrap">
                <div class="line" v-for="sku in scope.row.auditCostPriceDetailList">
                  <p>{{sku.skuCode}}</p>
                  <p><span v-if="sku.status == 0" class="c-red">(停售)</span>{{sku.propertyValue ? sku.propertyValue : ' -- '}}</p>
                  <p>{{sku.oldCostPrice/100}}</p>
                  <p><span class="c-green" v-if="sku.newCostPrice < sku.oldCostPrice">降价</span><span class="c-red" v-else>提价</span>
                  <p>{{sku.newCostPrice/100}}</p>
                </div>
              </div>

            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <el-button v-if="scope.row.status == 0" size="small" type="primary" @click="editShow(scope.row)">审核</el-button>
             </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog title="审核供货价" size="large" v-model="auditPriceModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <span class="label-sign">待启用日期</span>
        {{auditPriceModel.rs.effectiveDate}}
      </div>
      <div class="block-box">
        <span class="label-sign">调价原因</span>
        {{auditPriceModel.rs.reason}}
      </div>
      <div class="item-table">
        <el-table  border :data="auditPriceModel.rs.auditCostPriceDetailList" style="width: 100%;" >

          <el-table-column prop="skuCode" label="SKU码" align="center"></el-table-column>
          <el-table-column  label="销售属性值" align="center">
            <template scope="scope">
                <p><span v-if="scope.row.status == 0" class="c-red">(停售)</span>{{scope.row.propertyValue}}</p>
              </template>
          </el-table-column>
          <el-table-column  label="原成本价" align="center">
            <template scope="scope">
              <span>{{scope.row.oldCostPrice / 100}}</span>
            </template>
          </el-table-column>
          <el-table-column label="调价类型" align="center">
            <template scope="scope">
              <p><span v-if="scope.row.newCostPrice < scope.row.oldCostPrice" class="c-green">降价</span><span class="c-red" v-else>提价</span></p>
            </template>
          </el-table-column>
          <el-table-column  label="调后成本价" align="center">
            <template scope="scope">
              <span>{{scope.row.newCostPrice / 100}}</span>
            </template>
          </el-table-column>


        </el-table>

      </div>
      <div class="block-box">
        <span class="label-sign">审核结果</span>
        <el-radio class="radio" v-model="auditPriceModel.opts.status" :label="1">通过</el-radio>
        <el-radio class="radio" v-model="auditPriceModel.opts.status" :label="2">拒绝</el-radio>
      </div>
      <div class="block-box">
        <template v-if="auditPriceModel.opts.status == 1">
          <span class="label-sign">生效时间</span>
          <el-radio class="radio" v-model="auditPriceModel.opts.effectiveDateStatus" label="1">以商家提交启用日期为准</el-radio>
          <el-radio class="radio" v-model="auditPriceModel.opts.effectiveDateStatus" label="2">审核通过当晚24点提前生效</el-radio>
        </template>
        <template v-else-if="auditPriceModel.opts.status === 2">
          <span class="label-sign">失败原因</span>
          <el-input placeholder="请填写失败原因" size="small" style="width: 400px" v-model.trim="auditPriceModel.opts.auditResult"></el-input>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">确认</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
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
    filters:{
      filterSkuName(rs){
        let _nameList = []
        rs.map((item)=>{
          _nameList.push(item.pvName)
        })
        return _nameList.length ? _nameList.join('-') : '默认'
      },
    },
    data:()=>({
      loading:false,
      mapType:{
        status:{
          0:'待审核',
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
      auditPriceModel:{
        isShow:false,
        rs:{},
        opts:{
          auditCostPriceId:'',
          status:'',
          auditResult:'',
          effectiveDateStatus:'',
//          auditCostPriceDetailList:[]
        }
      }

    }),
    methods:{
      ...mapActions(['actionPriceAudit','setSearchParams','getPriceAuditList','setStartToast']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
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
        this.getPriceAuditList(params)
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
      editShow(rs){
        this.auditPriceModel.rs = rs
        this.auditPriceModel.opts.auditCostPriceId = rs.id
//        this.auditPriceModel.opts.auditCostPriceDetailList = rs.auditCostPriceDetailList
        this.auditPriceModel.isShow = true
      },
      submitAudit(){
         if(typeof this.auditPriceModel.opts.status == 'string'){
           this.getToast('请选择审核结果')
           return false
         } else if(this.auditPriceModel.opts.status === 1 && !this.auditPriceModel.opts.effectiveDateStatus){
           this.getToast('请选择生效时间')
           return false
         } else if(this.auditPriceModel.opts.status === 2 && !this.auditPriceModel.opts.auditResult){
           this.getToast('请填写失败原因')
           return false
         }
         if(this.auditPriceModel.opts.status === 2){
           this.auditPriceModel.opts.effectiveDateStatus = 1
         }
         this.actionPriceAudit(this.auditPriceModel.opts)
           .then((rs)=>{
             this.setStartToast({
               isShow:true,
               msg:'审核成功',
               type:'success'
             })
              this.cancelAudit()
              this.initView()

           })
      },
      cancelAudit(){
        this.auditPriceModel.opts = {
          status:'',
          auditResult:'',
          effectiveDateStatus:'',
//          auditCostPriceDetailList:[]
        }
        this.auditPriceModel.isShow = false
      },
      headerTitle(createElement, { column }) {
        let arr =  column.label.split('-'),
          createArr = []
        arr.map((item)=>{
          createArr.push(createElement('div', {class: {'split-title':true}}, item))
        })
        return createElement(
          'div',
          createArr
        );
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
  .line-wrap{
    .line{
      padding: 10px 0;
      border-top:1px solid rgb(236, 223, 223);
      overflow: hidden;
      &:nth-child(1){
        border-top: none;
      }
      >p{
        float: left;
        width: 150px;
        height: 100%;
        /*border-right: 1px solid rgb(236, 223, 223);*/
        &:last-child{
          /*border-right: none;*/
        }
      }
    }
  }
</style>
