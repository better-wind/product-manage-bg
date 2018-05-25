<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button type="primary" @click="editCateMsg()">新增模板</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;" >
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column :key="item.key" v-if="item.type == 'type'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                {{item.typeConfig[scope.row[item.key]]}}
              </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template scope="scope">
                <div class="opera-menu">
                  <el-button  type="primary" size="small" @click="editCateMsg(true,scope.row)">编辑</el-button>
                  <el-button  size="small" @click="editCateMsg(true,scope.row)">设置邮费</el-button>
                </div>
              </template>
            </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>

        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="cateMsgModel.type == 0 ? '新增模板' : '编辑模板'" size="small" v-model="cateMsgModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box cate-msg-model">
        <template v-for="(item,index) in cateMsgModel.config">
          <div :key="index" >
            <span  class="label-sign">{{item.label}}</span>
            <template v-if="item.type == 'input'">
              <div class="inline-box">
                <el-input size="small" :placeholder="'请输入'+item.label" v-model.trim="cateMsgModel.opts[item.key]"></el-input>
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
      imageKey:'',
      searchResult:{},
      loading:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      batchList:[],
      frontAvailableModel:{
        type:'',
        list:[],
        isShow:false
      },
      cateMsgModel:{
        isShow:false,
        type:0,
        config:[
          {
            label:'模板名称',
            key:'name',
            type:'input',
            req:true,
            limit:10
          },
          {
            label:'备注',
            key:'desc',
            type:'input',
          },
          {
            label:'状态',
            type:'radio',
            key:'isAvailable',
            req:true,
            items:[
              {
                label:'启用',
                value:1
              },
              {
                label:'停用',
                value:0
              }
            ]
          }
        ],
        dOpts:{
          id: '',
          isAvailable:1, //必填
          desc:'', //必填
          name:'' //必填
        },
        opts:{},
      },
      picUpload:{
        file:null
      }
    }),
    methods:{
      ...mapActions(['setViewImage','setSearchParams','getSaleFreightTempList','setStartToast','createFlag']),
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
        this.getSaleFreightTempList(params)
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


      //新建国旗
      editCateMsg(edit,rs){
        if(edit){
          this.setCateMsgModelMsg(rs)
          this.cateMsgModel.type = 1
        } else {
          this.setCateMsgModelMsg(this.cateMsgModel.dOpts)
          this.cateMsgModel.type = 0
        }
      },
      setCateMsgModelMsg(rs){
        this.cateMsgModel.opts = UtilTool.deepCopy(rs)
        this.cateMsgModel.isShow = true
      },
      submitCateMsgModel(){
        for(let i = 0,j=this.cateMsgModel.config.length;i<j;i++){
          const item = this.cateMsgModel.config[i]
          if(item.req && (!this.cateMsgModel.opts[item.key] && {}.toString.call(this.cateMsgModel.opts[item.key]) != '[object Number]')){
            this.getToast(item.label+'不能为空')
            return false
          }
          if(item.limit && this.cateMsgModel.opts[item.key].length > item.limit){
            this.getToast(item.label+'最长'+item.limit+'字符')
            return false
          }
          if(item.reg && !(this.cateMsgModel.opts[item.key]+'').match(item.reg)){
            this.getToast(item.label+item.regError)
            return false
          }
        }
        let _opts = Object.assign({},this.cateMsgModel.opts)
        this.createFlag(_opts)
          .then(()=>{
            this.cancelCateMsgModel()
            this.initView()
          })
      },
      cancelCateMsgModel(){
        this.cateMsgModel.isShow = false
      },
      //图片
      setImageKey(key){
          this.imageKey = key
      },
      handleSuccess(res){
        if(res.code != 1){
          this.getToast('上传失败')
          return false
        }
        let _optSize = {
            width:'48',
            height:'48'
        }
        if(res.data.width != _optSize.width || res.data.height != _optSize.height){
          this.getToast('图片限制'+_optSize.width+'*'+_optSize.height);
          return false;
        }

        this.cateMsgModel.opts[this.imageKey] = res.data.url
      },
      beforeUpload(file){
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 < 401;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传图片大小不能超过 400KB!');
        }
        this.picUpload.file=file
        return isJPG && isLt2M;
      },
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      //删除主图
      delProductImage(key){
        this.cateMsgModel.opts[key] = ''
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
  .opera-menu{
    padding: 5px 0;
    .el-button{
      margin-bottom:5px;
      /*&:nth-child()*/
    }
  }
  .cate-msg-model{
    .label-sign-wrap{
      /*float: left;*/
    }
    .label-sign{
      display: inline-block;
      width:100px;
      text-align: right;
    }
    .cate-img-wrap{
      padding-left: 125px;
      padding-bottom: 10px;
    }
    .cate-img{
      position: relative;
      width: 80px;
      height:80px;
      overflow: hidden;
      .cate-img-menu{
        display: none;
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        text-align: center;
        line-height: 80px;
        i{
          cursor: pointer;
          padding: 0 5px;
          font-size: 20px;
          color: #8c939d;
          &:hover{
            color:rgb(240,240,240)
          }
        }
      }
      &:hover{
        .cate-img-menu{
          display: block;
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
