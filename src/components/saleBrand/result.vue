<template>
  <div class="item-box">
    <div class="block-box menu-result">


      <el-button v-if="roleMenuDetail['/goods/front/brand/add']" type="primary" @click="editCateMsg()">新增品牌</el-button>
      <el-button v-else type="primary" @click="noRole()">新增品牌</el-button>
      <el-button  @click="callGroupStatus">启用/停用</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :data="searchResult.rows" style="width: 100%;" >
        <el-table-column type="selection" align="center" width="55">

        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column :key="item.key" v-if="item.type == 'type'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                {{item.typeConfig[scope.row[item.key]]}}
              </template>
            </el-table-column>
          <el-table-column :key="item.key" v-else-if="item.type == 'image'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                <div  style="display: inline-block;padding: 10px 0">
                  <img v-if="scope.row[item.key]" :style="'width: '+item.imageW+'px;height: '+item.imageH+'px;'" :src="scope.row[item.key]" alt="">
                </div>
              </template>
            </el-table-column>
          <el-table-column :key="item.key" v-else-if="item.type == 'stateId'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                <!--<span v-if="saleFlagNameList.length">{{scope.row[item.key] | toFlagName}}</span>-->
                <span v-if="saleFlagNameList.length">{{toFlagName(scope.row[item.key])}}</span>
              </template>

          </el-table-column>
          <el-table-column :key="item.key" v-else-if="item.type == 'category'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                <template v-if="scope.row.categoryEntities && scope.row.categoryEntities.length" v-for="(cate,index) in scope.row.categoryEntities">
                  {{cate.name}}
                </template>
              </template>

          </el-table-column>
          <el-table-column :key="item.key" v-else-if="item.type == 'introduce'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template  scope="scope">
                <div style="padding: 10px;">
                  {{scope.row[item.key]}}
                </div>
              </template>

          </el-table-column>

          <el-table-column v-else-if="item.type == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template scope="scope">
                <div class="opera-menu">
                  <el-button  type="primary" size="small" @click="editCateMsg(true,scope.row)">编辑</el-button>
                </div>
              </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>

        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="frontAvailableModel.type == 1 ? '设置品牌停用' : '设置品牌启用'" size="tiny" v-model="frontAvailableModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{frontAvailableModel.list.length}} 个【{{frontAvailableModel.type == 1 ? '启用' : '停用'}}】品牌，是否将其设置为【{{frontAvailableModel.type == 1 ? '停用' : '启用'}}】？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCateAvailable">确认</el-button>
        <el-button @click="cancelCateAvailable">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="cateMsgModel.type == 0 ? '新增品牌' : '编辑品牌'" size="small" v-model="cateMsgModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box cate-msg-model">
        <template v-for="(item,index) in cateMsgModel.config">
          <div :key="index" style="overflow: hidden">
            <div v-if="item.sign" class="label-sign-wrap">
              <span class="label-sign">{{item.label}}</span>
            </div>
            <span v-else class="label-sign">{{item.label}}</span>
            <template v-if="item.type == 'input'">
              <div class="inline-box" style="margin-left: -4px">
                <el-input size="small" class="input-input" :placeholder="'请输入'+item.label" v-model.trim="cateMsgModel.opts[item.key]"></el-input>
              </div>
            </template>
            <template v-else-if="item.type == 'text'">
              <div class="inline-box">
                <el-input size="small"  class="input-text" type="textarea" :rows="2" :placeholder="'请输入'+item.label" v-model.trim="cateMsgModel.opts[item.key]"></el-input>
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
                  <el-button size="small" type="primary" @click="setImageKey(item.key)">上传图片</el-button>
                </el-upload>
                <span class="c-dis c-tip mg-l-h">尺寸:{{item.size}}</span>
              </div>
              <div v-if="cateMsgModel.opts[item.key]" class="cate-img-wrap">
                <div :class="item.key == 'imageAd' ? 'cate-img cate-img-large' : 'cate-img'">
                  <img :src="cateMsgModel.opts[item.key]" alt="">
                  <div class="cate-img-menu">
                    <i class="el-icon-search" @click="showProductImage(cateMsgModel.opts[item.key])"></i>
                    <i class="el-icon-delete" @click="delProductImage(item.key)"></i>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="item.type == 'select'">
              <div class="inline-box" style="margin-left: -4px">
                <el-select class="input-input" v-model="cateMsgModel.opts[item.key]" size="small"  :placeholder="'请选择'+item.label">
                  <template v-for="subItem in saleFlagNameList">
                    <el-option :label="subItem.label" :value="subItem.value"></el-option>
                  </template>
                </el-select>
              </div>
            </template>
            <template v-else-if="item.type == 'frontCate'">
              <div class="inline-box" style="width: 380px">
                <template v-for="(cate,index) in cateMsgModel.frontCategoryIds">
                  <el-select class="input-input mg-b-h"  v-model="cateMsgModel.frontCategoryIds[index]" size="small"  :placeholder="'请选择'+item.label">
                    <template v-for="subItem in saleFrontCateList">
                      <el-option :label="subItem.label" :value="subItem.value"></el-option>
                    </template>
                  </el-select>
                </template>
                <el-button size="small" @click="addCate">新增类目</el-button>
                <el-button size="small" @click="delCate">删除</el-button>

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
      ...mapState(['searchConfig','roleMenuDetail','searchParams','saleFlagNameList','saleFrontCateList'])
    },
    created(){
      this.initView()
    },
    filters:{
      toFlagName(code){
        let _name = '',
            _length = this.saleFlagNameList.length
        while(_length--){
            if(this.saleFlagNameList[_length].value == code){
              _name = this.saleFlagNameList[_length].label
            }
        }
        return _name
      },
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
        // frontCategoryIds:[''],
        config:[
          {
            label:'品牌名称',
            key:'name',
            type:'input',
            req:true,
            limit:20
          },
          {
            label:'品牌英文名称',
            key:'nameEn',
            type:'input',
//            req:true,
            limit:50,
            reg:RegExpType.En,
            regError:'请输入英文'
          },
          {
            label:'品牌LOGO',
            key:'image',
            type:'image',
            req:true,
            size:'128x128'
          },
          {
            label:'品牌广告图',
            key:'imageAd',
            type:'image',
            size:'750x358 或 640x306'
//            req:true
          },
          {
            label:'品牌卖点',
            key:'hotSpots',
            type:'text',
            sign:true,
            req:true,
            limit:100,
          },
          {
            label:'品牌介绍',
            key:'introduce',
            type:'text',
            sign:true,
            req:true,
            limit:100,
          },
          {
            label:'品牌国家信息',
            key:'stateId',
            type:'select',
            optionsKey:'saleFlagNameList',
            req:true
          },
          // {
          //   label:'品牌所属类目',
          //   key:'frontCategoryIds',
          //   type:'frontCate',
          //   sign:true,
          // },
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
          },
          {
            label:'是否自有',
            type:'radio',
            key:'isSelfOwn',
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
            label:'是否展示',
            type:'radio',
            key:'isShow',
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
        ],
        dOpts:{
          stateId: '',
          introduce: '',
          hotSpots: '',
          isAvailable: 1,
          isSelfOwn:0,
          isShow:0,
          imageAd: '',
          image: '',
          nameEn: '',
          name: '',
          // frontCategoryIds:[]
        },
        opts:{},
      },
      picUpload:{
        file:null
      }
    }),
    methods:{
      ...mapActions(['setViewImage','setSearchParams','getSaleBrandList','setStartToast','setSaleBrandAble','createBrand']),
      noRole(){
        this.getToast('权限不足，请联系主管申请。')
        return false
      },
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
        this.getSaleBrandList(params)
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
      toFlagName(code){
        let _name = '',
          _length = this.saleFlagNameList.length
        while(_length--){
          if(this.saleFlagNameList[_length].value == code){
            _name = this.saleFlagNameList[_length].label
          }
        }
        return _name
      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      //启用停用
      callGroupStatus(){
        if(!this.batchList.length){
          this.getToast('请选择品牌')
          return false
        }
        let _isAvailable = this.batchList[0].isAvailable
        for(let i = 1,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i].isAvailable != _isAvailable){
            this.$alert('请选择启用/停用状态一致的品牌进行批量操作', '提示', {
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
          brandIds: JSON.stringify(_list),
          action: this.frontAvailableModel.type ? 0 : 1,
        }
        this.setSaleBrandAble(_opts)
          .then(()=>{
            this.cancelCateAvailable()
            this.initView()
          })
      },
      cancelCateAvailable(){
        this.frontAvailableModel.isShow = false
      },
      //新建囯家
      editCateMsg(edit,rs){
        if(edit){
          let _list = []
          if(rs.categoryEntities){
            rs.categoryEntities.map((item)=>{
              if(item)
              _list.push(item.id+'')
            })
          } else {
            _list.push('')
          }
          this.cateMsgModel.frontCategoryIds = _list

          rs.stateId += ''
          this.setCateMsgModelMsg(rs)
          this.cateMsgModel.type = 1
        } else {
          this.cateMsgModel.frontCategoryIds = ['']
          this.setCateMsgModelMsg(this.cateMsgModel.dOpts)
          this.cateMsgModel.type = 0
        }
      },
      setCateMsgModelMsg(rs){
        this.cateMsgModel.opts = UtilTool.deepCopy(rs)
        this.cateMsgModel.isShow = true
      },
      addCate(){
        if(this.cateMsgModel.frontCategoryIds.length > 2){
          this.getToast('最多选择三个类目')
          return false
        }
        this.cateMsgModel.frontCategoryIds.push('')
      },
      delCate(){
        if(this.cateMsgModel.frontCategoryIds.length <= 1){
          this.getToast('最少选择一个类目')
          return false
        }
        this.cateMsgModel.frontCategoryIds.pop('')
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
          if(item.reg && this.cateMsgModel.opts[item.key] && !(this.cateMsgModel.opts[item.key]+'').match(item.reg)){
            this.getToast(item.label+item.regError)
            return false
          }
        }
        // let _cateCount = 0
        // this.cateMsgModel.frontCategoryIds.map((item)=>{
        //     if(item)
        //       _cateCount++
        // })
        // if(!_cateCount){
        //   this.getToast('至少选择一个类目')
        //   return false
        // }
        let _opts = Object.assign({},this.cateMsgModel.opts)
        // _opts.frontCategoryIds = this.cateMsgModel.frontCategoryIds
//        console.log(_opts)
//        return false
        this.createBrand(_opts)
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
          image:{
            width:'128',
            height:'128'
          },
          imageAd:[
            {width:'750',
              height:'358',
            },
            {
              width:'640',
              height:'306'
            },
          ]
         }
        if(this.imageKey == 'image'){
          if(res.data.width == _optSize[this.imageKey].width && res.data.height == _optSize[this.imageKey].height){
            this.cateMsgModel.opts[this.imageKey] = res.data.url
          }
          else {
            this.getToast('图片限制'+_optSize[this.imageKey].width+'*'+_optSize[this.imageKey].height);
          }
        } else if(this.imageKey == 'imageAd'){
          if((res.data.width == _optSize[this.imageKey][0].width && res.data.height == _optSize[this.imageKey][0].height) || (res.data.width == _optSize[this.imageKey][1].width && res.data.height == _optSize[this.imageKey][1].height) ){
            this.cateMsgModel.opts[this.imageKey] = res.data.url
          }
          else {
            this.getToast('图片限制'+_optSize[this.imageKey][0].width+'*'+_optSize[this.imageKey][0].height+'或者'+_optSize[this.imageKey][1].width+'*'+_optSize[this.imageKey][1].height);
          }
        }

      },
      beforeUpload(file){
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 < 401;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
//          this.getToast('上传图片大小不能超过 400KB!');
        }
        this.picUpload.file=file
//        return isJPG && isLt2M;
        return isJPG;
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
      float: left;
    }
    .label-sign{
      display: inline-block;
      width:100px;
      text-align: right;
    }
    .input-text{
      width: 300px;
    }
    .input-input{
      width: 200px;
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
      &.cate-img-large{
        width: 167px;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
