<template>
  <div class="item-box item-table">
    <el-table  border  :data="activityList" style="width: 100%;">
      <template v-for="(item,index) in configList">
        <el-table-column v-if="item.type == 'applyList'" :render-header="headerTitle" :label="item.label" :width="item.width" align="center">
          <template scope="scope">
            <div class="line-wrap">
              <div class="line" v-for="(sku,skuIndex) in scope.row.applyList" :key="skuIndex">
                <div>{{type == 1 ? sku.skuCode : sku.saleUnitCode}}</div>
                <div>{{sku.name}}</div>
                <div v-if="type == 2">{{sku.skuCode}}</div>
                <div>
                  <p v-for="deliverCode in sku.skuDeliverAreaList">
                    {{deliverCode.deliverCode}} <span v-if="deliverCode.deliverAreaName">[{{deliverCode.deliverAreaName}}]</span>
                  </p>
                </div>
                <div>{{sku.activityWholesalePrice}}</div>

                <div>{{sku.isLimitStock == 1 ? sku.stock : '否'}}</div>
                <div>{{sku.isFreeFreight == 1 ? '' : '不'}}包邮</div>
                <div>{{mapProductStatus[sku.productStatus] || ''}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else :label="item.label" :prop="item.key" :width="item.width" align="center">

        </el-table-column>

      </template>
    </el-table>
  </div>
</template>
<script>
  export default {
    props:['activityList'],
    data:()=>({
      type:'1',
      configList:[
        {
          label:'活动名称',
          key:'name',
          width:'',
          type:''
        },
        {
          label:'活动平台',
          key:'typeList',
          width:'',
          type:''
        },
        {
          label:'开始时间',
          key:'activityStartTime',
          width:'90',
          type:''
        },
        {
          label:'结束时间',
          key:'activityEndTime',
          width:'90',
          type:''
        },
        {
          label:'',
          key:'',
          width:'',
          type:'applyList'
        }
      ],
      configApplyList:[
        {
          label:'SKU码',
          key:'skuCode'
        },
        {
          label:'销售属性',
          key:'saleProperties'
        },
        {
          label:'发货编码',
          key:'deliverCodes'
        },
        {
          label:'活动供货价',
          key:'activityWholesalePrice'
        },
        {
          label:'是否限库存',
          key:'isLimitStock'
        },
        {
          label:'是否包邮',
          key:'isFreeFreight'
        },
        {
          label:'参与状态',
          key:'isFreeFreight'
        }
      ],
      mapProductStatus:{
        1:'正常',
        2:'取消',
        3:'提前结束',
        4:'已排期'
      }
    }),
    created(){
        this.type = this.$route.params.type
        let title = this.type == 1 ?
          'SKU码-销售属性-发货编码-活动供货价-是否限库存-是否包邮-参与状态' :
          '销售单元码-销售属性-SKU码-发货编码-活动供货价-是否限库存-是否包邮-参与状态'
        let width = this.type == 1 ?
          '1052':
          '1202'
        this.configList[4].label = title
        this.configList[4].width = width
    },
    methods:{
      headerTitle(createElement, { column }) {
        let arr =  column.label.split('-'),
          createArr = []
        arr.map((item)=>{
          createArr.push(createElement('div', {class: {'split-title':true}}, item))
        })
        return createElement(
          'div',{class:{'split-title-wrap':true}},
          createArr
        );
      },
    },

  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .line-wrap{
    .line{
      /*padding: 10px 0;*/
      /*display: table-row;*/
      border-top:1px solid rgb(236, 223, 223);
      font-size: 0px;
      overflow: hidden;
      &:nth-child(1){
        border-top: none;
      }
      >div{
        display: table-cell;
        padding: 12px 0;
        width: 150px;
        font-size: 14px;
        vertical-align: middle;
        box-sizing: border-box;
        border-right: 1px solid rgb(236, 223, 223);
        &:last-child{
          border-right: none;
        }
      }
    }
  }
</style>
