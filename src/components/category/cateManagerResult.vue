<template>
  <div class="item-box">
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中"  :data="searchResult.rows" style="width: 100%;" >
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column :key="item.key" v-if="item.type == 'type'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template  scope="scope">
              {{item.typeConfig[scope.row[item.key]]}}
            </template>
          </el-table-column>
          <el-table-column :key="item.key" v-else-if="item.type == 'stockWarningThreshold'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template  scope="scope">
              {{scope.row.stockWarning == 1 ? scope.row.stockWarningThreshold : ''}}
            </template>
          </el-table-column>

          <el-table-column v-else-if="item.type == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="opera-menu">
                <el-button  type="primary" size="small" @click="editCateMsg(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>

        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog title="编辑类目经理" size="small" v-model="cateMsgModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="section-box cate-model-box">
        <template v-for="(item,index) in cateMsgModel.config">
          <div class="block-box" >
            <span  class="label-sign">{{item.label}}</span>
            <template v-if="item.type == 'input'">
              <div class="inline-box">
                <el-input size="small" :disabled="typeof item.disabled == 'string' ? cateMsgModel.opts[item.disabled] == 0 : item.disabled" :placeholder="'请输入'+item.label" v-model.trim="cateMsgModel.opts[item.key]"></el-input>
              </div>
            </template>
            <template v-else-if="item.type == 'radio'">
              <div class="inline-box">
                <template v-for="(subItem,subIndex) in item.items">
                  <el-radio class="radio" v-model="cateMsgModel.opts[item.key]" :label="subItem.value">{{subItem.label}}</el-radio>
                </template>
              </div>
            </template>
          </div>
        </template>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCateMsgModel">确认</el-button>
        <el-button @click="cancelCateMsgModel">取 消</el-button>
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
      cateMsgModel:{
        isShow:false,
        opts:{
          id:'',
          groupName:'',
          managerName:'',
          contactPhone:'',
          stockWarning:'',
          stockWarningThreshold:'',
          autoOffSale:''
        },
        config:[
          {
            label:'类目分组名称',
            type:'input',
            key:'groupName',
            disabled:true
          },
          {
            label:'商品经理名称',
            type:'input',
            key:'managerName',
            disabled:true
          },
          {
            label:'联系人手机号',
            type:'input',
            key:'contactPhone',
          },
          {
            label:'是否开启库存预警',
            type:'radio',
            key:'stockWarning',
            req:true,
            items:[
              {
                label:'是',
                value:1
              },
              {
                label:'否',
                value:0
              }
            ]
          },
          {
            label:'预警值',
            type:'input',
            key:'stockWarningThreshold',
            disabled:'stockWarning'
          },
          {
            label:'库存为0是否自动下架',
            type:'radio',
            key:'autoOffSale',
            req:true,
            items:[
              {
                label:'是',
                value:1
              },
              {
                label:'否',
                value:0
              }
            ]
          },

        ]
      }
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast','getCateManageGroupList','setCateManageGroupUpdate']),
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
        this.getCateManageGroupList(params)
          .then((rs)=>{
            this.searchResult = rs
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
      editCateMsg(rs){
        this.cateMsgModel.opts = UtilTool.deepCopy(rs)
        this.cateMsgModel.isShow = true
      },
      submitCateMsgModel(){
        if(!(this.cateMsgModel.opts.contactPhone+'')){
            this.getToast('请输入联系人手机号')
            return false
        } else if(!(this.cateMsgModel.opts.contactPhone+'').match(RegExpType.Tel)){
          this.getToast('联系人手机号码格式不正确')
          return false
        } else if(this.cateMsgModel.opts.stockWarning == 1 && !(this.cateMsgModel.opts.stockWarningThreshold+'')){
          this.getToast('请输入预警值')
          return false
        } else if(this.cateMsgModel.opts.stockWarning == 1 && !(this.cateMsgModel.opts.stockWarningThreshold+'').match(RegExpType.Num)){
          this.getToast('预警值格式不正确')
          return false
        }
        this.setCateManageGroupUpdate(this.cateMsgModel.opts)
          .then(()=>{
            this.setStartToast({
              isShow:true,
              msg:'编辑成功',
              type:'success'
            })
            this.cancelCateMsgModel()
            this.initView()
          })
      },
      cancelCateMsgModel(){
        this.cateMsgModel.isShow = false
        this.cateMsgModel.opts = {
            id:'',
            groupName:'',
            managerName:'',
            contactPhone:'',
            stockWarning:'',
            stockWarningThreshold:'',
            autoOffSale:''
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
  .cate-model-box{
    .label-sign{
      display: inline-block;
      width: 150px;
    }
  }
</style>
