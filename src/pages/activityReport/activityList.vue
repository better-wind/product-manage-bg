<template>
  <div>
    <div class="title-box">
      {{type == 1 ? '活动提报' : '活动供货价'}}
    </div>
    <div class="section-box">
      <div class="item-box" v-if="type == 1">
        <el-button type="primary" @click="callReport">申报活动</el-button>
      </div>
      <template v-for="(activityItem,index) in reportList">
        <div class="item-box" :key="index">
          <h1>{{activityItem.title}}</h1>
          <v-table-list :activityList="activityList[activityItem.status]" />
          <el-pagination
            @click="handleClick(activityItem.status)"
            @current-change="handleCurrentChangeSaleSetsList($event,activityItem.status)"
            :current-page="pageConfig[activityItem.status].page"
            :page-sizes="[5]"
            small
            :page-size="pageConfig[activityItem.status].rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageConfig[activityItem.status].total">
          </el-pagination>
        </div>
      </template>

    </div>
    <el-dialog title="申报活动" size="super" v-model="reportModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="section-box">
        <div class="item-box">
          <div class="block-box">
            <span class="label-sign">报名活动</span>
            <el-select v-model="reportModel.activityId" @change="changeActivity" style="width: 300px" size="small"  >
              <template v-for="subItem in reportModel.activityList">
                <el-option :label="subItem.name" :value="subItem.code"></el-option>
              </template>
            </el-select>
          </div>
          <div class="block-box">
            <span class="label-sign">活动平台</span>
            {{reportModel.activityDetail.typeList || '--'}}
          </div>
          <div class="block-box">
            <span class="label-sign">活动时间</span>
            {{reportModel.activityDetail.activityStartTime || '--'}}<span v-if="reportModel.activityDetail.activityEndTime">~ {{reportModel.activityDetail.activityEndTime}}</span>
          </div>
          <div class="block-box">
            <span class="label-sign">活动介绍</span>
            {{reportModel.activityDetail.desc || '--'}}
          </div>
        </div>
        <div class="item-box item-table">
          <div class="multiple-box">
            <div class="multiple-wrap">
              <div style="width: 100px">
                批量设置：
              </div>
              <div style="width: 120px">
                <el-input style="width: 100px" class="input-item-middle" size="small" v-model.trim="multipleConfig.activityWholesalePrice" placeholder="活动供货价"></el-input>

              </div>
              <div style="width: 242px">
                <el-radio class="radio" v-model="multipleConfig.isLimitStock" :label="0">否</el-radio>
                <el-radio class="radio" v-model="multipleConfig.isLimitStock" :label="1">是</el-radio>
                <el-input style="width: 80px" v-if="multipleConfig.isLimitStock == 1" size="small" v-model="multipleConfig.stock" placeholder="库存数"></el-input>

              </div>
              <div style="width: 120px">
                <el-radio class="radio" v-model="multipleConfig.isFreeFreight" :label="true">是</el-radio>
                <el-radio class="radio" v-model="multipleConfig.isFreeFreight" :label="false">否</el-radio>
              </div>
            </div>
          </div>
          <el-table  border  ref="multipleTable" :data="reportModel.skuList" style="width: 100%;"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55">

            </el-table-column>

            <el-table-column  label="SKU码" prop="skuCode" width="120" align="center"></el-table-column>
            <el-table-column  label="销售属性" prop="skuName" width="" align="center"></el-table-column>
            <el-table-column  label="发货编码" prop="costPrice" width="" align="center">
              <template scope="scope">
                <div style="">
                  <p v-for="(deliverArea,index) in scope.row.deliverAreas" :key="index">
                    {{deliverArea.deliverCode}}[{{deliverArea.deliverAreaName}}]
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column  label="日常供货价" prop="costPrice" width="100" align="center"></el-table-column>
            <el-table-column  label="活动供货价" prop="activityWholesalePrice" width="120" align="center">
              <template scope="scope">
                <div style="padding: 0 10px">
                  <el-input class="input-item-middle" size="small" v-model.trim="scope.row.activityWholesalePrice" placeholder="活动供货价"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column  label="是否限库存" prop="isLimitStock" width="240" align="center">
              <template scope="scope">
                <div >
                  <el-radio class="radio" v-model="scope.row.isLimitStock" :label="0">否</el-radio>
                  <el-radio class="radio" v-model="scope.row.isLimitStock" :label="1">是</el-radio>
                  <el-input style="width: 80px" v-if="scope.row.isLimitStock == 1" size="small" v-model="scope.row.stock" placeholder="库存数"></el-input>

                </div>
              </template>
            </el-table-column>
            <el-table-column  label="是否包邮" prop="isFreeFreight" width="120" align="center">
              <template scope="scope">
                <div style="padding: 0 10px">
                  <el-radio class="radio" v-model="scope.row.isFreeFreight" :label="true">是</el-radio>
                  <el-radio class="radio" v-model="scope.row.isFreeFreight" :label="false">否</el-radio>
                </div>
              </template>
            </el-table-column>


          </el-table>
        </div>
        <div class="item-box"> <span class="c-red">注：提交后将默认审核通过，请仔细核对信息！</span></div>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="submitModel">确 定</el-button>
        <el-button  @click="cancelModel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import vTableList from '@/pages/activityReport/tableList'
  import {mapActions} from 'vuex'
  export default {
    created(){
        this.initView()
    },
    data:()=>({
      type:1,
      goodsId:'',
      reportList:[
        {
          title:'未开始活动',
          status:0,
        },
        {
          title:'进行中活动',
          status:1,
        },
        {
          title:'已结束活动',
          status:2,
        },
      ],
      activityList:{0:[],1:[],2:[]},
      pageConfig:{
        0:{
            total:0,
            page:1,
            rows:5
          },
        1:{
          total:0,
          page:1,
          rows:5
        },
        2:{
          total:0,
          page:1,
          rows:5
        }
      },
      baseSkuConfig:{
        isFetch:false,
        sellerMainId:'',
        skuList:[]
      },
      reportModel:{
        isShow:false,
        skuList:[],
        activityList:[],
        activityId:'',
        activityDetail:{
//          "typeList": "活动平台",
//          "activityStartTime": "2018-03-10 00:00:00",
//          "activityEndTime": "2018-03-10 00:00:00",
//          "desc": "活动介绍"
        },
        batchList:[]
      },
      multipleConfig:{
        activityWholesalePrice:'',
        isLimitStock:'',
        stock:'',
        isFreeFreight:''
      },
    }),
    methods:{
      ...mapActions(['getSaleActivityList','getBaseGoodsDetail','getReportActivityList','getActivityDetail','submitActivityReport','setStartToast']),
      initView(){
        this.type = this.$route.params.type
        this.goodsId = this.$route.params.goodsId
        this.reportList.map((report)=>{
          this.getActivityList(report.status)
        })

      },
      getActivityList(status){
          let _opts = {
            page:this.pageConfig[status].page,
            rows:this.pageConfig[status].rows,
//            baseGoodsId:this.goodsId,
            status:status
          }
          if(this.type == 1){
            _opts.baseGoodsId = this.goodsId
          } else {
            _opts.saleGoodsId = this.goodsId
          }
          let _params = {
              type:this.type,
              data:_opts
          }
          this.getSaleActivityList(_params)
            .then((rs)=>{
              this.pageConfig[status].total = rs.total
              this.activityList[status] = rs.rows
//              this.$set(this.activityList,status,rs.rows)

            })


      },
      handleCurrentChangeSaleSetsList(page,status){
        this.pageConfig[status].page = page
        this.getActivityList(status)
      },
      callReport(){
          if(!this.baseSkuConfig.isFetch){
              this.callGetBaseGoodsDetail()
          } else {
            this.showViewReport()
          }

      },
      callGetBaseGoodsDetail(){
        this.getBaseGoodsDetail({baseGoodsId:this.goodsId})
          .then((rs)=>{
            this.baseSkuConfig.sellerMainId = rs.sellerMainId
            this.baseSkuConfig.skuList = rs.skuArray
            this.baseSkuConfig.isFetch = true
            this.showViewReport()
          })
      },
      showViewReport(){
        this.getReportActivityList({sellerMainId:this.baseSkuConfig.sellerMainId})
          .then((rs)=>{
            this.reportModel.activityList = rs
          })
        this.baseSkuConfig.skuList.map((sku)=>{
          let _opts = {
              skuCode:sku.skuCode,
              skuName:sku.skuName,
              costPrice:sku.costPrice/100,
              deliverAreas:sku.deliverAreas,
              skuId:sku.id,
              activityWholesalePrice:'',
              stock:'',
              isLimitStock:'',
              isFreeFreight:''
            }
          this.reportModel.skuList.push(_opts)

        })
        this.reportModel.isShow = true
        this.$nextTick(()=>{
          this.defaultToggleRowSelection()
        })
      },
      defaultToggleRowSelection(){
        this.reportModel.skuList.forEach((item)=>{
          this.$refs.multipleTable.toggleRowSelection(item);
        })
      },
      changeActivity(id){
        if(!id) return
        this.getActivityDetail({id})
          .then((rs)=>{
              this.reportModel.activityDetail = rs

          })

      },
      handleSelectionChange(list){
        this.reportModel.batchList = list;
      },
      submitModel(){
        if(!this.reportModel.activityId){
            this.getToast('请选择活动')
            return false
        }
        let _sku = []
        if(!this.reportModel.batchList.length){
          this.getToast('请选择要提报的SKU')
          return false
        }
//        this.reportModel.skuList
        for(let i = 0,j = this.reportModel.batchList.length;i<j;i++){
            let _item = this.reportModel.batchList[i],
                _name = _item.skuName
            if(!(_item.activityWholesalePrice+'')){
                this.getToast(`请填写${_name}活动供货价`)
                return false
            } else if(!(_item.activityWholesalePrice+'').match(RegExpType.Price)){
              this.getToast(`${_name}活动供货价格式不正确`)
              return false
            } else if(Number(_item.activityWholesalePrice) >= Number(_item.costPrice)){
              this.getToast(`${_name}活动供货价应小于日常供货价`)
              return false
            } else if(!(_item.isLimitStock+'')){
              this.getToast(`请选择${_name}是否限库存`)
              return false
            } else if(_item.isLimitStock == 1 && !(_item.stock+'')){
              this.getToast(`请填写${_name}库存数`)
              return false
            } else if(_item.isLimitStock == 1 && (!(_item.stock+'').match(RegExpType.Num) || _item.stock == 0)){
              this.getToast(`${_name}库存数格式不正确`)
              return false
            } else if(!(_item.isFreeFreight+'')){
              this.getToast(`请选择${_name}是否包邮`)
              return false
            }
            let {skuId,activityWholesalePrice,isLimitStock,stock,isFreeFreight} = _item
            let _opts = {
              skuId,activityWholesalePrice,isLimitStock,stock,isFreeFreight
            }
            _sku.push(_opts)
        }

        let _params = {
          activityId:this.reportModel.activityId,
          sku:_sku
        }
//        console.log(_params)
//        return false
        this.submitActivityReport(_params)
          .then(()=>{
            this.setStartToast({
              isShow:true,
              msg:'提报活动成功',
              type:'success'
            })
            this.cancelModel()
//            this.initView()
            if(this.pageConfig[0].page == 1){
              this.getActivityList(0)
            } else {
              this.pageConfig[0].page = 1
            }

          })
      },
      cancelModel(){
        this.reportModel.isShow = false
        this.reportModel.skuList = []
        this.reportModel.activityList = []
        this.reportModel.activityId = ''
        this.reportModel.activityDetail = {}
        this.reportModel.batchList = []
        this.multipleConfig.activityWholesalePrice = ''
        this.multipleConfig.isLimitStock = ''
        this.multipleConfig.stock = ''
        this.multipleConfig.isFreeFreight = ''

      },
      multipleControl(key,val){
        this.reportModel.skuList.map((item)=>{
            item[key] = val
        })
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
      'multipleConfig.activityWholesalePrice':function(newVal,val){
        this.multipleControl('activityWholesalePrice',newVal)
      },
      'multipleConfig.isLimitStock':function(newVal,val){
        this.multipleControl('isLimitStock',newVal)
      },
      'multipleConfig.stock':function(newVal,val){
        this.multipleControl('stock',newVal)

      },
      'multipleConfig.isFreeFreight':function(newVal,val){
        this.multipleControl('isFreeFreight',newVal)

      },

    },
    components:{
      vTableList
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .section-box{
    .multiple-box{
      position: relative;
      height: 40px;
    }
    .multiple-wrap{
      position: absolute;
      top:0;
      right:0;
      overflow: hidden;
      >div{
        height: 40px;
        line-height: 40px;
        float: left;
        text-align: center;
        border-top:1px solid rgb(236, 223, 223);
        border-right:1px solid rgb(236, 223, 223);
        &:first-child{
          border:none;
          border-right:1px solid rgb(236, 223, 223);
        }

      }
    }
  }
</style>
