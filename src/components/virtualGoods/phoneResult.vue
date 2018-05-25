<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button size="small" type="primary" @click="changeStatusBatch">启用/停用</el-button>
      <el-button size="small" type="primary" @click="uploadShow = true">批量修改价格</el-button>
      <el-button  size="small" @click="downVirtualTemp">下载批量修改价格模板</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :data="searchResult.rows" style="width: 100%;" >
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column :key="item.key" v-if="item.type == 'map'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template  scope="scope">
              <span :class="scope.row[item.key] == 0 ? 'c-red' : ''">{{item.map[scope.row[item.key]]}}</span>

            </template>
          </el-table-column>
          <el-table-column :key="item.key" v-else-if="item.type == 'price'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template  scope="scope">
              <el-input v-if="scope.row.isEdit" size="small" v-model.trim="scope.row.price" style="width: 160px;"></el-input>
              <span v-else>{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope" >
              <template v-if="!scope.row.isEdit">
                <el-button size="small" @click="changeStatus(scope.row,scope.row.status)">{{scope.row.status == 1 ? '停用' : '启用'}}</el-button>
                <el-button  size="small" type="primary" @click="changePrice(scope.row,1)">调价</el-button>
                <el-button  size="small" type="primary" @click="callVirtualPhoneLogList(scope.row.id)">操作日志</el-button>
              </template>
              <template v-else="scope.row.isEdit">
                <el-button  size="small" type="primary" @click="changePrice(scope.row,2)">保存</el-button>
                <el-button  size="small" @click="scope.row.isEdit = false">取消</el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="frontAvailableModel.type == 1 ? '设置商品停用' : '设置商品启用'" size="tiny" v-model="frontAvailableModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{frontAvailableModel.list.length}} 个【{{frontAvailableModel.type == 1 ? '可用' : '停用'}}】商品，是否将其设置为【{{frontAvailableModel.type == 1 ? '停用' : '可用'}}】？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCateAvailable">确认</el-button>
        <el-button @click="cancelCateAvailable">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog  title="操作日志" size="large" v-model="logModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="item-table mg-t-h mg-b">
        <el-table  border  :data="logModel.list" style="width: 100%;" max-height="500">
          <template v-for="item in logModel.configItem">

            <el-table-column v-if="item.type == 'time'" :label="item.label" :prop="item.key" align="center">
              <template scope="scope">
                <span v-if="scope.row[item.key]">{{scope.row[item.key] | transTimeDate}}</span>
              </template>
            </el-table-column>
            <el-table-column v-else :label="item.label" :prop="item.key" align="center"> </el-table-column>
          </template>
        </el-table>
      </div>
      <el-pagination
        @current-change="handleCurrentChangeLog"
        :current-page="logModel.opts.page"
        :page-sizes="[20]"
        small
        :page-size="logModel.opts.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="logModel.opts.total">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="cancelLogModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog size="small" v-model="uploadShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <form method="post" id="importValue" ref="importValue" action="/goodsAdmin/goods/recharge/trafficGoods/import" enctype="multipart/form-data">
        <span class="upload-input-wrap">
          请选择文件
          <input type="file" class="upload-input" ref="importFile" id="file" @change="changeFile" name="importFile"/>
        </span>
        <p>{{uploadName}}</p>
      </form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="save">确 定</el-button>
        <el-button size="small" @click="cancelUpload">取 消</el-button>
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
      mapProperties:{
        '运营商':'pnYYS',
        '省份':'pnSF',
        '面值':'pnMZ',
        '充值范围':'pnCZFW',
        '适用范围':'pnSYFW',
      },
      pagingShow:false,
      batchList:[],
      frontAvailableModel:{
        type:'',
        list:[],
        isShow:false
      },
      logModel:{
        isShow:false,
        list:[],
        configItem:[
          {
            label:'操作',
            key:'content',
          },
          {
            label:'生效时间',
            key:'createTime',
            type:'time'
          },
          {
            label:'操作人',
            key:'username'
          }
        ],
        opts:{
          page:1,
          rows:20,
          total:0,
          targetId:''
        }
      },
      routerName:'',
      uploadFile:{
        importFile:null
      },
      uploadShow:false,
      uploadName:''
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast',
        'getVirtualPhoneList','updateVirtualPhone','getVirtualPhoneLogList',
        'downVirtualTemp']),
      initView(){
        this.routerName = this.$route.name
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
        let _opts = {
          params:params,
          routerName:this.routerName
        }
        this.getVirtualPhoneList(_opts)
          .then((rs)=>{
            rs.rows.map((item)=>{
              let _opts = {}
              item.properties.map((pItem)=>{
                _opts[this.mapProperties[pItem.pnName]] = pItem.pvName
              })
              item.price /= 100
              item.isEdit = false
              Object.assign(item,_opts)
            })
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
      handleSelectionChange(list){
        this.batchList = list;
      },
      changePrice(rs,type){
        switch (type){
          case 1:
              rs.isEdit = true;
              break;
          case 2:
              if(!(rs.price+'')){
                this.getToast(`请输入${rs.saleUnitCode}售价`)
                return false
              } else if(!(rs.price+'').match(RegExpType.Price)){
                this.getToast(`${rs.saleUnitCode}售价格式不正确`)
                return false
              }
              this.editItem([rs.id],2,rs.price)
                .then(()=>{
                  this.initView()
                })
              break;
        }
      },
      changeStatus(rs,type){
        let _msg = '是否确认'+ (type == 1 ? '停用' : '启用')
        this.$confirm(_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editItem([rs.id],1,type)
            .then(()=>{
              this.initView()
            })
        }).catch(() => {

        });
      },
      changeStatusBatch(){
        if(!this.batchList.length){
          this.getToast('请选择商品')
          return false
        }
        let _status = this.batchList[0].status
        for(let i = 1,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i].status != _status){
            this.$alert('请选择可用/停用状态一致的商品进行批量操作', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
        }
        this.frontAvailableModel.type = _status
        this.frontAvailableModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.frontAvailableModel.isShow = true
      },
      cancelCateAvailable(){
        this.batchList = []
        this.frontAvailableModel.isShow = false
      },
      submitCateAvailable(){
        let _list = []
        this.frontAvailableModel.list.map((item)=>{
          _list.push(item.id)
        })
        this.editItem(_list,1,this.frontAvailableModel.type)
          .then(()=>{
            this.cancelCateAvailable()
            this.initView()
          })
      },
      //修改状态 修改价格
      /*
      * ids Array
      * type 1 启用停用 2 价格
      * */
      editItem(ids,type,val){
        let _rs = {}

        let _opts = {
            saleUnitIds:ids.join(','),
//            status:'',
//            price:''
        }
        type == 1 ? (_opts.status = val ? 0 : 1) : _opts.price =  UtilTool.accMul(val,100)
        _rs.opt = _opts
        _rs.type = type
        return new Promise((reslove)=>{
          this.updateVirtualPhone(_rs)
            .then((rs)=>{
              reslove()
            })
        })

      },
      callVirtualPhoneLogList(id){
        this.logModel.opts.targetId = id
        this.callGetVirtualPhoneLogList()
        this.logModel.isShow = true
      },
      callGetVirtualPhoneLogList(){
        const {page,rows,targetId} = this.logModel.opts
        let _opt = {
          page,
          rows,
          targetId:targetId
        }
        this.getVirtualPhoneLogList(_opt)
          .then((rs)=>{
            this.logModel.list = rs.rows
            this.logModel.opts.total = rs.total
          })
      },
      handleCurrentChangeLog(page){
        this.logModel.opts.page = page
        if(this.logModel.isShow){
          this.callGetVirtualPhoneLogList()
        }

      },
      cancelLogModel(){
        this.logModel.isShow = false
        this.logModel.list = []
        this.logModel.opts = {
          page:1,
          rows:20,
          total:0,
          targetId:''
        }
      },
      //批量上传前判断
      save(){
        let filePath = this.$refs.importFile.value;
        if(!filePath){
          this.getToast('请选择文件')
          return false
        }
        this.$refs.importValue.submit()
        this.cancelUpload()
      },
      cancelUpload(){
        this.uploadShow = false
        this.uploadName = ''
        this.$refs.importFile.value = ''
      },
      changeFile(){
        this.uploadName = ''
        let filePath = this.$refs.importFile.value;
        let sType = filePath.split('.').pop()
        let _path = filePath.split('\\').pop()
        let type = {
          xls:'xls',
          xlsx:'slsx'
        }
        if(!type[sType]){
          this.getToast('文件格式不正确')
          this.$refs.importFile.value = null
          return false
        }
        this.uploadName = _path
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
  .upload-input-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    line-height: 30px;
    text-align: center;
    background-color: #fb4b4d;
    color:#fff;
    border-radius: 4px;
    overflow: hidden;
    .upload-input{
      position: absolute;
      top:0;
      left: 0;
      width: 100px;
      height: 30px;
      opacity: 0;
    }
  }
</style>
