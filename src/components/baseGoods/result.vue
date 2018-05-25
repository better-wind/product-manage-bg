<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <a v-if="roleMenuDetail['/goods/baseGoods/save']" href="/#/baseGoods/edit" target="_blank">
        <el-button type="primary" size="small">新建基础商品</el-button>
      </a>
      <el-button v-else type="primary" @click="noRole()" size="small">新建基础商品</el-button>
      <el-button @click="disableGoods" size="small">删除商品</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border @selection-change="handleSelectionChange" :data="searchResult.rows" style="width: 100%;">
        <el-table-column type="selection" align="center" width="55">

        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.type == 'image'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="table-image">
                <img v-if="scope.row.image&&scope.row.image.url" :src="scope.row.image.url" style="width: 80px;height: 80px" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'base'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="t-l" style="padding-left: 5px">
                <p>基础商品码：{{scope.row.baseGoodsCode}}</p>
                <p>可用状态：<span :class="scope.row.status == 1 ? '' :  'c-red'">{{scope.row.status == 1 ? '可用' : scope.row.status == 2 ? '删除' : '停用'}}</span> </p>
                <p v-if="scope.row.auditStatus==1" class="c-red">(审核中)</p>
              </div>

            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'name'" :label="item.label" :min-width="item.minWidth" :width="item.width" align="center">
            <template scope="scope">
              <div class="t-l">
                <p>商品名称：{{scope.row.name}}</p>
                <p>商品归属：{{scope.row.sellerMainName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'detail'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="t-l">
                <p>类目：{{scope.row.pathName | pathNameFilter}}</p>
                <p>发货地：{{scope.row.deliverAreas | deliverAreasFilter}}</p>
                <p v-if="scope.row.brandName">品牌：{{scope.row.brandName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'sku'" :render-header="headerTitle" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="line-wrap">
                <div class="line" v-for="sku in scope.row.skuArray">
                  <p>{{sku.skuCode | skuArrayValueFilter('',sku)}}</p><p><span v-if="sku.status == 0 || sku.status == 2" class="c-red">({{sku.status == 0 ? '停用' :'删除'}})</span>{{sku.properties | skuArrayValueFilter('pvName',sku)}}</p><p v-html="deliverCodeFilter(sku.deliverAreas)"></p><p>{{sku.costPrice | skuArrayValueFilter('costPrice',sku)}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column v-else-if="item.type == 'sku'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="line-wrap">
                <div class="line" v-for="sku in scope.row.skuArray">
                  <span v-if="item.subKey == 'properties'"><span v-if="sku.status == 0" class="c-red">(停售)</span>{{sku[item.subKey] | skuArrayValueFilter(item.subSubKey,sku)}}</span>
                  <div v-else-if="item.subKey == 'deliverAreas'">
                    <p v-html="deliverCodeFilter(sku[item.subKey])"></p>
                  </div>
                  <span v-else>{{sku[item.subKey] | skuArrayValueFilter(item.subSubKey,sku)}}</span>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column v-else-if="item.type == 'channels'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <p v-for="channel in scope.row.channels" :style="{backgroundColor: channel == 1 ? '#FB4B4D' : channel==2 ? '#000000':channel==3?'#867152':channel==4?'#0054ff':channel==5?'#00B745':channel==6?'#FABE00':channel==7?'#33CEBE':channel==8?'#FABE00':'',color:'#fff',margin:'0 5px 5px'}">{{mapChannels[channel]}}</p>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'operate'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div style="padding: 10px 0">
                <template v-if="scope.row.status == 1">
                  <a v-if="roleMenuDetail['/goods/baseGoods/detail/{baseGoodsId}']" :href="'/#/baseGoods/edit?goodsId='+scope.row.baseGoodsId" target="_blank">
                    <el-button type="primary"  size="small">{{scope.row.auditStatus==1?'查看商品':'编辑商品'}}</el-button>
                  </a>
                  <el-button v-else type="primary" @click="noRole()" size="small">编辑商品</el-button>

                </template>

                <el-button style="margin: 10px 0 0 0" size="small" @click="storageList(scope.row.baseGoodsCode)">销量及库存</el-button>

                <a :href="'/#/activity/report/1/'+scope.row.baseGoodsId" target="_blank">
                  <el-button style="margin: 10px 0 0 0" size="small">活动供货价</el-button>
                </a>
              </div>

            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="'销量和库存'" size="super"  v-model="storageModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <template v-for="storage in storageModel.storageList">
        <div>
          <span class="mg-r">商品名称：{{storage.name}}</span>
          <span>发货地：{{storage.sellerMainName}}-{{storage.deliverAreaName}}</span>
        </div>
        <div class="item-table mg-t-h mg-b">
          <el-table  border :data="storage.skuStorageVOList" style="width: 100%;">
            <el-table-column label="SKU码" prop="skuCode" align="center"> </el-table-column>
            <el-table-column label="销售属性值" prop="saleProperties" align="center">
              <template scope="scope">
                <span v-if="scope.row.status == 0 || scope.row.status == 2" class="c-red">({{scope.row.status == 0 ? '停用' : '删除'}})</span><span>{{scope.row.saleProperties}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发货编码" prop="deliverCode" align="center">
              <template scope="scope">
                <span class="c-red" v-if="scope.row.deliverAreaStatus == 0">(停用)</span><span>{{scope.row.deliverCode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="成本价(不含邮)" prop="costPrice" align="center">
              <template scope="scope">
                <span>{{scope.row.costPrice/100}}</span>
              </template>
            </el-table-column>
            <el-table-column label="实物库存" prop="qtyStorageStock" align="center"> </el-table-column>
            <el-table-column v-if="storage.isSelfSupport" label="预售库存" prop="qtyPresell" align="center"> </el-table-column>
            <el-table-column label="待发货占用" prop="notDeliverLock" align="center"> </el-table-column>
            <el-table-column label="待付款占用" prop="notPayLock" align="center"> </el-table-column>
            <el-table-column label="可售库存" prop="availCount" align="center"> </el-table-column>
            <el-table-column v-if="storage.isInStorage != 1" :label="(storage.isSelfSupport && (storage.outWMS > 0 && storage.outWMS != 8)) ? '调整预售库存' : '调整可售库存'" prop="skuCode" align="center" width="130">
              <template scope="scope">
                <!--{{!storage.isSelfSupport}}-->
                <template v-if="scope.row.deliverAreaStatus == 1">
                  <el-input-number class="mg-t-h" v-if="storage.isSelfSupport && (storage.outWMS > 0 && storage.outWMS != 8)" size="small" :min='0-scope.row.qtyPresell' :debounce=300 v-model="scope.row.qtyPresellChange"></el-input-number>
                  <el-input-number class="mg-t-h" v-else-if="!storage.isSelfSupport && storage.outWMS == 0" :min='0-scope.row.availCount' :debounce=300 size="small" v-model="scope.row.qtyStorageStockChange"></el-input-number>
                </template>
              </template>
            </el-table-column>
            <!--<el-table-column v-if="storage.isInStorage != 1" label="新商品库库存占比" width="150" prop="percent" align="center">-->
              <!--<template scope="scope">-->
                <!--<template v-if="scope.row.deliverAreaStatus == 1">-->
                  <!--<el-input class="percent-div" style="width: 60px;" size="small" v-model.trim="scope.row.percent"></el-input>%-->
                <!--</template>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="storageModel.isMenu"  @click="submitStorageModel">保 存</el-button>
        <el-button @click="cancelStorageModel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置商品删除" size="tiny" v-model="saleGoodsStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{saleGoodsStatusModel.list.length}}个基础商品，删除后不可恢复可用，与所选基础商品SKU关联的销售单元将停用且不可恢复可用，是否确认删除？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSaleStatus">确认</el-button>
        <el-button @click="cancelSaleStatus">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'

  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','roleMenuDetail'])
    },
    filters: {
      pathNameFilter(str){
        return str ? str.split(',').join(' - ') : ''
      },
      deliverAreasFilter(arr){
        let _arr = [];
        arr.map((area,i)=>{
          _arr.push(area.deliverAreaName)
        })
        return _arr.join(',')
      },
      skuArrayValueFilter(data,key,sku){
        const _this = this
        let str = ''
        if (Object.prototype.toString.call(data) == '[object Array]' && key) {
          let arr = []
          if (data.length == 0 && key == 'pvName') {
            str = '默认'
            return str
          }
          data.map((item,i)=>{
//            console.log(item)
            arr.push(item[key])
          })
          // if (key == 'deliverCode') {
          //   //str = arr.join('/')
          //   str = arr
          // }else if(key == 'pvName'){
          //   str = arr.join('-')
          //   // if (sku.status == 2) {
          //   //   str = '(停售)'+str
          //   // }
          // }
          if(key == 'pvName'){
            str = arr.join('-')
            // if (sku.status == 2) {
            //   str = '(停售)'+str
            // }
          }
        }else{
          if (key == 'costPrice') {
            str = data/100
          }else{
            str = data
          }
        }
        return str
      }
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
      strongHtml: '',
      bgColor: '',
      storageModel:{
        isShow:false,
        storageList:[],
        isMenu:false
      },
      batchList:[],
      saleGoodsStatusModel:{
        isShow:false,
        list:[],
      },
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast','getBaseGoodsList'
        ,'getStorageList','saveStorage','setBaseGoodsUpdateStatus']),
      noRole(){
        this.getToast('权限不足，请联系主管申请。')
        return false
      },
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getBaseGoodsList(params)
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
      createBaseGoods(){
        this.$router.push({
          name: 'baseGoodsEdit',
        })
      },
      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
      edit(baseGoodsId){
        this.$router.push({
          name: 'baseGoodsEdit',
          query: {
            goodsId: baseGoodsId
          }
        })
      },
      editShow(baseGoodsId){
        this.$router.push({
          name: 'baseGoodsConsult',
          query: {
            goodsId: baseGoodsId
          }
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
      deliverCodeFilter(arr){
        let result = {}
        let str = ''
        arr.map((item)=>{
          if(!result[item.deliverAreaId]){
            result[item.deliverAreaId] = item
          }
        })
        for(let i in result){
          if (result[i]['deliverAreaName']) {
            str += result[i]['deliverCode']+'['+result[i]['deliverAreaName']
            if(result[i]['deliverAreaStatus'] == 0){
                str+='(<span class="c-red">停用</span>)'
            }
            str+= ']'+'<br/>'
          } else{
            str += result[i]['deliverCode']+'<br/>'
          }
        }
        return str
      },
      storageList(code){
        const _opt = {
          baseGoodsCode:code
        }
//        let _a = [
//          {
//            "name": "sku发货地测试2222222222",
//            "deliverAreaId": 75,
//            "deliverAreaName": "杭州-旺店通",
//            "sellerMainName": "格格家",
//            "isSelfSupport": true,
//            "isInStorage": 1,
//            "skuStorageVOList": [
//              {
//                "skuId": 87095,
//                "skuCode": "SKU80041_81238",
//                "saleProperties": "大",
//                "deliverCode": "33333xxx",
//                "deliverAreaStatus": 1,
//                "costPrice": 1200,
//                "deliverAreaId": 75,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 100,
//                "isInStorage": 1
//              }
//            ],
//            "outWMS": 6
//          },
//          {
//            "name": "sku发货地测试2222222222",
//            "deliverAreaId": 75,
//            "deliverAreaName": "杭州-旺店通",
//            "sellerMainName": "格格家",
//            "isSelfSupport": true,
//            "isInStorage": 1,
//            "skuStorageVOList": [
//              {
//                "skuId": 87095,
//                "skuCode": "SKU80041_81238",
//                "saleProperties": "大",
//                "deliverCode": "33333xxx",
//                "deliverAreaStatus": 1,
//                "costPrice": 1200,
//                "deliverAreaId": 75,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 100,
//                "isInStorage": 1
//              }
//            ],
//            "outWMS": 8
//          },
//          {
//            "name": "sku发货地测试2222222222",
//            "deliverAreaId": 75,
//            "deliverAreaName": "杭州-旺店通",
//            "sellerMainName": "格格家",
//            "isSelfSupport": false,
//            "isInStorage": 1,
//            "skuStorageVOList": [
//              {
//                "skuId": 87095,
//                "skuCode": "SKU80041_81238",
//                "saleProperties": "大",
//                "deliverCode": "33333xxx",
//                "deliverAreaStatus": 0,
//                "costPrice": 1200,
//                "deliverAreaId": 75,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 100,
//                "isInStorage": 1
//              }
//            ],
//            "outWMS": 6
//          },
//          {
//            "name": "sku发货地测试2222222222",
//            "deliverAreaId": 100845,
//            "deliverAreaName": "杭州",
//            "sellerMainName": "杭州维度贸易有限公司",
//            "isSelfSupport": false,
//            "isInStorage": 0,
//            "skuStorageVOList": [
//              {
//                "skuId": 87095,
//                "skuCode": "SKU80041_81238",
//                "saleProperties": "大",
//                "deliverCode": "33333xxx",
//                "deliverAreaStatus": 0,
//                "costPrice": 1200,
//                "deliverAreaId": 100845,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 5,
//                "isInStorage": 0
//              },
//              {
//                "skuId": 87096,
//                "skuCode": "SKU80041_81239",
//                "saleProperties": "小",
//                "deliverCode": "44444xxx",
//                "deliverAreaStatus": 1,
//                "costPrice": 1200,
//                "deliverAreaId": 100845,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 5,
//                "isInStorage": 0
//              }
//            ],
//            "outWMS": 0
//          }
//        ]
//        this.setStorageShow(_a)
//        return false
        this.getStorageList(_opt)
          .then((rs)=>{
            this.setStorageShow(rs)
          })
      },
      setStorageShow(rs){
          var _storageList = JSON.parse(JSON.stringify(rs))

          _storageList.map((item)=>{
              item.skuStorageVOList.map((subItem)=>{
                subItem.percent = subItem.percent
                subItem.qtyStorageStockChange = 0
                subItem.qtyPresellChange = 0
                if(subItem.deliverAreaStatus == 1 && item.isInStorage != 1){
                  this.storageModel.isMenu = true
                }
              })
          })
          this.storageModel.storageList = _storageList
          this.storageModel.isShow = true
      },
      submitStorageModel(){
        var _storageList = []
        for(let i=0,j=this.storageModel.storageList.length;i<j;i++){
            var _item = this.storageModel.storageList[i]
            let _saveItem = {}
            _saveItem.deliverAreaId = _item.deliverAreaId
            _saveItem.selfSupport = _item.isSelfSupport
            _saveItem.adjustSku = []
            for(let n = 0,m = _item.skuStorageVOList.length;n<m;n++){
                let _subItem = _item.skuStorageVOList[n]
                if(_saveItem.selfSupport){
//                （实物库存+预售库存） >= (订单占用+下单锁库存)
                  if(_subItem.qtyStorageStock+_subItem.qtyPresell + _subItem.qtyPresellChange < _subItem.notDeliverLock+_subItem.notPayLock){
                    this.getToast('发货地：'+_item.sellerMainName+'-'+_item.deliverAreaName +_subItem.skuCode+'可发库存+预售库存应大于订单占用+下单锁库存')
                    _subItem.qtyPresellChange  = -(_subItem.notDeliverLock+_subItem.notPayLock) - _subItem.qtyPresell
                    return false
                  }
                }
                else {
//                  实物库存是否 >= (订单占用+下单锁库存)，
                  if(_subItem.qtyStorageStock+_subItem.qtyStorageStockChange < _subItem.notDeliverLock + _subItem.notPayLock){
                    this.getToast('发货地：'+_item.sellerMainName+'-'+_item.deliverAreaName +_subItem.skuCode+'实物库存应大于订单占用+下单锁库存')
                    _subItem.qtyStorageStockChange = -(_subItem.availCount)
                    return false
                  }
                }
                if(!(_subItem.percent+'').match(/^[0-9]{1}[0-9]*(\.[0-9]{1})?$/g)){
                  this.getToast('发货地：'+_item.sellerMainName+'-'+_item.deliverAreaName +_subItem.skuCode+'新商品库库存占比格式不正确')
                  return false
                }
                if(_subItem.percent/100 > 1){
                  this.getToast('发货地：'+_item.sellerMainName+'-'+_item.deliverAreaName +_subItem.skuCode+'新商品库库存占比不能超过100%')
                  return false
                }
                let _opt = {
                  skuId:_subItem.skuId,
                  qtyStorageStockChange:_subItem.qtyStorageStockChange,
                  qtyPresellChange:_subItem.qtyPresellChange,
                  percent:_subItem.percent
                }
                _saveItem.adjustSku.push(_opt)
            }
            _storageList.push(_saveItem)
        }
        const _saveOpt = {
          stockFormList:_storageList
        }
//        console.log(_storageList)
//        return false
        this.saveStorage(_saveOpt)
          .then((rs)=>{
            this.setStartToast({
              isShow:true,
              msg:'修改成功',
              type:'success'
            })
            this.cancelStorageModel()
          })
      },
      cancelStorageModel(){
        this.storageModel.isShow = false
        this.storageModel.storageList = []
        this.storageModel.isMenu = false

      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      //停用商品
      disableGoods(){
        if(!this.batchList.length){
          this.getToast('请选择基础商品')
          return false
        }
        let _key = 'status'
        for(let i = 0,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i][_key] == 0 ){
            this.$alert('请选择可用的商品进行批量操作。', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
        }
        this.saleGoodsStatusModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.saleGoodsStatusModel.isShow = true
      },
      submitSaleStatus(){
        let _idList = []
        this.batchList.map((item,idx)=>{
          _idList.push(item.baseGoodsId)
        })
        let _opts = {
          baseGoodsIds:JSON.stringify(_idList)
        }
        this.setBaseGoodsUpdateStatus(_opts)
          .then(()=>{
          this.cancelSaleStatus()
          this.initView()
        })
      },
      cancelSaleStatus(){
        this.saleGoodsStatusModel.isShow = false
        this.saleGoodsStatusModel.list = []
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
  .el-input-number--small{
    width: 120px;
    .el-input-number__decrease,.el-input-number__increase{
      width: 20px!important;
    }
  }
  .t-l{
    padding-left: 20px;
    p{
      /*overflow: hidden;*/
      /*text-overflow: ellipsis;*/
      /*white-space: nowrap;*/
    }
  }
  .line-wrap{
    .line{
      padding: 10px 0;
      border-top:1px solid rgb(236, 223, 223);
      &:nth-child(1){
        border-top: none;
      }
      >p{
        display: inline-block;
        width: 150px;
        height: 100%;
        /*border-right: 1px solid rgb(236, 223, 223);*/
        &:last-child{
          /*border-right: none;*/
        }
      }
    }
  }
  .label-sign{
    width: 120px;
  }
</style>
