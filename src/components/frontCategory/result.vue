<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button type="primary" @click="editCateMsg()">新增{{mapLabelLevel[labelLevel]}}类目</el-button>
      <el-button  @click="callGroupStatus">启用/停用</el-button>
      <!--<el-button size="small" @click="callGroupStatus">停用</el-button>-->
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :data="searchResult.rows" style="width: 100%;" >
        <el-table-column type="selection" align="center" width="55">

        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <template v-if="item.level.includes(labelLevel)">
            <el-table-column :key="item.key" v-if="item.type == 'type'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                {{item.typeConfig[scope.row[item.key]]}}
              </template>
            </el-table-column>
            <el-table-column :key="item.key" v-else-if="item.type == 'image'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                <a v-if="scope.row[item.key]" :href="scope.row[item.key]" target="_blank">查看</a>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'chanel'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template scope="scope">
                <span v-if="scope.row.isGgj">格格家</span>
                <span v-if="scope.row.isHqbs">环球捕手</span>
                <span v-if="scope.row.isMsms">美食买手</span>
              </template>
            </el-table-column>

            <el-table-column v-else-if="item.type == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template scope="scope">
                <div class="opera-menu">
                  <a :href="'#/frontCategory?level='+(labelLevel+1)+'&parentId='+scope.row.id"  v-if="labelLevel < 3" target="_blank">
                    <el-button  type="primary" size="small">
                      {{labelLevel == 1 ? '查看二级类目' : '查看三级类目'}}
                    </el-button>
                  </a>
                  <!--<el-button  v-if="labelLevel < 3" @click="nextLevel(labelLevel,scope.row.id)" type="primary" size="small">-->
                    <!--{{labelLevel == 1 ? '查看二级类目' : '查看三级类目'}}-->
                  <!--</el-button>-->
                  <el-button  type="primary" size="small" @click="editCateMsg(true,scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="frontAvailableModel.type == 0 ? '设置前台类目停用' : '设置前台类目启用'" size="tiny" v-model="frontAvailableModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{frontAvailableModel.list.length}} 个【{{frontAvailableModel.type == 1 ? '启用' : '停用'}}】类目，是否将其设置为【{{frontAvailableModel.type == 1 ? '停用' : '启用'}}】？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCateAvailable">确认</el-button>
        <el-button @click="cancelCateAvailable">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="(cateMsgModel.type == 0 ? '新增' : '编辑') +mapLabelLevel[labelLevel]+'类目'" size="small" v-model="cateMsgModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box cate-msg-model">
        <template v-for="(item,index) in cateMsgModel.config">
          <div :key="index" style="overflow: hidden;" v-if="item.level.includes(labelLevel) && (cateMsgModel.type == 0 || (cateMsgModel.type == 1 && !item.noEdit))">
            <!--<div class="label-sign-wrap" v-if="item.type == 'image'">-->
              <!--<span class="label-sign">{{item.label}}</span>-->
            <!--</div>-->
            <span  class="label-sign">{{item.label}}</span>
            <template v-if="item.type == 'input'">
              <div class="inline-box">
                <el-input size="small" :placeholder="'请输入'+item.label" v-model.trim="cateMsgModel.opts[item.key]"></el-input>
              </div>
            </template>
            <template v-else-if="item.type == 'checkBox'">
              <div class="inline-box">
                <template v-for="(subItem,subIndex) in item.items">
                  <el-checkbox v-model="cateMsgModel.opts[subItem.key]">{{subItem.label}}</el-checkbox>
                </template>
              </div>
            </template>
            <template v-else-if="item.type == 'radio'">
              <div class="inline-box">
                <template v-for="(subItem,subIndex) in item.items">
                  <el-radio class="radio" v-model="cateMsgModel.opts[item.key]" :label="subItem.value">{{subItem.label}}</el-radio>
                </template>

              </div>
            </template>
            <template v-else-if="item.type == 'image'">
              <div class="inline-box">
                <el-upload style="display: inline-block" action="/goodsAdmin/goods/file/imageUpload" :data="picUpload" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
                  <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
                <span class="c-dis c-tip mg-l-h">尺寸:{{labelLevel == 2 ? '582x268' : '152x152'}}</span>
              </div>
              <div v-if="cateMsgModel.opts[item.key]" class="cate-img-wrap">
                <div :class="labelLevel == 3 ? 'cate-img cate-img-level' : 'cate-img'">
                  <img :src="cateMsgModel.opts[item.key]" alt="">
                  <div class="cate-img-menu">
                    <i class="el-icon-search" @click="showProductImage(cateMsgModel.opts[item.key])"></i>
                    <i class="el-icon-delete" @click="delProductImage(item.key)"></i>
                  </div>
                </div>


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
    filters:{
      numToNumStr(level){
          let _str = ''
          switch (level){
            case 1:
                _str = '一'
                break
            case 2:
              _str = '二'
              break
            case 3:
              _str = '三'
              break

          }
          return _str
      }
    },
    data:()=>({
      mapLabelLevel:{
          1:'一级',
          2:'二级',
          3:'三级'
      },
      searchResult:{},
      labelLevel:1,
      parentId:0,
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
            label:'类目名称',
            level:[1,2,3],
            key:'name',
            type:'input',
            req:true,
            limit:10
          },
          {
            label:'排序值',
            level:[1,2,3],
            key:'sortOrder',
            type:'input',
            req:true,
            reg:RegExpType.Num,
            regError:'请输入正确的数字'
          },
          {
            label:'类目图标',
            level:[2,3],
            key:'image',
            type:'image'
          },
          {
            label:'展示渠道',
            level:[1,2,3],
            type: 'checkBox',
            items:[
              {
                label:'格格家',
                key:'isGgj'
              },
              {
                label:'环球捕手',
                key:'isHqbs'
              },
              {
                label:'美食买手',
                key:'isMsms'
              }
            ]
          },
          {
            label:'商品排序规则',
            level:[2],
            key:'sortMethod',
            type:'radio',
            items:[
              {
                label:'按销量排序',
                value:1
              },
              {
                label:'按所包含三级类目的顺序排序',
                value:2
              }
            ]
          },
          {
            label:'商品排序规则',
            level:[3],
            key:'sortMethod',
            type:'radio',
            items:[
              {
                label:'按销量排序',
                value:1
              },
              {
                label:'按类目的顺序排序',
                value:3
              }
            ]
          },
          {
            label:'是否HOT',
            level:[3],
            type:'radio',
            key:'isHot',
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
            label:'是否高亮',
            level:[3],
            type:'radio',
            key:'isHighlight',
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
            label:'是否展示品牌',
            level:[1],
            key:'isShowBrand',
            type:'radio',
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
            label:'状态',
            level:[1,2,3],
            noEdit:true,
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
          image: '',
          isAvailable: 1,
          isGgj: false,
          isHighlight: '',
          isHot: '',
          isHqbs: false,
          isMsms: false,
          isShowBrand: 1,
          name: '',
          parentId: 0,
          sortMethod: 1,
          sortOrder: '',
          tag: ''
        },
        opts:{},
      },
      cateChannel:['isGgj','isHqbs','isMsms'],
      picUpload:{
        file:null
      }
    }),
    methods:{
      ...mapActions(['setViewImage','setSearchParams','getFrontCateList','setFrontCateManageTitle','setStartToast','setFrontCateAble','getFrontCateMsg','createFrontCate']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        this.labelLevel = query.level ? Number(query.level) : 1
        this.parentId = query.parentId ? Number(query.parentId) : 0
        this.setFrontCateManageTitle(this.labelLevel)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        if(!this.parentId){
            params.parentId = 0
        }
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
        this.getFrontCateList(params)
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
      nextLevel(level,parentId){
        const query = {level:level+1,parentId}
        let params = {}
        this.searchConfig.searchItem.map((item)=>{
          if(item.items){
            item.items.map((subItem)=>{
              params[subItem.key] = subItem.isClear ?  '' : subItem.intKey
            })
          } else {
            params[item.key] = item.intKey
          }
        })


        this.setSearchParams(Object.assign({},params,query))
        this.$router.push({
          path: this.$route.path,
          query: query
        })
      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      //启用停用
      callGroupStatus(){
        if(!this.batchList.length){
          this.getToast('请选择前台类目')
          return false
        }
        let _isAvailable = this.batchList[0].isAvailable
        for(let i = 1,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i].isAvailable != _isAvailable){
            this.$alert('请选择启用/停用状态一致的类目进行批量操作', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
        }
        this.frontAvailableModel.type = _isAvailable
        this.frontAvailableModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.frontAvailableModel.isShow = true
      },
      submitCateAvailable(){
        let _list = []
        this.frontAvailableModel.list.map((item)=>{
          _list.push(item.id)
        })
        let _opts = {
          cateIds: JSON.stringify(_list),
          action: this.frontAvailableModel.type ? 0 : 1,
        }
        this.setFrontCateAble(_opts)
          .then(()=>{
            this.cancelCateAvailable()
            this.initView()
          })
      },
      cancelCateAvailable(){
        this.frontAvailableModel.isShow = false
      },
      //新建类目
      editCateMsg(edit,rs){
        if(edit){
          this.cateChannel.map((item)=>{
            rs[item] = rs[item] ? true : false
          })
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
          if(item.level.includes(this.labelLevel) && item.req && (!this.cateMsgModel.opts[item.key] && {}.toString.call(this.cateMsgModel.opts[item.key]) != '[object Number]')){
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
//        if(!this.cateMsgModel.opts.isGgj && !this.cateMsgModel.opts.isHqbs && !this.cateMsgModel.opts.isMsms){
//          this.getToast('展示渠道不能为空')
//          return false
//        }
        let _opts = Object.assign({},this.cateMsgModel.opts,{parentId:this.parentId})
        this.createFrontCate(_opts)
          .then(()=>{
            this.cancelCateMsgModel()
            this.initView()
          })
      },
      cancelCateMsgModel(){
        this.cateMsgModel.isShow = false
      },
      //图片
      handleSuccess(res){
        if(res.code != 1){
          this.getToast('上传失败')
          return false
        }
        let _optSize = {
          2:{
            width:'582',
            height:'268'
          },
          3:{
            width:'152',
            height:'152'
          }

        }

        if(res.data.width != _optSize[this.labelLevel].width || res.data.height != _optSize[this.labelLevel].height){
          this.getToast(`当前图片大小${res.data.width}*${res.data.height},图片限制${_optSize[this.labelLevel].width}*${_optSize[this.labelLevel].height}`);
          return false;
        }

        this.cateMsgModel.opts.image = res.data.url
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
      width: 150px;
      height:69px;
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
        line-height: 69px;
        i{
          cursor: pointer;
          padding: 0 10px;
          font-size: 20px;
          color: #8c939d;
          &:hover{
            color:rgb(240,240,240)
          }
        }
      }
      &.cate-img-level{
        width: 69px;
        .cate-img-menu{
          i{
            padding: 0 5px;
            font-size: 15px;
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
