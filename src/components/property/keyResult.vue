<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button type="primary" @click="editProperty('1')" size="small">新增属性项</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;" >
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.key == 'isKeyProperty'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <span class="key-item key-red"  v-if="scope.row.isKeyProperty">关键</span>
              <span class="key-item key-green" v-if="scope.row.isSellProperty">销售</span>
              <span class="key-item key-blue" v-if="scope.row.isGoodsProperty">商品</span>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'isRequired'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              {{scope.row.isRequired ? '必填' : '非必填'}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'inputType'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              {{mapType.input[scope.row.inputType]}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'modifyType'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              {{mapType.modify[scope.row.modifyType]}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <template v-for="operaItem in item.items">
                <el-button v-if="operaItem.type== 'edit'" type="primary" @click="editProperty('2',scope.row.id)" size="small">{{operaItem.label}}</el-button>
                <el-button v-if="operaItem.type== 'manage'" type="primary" @click="manageProperty(scope.row.id)" size="small">管理属性值</el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="propertyEditModel.type == 1 ? '新增属性项' : '编辑属性项'" size="small" v-model="propertyEditModel.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <!--propertyEdit.name && propertyKeyCheck.isShow-->
      <div v-if="propertyEdit.name && propertyKeyCheck.isShow && propertyKeyCheck.list.length" class="property-key">
        <p v-for="item in propertyKeyCheck.list">
          {{item.name}}
        </p>
      </div>
      <template v-for="(item,idx) in propertyEditModel.items">
        <div class="mg-b">
          <span class="label-sign">{{item.label}}</span>
          <template v-if="item.type == 'items'">
            <template v-for="subItem in item.items">
              <el-checkbox v-model="propertyEdit[subItem.key]" :disabled="propertyEdit[subItem.changeKey]" v-if="subItem.type == 'check'">{{subItem.label}}</el-checkbox>
              <el-radio v-model="propertyEdit[subItem.key]" v-else-if="subItem.type == 'radio'" :label="subItem.val">{{subItem.label}}</el-radio>
            </template>
          </template>
          <el-input v-else-if="item.type == 'input'" @change="changeKey" v-model.trim="propertyEdit[item.key]" @focus="callPropertyValCheck(1,1)" @blur="callPropertyValCheck(1,2)" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" ></el-input>
          <el-select v-else-if="item.type == 'select'" v-model="propertyEdit[item.key]" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" >
            <template v-for="subItem in item.options">
              <el-option :label="subItem.label"  :value="subItem.value"></el-option>
            </template>
          </el-select>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelProperty">取 消</el-button>
        <el-button type="primary" @click="submitProperty">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="propertyManageModel.type == 1 ? '管理属性值' : (propertyManageModel.type == 2 ? (propertyManageModel.editType == 1 ? '新增属性值' : '编辑属性值') : '导入属性值')" size="small" v-model="propertyManageModel.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <template v-if="propertyManageModel.type == 1">
        <div class="block-box">
          <el-button  type="primary" @click="callAddVal('1')" size="small">新建属性值</el-button>
          <el-button  type="primary" @click="callImport" size="small">导入属性值</el-button>
          <!--icon="close" :on-icon-click="handleIconClick"-->
          <div class="inline-box pv-name-search" style="">
            <el-input v-model.trim="propertyManageModel.pvName"  style="margin:0 10px 0 120px;vertical-align: middle" class="input-item-large" size="small"  placeholder="请输入属性值名称"></el-input>
            <div class="pv-name-search-icon">
              <i class="el-icon-circle-close" @click="handleIconClick" ></i>
            </div>

          </div>
          <el-button type="primary" @click="searchPvName" size="small">查询</el-button>

        </div>
        <el-table :data="propertyValList" style="width: 100%;"  height="450">
          <el-table-column prop="pnName" label="属性项名称" align="center"></el-table-column>
          <el-table-column prop="propertyValueId" label="属性值ID"  align="center"></el-table-column>
          <el-table-column prop="pvName" label="属性值名称"  align="center"></el-table-column>
          <el-table-column prop="order" label="排序值"  align="center"></el-table-column>
          <el-table-column label="操作"  align="center">
            <template scope="scope">
              <el-button  type="primary" @click="callAddVal('2',scope.row)" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="item-box">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="propertyNamePage.page"
            :page-sizes="[10]"
            small
            :page-size="propertyNamePage.rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="propertyNamePage.total">
          </el-pagination>
        </div>
      </template>
      <template v-else-if="propertyManageModel.type == 2">
        <div class="block-box">
          <span class="label-sign" style="display: inline-block;width: 90px;padding-right: 4px">属性值名称</span>
          <el-input v-model.trim="propertyManageModel.name" @change="changeValue" @focus="callPropertyValCheck(2,1)" @blur="callPropertyValCheck(2,2)" class="input-item-large" size="small"></el-input>
          <div  class="block-box property-value-wrap" style="position: absolute;z-index:99;">
            <div v-if="propertyManageModel.name && propertyValCheck.isShow && propertyValCheck.list.length" class="property-value">
              <p v-for="item in propertyValCheck.list">
                {{item.name}}
              </p>
            </div>
          </div>
        </div>
        <div class="block-box" v-if="propertyManageModel.editType == 2">
          <span class="label-sign" style="display: inline-block;width: 90px;padding-right: 4px">排序值</span>
          <el-input v-model.trim="propertyManageModel.order"  class="input-item-large" size="small"></el-input>
        </div>
      </template>
      <template v-else-if="propertyManageModel.type == 3">
        <div class="block-box">

          <form method="post" id="importValue" ref="importValue" action="/goodsAdmin/goods/property/value/import2" enctype="multipart/form-data">
            <!--<span class="label-sign">请选择文件:</span>-->
            <!--<el-upload-->
              <!--style="display: inline-block"-->
              <!--:show-file-list="false"-->
              <!--action="/adminGoods/goods/property/value/import"-->
              <!--:data="importData"-->
              <!--:before-upload="handleBeforeUpload"-->
              <!--:on-success="handSuccess">-->
              <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <!--</el-upload>-->
            <input type="file" ref="importFile" id="file" @change="changeFile" name="importFile"/>
          </form>
        </div>
        <div class="block-box">
          <el-button size="small" @click="downTemp" type="primary">下载导入模板</el-button>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="propertyManageModel.type != 1" @click="saveManageModel(propertyManageModel.type)" size="small">保 存</el-button>
        <el-button size="small" v-if="propertyManageModel.type == 1" @click="cancelManageModel(propertyManageModel.type)">确 定</el-button>
        <el-button size="small" v-else="propertyManageModel.type == 1" @click="cancelManageModel(propertyManageModel.type)">取 消</el-button>
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
        input:{
          1:'单选(不可自定义)',
          2:'单选(允许自定义)',
          3:'多选(不可自定义)',
          4:'多选(允许自定义)',
          5:'文本输入框',
          6:'日期选择器',
          7:'时间选择器'
        },
        modify:{
          1:'可修改',
          2:'不可修改',
//          3:'不可修改'
        }
      },
      propertyEditModel:{
        isShow:false,
        type:1,
        items:[
          {
            label:'属性项名称',
            type:'input',
            key:'name',
            width:'180px'
          },
          {
            label:'属性项类型',
            type:'items',
            items:[
              {
                type:'check',
                label:'关键属性',
                placeholder:'关键属性',
                key:'isKeyProperty',
                changeKey:'relatedToCategoryKeyProperty'
              },
              {
                type:'check',
                label:'销售属性',
                placeholder:'销售属性',
                key:'isSellProperty',
                changeKey:'relatedToCategorySellProperty'
              },
              {
                type:'check',
                label:'商品属性',
                placeholder:'商品属性',
                key:'isGoodsProperty',
                changeKey:'relatedToCategoryGoodsProperty'
              }
            ],
          },
//          {
//            label:'是否必填',
//            type:'items',
//            items:[
//              {
//                type:'radio',
//                label:'必填',
//                placeholder:'关键属性',
//                key:'isRequired',
//                val:true,
//              },
//              {
//                type:'radio',
//                label:'非必填',
//                placeholder:'关键属性',
//                key:'isRequired',
//                val:false
//              },
//            ],
//          },
          {
            label:"属性值输入方式",
            type:'select',
            key:'inputType',
            width:'200px',
            options:[
              {
                value:1,
                label:'单选(不可自定义)'
              },
              {
                value:2,
                label:'单选(允许自定义)'
              },
              {
                value:3,
                label:'多选(不可自定义)'
              },
              {
                value:4,
                label:'多选(允许自定义)'
              },
              {
                value:5,
                label:'文本输入框'
              },
              {
                value:6,
                label:'日期选择器'
              },
              {
                value:7,
                label:'时间选择器'
              }

            ]
          },
          {
            label:'输入方式是否可修改',
            type:'items',
            items:[
              {
                type:'radio',
                label:'可修改',
                placeholder:'',
                key:'modifyType',
                val:1,
              },
              {
                type:'radio',
                label:'不可修改',
                placeholder:'',
                key:'modifyType',
                val:2
              },
//              {
//                type:'radio',
//                label:'不可修改',
//                placeholder:'',
//                key:'modifyType',
//                val:3
//              },
            ],
          }
        ]
      },
      propertyEdit:{
        name:'',
        isKeyProperty:false,
        isSellProperty:false,
        isGoodsProperty:false,
        isRequired:'',
        inputType:'',
        modifyType:'',
        relatedToCategoryGoodsProperty:false,
        relatedToCategoryKeyProperty:false,
        relatedToCategorySellProperty:false
      },
      propertyManageModel:{
        isShow:false,
        type:1, // 1 列表  2 编辑 3 导入
        name:'',
        pvName:'',
        order:'',
        editType:1,// 1 新建 2 修改
        propertyValueId:'',
        propertyNameId:'',
        propertyPairId:''
      },
      propertyValList:[],
      propertyValCheck:{
        isShow:false,
        list:[],
      },
      propertyKeyCheck:{
        isShow:false,
        list:[]
      },
      importData:{
        file:null
      },
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},
      hasChange:false,
      propertyNamePage:{
        page:1,
        rows:10,
        total:0,
        close:false
      },
      timeStr:0,
      isInputing:false
    }),
    methods:{
      ...mapActions(['setSearchParams','getKeyAttrList','getPropertyListDetail','saveProperty','savePropertyVal','setStartToast','getPropertyValList','downTemp','matchValueList','propertyValueImport','matchNameList']),
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
        this.changeValue = this.debounce(function(val){
          this.setChangeValue(val)
        }.bind(this),300)
        this.changeKey = this.debounce(function(val){
          this.setChangeKey(val)
        }.bind(this),300)
      },
      searchList(params){
        this.loading = true
        this.getKeyAttrList(params)
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
      /*
      * 新建编辑属性项
      * */
      editProperty(type,id){
        if(type == 2){
          let opts = {
            propertyNameId:id
          }
          this.getPropertyListDetail(opts)
            .then((rs)=>{
            this.propertyEdit = Object.assign({},this.propertyEdit,rs)
//              console.log(rs)
          })
        }
        this.propertyEditModel.type = type
        this.propertyKeyCheck.list = []
        this.propertyEditModel.isShow = true
      },
      submitProperty(){

        if(!this.propertyEdit.name){
          this.getToast('请输入属性项名称')
          return false
        }
        if(this.propertyEdit.name.length > 6){
          this.getToast('属性项名称长度小于6字符')
          return false
        }
        if(!(this.propertyEdit.isKeyProperty || this.propertyEdit.isSellProperty || this.propertyEdit.isGoodsProperty)){
          this.getToast('请选择属性项类型')
          return false
        }
        this.propertyEdit.isRequired = false
//        if(this.propertyEdit.isRequired === ''){
//          this.getToast('请选择是否必填')
//          return false
//        }
        if(!this.propertyEdit.inputType){
          this.getToast('请选择属性值输入方式')
          return false
        }
        if(!this.propertyEdit.modifyType){
          this.getToast('请选择属项特征是否可修改')
          return false
        }
        let _opts = Object.assign({},this.propertyEdit)

        delete _opts.relatedToCategoryGoodsProperty
        delete _opts.relatedToCategoryKeyProperty
        delete _opts.relatedToCategorySellProperty
        if(this.propertyEditModel.type == 1){
          delete _opts.id
        } else {
          delete _opts.valueCount
        }
//        console.log(_opts)
        this.saveProperty({rs:_opts,type:this.propertyEditModel.type})
          .then((rs)=>{
            if(rs){
              this.initView()
              this.cancelProperty()
            }
          })
      },
      cancelProperty(){
        this.propertyEditModel.isShow = false
        this.propertyEdit = {
          name:'',
          isKeyProperty:false,
          isSellProperty:false,
          isGoodsProperty:false,
          isRequired:'',
          inputType:'',
          modifyType:'',
          relatedToCategoryGoodsProperty:false,
          relatedToCategoryKeyProperty:false,
          relatedToCategorySellProperty:false
        }
      },
      searchPvName(){
        // if(!this.propertyManageModel.pvName){
        //   this.getToast('请输入属性值名称')
        //   return false
        // }
        if(this.propertyManageModel.pvName && this.propertyManageModel.pvName.length > 128){
          this.getToast('属性值名称过长')
          return false
        }
        this.propertyNamePage.close = true
        this.propertyNamePage.page = 1
        this.manageProperty(this.propertyManageModel.propertyNameId)
      },
      handleCurrentChange(val) {
        if(!this.propertyNamePage.close){
          this.propertyNamePage.page = val
          this.manageProperty(this.propertyManageModel.propertyNameId)
        }
      },
      handleIconClick(){
        this.propertyManageModel.pvName = ''
      },
      manageProperty(id){
        let opts = {
          page:this.propertyNamePage.page,
          rows:this.propertyNamePage.rows,
          propertyNameId:id,
          pvName:this.propertyManageModel.pvName
        }
        this.getPropertyValList(opts)
          .then((rs)=>{
            this.propertyNamePage.close = false
            this.propertyValList = rs.rows
            this.propertyManageModel.propertyNameId = id
            this.propertyNamePage.total = rs.total
            this.propertyManageModel.isShow = true
          })

      },
      callImport(){
        this.propertyManageModel.type = 3
      },
      callAddVal(type,row){
        this.propertyManageModel.type = 2
        this.propertyManageModel.editType = type
        if(type == 2){
          this.propertyManageModel.name = row.pvName
          this.propertyManageModel.order = row.order
          this.propertyManageModel.propertyValueId = row.propertyValueId
          this.propertyManageModel.propertyPairId = row.id
        }
      },
      //是否显示下拉框
      callPropertyValCheck(key,type){
        switch (key){
          case 1:
            this.propertyKeyCheck.isShow = type == 1 ? true : false
            break
          case 2:
            this.propertyValCheck.isShow = type == 1 ? true : false
            break
        }
      },
      debounce(func, wait, immediate) {
        let _this = this
        var timeout;
        return function() {
          var context = _this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },
//       changeValue(val){
//         let _time = new Date().getTime()
// //        if(_time - this.timeStr < 100){
// //          this.isInputing = true
// //        }
// //        this.timeStr = _time
// //        this.debounce(function(){
// //          this.isInputing = false
// //        },200)()
//         this.debounce(function(){
//           this.setChangeValue(val)
//         },300)()
//       },
//       changeKey(val){
//         this.debounce(this.setChangeKey(val),300)
//       },
      setChangeValue(val){
        if(!val){
          this.propertyValCheck.list = []
            return false
        }
//        if(this.isInputing){
//            return false
//        }
////        console.log(this.propertyManageModel.propertyNameId)
//        return false
        const opts = {
          propertyNameId:this.propertyManageModel.propertyNameId,
          propertyValue:val,
          preMatch:false
        }
        this.matchValueList(opts)
          .then((rs)=>{
            this.propertyValCheck.list = rs
          })
      },
      setChangeKey(val){
        if(!val){
          this.propertyKeyCheck.list = []
          return false
        }

        const opts = {
          propertyName:val,
          preMatch:false
        }
        this.matchNameList(opts)
          .then((rs)=>{
            this.propertyKeyCheck.list = rs
          })
      },
      handleBeforeUpload(file){
        const sType = file.name.split('.')[1]
        if(!sType){
          this.getToast('格式错误');
          return false
        }
        this.importData.file = file;
        return false
      },
      handSuccess(data){
        if(data.code == '1'){

        }
        else{
          this.getToast('格式错误');
        }
      },
      cancelManageModel(type){
          switch(type){
            case 1:
              this.propertyManageModel.type = 1
              this.propertyManageModel.propertyNameId = ''
              this.propertyManageModel.pvName = ''
              this.propertyManageModel.isShow = false
              this.propertyNamePage.close = true
              this.propertyNamePage.page = 1
              this.propertyNamePage.rows = 10
              this.propertyNamePage.total = 0
              if(this.hasChange){
                this.initView()
                this.hasChange = false
              }
              break;
            case 2:
              this.propertyManageModel.type = 1
              this.propertyManageModel.editType = 1
              this.propertyManageModel.name = ''
              this.propertyManageModel.propertyValueId = ''
              break;
            case 3:
              this.propertyManageModel.type = 1
              this.importData.file = null
              break;
          }
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
      saveManageModel(type){
        switch(type){
          case 1:
            this.cancelManageModel(1)
            break;
          case 2:
            let opts = {},
                _type = 1;
            if(!this.propertyManageModel.name){
              this.getToast('请输入属性值名称')
              return false
            }
            if(this.propertyManageModel.name.length > 128){
              this.getToast('属性值名称长度过长')
              return false
            }
            if(this.propertyManageModel.editType == 1){
                opts = {
                  propertyNameId:this.propertyManageModel.propertyNameId,
                  valueName:this.propertyManageModel.name
                }
              _type = 1
            }
            else {
              if(!(this.propertyManageModel.order+'')){
                this.getToast('请输入排序值')
                return false
              } else if(!(this.propertyManageModel.order+'').match(RegExpType.NumEZ)){
                this.getToast('排序值格式不正确')
                return false
              } else if(this.propertyManageModel.order.length > 10){
                this.getToast('排序值把不超过10位')
                return false
              }
              opts = {
                propertyPairId:this.propertyManageModel.propertyPairId,
                pvName:this.propertyManageModel.name,
                order:this.propertyManageModel.order
              }
              _type = 2
            }
            this.savePropertyVal({rs:opts,type:_type})
              .then((rs)=>{
                if(rs){
                  this.propertyManageModel.type = 1
                  if(this.propertyManageModel.editType == 1){
                    this.propertyNamePage.page = 1
                  }
                  this.manageProperty(this.propertyManageModel.propertyNameId)
                  this.propertyManageModel.name = ''
                  this.propertyManageModel.order = ''
                  this.propertyManageModel.propertyPairId =  ''
                  this.hasChange = true
                }
              })
            break;
          case 3:
            let filePath = this.$refs.importFile.value;
            if(!filePath){
              this.getToast('请选择文件')
              return false
            }
            this.$refs.importValue.submit()
            this.hasChange = true
            this.propertyManageModel.type = 1
//              document.querySelector('#importValue')
//            if(!this.importData.file){
//              this.getToast('请选择文件')
//              return false
//            }
//            this.propertyValueImport({importFile:this.importData.file})
//              .then((rs)=>{
////                this.hasChange = true
////                this.cancelManageModel(1)
////                if(rs.errorCount)
////                rs.successCount
////                rs.ignoreCoun
////                rs.errorCount
//              })
            break;
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
  .key-item{
    display: inline-block;
    padding: 2px 6px;
    color: #fff;
    /*background-color: #eee;*/
    border-radius: 2px;
    &.key-red{
      background-color: #fb4b4d;
    }
    &.key-green{
      background-color: #11b95c;
    }
    &.key-blue{
      background-color: #0082e6;
    }
  }
  .property-key{
    position: absolute;
    top: 105px;
    left: 128px;
    width: 180px;
    max-height: 120px;
    overflow-y: scroll;
    border: 1px solid rgb(229, 211, 209);
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    z-index: 9;
    p{
      padding: 4px 0 4px 20px;
    }
  }
  .property-value-wrap{
    position: relative;
    height: 80px;
  }
  .property-value{
    position: absolute;
    top:-2px;
    left: 98px;
    width: 200px;
    max-height: 120px;
    overflow-y: scroll;
    border: 1px solid rgb(229, 211, 209);
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    p{
      padding: 4px 0 4px 20px;
    }
  }
  .pv-name-search{
    position: relative;
    >.pv-name-search-icon{
      display: none;
      position: absolute;
      width: 30px;
      height: 30px;
      line-height: 30px;
      top:0;
      right:0;
      >i{
        color:rgb(217, 193, 191);
        &:hover{
          color:rgb(190,156,151);
          cursor: pointer;

        }
      }
    }
    &:hover{
      >.pv-name-search-icon{
        display: block;
      }
    }
  }
</style>
