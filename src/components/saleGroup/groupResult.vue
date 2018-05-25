<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button type="primary" @click="callGroupStatus" size="small">启用/停用</el-button>
      <el-button type="primary" @click="callEditGroup(1)" size="small">新建销售组合</el-button>
    </div>
    <div class="item-table">
      <el-table ref="saleTable" v-loading="loading" element-loading-text="拼命加载中" border @selection-change="handleSelectionChange" :data="searchResult.rows" style="width: 100%;">
        <el-table-column type="selection" align="center" width="55">

        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.type == 'image'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="table-image" style="margin-top: 10px">
                <img v-if="channelConfigStates.channel == 1" :src="scope.row[item.key]" style="width: 142px;height: 66px" alt="">
                <img v-else :src="scope.row[item.key]" style="width: 142px;height: 80px" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.type == 'status'" :width="item.width" label="启用状态"  align="center">
            <template scope="scope">
              <span v-if="scope.row.status == 1">启用</span>
              <span v-else class="c-red">停用</span>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.type == 'saleLabels'" :width="item.width" label="组合标签"  align="center">
            <template scope="scope">
              <span v-for="(item,idx) in scope.row.labels">
                {{item.name}} <span v-if="idx != scope.row.labels.length - 1">;</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.type == 'opera'" :width="item.width" label="操作"  align="center">
            <template scope="scope">
              <div style="margin: 5px 0">
                <el-button size="small" @click="callGetGroupDetail(scope.row.id)" type="primary" >编辑组合</el-button>
              </div>
              <div style="margin: 5px 0">
                <a :href="'/#/saleGroup/list?saleSetsCode='+scope.row.saleSetsCode+'&channel='+channelConfigStates.channel" target="_blank">
                  <el-button size="small" type="primary" >组合商品</el-button>
                </a>
              </div>


            </template>
          </el-table-column>
          <el-table-column  v-else :prop="item.key" :label="item.label" :width="item.width"  align="center">

          </el-table-column>

        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="saleGroupModel.type == 1 ? '新建销售组合' : '编辑销售组合'" size="large" v-model="saleGroupModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <span class="label-sign"><span class="c-red">*</span>组合标题</span>
        <el-input v-model.trim="saleGroupModel.opts.title" :maxlength="10" class="input-item-large" style="width: 600px" size="small" placeholder="将展示给用户，请认真填写，限10字"></el-input>
      </div>
      <div class="block-box label-float-layout">
        <div class="label-sign-wrap">
          <span class="label-sign"><span class="c-red">*</span>卖点文案</span>
        </div>
        <el-input type="textarea" :maxlength="100" :rows="4" style="width: 600px" v-model.trim="saleGroupModel.opts.sellingPoint" class="input-item-large" size="small" placeholder="组合卖点描述，限100字"></el-input>
        <span class="c-red">{{saleGroupModel.opts.sellingPoint.length}}</span> /100

      </div>
      <div class="block-box label-float-layout">
        <div class="label-sign-wrap">
          <span class="label-sign"><span class="c-red">*</span>组合标签</span>
        </div>
        <div class="group-label-box">
          <div class="tag-item" v-for="(tag,idx) in saleGroupModel.opts.labels">
            <p>{{tag.name}}</p>
            <i class="tag-close" @click="handleCloseTag(idx)">x</i>
          </div>
          <!--<el-tag :key="tag" class="tag-item" v-for="(tag,idx) in saleGroupModel.opts.labels" :closable="true" :close-transition="false" @close="handleCloseTag(idx)">-->
            <!--{{tag.name}}-->
          <!--</el-tag>-->
          <template v-if="saleGroupModel.opts.labels.length < 10">
            <el-input class="tag-item-input"
                      v-if="saleGroupModel.inputVisible"
                      v-model.trim="saleGroupModel.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm">
            </el-input>
            <div v-else class="tag-item tag-item-btn" @click="showInput">
              <p>新增</p>
            </div>
            <!--<el-button v-else class="tag-item-input" size="small" @click="showInput"></el-button>-->
          </template>

        </div>

      </div>
      <div class="block-box">
        <span class="label-sign"><span class="c-red">*</span>组合Banner图</span>
        <el-upload style="display: inline-block" action="/goodsAdmin/goods/file/imageUpload" :data="picUpload" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
          <el-button size="small" type="primary">上传图片</el-button>
        </el-upload>
        <span class="c-dis c-tip mg-l-h">
          尺寸限制：
          <span v-if="channelConfigStates.channel == 1">750x358</span>
          <span v-else-if="channelConfigStates.channel == 2">710x400</span>
          <span v-else-if="channelConfigStates.channel == 8">710x400</span>
        </span>
        <div class="banner-wrap">
          <div :class="[
          'avatar-wrap',
          channelConfigStates.channel == 1 ? 'ggj' : channelConfigStates.channel == 2 ? 'hqbs' : 'mbyd'
          ]">
            <template v-if="saleGroupModel.opts.bannerUrl">
              <img  :src="saleGroupModel.opts.bannerUrl" class="avatar">
              <div class="avatar-menu">
                <i class="el-icon-search" @click="showProductImage(saleGroupModel.opts.bannerUrl)"></i>
                <i class="el-icon-delete" @click="delProductImage()"></i>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="block-box">
        <span class="label-sign"><span class="c-red">*</span>渠道销售类型</span>
        <el-select :disabled="saleGroupModel.type == 2 ? true : false" v-model="saleGroupModel.opts.saleTypeId"   class="input-item-middle" size="small"  placeholder="请选择">
          <!--<template v-for="(item,idx) in channelConfig.opts">-->
            <!--<el-option  :label="item.label" :value="item.value"></el-option>-->
          <!--</template>-->
          <template v-for="subItem in saleWayList">
            <el-option :label="subItem.name" :value="subItem.code"></el-option>
          </template>
          <!--<el-option  label="分销" :value="2"></el-option>-->
          <!--<el-option  label="拼团" :value="3"></el-option>-->

        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroup">保存</el-button>
        <el-button @click="cancelGroup">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="saleGroupStatusModel.type == 1 ? '设置销售组合停用' : '设置销售组合启用'" size="tiny" v-model="saleGroupStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{saleGroupStatusModel.list.length}} 个【{{saleGroupStatusModel.type == 1 ? '启用' : '停用'}}】组合，是否将其设置为【{{saleGroupStatusModel.type == 1 ? '停用' : '启用'}}】？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroupStatus">确认</el-button>
        <el-button @click="cancelGroupStatus">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'

  export default{
    computed:{
      ...mapState(['channelConfigStates','searchConfig','searchParams','saleWayList','roleMenuDetail'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      loading:false,
      mapSaleType:{
        1:'常规',
        2:'分销',
        3:'拼团',
        4:'积分换购'
      },
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},
      mapChannels:{
        1:'格格家',
        2:'环球捕手',
        3:'燕网',
        4:'第三方',
        5:'B2B',
        6:'脉宝云店',
        7:'燕窝酵素',
        8:'美食买手'
      },
      batchList:[],
      saleGroupModel:{
        isShow:false,
        type:1,
        opts:{
          id:'',
          title:'',
          saleSetsCode:'',
          sellingPoint:'',
          bannerUrl:'',
          saleTypeId:1,
          channel:'',
          status:'',
          labels:[
            {
              id:'',
              name:'asf'
            }
          ]

        },
        inputVisible: false,
        inputValue: ''

      },
      saleGroupStatusModel:{
        type:'',
        list:[],
        isShow:false
      },
      picUpload:{
        file:null
      }
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast','getSaleGroupList','setViewImage','saveGroup','getGroupDetail','setGroupStatus']),
      initView(){

        let _opts = {
          channel : this.channelConfigStates.channel
        }
        const query = UtilTool.parseQuery(this.$route.query)
        const params = Object.assign({},this.searchParams,query,_opts)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        return new Promise((reslove)=>{
          this.getSaleGroupList(params)
            .then((item)=>{
              this.searchResult = item
              reslove()
              this.setPage()
            },()=>{
              this.loading = false
            })
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
      //获取详情
      callGetGroupDetail(id){
        let _opts = {
            id
        }
        this.getGroupDetail(_opts)
          .then((rs)=>{
            this.callEditGroup(2,rs)
          })
      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      //启用停用
      callGroupStatus(){
        if(!this.batchList.length){
          this.getToast('请选择销售组合')
          return false
        }
        let _status = this.batchList[0].status
        for(let i = 1,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i].status != _status){
            this.$alert('请选择启用/停用状态一致的组合进行批量操作', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
        }
        this.saleGroupStatusModel.type = _status
        this.saleGroupStatusModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.saleGroupStatusModel.isShow = true
      },
      submitGroupStatus(){
        let _list = []
        this.saleGroupStatusModel.list.map((item)=>{
          _list.push(item.id)
        })
        let _opts = {
            list:_list
        }
        this.setGroupStatus(_opts)
          .then((rs)=>{
            this.cancelGroupStatus()
            this.initView()
          })

      },
      cancelGroupStatus(){
        this.saleGroupStatusModel.isShow = false
      },
      //调用编辑
      callEditGroup(type,rs){
        this.saleGroupModel.type = type
        this.saleGroupModel.opts = {}
        let _opt = {
          id:'',
          title:'',
          saleSetsCode:'',
          sellingPoint:'',
          bannerUrl:'',
          saleTypeId:this.saleWayList.length ? this.saleWayList[0].code : '',
          channel:this.channelConfigStates.channel,
          status:'',
          labels:[]
        }
        if(type == 2){
          this.saleGroupModel.opts = Object.assign({},_opt,rs)
        } else {
          this.saleGroupModel.opts = Object.assign({},_opt,rs)
        }

        this.saleGroupModel.isShow = true

      },
      handleCloseTag(idx){
        this.saleGroupModel.opts.labels.splice(idx,1)
      },
      showInput() {
        this.saleGroupModel.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.saleGroupModel.inputValue;
        for(let i = 0,_len = this.saleGroupModel.opts.labels.length;i<_len;i++){
          let _item = this.saleGroupModel.opts.labels[i]
          if(_item.name == inputValue){
            this.getToast('组合标签已存在')
            this.saleGroupModel.inputValue = '';
            return false
          }
        }

        if(inputValue.length > 10){
          this.getToast('组合标签限定10字')
          this.saleGroupModel.inputValue = '';
          return false
        }
        if (inputValue) {
          let _opt = {
            id:'',
            name:inputValue
          }
          this.saleGroupModel.opts.labels.push(_opt);
          this.saleGroupModel.inputVisible = false;
          this.saleGroupModel.inputValue = '';
        }
      },
      //查看sku主图
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      //删除sku主图
      delProductImage(item){
        this.saleGroupModel.opts.bannerUrl = ''
      },
      handleSuccess(res){
        if(res.code != 1){
          this.getToast('上传失败')
          return false
        }
        let _optSize = {
          width:'',
          height:''
        }
        if(this.channelConfigStates.channel == 1){
          _optSize.width = 750
          _optSize.height = 358
        } else {
          _optSize.width = 710
          _optSize.height = 400
        }
        if(res.data.width != _optSize.width || res.data.height != _optSize.height){
          this.getToast('图片限制'+_optSize.width+'*'+_optSize.height);
          return false;
        }

        this.saleGroupModel.opts.bannerUrl = res.data.url



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
      submitGroup(){
        if(!this.saleGroupModel.opts.title){
            this.getToast('请输入销售组合标题')
            return false
        } else if(this.saleGroupModel.opts.title.length > 10){
          this.getToast('销售组合标题限制10字')
          return false
        } else if(!this.saleGroupModel.opts.sellingPoint){
          this.getToast('请输入销售组合卖点')
          return false
        } else if(this.saleGroupModel.opts.sellingPoint.length > 100){
          this.getToast('销售组合卖点限制100字')
          return false
        } else if(!this.saleGroupModel.opts.labels.length){
          this.getToast('请输入销售组合标签')
          return false
        } else if(!this.saleGroupModel.opts.bannerUrl){
          this.getToast('请上传销售组合Banner图')
          return false
        } else if(!this.saleGroupModel.opts.saleTypeId){
          this.getToast('请输入销售组合渠道销售类型')
          return false
        }
        let _opts = JSON.parse(JSON.stringify(this.saleGroupModel.opts))
        if(this.saleGroupModel.type == 1){
          delete _opts.id
          delete _opts.saleSetsCode
          delete _opts.status
        }
        this.saveGroup(_opts)
          .then((rs)=>{
            if(rs){
              this.cancelGroup()
              this.initView()
            }
          })
      },
      cancelGroup(){
        this.saleGroupModel.isShow = false
      },

    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
          this.initView();
        }
      },
      'createGoodsModel.createType':function(){
          this.changeLink()
      }
    },
    components: {
      vPagination
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .t-l{
    padding-left: 20px;
    p{

    }
  }
  .label-sign{
    width: 120px;
  }
  .label-float-layout{
    position: relative;
    overflow: hidden;
    .label-sign-wrap{
      float: left;
      .label-sign{
        display: inline-block;
        line-height: 30px;
      }
    }
  }
  .banner-wrap{
    margin-top: 20px;
    padding-left: 125px;

  }
  .avatar-wrap{
    position: relative;
    display: inline-block;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    background-color: #eee;
    .avatar {
      width: 100%;
      height: 100%;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      text-align: center;
      top:0;
      right:0;
      background-color: rgba(0,0,0,.5);
      i{
        cursor: pointer;
        padding: 0 10px;
        font-size: 20px;
        color: #8c939d;
      }
    }
    &:hover{
      .avatar-menu{
        display: block;
      }
    }
    &.ggj{
      width: 375px;
      height: 179px;
      .avatar-menu{
        width: 375px;
        height: 179px;
        line-height: 179px;
      }
    }
    &.hqbs,&.mbyd{
      width: 355px;
      height: 200px;
      .avatar-menu{
        width: 355px;
        height: 200px;
        line-height: 200px;
      }

    }
  }
  .group-label-box{
    display: inline-block;
    width: 620px;
  }
  .tag-item{
    position: relative;
    display: inline-block;
    min-width: 100px;
    height: 30px;
    margin: 0 20px 10px 0;
    line-height: 30px;
    text-align: center;
    border:1px solid #eee;
    border-radius: 4px;
    >p{
      /*white-space: nowrap;*/
      /*overflow: hidden;*/
      /*text-overflow: ellipsis;*/
    }
    .tag-close{
      position: absolute;
      width: 12px;
      height: 12px;
      line-height: 9px;
      top:-7px;
      right:-7px;
      display: inline-block;
      color: #ddd;
      border:1px solid #ddd;
      border-radius: 50%;
      cursor: pointer;
      background-color: #fff;
      &:hover{
        color: #999;
        border:1px solid #999;
      }
    }
  }
  .tag-item-input{
    /*overflow: hidden;*/
    width: 100px;
  }
  .tag-item-btn:hover{
    cursor: pointer;
  }
</style>
