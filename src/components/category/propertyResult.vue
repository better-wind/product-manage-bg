<template>
  <div class="item-box">
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;" >
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.key == 'opera'"  :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <el-button type="primary"  @click="callProperManage(scope.row)" size="small">类目属性明细</el-button>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'pathName'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <span>{{scope.row.pathName.split(',').join(' - ')}}</span>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="cateTitle" size="large" v-model="propertyDetailModel.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <template v-for="(property,idx) in detailResult">
        <div class="item-box proper-box">
          <div class="block-item proper-title">
            {{property.label}} <el-button type="primary"  @click="addPropertyName(property.type)" size="small">新增属性</el-button>
            <template v-if="property.key == 'saleProperties'">
              <!--{{skuImageOpts.isRequiredImage}}-->
              <el-button  type="primary"  @click="editSkuImage()" size="small">单独上传SKU主图</el-button>
              <span v-if="skuImageOpts.isRequiredImage && skuImageOpts.skuImagePropertyNameId">(已选择单独上传SKU主图销售属性:{{skuImageOpts.skuImagePropertyName}})</span>
              <span v-else>(未选择单独上传SKU主图销售属性)</span>
            </template>
           </div>
          <div class="block-item" style="padding: 5px 0" v-for="(item,subIdx) in property.list">
            <span class="label-sign">{{item.propertyName}}</span>
            <!--:disabled="item.modifyType == 2"-->
            <el-select v-if="property.key == 'goodsProperties'" v-model="item.isRequired"  class="input-item-middle" size="small">
              <el-option label="必填" :value=true></el-option>
              <el-option label="非必填" :value=false></el-option>
            </el-select>
            <el-select v-if="item._select" :disabled="item.modifyType == 2" v-model="item.inputType"  class="input-item-middle" size="small">
              <el-option label="多选(不可自定义)" :value=3></el-option>
              <el-option label="多选(允许自定义)" :value=4></el-option>
            </el-select>
            <template v-else>
              <template v-if="property.key == 'saleProperties'">
                <el-select :disabled="item.modifyType == 2" v-model="item.inputType"  class="input-item-middle" size="small">
                  <el-option label="多选(允许自定义)" :value=4></el-option>
                </el-select>
              </template>
              <el-select v-else :disabled="item.modifyType == 2" v-model="item.inputType"  class="input-item-middle" size="small">
                <el-option label="单选(不可自定义)" :value=1></el-option>
                <el-option label="单选(允许自定义)" :value=2></el-option>
                <el-option label="多选(不可自定义)" :value=3></el-option>
                <el-option label="多选(允许自定义)" :value=4></el-option>
                <el-option label="文本输入框" :value=5></el-option>
                <el-option label="日期选择器" :value=6></el-option>
                <el-option label="时间选择器" :value=7></el-option>
              </el-select>
            </template>

            <el-button size="small" :disabled="item.isUsedInSKU" @click="delPropertyItem(idx,subIdx)">删除</el-button>
            <!--<el-button size="small"  @click="delPropertyItem(idx,subIdx)">删除</el-button>-->
            <template v-if="item.inputType >= 5"></template>
            <!--<el-button v-if="item.inputType == 5" @click="editPropertyValue(1,idx,subIdx)" type="primary" size="small">查看类目属性值</el-button>-->
            <template v-else>
              <el-button  type="primary" @click="editPropertyValue(2,idx,subIdx)" size="small">管理类目属性值</el-button>
              已选类目属性值数：{{item.propertyPairs ? item.propertyPairs.length : 0}}
            </template>
          </div>

        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="saveManageModel" size="small">保 存</el-button>
        <el-button size="small" @click="cancelManageModel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog size="tiny" :title="'新增'+propertyEditTitle+'属性项'" v-model="propertyEdit.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div class="block-item">
        <span class="label-sign">选择属性项</span>
        <el-select filterable remote :remote-method="remoteMethod"  v-model="propertyEdit.nameOpts.propertyNameId"  class="input-item-middle" size="small"  placeholder="请输入属性项">
          <template v-for="subItem in propertyNameList">
            <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code"></el-option>
          </template>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="saveEditModel(1)" size="small">保 存</el-button>
        <el-button size="small" @click="cancelEditModel(1)">取 消</el-button>
      </div>

    </el-dialog>
    <el-dialog size="small" :title="cateTitle"  v-model="propertyValueEdit.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div class="block-box" v-if="propertyValueEdit.type == 2">
        <el-button type="primary"  @click="addPropertyValue(propertyValueEdit.nameId)" size="small">新增属性值</el-button>
      </div>
      <div class="item-table">
        <el-table   :data="propertyValueEdit.list" style="width: 100%;" >
          <el-table-column prop="pnName" label="属性项名称"  align="center"></el-table-column>
          <el-table-column prop="propertyValueId" label="属性值ID"  align="center"></el-table-column>
          <el-table-column prop="pvName" label="属性值名称"  align="center"></el-table-column>
          <el-table-column v-if="propertyValueEdit.type == 2" label="操作"  align="center">
            <template scope="scope">
              <el-button type="primary"  @click="delPropertyValue(scope)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" v-if="propertyValueEdit.type == 2" @click="saveEditModel(2)" size="small">保存</el-button>-->
        <!--<el-button size="small" v-if="propertyValueEdit.type == 1" @click="cancelEditModel(2)">取 消</el-button>-->
        <el-button type="primary"  @click="saveEditModel(2)" size="small">保 存</el-button>
        <el-button size="small"  @click="cancelEditModel(2)">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog size="small" v-model="propertyValueAdd.isShow"  :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <!--<div class="block-box">-->
        <!--<el-button type="primary"  @click="batchPropertyValue()" size="small">选中属性值</el-button>-->
      <!--</div>-->
      <div class="item-table">
        <el-table  :data="propertyValueAdd.list" height="450" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" :selectable="selectable" width="55">

          </el-table-column>
          <el-table-column prop="pnName" label="属性项名称"  align="center"></el-table-column>
          <el-table-column prop="propertyValueId" label="属性值ID"  align="center"></el-table-column>
          <el-table-column prop="pvName" label="属性值名称"  align="center"></el-table-column>
        </el-table>
      </div>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="batchPropertyValue()" size="small">选中属性值</el-button>
        <!--<el-button type="primary"  @click="saveEditModel(3)" size="small">保 存</el-button>-->
        <el-button size="small" @click="cancelEditModel(3)">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog size="small" v-model="skuImageModel.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div class="block-box">
        <span class="label-sign">是否单独上传SKU主图</span>
        <el-radio v-model="skuImageModel.opts.isRequiredImage"  :label=true>是</el-radio>
        <el-radio v-model="skuImageModel.opts.isRequiredImage"  :label=false>否</el-radio>
        <br />
        <span v-if="!skuImageModel.opts.isRequiredImage">（选否则SKU主图默认为第1张商品主图）</span>
      </div>
      <div class="block-box" v-if="skuImageModel.opts.isRequiredImage">
        <span  class="label-sign">单独上传SKU主图的属性项</span>
        <el-select  v-model="skuImageModel.opts.skuImagePropertyNameId"  class="input-item-middle" size="small"  placeholder="请输入属性项">
          <template v-for="subItem in skuImageModel.options">
            <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code"></el-option>
          </template>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="saveEditModel(4)" size="small">保 存</el-button>
        <el-button size="small" @click="cancelEditModel(4)">取 消</el-button>
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
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},
      propertyEditTitle:'',
      propertyDetailModel:{
        isShow:false,
        categoryId:''
      },
      propertyEdit:{
        isShow:false,
        type:'',
        nameOpts:{
          propertyNameId:''
        }
      },
      propertyValueEdit:{
        isShow:false,
        nameId:'',
        type:2,// 2 管理 1 查看
        idx:{
          idx:'',
          subIdx:''
        },
        list:[],
        inputType:''
      },
      propertyValueAdd:{
        isShow:false,
        list:[],
        batchList:[],
        inputType:''
      },
      propertyNameList:[],
      detailResult:[],
      skuImageOpts:{
        isRequiredImage:false,//是否需要上传SKU主图, false否，true是
        skuImagePropertyNameId:'',//sku主图属性名id
        skuImagePropertyName:''//sku主图属性名
      },
      skuImageModel:{
        isShow:false,
        options:[],
        opts:{
          isRequiredImage:false,//是否需要上传SKU主图, false否，true是
          skuImagePropertyNameId:'',//sku主图属性名id
          skuImagePropertyName:''//sku主图属性名id
        }
      },
      cateTitle:'',
      propertyNamePage:{
        page:1,
        rows:10,
        total:0,
        close:false
      }

    }),
    methods:{
      ...mapActions(['setSearchParams','getPropertyManagerList','setStartToast','getPropertyDetail','matchNameList',
      'savePropertyName','getPropertyValList','getPropertyListDetail','savePropertyDetail']),
      initView(){
       const query = UtilTool.parseQuery(this.$route.query)
       const params = UtilTool.paramsAssign(query,this.searchParams)
//        this.callProperManage(7)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getPropertyManagerList(params)
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
      //明细管理
      callProperManage(row){
        let id = row.id
        this.cateTitle = row.pathName.split(',').join('-')
        this.getPropertyDetail({categoryId:id})
          .then((rs)=>{
            this.skuImageOpts.isRequiredImage = rs.isRequiredSKUImage || false
            this.skuImageOpts.skuImagePropertyNameId =this.skuImageOpts.isRequiredImage ? rs.skuImagePropertyId : ''
            this.skuImageOpts.skuImagePropertyName = this.skuImageOpts.isRequiredImage ? rs.skuImagePropertyName : ''

            this.detailResult.push({list:rs.keyProperties || [],key:'keyProperties',label:'关键属性',type:1})
            this.detailResult.push({list:rs.saleProperties || [],key:'saleProperties',label:'销售属性',type:2})
            this.detailResult.push({list:rs.goodsProperties || [],key:'goodsProperties',label:'商品属性',type:3})
            this.detailResult.map((item)=>{
              item.list.map((subItem)=>{
                  subItem.propertyPairs = subItem.propertyPairs || []
                  if(item.key == 'saleProperties'){
                    subItem.inputType = 4
                    subItem.modifyType = 2
                  }
                  if(subItem.inputType == 3 || subItem.inputType == 4){
                    subItem._select = true
                  }

              })
            })
            this.propertyDetailModel.isShow = true
            this.propertyDetailModel.categoryId = id
          })
      },
      //删除属性项
      delPropertyItem(idx,sIdx){
        if(idx == 1){
          let id = this.detailResult[idx].list[sIdx].propertyNameId
          if(id == this.skuImageOpts.skuImagePropertyNameId){
            this.skuImageOpts = {
              isRequiredImage:false,
              skuImagePropertyNameId:'',
              skuImagePropertyName:''
            }
            this.skuImageModel.opts = {
              isRequiredImage:false,
              skuImagePropertyNameId:'',
              skuImagePropertyName:''
            }
          }
        }
        this.detailResult[idx].list.splice(sIdx,1)
      },
      //管理属性值
      editPropertyValue(type,idx,sIdx){
        this.propertyValueEdit.type = type
        this.propertyValueEdit.isShow = true
        this.propertyValueEdit.idx.idx = idx
        this.propertyValueEdit.idx.subIdx = sIdx
        this.propertyValueEdit.nameId = this.detailResult[idx].list[sIdx].propertyNameId
        this.propertyValueEdit.list = JSON.parse(JSON.stringify(this.detailResult[idx].list[sIdx].propertyPairs))
        this.propertyValueEdit.inputType = this.detailResult[idx].list[sIdx].inputType
      },
      //删除属性值
      delPropertyValue(sIdx){
        this.propertyValueEdit.list.splice(sIdx.$index,1)
      },
      selectable(row){
        let check = {}
        this.propertyValueEdit.list.map((item)=>{
          check[item.propertyValueId] = item.propertyValueId
        })
        return check[row.propertyValueId] ? false : true
      },
      //新增属性值
      addPropertyValue(id){
        let opts = {
          page:this.propertyNamePage.page,
          rows:this.propertyNamePage.rows,
          propertyNameId:id
        }
        this.propertyNamePage.close = false
        this.getPropertyValList(opts)
          .then((rs)=>{
//            let check = {}
//            this.propertyValueEdit.list.map((item)=>{
//              check[item.propertyValueId] = item.propertyValueId
//            })
            this.propertyNamePage.total = rs.total
//            this.propertyValueAdd.list = rs.rows.filter((item)=>!check[item.propertyValueId])
            this.propertyValueAdd.list = rs.rows
            this.propertyValueAdd.isShow = true
            this.propertyValueAdd.inputType = this.propertyValueEdit.inputType

          })
      },
      handleCurrentChange(val) {
        if(!this.propertyNamePage.close){
          this.propertyNamePage.page = val
          this.addPropertyValue(this.propertyValueEdit.nameId)
        }

      },
      //批量
      handleSelectionChange(list){
        this.propertyValueAdd.batchList = list;
      },
      //批量添加
      batchPropertyValue(){
        if(!this.propertyValueAdd.batchList.length){
          this.getToast('请选择属性值')
          return false
        }

        let _length = this.propertyValueEdit.list.length + this.propertyValueAdd.batchList.length,
            _check = this.checkValLength(_length,this.propertyValueAdd.inputType)
        if(_check){
          this.getToast(_check)
          return false
        }
        let list = JSON.parse(JSON.stringify(this.propertyValueAdd.batchList))
        Array.prototype.push.apply(this.propertyValueEdit.list,list)
        this.propertyValueEdit.list.push({})
        this.propertyValueEdit.list.pop()
//        console.log(this.propertyValueEdit.list)
        this.cancelEditModel(3)
      },
      checkValLength(_length,val,_name){
        let name = _name || ''
        let _check = ''
        switch (val){
          case 1:
            if(!_length){
              _check = '请选择'+name+'属性值'
            }
            break
          case 2:
            if(!_length){
              _check = '请选择'+name+'属性值'
            }
            if(_length > 10){
              _check = name+'属性值不可超过10个，请选择不可输入的单选框'
            }
            break
          case 3:
            if(!_length){
              _check = '请选择'+name+'属性值'
            }
            if(_length > 40){
              _check = name+'属性值不可输入多选不可超过40个'
            }
            break
          case 4:
            if(!_length){
              _check = '请选择'+name+'属性值'
            }
            if(_length > 20){
              _check = name+'属性值可输入多选不可超过20个,请选择不可输入多选框'
            }
            break
        }
        return _check
      },
      //sku图片
      editSkuImage(){
        if(!this.detailResult[1].list.length){
          this.getToast('请添加销售属性')
          return false
        }
////        console.log(this.skuImageOpts)
        this.skuImageModel.opts.isRequiredImage = this.skuImageOpts.isRequiredImage
        this.skuImageModel.opts.skuImagePropertyNameId = this.skuImageOpts.skuImagePropertyNameId
        this.skuImageModel.isShow = true
        this.skuImageModel.options = []
        this.detailResult[1].list.map((item)=>{
          let _opt = {
            code:item.propertyNameId,
            name:item.propertyName
          }
          this.skuImageModel.options.push(_opt)
        })

      },
      //新增属性项
      addPropertyName(type){
//        console.log(type)
        this.propertyEditTitle = type == 1 ? '关键' : type == 2 ? '销售' : '商品'
        this.propertyEdit.isShow = true
        this.propertyEdit.type = type
      },
      //新增属性项模糊搜索
      remoteMethod(query){
        if(!query){
          this.propertyNameList = []
          return false
        }
        let opts = {
          propertyName:query,
          preMatch:false
        }
        switch (this.propertyEdit.type){
          case 1:
              opts.isKeyProperty = true
              break
          case 2:
              opts.isSellProperty = true
              break
          case 3:
              opts.isGoodsProperty = true
              break
        }
        this.matchNameList(opts)
          .then((rs)=>{
            let check = {}
            this.detailResult.map((item)=>{
              item.list.map((property)=>{
                check[property.propertyNameId] = property.propertyNameId
              })
            })
            this.propertyNameList = rs.filter((item)=>!check[item.code])
          })
      },
      //保存编辑属性项/值
      saveEditModel(type){
        switch(type){
          case 1:
//            console.log(this.propertyEdit.type)
//            console.log(this.propertyEdit.nameOpts.propertyNameId)
            if(!this.propertyEdit.nameOpts.propertyNameId){
              this.getToast('请选择属性项')
              return false
            }
            this.getPropertyListDetail({propertyNameId:this.propertyEdit.nameOpts.propertyNameId})
              .then((rs)=>{
                let opts = {
                  inputType: this.propertyEdit.type == 2 ? 4 : rs.inputType,
                  isRequired: (this.propertyEdit.type == 2 || this.propertyEdit.type == 1) ? true : false,
                  modifyType:this.propertyEdit.type == 2 ? 2 : rs.modifyType,
                  propertyName: rs.name,
                  propertyNameId: rs.id,
                  propertyPairs: [],
                  propertyType: this.propertyEdit.type,
                }
              this.detailResult[this.propertyEdit.type-1].list.push(opts)
              this.cancelEditModel(1)
              })
            break
          case 2:
            let idx = this.propertyValueEdit.idx.idx,
                sIdx = this.propertyValueEdit.idx.subIdx
            this.detailResult[idx].list[sIdx].propertyPairs = JSON.parse(JSON.stringify(this.propertyValueEdit.list))
            this.cancelEditModel(2)
            break
          case 4:
            if(this.skuImageModel.opts.skuImageOpts && !this.skuImageModel.opts.skuImagePropertyNameId){
              this.getToast('请选择销售属性')
            }
            this.skuImageModel.options.map((item)=>{
              if(item.code == this.skuImageModel.opts.skuImagePropertyNameId){
                this.skuImageModel.opts.skuImagePropertyName = item.name
              }
            })
            this.skuImageOpts = Object.assign({},this.skuImageModel.opts)
            this.cancelEditModel(4)
        }


      },
      //取消编辑属性项/值
      cancelEditModel(type){
        switch (type){
          case 1:
            this.propertyEdit.isShow = false
            this.propertyEdit.type = ''
            this.propertyEdit.nameOpts.propertyNameId = ''
            break
          case 2:
            this.propertyValueEdit.isShow = false
            this.propertyValueEdit.idx.idx = ''
            this.propertyValueEdit.idx.subIdx = ''
            this.propertyValueEdit.nameId = ''
            this.propertyValueEdit.list = []
            this.propertyValueEdit.type = 2
            this.propertyValueEdit.inputType = 2
            break
          case 3:
            this.propertyValueAdd.isShow = false
            this.propertyValueAdd.list = []
            this.propertyValueAdd.batchList = []
            this.propertyValueAdd.inputType = ''

//            this.propertyNamePage = {
//              page:1,
//              rows:10,
//              total:0
//            }
            this.propertyNamePage.page = 1
            this.propertyNamePage.rows = 10
            this.propertyNamePage.total = 0
            this.propertyNamePage.close = true

            break
          case 4:
            this.skuImageModel.isShow = false
            this.skuImageModel.opts = Object.assign({},this.skuImageOpts)
        }


      },
      saveManageModel(){
        let opts = {},
            list = JSON.parse(JSON.stringify(this.detailResult))
        for(let item of list){
          for(let subItem of item.list){
            if(item.type == 2){
              if(subItem.inputType != 4){
                this.getToast('销售属性必须多选自定义')
                return false
              }
              subItem.isRequired = false
            }
            let _check = this.checkValLength(subItem.propertyPairs.length,subItem.inputType,subItem.propertyName)
            if(_check){
              this.getToast(_check)
              return false
            }
            delete subItem.sortOrder
            delete subItem._select
            delete subItem.isUsedInSKU
            subItem.propertyPairs.map((pairs)=>{
              pairs.propertyPairId = pairs.id
              delete pairs.pnName
              delete pairs.pvName
              delete pairs.id
              delete pairs.propertyValueId
            })
          }
          opts[item.key] = item.list
        }
        if(!this.skuImageOpts.isRequiredImage){
          this.skuImageOpts.skuImagePropertyNameId = ''
        }

        let _opts = Object.assign({},opts,this.skuImageOpts,{categoryId:this.propertyDetailModel.categoryId})
        let _saleLength = _opts.saleProperties.length,
         _goodsLength = _opts.goodsProperties.length,
         _keyLength = _opts.keyProperties.length

        _opts.saleProperties.map((item,idx)=>{
          item.sortOrder = _saleLength - idx
        })
        _opts.goodsProperties.map((item,idx)=>{
          item.sortOrder = _goodsLength - idx
        })
        _opts.keyProperties.map((item,idx)=>{
          item.sortOrder = _keyLength - idx
        })
        this.savePropertyDetail(_opts)
          .then((rs)=>{
            if(rs){
              this.cancelManageModel()
              this.initView()
            }
          })
      },
      cancelManageModel(){
        this.propertyDetailModel.isShow = false
        this.propertyDetailModel.categoryId = ''
        this.skuImageModel.opts.skuImagePropertyNameId = ''
        this.skuImageModel.opts.skuImagePropertyName = ''
        this.skuImageModel.opts.isRequiredImage = ''
        this.detailResult = []
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
  .section-box{
    .proper-box{
      .proper-title{
        margin-bottom: 10px;
      }
      .label-sign{
        display: inline-block;
        /*min-width: 60px;*/
        min-width: 100px;
        padding-right: 0;
      }
    }
  }
  .input-item-middle{
    width: 200px;
  }
</style>
