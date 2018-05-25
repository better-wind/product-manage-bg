<template>
	<div>
	    <div class="title-box">
        <span v-if="auditStatus == 0">商品初审</span>
        <span v-else-if="auditStatus == 1">商品复审</span>
        <span v-else>商品审核记录</span>
      </div>
    <div class="section-box">
      <div class="item-box">
        <div class="block-item">
          <span class="label-sign">当前选择类目</span>
          {{cateTitle}}
        </div>
      </div>
      <div class="item-box ">
        <div class="sub-title-box mg-b">
          基本信息
          <div class="show-check" v-if="showType == 2">
            <template v-if="checkDetailConfig.baseMsg">
              <span class="c-red">审核辅助：信息有修改</span>
              <el-button size="small" type="primary" @click="callShowCheckDetail(1)">对比</el-button>
            </template>
            <span v-else>审核辅助：信息未修改</span>
          </div>

        </div>
        <div class="block-box base-box">
          <span class="label-sign"><span class="c-red">*</span>商品名称</span>
          <span>{{saveProductEdit.name}}</span>
        </div>
        <div class="block-box base-box label-float-layout">
          <div class="label-sign-wrap">
            <span class="label-sign"><span class="c-red">*</span>卖点文案</span>
          </div>
          <div class="inline-box" style="width: 600px">
            <span>{{saveProductEdit.sellingPoint}}</span>
          </div>
        </div>
        <template v-for="(item,idx) in goodsPropertyConfig.filter((item)=>item.propertyType == 1)">
          <div class="block-box property-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">{{item.propertyName}}</span>
            </div>
            <div class="inline-box">
              <span>{{item.select.join(',')}}</span>
            </div>

          </div>
        </template>

        <div class="block-box base-box">
          <span class="label-sign">发货地</span>
          <div class="inline-box" :style="{'width':'80%'}" v-if="shipAreaOptions.length > 0">
            <template v-for="(item,i) in shipAreaOptions">
              {{(i != 0 ? '，' : '') + mapArea[item.deliverAreaId]}}
            </template>
          </div>
          <div class="inline-box" v-else="shipAreaOptions.length == 0">
            暂无发货地
          </div>
        </div>
        <template v-for="(item,i) in shipAreaOptions">
          <div class="block-box base-box label-float-layout">
            <!--<div class="label-sign-wrap">-->
              <span class="label-sign">配送地区({{mapArea[item.deliverAreaId]}})</span>
            <!--</div>-->
            {{item.deliverAreaTemplateId ? mapAreaTemp[item.deliverAreaTemplateId] : '全国发货'}}
          </div>

        </template>
      </div>
      <div class="item-box" v-if="showType == 2">
        <div class="sub-title-box mg-b">
          商品属性
          <div class="show-check">
            <template v-if="checkDetailConfig.goodsProperty">
              <span class="c-red">审核辅助：信息有修改</span>
              <el-button size="small" type="primary" @click="callShowCheckDetail(2)">对比</el-button>
            </template>
            <span v-else>审核辅助：信息未修改</span>
          </div>
        </div>
        <template v-for="(item,idx) in goodsPropertyConfig.filter((item)=>item.propertyType == 3)">
          <div class="block-box property-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">{{item.propertyName}}</span>
            </div>
            <div class="inline-box">
              <span>{{item.select.join(',')}}</span>
            </div>

          </div>
        </template>
      </div>
      <div class="item-box" v-else-if="goodsPropertyConfig.filter((item)=>item.propertyType == 3).length">
        <div class="sub-title-box mg-b">
          商品属性

        </div>
        <template v-for="(item,idx) in goodsPropertyConfig.filter((item)=>item.propertyType == 3)">
          <div class="block-box property-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">{{item.propertyName}}</span>
            </div>
            <div class="inline-box">
              <span>{{item.select.join(',')}}</span>
            </div>

          </div>
        </template>
      </div>
      <div class="item-box">
        <div class="sub-title-box mg-b">
          销售属性
          <div class="show-check" v-if="showType == 2">
            <template v-if="checkDetailConfig.saleUnit">
              <span class="c-red">审核辅助：信息有修改</span>
              <el-button size="small" type="primary" @click="callShowCheckDetail(3)">对比</el-button>
            </template>
            <span v-else>审核辅助：信息未修改</span>
          </div>
        </div>
        <div class="item-table">
          <el-table :data="goodsSkuConfig" style="width: 100%;" >
            <el-table-column align="center" label="销售状态">
              <template scope="scope" >
                <span v-if="scope.row.status == 1">可售</span>
                <span v-else class="c-red">停售</span>
              </template>
            </el-table-column>
            <el-table-column  prop="skuName" label="销售属性值"  align="center">
              <template scope="scope">
                <span class="key-item">{{scope.row.skuName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="barcode" align="center" label="商品条码" width="120">
            </el-table-column>
            <el-table-column prop="grossWeight" align="center" label="毛重(g)" width="120">
            </el-table-column>
            <el-table-column prop="marketPrice" align="center" label="市场价" width="120">
            </el-table-column>
            <el-table-column prop="retailPrice" align="center" label="建议售价" width="120">
            </el-table-column>
            <el-table-column prop="costPrice" align="center" label="成本价(不含邮费)" width="120">
            </el-table-column>
            <el-table-column align="center"
                             v-if="shipAreaOptions.length > 0"
                             v-for="(item,i) in shipAreaOptions"
                             :label="'发货编码('+mapArea[item.deliverAreaId]+')'"
                             width="120"
                             :key="i" >
              <template scope="scope">
                {{scope.row['code'+item.deliverAreaId]}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="item-box" v-if="configSaleUnitImages.isRequiredImage">
        <div class="sub-title-box mg-b">
          SKU主图（销售属性项：{{configSaleUnitImages.skuImagePropertyName}}）
          <div class="show-check" v-if="showType == 2">
            <template v-if="checkDetailConfig.skuImage">
              <span class="c-red">审核辅助：信息有修改</span>
              <el-button size="small" type="primary" @click="callShowCheckDetail(4)">对比</el-button>
            </template>
            <span v-else>审核辅助：信息未修改</span>
          </div>
        </div>
        <div class="block-box c-dis">SKU主图：必填，分辨率640x640，文件小于400KB！</div>
        <div class="block-box" v-if="goodsPropertyConfig[configSaleUnitImages.idx]">
          <div class="inline-box mg-r" style="overflow: hidden" v-for="item in goodsPropertyConfig[configSaleUnitImages.idx].select">
            <span class="label-sign" style="display: inline-block;width: 60px;word-break:break-all;">{{item}}</span>
            <div class="avatar-wrap" >
              <template v-if="configSaleUnitImages.list[item]">
                <img :src="configSaleUnitImages.list[item].url" class="avatar">
                <div class="avatar-menu">
                  <i class="el-icon-search" @click="showProductImage(configSaleUnitImages.list[item].url)"></i>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <v-upload :uploadConfig="uploadConfig">
        <template slot="check-edit">
          <div class="show-check" v-if="showType == 2">
            <template v-if="checkDetailConfig.image">
              <span class="c-red">审核辅助：信息有修改</span>
              <el-button size="small" type="primary" @click="callShowCheckDetail(5)">对比</el-button>
            </template>
            <span v-else>审核辅助：信息未修改</span>
          </div>
        </template>
        <template slot="check-edit-detail">
          <div class="show-check" v-if="showType == 2">
            <template v-if="checkDetailConfig.detail">
              <span class="c-red">审核辅助：信息有修改</span>
              <el-button size="small" type="primary" @click="callShowCheckDetail(6)">对比</el-button>
            </template>
            <span v-else>审核辅助：信息未修改</span>
          </div>
        </template>
      </v-upload>
      <div class="item-box t-c">
        <template v-if="auditStatus == 0">
          <el-button @click="submitAudit(0,1)" type="primary" >初审通过</el-button>
          <el-button @click="submitAudit(0,2)" >初审不通过</el-button>
        </template>
        <template v-else-if="auditStatus == 1">
          <el-button @click="submitAudit(1,1)" type="primary" >复审通过</el-button>
          <el-button @click="submitAudit(1,2)"  >复审不通过</el-button>
        </template>

      </div>
    </div>
    <el-dialog :title="goodAuditModel.sStatus+goodAuditModel.sAction" size="small" v-model="goodAuditModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="section-box">
        <div class="block-box">
          <span v-if="goodAuditModel.opts.action == 1">是否确认审核通过？</span>
          <span v-else>审核不通过原因：</span>
        </div>
        <div class="block-box" v-if="goodAuditModel.opts.action == 2">
          <el-input placeholder="请输入原因" v-model="goodAuditModel.opts.comments" style="width: 400px" type="textarea" :rows="4"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGoodAudit">确认</el-button>
        <el-button @click="cancelGoodAudit">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核辅助" size="large" v-model="checkDetailModel.isShow">
      <div class="section-box">
        <div v-if="checkDetailModel.type == 1" class="item-box">
          <div class="sub-title-box mg-b">
            基本信息
          </div>
          <div  v-if="checkDetailOpts.name" class="block-box base-box ">
            <span class="label-sign">商品名称</span>
            <div class="inline-box">
              <span>{{checkDetailOpts.name}}</span>
            </div>
          </div>
          <div v-if="checkDetailOpts.sellingPoint" class="block-box base-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">卖点文案</span>
            </div>
            <div class="inline-box" style="width: 400px">
              <span>{{checkDetailOpts.sellingPoint}}</span>
            </div>
          </div>
          <template v-for="(item,idx) in checkDetailOpts.goodsPropertyConfig.filter((item)=>item.propertyType == 1)">
              <div class="block-box property-box label-float-layout">
                <div class="label-sign-wrap">
                  <span class="label-sign">{{item.propertyName}}</span>
                </div>
                <div class="inline-box">
                  <span>{{item.select.join(',')}}</span>
                </div>

              </div>
            </template>
          <div v-if="checkDetailOpts.deliverAreas" class="block-box base-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">发货地</span>
            </div>
            <div class="inline-box" style="width: 400px">
              <span>{{checkDetailOpts.deliverAreas}}</span>
            </div>
          </div>
          <template v-if="checkDetailOpts.deliverAreasTemp.length">
            <div class="block-box base-box label-float-layout" v-for="item in checkDetailOpts.deliverAreasTemp">
              <span class="label-sign">配送地区({{mapArea[item.deliverAreaId]}})</span>
              <span>{{item.deliverAreaTemplateId ? mapAreaTemp[item.deliverAreaTemplateId] : '全国发货'}}</span>
            </div>
          </template>
        </div>
        <div v-if="checkDetailModel.type == 2" class="item-box">
          <div class="sub-title-box mg-b">
            商品属性
          </div>
          <template v-for="(item,idx) in checkDetailOpts.goodsPropertyConfig.filter((item)=>item.propertyType == 3)">
            <div class="block-box property-box label-float-layout">
              <div class="label-sign-wrap">
                <span class="label-sign">{{item.propertyName}}</span>
              </div>
              <div class="inline-box">
                <span>{{item.select.join(',')}}</span>
              </div>

            </div>
          </template>
          <div class="inline-box mg-r" v-if="!checkDetailOpts.goodsPropertyConfig.filter((item)=>item.propertyType == 3).length">
            <span class="c-dis mg-l">未选择商品属性</span>
          </div>
        </div>
        <div v-if="checkDetailModel.type == 3" class="item-box">
          <div class="sub-title-box mg-b">
            销售属性
          </div>
          <el-table :data="checkDetailOpts.goodsSkuConfig" style="width: 100%;" >
            <el-table-column align="center" label="销售状态">
              <template scope="scope" >
                <span v-if="scope.row.status == 1">可售</span>
                <span v-else class="c-red">停售</span>
              </template>
            </el-table-column>
            <el-table-column  prop="skuName" label="销售属性值"  align="center">
              <template scope="scope">
                <span class="key-item">{{scope.row.skuName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="barcode" align="center" label="商品条码" width="120">
            </el-table-column>
            <el-table-column prop="grossWeight" align="center" label="毛重(g)" width="120">
            </el-table-column>
            <el-table-column prop="marketPrice" align="center" label="市场价" width="120">
            </el-table-column>
            <el-table-column prop="retailPrice" align="center" label="建议售价" width="120">
            </el-table-column>
            <el-table-column prop="costPrice" align="center" label="成本价(不含邮费)" width="120">
            </el-table-column>
            <el-table-column align="center"
                             v-if="checkDetailOpts.shipAreaOptions.length > 0"
                             v-for="(item,i) in checkDetailOpts.shipAreaOptions"
                             :label="'发货编码('+mapArea[item.deliverAreaId]+')'"
                             width="120"
                             :key="i" >
              <template scope="scope">
                {{scope.row['code'+item.deliverAreaId]}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="checkDetailModel.type == 4" class="item-box">
          <div class="sub-title-box mg-b">
            SKU主图
          </div>
          <div class="block-box">
            <div class="inline-box mg-r" style="overflow: hidden" v-for="item in checkDetailOpts.skuImages">
              <span class="label-sign" style="display: inline-block;width: 60px;word-break:break-all;">{{item.name}}</span>
              <div class="avatar-wrap" >
                <img :src="item.url" class="avatar">
                <div class="avatar-menu">
                  <i class="el-icon-search" @click="showProductImage(item.url)"></i>
                </div>
              </div>
            </div>
            <div class="inline-box mg-r" v-if="!checkDetailOpts.skuImages.length">
              <span class="c-dis mg-l">未选择SKU主图</span>
            </div>
          </div>
        </div>
        <div v-if="checkDetailModel.type == 5" class="item-box">
          <div class="sub-title-box mg-b">
            商品主图
          </div>
          <div class="avatar-wrap" v-for="(item,idx) in checkDetailOpts.images">
              <img :src="item" class="avatar">
              <div class="avatar-menu">
                <i class="el-icon-search" @click="showProductImage(item)"></i>
              </div>
          </div>
        </div>
        <div v-if="checkDetailModel.type == 6" class="item-box">
          <div class="sub-title-box mg-b">
            详情
          </div>
          <div class="detail-wrap-scroll">
            <div class="detail-wrap" v-html="checkDetailOpts.detail" v-if="checkDetailOpts.detail"></div>
          </div>
        </div>
      </div>
    </el-dialog>
	</div>
</template>
<script>
  import vUpload from '@/components/productLibrary/uploadImage'
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['productUpload'])
    },

    data:()=>({
      goodsId:'',
      showType:1,
      auditStatus:0,
      goodsProperty:[],
      goodsSaleUnit:[],
      saveProductEdit:{
        name:'',
        sellingPoint:'',
        detail:''
      },
      cateTitle:'',
      configSaleUnitImages :{
        idx:'',
        isRequiredImage:false,
        skuImagePropertyNameId:'',
        list:{},
        saleUnitImages:[],
        currentSkuImage:''
      },
      uploadConfig:{
        detailConfig:{
          isShow:true, // 是否有详情
          editType:1,// 1 不可修改  2 可修改 3 弹框修改
        },
        imageConfig:{
          isShow:true, // 是否有主图
          editType:1, // 1不可修改 2可修改
        }
      },
      goodsPropertyConfig:[],
      goodsSkuConfig:[],
      goodsDetailFetch:{
          rs:{}
      },
      shipAreaOptions: [

      ],
      mapShipAreaOptions:{},
      checkDetailModel:{
        isShow:false,
        type:''
      },
      checkDetailConfig:{
        baseMsg:false,
        baseProperty:false,
        goodsProperty:false,
        saleUnit:false,
        skuImage:false,
        image:false,
        detail:false
      },
      checkDetailOpts:{
        goodsPropertyConfig:[],
        images:[],
        deliverAreasTemp:[],
        goodsSaleUnit:[],
        shipAreaOptions:[],
        mapShipAreaOptions:{},
        skuImages:[]
      },
      checkGoodsPropertyConfig:[],
      goodAuditModel:{
        isShow:false,
        sStatus:'',
        sAction:'',
        opts:{
          auditId:'',
          action:'',
          auditStatus:'',
          comments:''
        }
      },
      mapArea:{},
      mapAreaTemp:{}
    }),
    methods:{
      ...mapActions(['getGoodsSellerDeliver','getAreaTempList','actionGoodAudit','goodsCodeDetail','goodsAuditDetail','setViewImage','setProductUpload','getPropertyDetail','getBaseGoodsDetail','getCateList','getCategoryPath','getGoodsBelong','getShipArea','saveBaseGoods','validCategoryIdChange','setStartToast']),
      initView(){
        const query = this.$route.query
        this.showType = query.showType
        this.goodsId = query.goodsId
        this.callGetProductDetail()
            .then(()=>{
              this.checkProperty()
            })
      },
      callGetProductDetail(){
        const _this = this
        return new Promise(function(resolve){
          _this.goodsAuditDetail({auditId:_this.goodsId})
            .then((rs)=>{
              _this.auditStatus = rs.auditStatus
              _this.goodsDetailFetch.rs = rs.baseGoodsVO
              if(_this.auditStatus == 1){
                _this.goodsCodeDetail({baseGoodsCode:rs.baseGoodsVO.baseGoodsCode})
                    .then((dRs)=>{
                      _this.goodsDetalCheck = dRs
                      _this.callInitDetail(rs.baseGoodsVO,resolve)
                    })
              } else {
                _this.callInitDetail(rs.baseGoodsVO,resolve)
              }

            })
        })
      },
      callGetAreaTempList(sellerMainId){
        const _this = this
        return new Promise(function(resolve){
          _this.getAreaTempList({sellerMainId:sellerMainId})
            .then((tempRs)=>{
              tempRs.map((item)=>{
                _this.$set(_this.mapAreaTemp, item.id, item.name)
              })
              resolve()
            })
        })
      },
      callGetGoodsSellerDeliver(sellerMainId){
        const _this = this
        return new Promise(function(resolve){
          _this.getGoodsSellerDeliver({sellerMainId:sellerMainId})
            .then((tempRs)=>{
              tempRs.map((item)=>{
                _this.$set(_this.mapArea, item.deliverAreaId, item.deliverAreaName);
              })
              resolve()
            })
        })

      },
      //详情初始化
      callInitDetail(rs,resolve){
        const _this = this
        Promise.all([_this.callGetGoodsSellerDeliver(rs.sellerMainId),_this.callGetAreaTempList(rs.sellerMainId)])
          .then(()=>{
            _this.initDetail(rs,resolve)
          })

      },
      initDetail(rs,resolve){
        let _this = this
//        this.getAreaTempList({sellerMainId:rs.sellerMainId})
//          .then((tempRs)=>{
//            tempRs.map((item)=>{
//              this.$set(this.mapAreaTemp, item.id, item.name)
//            })
//          })
//        this.getGoodsSellerDeliver({sellerMainId:rs.sellerMainId})
//          .then((tempRs)=>{
//            tempRs.map((item)=>{
//              this.$set(this.mapArea, item.deliverAreaId, item.deliverAreaName);
//            })
//          })

        _this.goodsProperty = rs.properties
        //详情销售单元
        _this.goodsSaleUnit = rs.skuArray
        //同步基本信息
        _this.saveProductEdit.name= rs.name
        _this.saveProductEdit.sellingPoint = rs.sellingPoint
        _this.shipAreaOptions = rs.deliverAreas
        _this.shipAreaOptions.map((item)=>{
            _this.mapShipAreaOptions[item.deliverAreaId] = item.deliverAreaName
        })
        //同步商品图片详情
        _this.saveProductEdit.detail = rs.detail
        _this.setProductUpload({detail:rs.detail,images:rs.images})
        if(rs.skuImages.length){
          _this.configSaleUnitImages = {
            idx:'',
            isRequiredImage:true,
            skuImagePropertyNameId:rs.skuImages[0].pnNameId,
            skuImagePropertyName:rs.skuImages[0].pnName,
            list:{},
            saleUnitImages:rs.skuImages
          }
        }
        //同步商品已选择类目
        _this.selectCategoryId = _this.selectCategoryId ? _this.selectCategoryId : rs.categoryId
        _this.getCategoryPath({categoryId:_this.selectCategoryId})
          .then((_rs)=>{
            _this.cateTitle = _rs.pathName.split(',').join(' > ')
          })
        resolve()
      },
      checkProperty(){
        //根据类目初始化
        this.mapCateProperty = {}
        this.goodsPropertyConfig = []
        this.goodsSkuConfig = []
        this.goodsProperty.map((item,idx)=>{
          let opts = {
              propertyName : item.propertyName,
              propertyNameId : item.propertyNameId,
              select:[],
              propertyType:item.propertyType
            }
          this.mapCateProperty[item.propertyNameId] = idx
          if(item.propertyPairs.length){
            item.propertyPairs.map((subItem)=>{
              opts.select.push(subItem.pvName)
            })
          }
          this.goodsPropertyConfig.push(opts)
        })
        const saleUnit =this.goodsSaleUnit
        saleUnit.map((item)=>{
          let arr = [];
          item.properties.map((subItem)=>{
            arr.push(subItem.pvName)
          })
          let _opts = {
            id:item.id,
            skuName:arr.length > 0 ? arr.join('-') : '默认',
            status:item.status,
            barcode:item.barcode,
            costPrice:item.costPrice/100,
            grossWeight:item.grossWeight,
            marketPrice:item.marketPrice/100,
            retailPrice:item.retailPrice/100,
            skuCode:item.skuCode
          }
          item.deliverAreas.map((area,i)=>{
            _opts['code'+area.deliverAreaId] = area.deliverCode
          })
          this.goodsSkuConfig.push(_opts)
        })
        this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
        this.mapSKUImage()
        if(this.auditStatus == 1 && this.goodsDetalCheck.baseGoodsCode){
          this.checkDetail()
        }
      },
      mapSKUImage(){
        if(this.configSaleUnitImages.isRequiredImage){
          this.configSaleUnitImages.list = {}
          this.goodsPropertyConfig[this.configSaleUnitImages.idx].select.map((unit,u_idx)=>{
              let _propertyPairs = []
              this.goodsProperty.map((item)=>{
                if(item.propertyNameId == this.configSaleUnitImages.skuImagePropertyNameId){
                  _propertyPairs = item.propertyPairs
                }
              })
              let _pairsId = ''
              _propertyPairs.map((item)=>{
                if(item.pvName == unit){
                  _pairsId = item.id
                }
              })
              this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages.filter((item)=>item.propertyPairId == _pairsId)[0]
          })
        }
      },
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      checkDetail(){
        const preDetailRs = JSON.parse(JSON.stringify(this.goodsDetalCheck))
        const detailRs = JSON.parse(JSON.stringify(this.goodsDetailFetch.rs))
        let _checkOpts = {
          mapShipAreaOptions:{},
          goodsPropertyConfig:[],
          deliverAreasTemp:[]
        }
        let _preProperties = preDetailRs.properties,
            _properties = detailRs.properties,
            _mapProperties = {}
        _properties.map((item)=>{
          let _list = []
          item.propertyPairs.map((subItem)=>{
            _list.push(subItem.pvName)
          })
          _mapProperties[item.propertyNameId] = _list.sort()
        })
        let _goodsPropertyConfig = []
        _preProperties.map((item)=>{
          let opts = {
            propertyName : item.propertyName,
            propertyNameId : item.propertyNameId,
            select:[],
            propertyType:item.propertyType
          }
          if(item.propertyPairs.length){
            item.propertyPairs.map((subItem)=>{
              opts.select.push(subItem.pvName)
            })
          }
          let _check = false
          if(_mapProperties[item.propertyNameId]){
            let _arr = JSON.parse(JSON.stringify(opts.select))
            if(_arr.sort().join('') != _mapProperties[item.propertyNameId].join('')){
              _check = true
            }
          }
          if(!_mapProperties[item.propertyNameId] || _check){
            _goodsPropertyConfig.push(opts)
          }
        })
        if(_goodsPropertyConfig.length){
          _checkOpts.goodsPropertyConfig = _goodsPropertyConfig
        }
        //基本信息 名称 文案 基本属性 发货地
        if(detailRs.name != preDetailRs.name){
          _checkOpts.name = preDetailRs.name
          this.checkDetailConfig.baseMsg = true
        }
        if(detailRs.sellingPoint != preDetailRs.sellingPoint){
          _checkOpts.sellingPoint = preDetailRs.sellingPoint
          this.checkDetailConfig.baseMsg = true
        }
        let _deliverAreas = [],
            _preDeliverAreas = [],
          _preDeliverAreasName = [],
           _delAreaTempList = [],
          _preDelAreaTempList = [],
          _shipAreaTeml = []
        detailRs.deliverAreas.map((item)=>{
          _deliverAreas.push(item.deliverAreaId)
          _delAreaTempList.push(item.deliverAreaTemplateId)
        })
        preDetailRs.deliverAreas.map((item)=>{
          _preDeliverAreas.push(item.deliverAreaId)
          _preDelAreaTempList.push(item.deliverAreaTemplateId)
          _preDeliverAreasName.push(this.mapArea[item.deliverAreaId])
          let _opts = {
            deliverAreaId:item.deliverAreaId,
            deliverAreaTemplateId:item.deliverAreaTemplateId
          }
          _shipAreaTeml.push(_opts)
        })
        _deliverAreas.sort()
        _preDeliverAreas.sort()
        _delAreaTempList.sort()
        _preDelAreaTempList.sort()
        if(_deliverAreas.join('-') != _preDeliverAreas.join('-')){
          _checkOpts.deliverAreas = _preDeliverAreasName.join(',')
          console.log('==--',_checkOpts.deliverAreas)
          this.checkDetailConfig.baseMsg = true
        }
        if(_delAreaTempList.join('-') != _preDelAreaTempList.join('-')){
          _checkOpts.deliverAreasTemp = _shipAreaTeml
          this.checkDetailConfig.baseMsg = true
        }

        //基本属性
        if(_properties.filter((item)=>item.propertyType == 1).length != _preProperties.filter((item)=>item.propertyType == 1).length){
          this.checkDetailConfig.baseMsg = true
          this.checkDetailConfig.baseProperty = true
        }
        if(_checkOpts.goodsPropertyConfig.filter((item)=>item.propertyType == 1).length){
          this.checkDetailConfig.baseMsg = true
          this.checkDetailConfig.baseProperty = true
        }
        //商品属性
        if(_properties.filter((item)=>item.propertyType == 3).length != _preProperties.filter((item)=>item.propertyType == 3).length){
          this.checkDetailConfig.baseMsg = true
        }
        if(_checkOpts.goodsPropertyConfig.filter((item)=>item.propertyType == 3).length){
          this.checkDetailConfig.goodsProperty = true
        }
        _checkOpts.shipAreaOptions = preDetailRs.deliverAreas
        _checkOpts.shipAreaOptions.map((item)=>{
          _checkOpts.mapShipAreaOptions[item.deliverAreaId] = item.deliverAreaName
        })
        _checkOpts.goodsSkuConfig = []
        preDetailRs.skuArray.map((item)=>{
          let arr = [];
          item.properties.map((subItem)=>{
            arr.push(subItem.pvName)
          })
          let _opts = {
            id:item.id,
            skuName:arr.length > 0 ? arr.join('-') : '默认',
            status:item.status,
            barcode:item.barcode,
            costPrice:item.costPrice/100,
            grossWeight:item.grossWeight,
            marketPrice:item.marketPrice/100,
            retailPrice:item.retailPrice/100,
            skuCode:item.skuCode
          }
          item.deliverAreas.map((area,i)=>{
            _opts['code'+area.deliverAreaId] = area.deliverCode
          })
          _checkOpts.goodsSkuConfig.push(_opts)
        })
        if(_checkOpts.goodsPropertyConfig.filter((item)=>item.propertyType == 2).length){
          this.checkDetailConfig.saleUnit = true
        } else {
          //元素修改
          let _checkSkuArr = ['barcode','status','costPrice','marketPrice','retailPrice','grossWeight']
          for(let i = 0,j = preDetailRs.skuArray.length;i<j;i++){
            let _preSku = preDetailRs.skuArray[i],
              sku = detailRs.skuArray[i],
              skuArrCheck=false
            for(let n=0,m=_checkSkuArr.length;n<m;n++){
              let _key = _checkSkuArr[n]
              if(_preSku[_key] != sku[_key]){
                skuArrCheck = true
                  break
              }
            }
            if(skuArrCheck){
              this.checkDetailConfig.saleUnit = true
              break
            }
            if(sku.deliverAreas.length != _preSku.deliverAreas.length){
              this.checkDetailConfig.saleUnit = true
              break
            } else {
              let _skuAreaMap = {}
              _preSku.deliverAreas.map((area)=>{
                _skuAreaMap[area.deliverAreaId]=area.deliverCode
              })
              let _checkSkuArea = false
              sku.deliverAreas.map((area)=>{
                if(!_skuAreaMap[area.deliverAreaId] || _skuAreaMap[area.deliverAreaId] !=area.deliverCode){
                  _checkSkuArea = true
                }
              })
              if(_checkSkuArea){
                this.checkDetailConfig.saleUnit = true
              }
            }
          }
        }

        //SKU主图
        let _skuImages = [],
            _mapSkuImages = {}
        if(detailRs.skuImages.length != preDetailRs.skuImages.length){
          this.checkDetailConfig.skuImage = true
        }
        if(detailRs.skuImages.length || preDetailRs.skuImages.length){
          detailRs.skuImages.map((item)=>{
            _mapSkuImages[item.pvName] = item.url
          })
          preDetailRs.skuImages.map((item)=>{
            let _check = false
            if(_mapSkuImages[item.pvName] && _mapSkuImages[item.pvName] != item.url){
              _check = true
            }
            if(!_mapSkuImages[item.pvName] || _check){
                let _opt = {
                  name:item.pvName,
                  url:item.url
                }
              _skuImages.push(_opt)
            }
          })
        }
        _checkOpts.skuImages = _skuImages
        if(_checkOpts.skuImages.length){
          this.checkDetailConfig.skuImage = true
        }
        //商品主图
        let _preImage = [],
            _images = [],
           images = []
        detailRs.images.map((item)=>{
            _images.push(item.url)
        })
        preDetailRs.images.map((item)=>{
          _preImage.push(item.url)
          images.push(item.url)
        })
        _images.sort()
        _preImage.sort()
        if(_images.join('-') != _preImage.join('-')){
          _checkOpts.images = images
          this.checkDetailConfig.image = true
        }
        //商品详情
        if(preDetailRs.detail != detailRs.detail){
          _checkOpts.detail = preDetailRs.detail
          this.checkDetailConfig.detail = true
        }
        this.checkDetailOpts = _checkOpts
        this.showType = 2
      },
      callShowCheckDetail(type){
        this.checkDetailModel.type = type
        this.checkDetailModel.isShow = true
      },
      submitAudit(status,action){
        this.goodAuditModel.sStatus = status == 0 ? '初审' : '复审'
        this.goodAuditModel.sAction = action == 1 ? '通过' : '不通过'
        this.goodAuditModel.opts.auditStatus = status
        this.goodAuditModel.opts.action = action
        this.goodAuditModel.opts.auditId = this.goodsId
        this.goodAuditModel.opts.comments = ''
        this.goodAuditModel.isShow = true

      },
      submitGoodAudit(){
        if(this.goodAuditModel.opts.action == 2 && !this.goodAuditModel.opts.comments){
          this.getToast('请输入'+this.goodAuditModel.sStatus+'不通过原因')
          return false
        }
        this.actionGoodAudit(this.goodAuditModel.opts)
          .then((rs)=>{
            this.setStartToast({
              isShow:true,
              msg:'审核成功',
              type:'success'
            })
            this.$router.push({
              name: 'goodsAudit',
            })
          })
      },
      cancelGoodAudit(){
        this.goodAuditModel.isShow = false
      },

      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
    },
    components:{
      vUpload
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	.mg-r {
		span {
			text-align: right;
		}
	}
  .input-item-large{
    width: 300px;
  }
  .input-item-large-select{
    width: 280px;
  }
  .mg-b-h{
    margin: 0px 10px 0px 0px;
  }
  .avatar-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      width: 100px;
      height: 100px;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      width: 100px;
      height: 100px;
      line-height: 100px;
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
  }
  .avatar-uploader{
    width: 100px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
  .property-box{
    position: relative;
    display: block;
    .inline-box{
      max-width: 85%;
    }
    .label-sign{
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .property-layout-box{
    .label-sign{
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .base-box{
    .label-sign{
      display: inline-block;
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .block-box{
    padding: 10px 0;
  }
  .inline-box{
    margin-bottom: 0;
  }
  .label-float-layout{
    position: relative;
    overflow: hidden;
    .label-sign-wrap{
      float: left;
      .label-sign{
        display: inline-block;
        /*line-height: 30px;*/
      }
    }
  }
  .detail-wrap-scroll{
    width: 600px;
    height: 600px;
    overflow: hidden;
  }
  .detail-wrap{
    width: 650px;
    height: 600px;
    overflow: hidden;
    overflow-y:scroll;
  }
  .show-check{
    margin-left: 20px;
    display: inline-block;
    font-size: 14px;
  }
</style>
