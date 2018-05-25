<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <template v-if="salGroupConfig.isGroup">
        <el-button type="primary" @click="moveGroup" size="small">移出组合</el-button>
        <el-button type="primary" @click="editShow" size="small">展现/不展现</el-button>
        <el-button type="primary" @click="sortList" size="small">编辑排序</el-button>
        <el-button type="primary" @click="editStatus" size="small">上架/下架</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="callGroup" size="small">加入组合</el-button>
        <el-button type="primary" @click="editStatus" size="small">上架/下架</el-button>
        <el-button type="primary" @click="batchSelect" size="small">批量选择商品</el-button>

        <el-button v-if="roleMenuDetail['/goods/saleGoods/saveSaleGoods']" type="primary" @click="createSaleGoods" size="small">新建销售商品</el-button>
        <el-button v-else type="primary" @click="noRole()" size="small">新建销售商品</el-button>

        <el-button @click="disableGoods" size="small">删除商品</el-button>

      </template>
    </div>
    <div class="item-table">
      <el-table v-if="saleResultPageName" ref="saleTable" v-loading="loading" element-loading-text="拼命加载中" border @selection-change="handleSelectionChange" :data="searchResult.rows" style="width: 100%;">
        <el-table-column  type="selection" align="center" width="55">

        </el-table-column>
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.type == 'image'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="table-image">
                <img v-if="scope.row.firstSaleGoodsImage && scope.row.firstSaleGoodsImage.url" :src="scope.row.firstSaleGoodsImage.url" style="width: 80px;height: 80px" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'base'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <div class="t-l">
                <p>销售商品码：{{scope.row.saleGoodsCode}}</p>
                <p>销售类型：<span :class="scope.row.saleType && scope.row.saleTypeId == 1 ? '' :  'c-red'">{{scope.row.saleType ? scope.row.saleType.saleTypeName : ''}}</span> </p>
                <p>可用状态：<span :class="scope.row.status == 1 ? '' :  'c-red'">{{scope.row.status == 1 ? '可用' : scope.row.status == 2 ? '删除' : '停用'}}</span> </p>
                <p>销售状态：<span v-if="scope.row.saleStatus == 1">上架</span><span v-else class="c-red">下架</span></p>
                <span class="c-red" v-if="scope.row.message">
                  {{scope.row.message}}
                </span>
                <template v-else>
                  <p><span v-if="scope.row.saleStatusTime">({{scope.row.saleStatusTime | transTimeDate}}{{scope.row.saleStatus == 1 ? '下架' : '上架'}})</span></p>
                </template>
                <!--<p>状态码：{{scope.row.saleType ? scope.row.saleType.saleTypeCode : ''}}</p>-->
                <p v-if="salGroupConfig.isGroup">
                  展现状态：<span v-if="scope.row.isShow == 1">展现</span><span v-else class="c-red"> 不展现 </span>
                </p>
              </div>

            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'name'" :label="item.label" :min-width="item.minWidth" :width="item.width" align="center">
            <template scope="scope">
              <div class="t-l">
                <p>销售长名称：{{scope.row.longTitle}}</p>
                <p>销售短名称：{{scope.row.shortTitle}}</p>
                <p>发货地：{{scope.row.deliverAreaName}}<span v-if="scope.row.realSellerName">({{scope.row.realSellerName}})</span></p>
              </div>

            </template>
          </el-table-column>
          <template v-else-if="item.type == 'sku'" >
            <el-table-column  :render-header="headerTitle" :label="item.saleMap[saleResultPageName].label" :width=752 align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="sku in scope.row.saleUnits">
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitFirstWidth+'px'"><p>{{sku.saleUnitCode}}</p></div>
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'"><span v-if="sku.status == 0 || sku.status == 2" class="c-red">({{sku.status == 0 ? '停用' : '删除'}})</span>{{sku.propertyValues}}</div>
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'">{{sku.price/100}}</div>
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'">{{sku.costPrice/100}}</div>
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'">{{sku.grossRate | grossRateFilter}}</div>
                    <template v-if="saleResultPageName == 'saleGoodsHQBS'">
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'">{{sku.totalProfit}}</div>
                    </template>

                    <template v-if="saleResultPageName != 'saleGoodsGGJ'">
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'">{{sku.availCount}}</div>
                    <div :style="'width:'+ item.saleMap[saleResultPageName].splitWidth+'px'">{{sku.thirtyVolume}}</div>
                    </template>
                  </div>
                </div>

              </template>
            </el-table-column>

          </template>
          <el-table-column v-else-if="item.type == 'saleSets'" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <p v-if="salGroupConfig.isGroup" v-for="saleSet in scope.row.saleSets">
                <template v-if="saleSet.status == 1">
                  <span v-if="salGroupConfig.saleSetsCode == saleSet.saleSetsCode">{{saleSet.title}}</span>
                  <a v-else :href="'/#/saleGroup/list?saleSetsCode='+saleSet.saleSetsCode" target="_blank">{{saleSet.title}}</a>
                </template>
              </p>
              <p v-else>
                <a v-if="saleSet.status == 1" :href="'/#/saleGroup/list?saleSetsCode='+saleSet.saleSetsCode" target="_blank">{{saleSet.title}}</a>
              </p>
            </template>
          </el-table-column>
          <el-table-column  v-else-if="item.type == 'opera'" label="操作" :width="item.width" align="center">
            <template scope="scope">
              <div style="padding: 10px  0">
                <el-button size="small" @click="callSaleStatusList(scope.row.id)">销售排期</el-button>
                <template v-if="scope.row.status == 1">
                  <a v-if="roleMenuDetail['/goods/saleGoods/detail/{saleGoodsId}']" :href="'/#/saleGoods/detail?goodsId='+scope.row.id" target="_blank">
                    <el-button style="margin: 10px 0 0 0" size="small" type="primary">编辑商品</el-button>
                  </a>
                  <el-button style="margin: 10px 0 0 0" v-else size="small" type="primary" @click="noRole()" >编辑商品</el-button>
                  <!--<el-button size="small" @click="editSaleGoods(1,scope.row.id)">编辑商品</el-button>-->
                </template>


                <el-button style="margin: 10px 0 0 0" size="small" @click="storageList(scope.row.id)">销量及库存</el-button>
                <el-button style="margin: 10px 0 0 0" size="small" @click="saleSetsList(scope.row.saleGoodsCode)">销售组合</el-button>
                <a :href="'/#/activity/report/2/'+scope.row.id" target="_blank">
                  <el-button style="margin: 10px 0 0 0" size="small">活动供货价</el-button>
                </a>
                <template v-if="channelConfigStates.channel == 2">
                  <a target="_blank" :href="HQBSGoodsLink[webEnv]+ scope.row.id">
                    <el-button style="margin-top: 10px" type="primary" size="small">预览</el-button>
                  </a>
                </template>
              </div>


            </template>
          </el-table-column>

        </template>
      </el-table>
    </div>
    <template v-if="pageBatchShow">
      <p style="line-height: 70px;padding-left: 20px">
        共 {{searchResult.rows.length}} 条
      </p>

    </template>
    <template v-else>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </template>

    <el-dialog title="新建销售商品" size="small" v-model="createGoodsModel.isShow" :close-on-click-modal="false"  :show-close="false">
     <div class="block-box">
       <span class="label-sign">销售渠道</span>
       <el-select v-model="createGoodsModel.channelType" @change="changeLink" class="input-item-middle" size="small"  >
         <el-option :label="channelConfigStates.channelName" :value="channelConfigStates.channel"></el-option>
       </el-select>
     </div>
      <div class="block-box">
       <span class="label-sign">渠道销售类型</span>
        <el-select v-model="createGoodsModel.saleType" @change="changeLink" class="input-item-middle" size="small"  >
          <template v-for="subItem in saleWayList">
            <el-option :label="subItem.name" :value="subItem.code"></el-option>
          </template>
        </el-select>
     </div>
      <div class="block-box">
        <span class="label-sign">选择创建方式</span>
        <div class="inline-box" style="width: 310px">
          <el-radio v-model="createGoodsModel.createType"  :label="2">快捷创建</el-radio>
          <div v-if="createGoodsModel.createType == 2" class="inline-box">
            基础商品码：<el-input size="small" style="width: 140px" class="input-item" v-model.trim="createGoodsModel.baseGoodsId" placeholder="请输入基础商品码"></el-input>
          </div>
          <br />
          <el-radio  v-model="createGoodsModel.createType"  :label="1">常规创建</el-radio>



        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSaleEditModel">取 消</el-button>
        <a :href="linkHref" target="_blank" v-if="linkTarget">
          <el-button type="primary">下一步</el-button>
        </a>
        <el-button v-else type="primary" @click="editSaleGoods(2)">下一步</el-button>
      </div>
    </el-dialog>
    <el-dialog title="加入组合" size="large" v-model="saleGroupModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
       <span class="label-sign">加入组合</span>
       <el-select placeholder="请输入组合名称进行搜索" class="input-item-middle"  filterable clearable remote :remote-method="remoteMethodGroup"  v-model="saleGroupModel.saleSetsId" size="small" style="width: 300px!important;" >
         <template v-for="subItem in saleGroupModel.saleTypeOpts">
           <el-option :label="subItem.label" :value="subItem.value"></el-option>
         </template>
       </el-select>
     </div>
      <div class="block-box">
        <span class="label-sign">已选销售商品</span>
      </div>
      <div class="item-table">
        <el-table :data="saleGroupModel.pageList" style="width: 100%;">
          <el-table-column prop="saleGoodsCode" label="销售商品码" width="" align="center"></el-table-column>
          <el-table-column prop="longTitle" label="销售长名称" width="" align="center"></el-table-column>
          <el-table-column prop="deliverAreaName" label="发货地" width="" align="center">
            <template scope="scope">
              {{scope.row.deliverAreaName}}<span v-if="scope.row.realSellerName">({{scope.row.realSellerName}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="saleGoodsCode" label="操作" width="" align="center">
            <template scope="scope">
              <el-button size="small" @click="delGroupList(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="item-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="saleGroupModel.paging.page"
          :page-sizes="[10]"
          small
          :page-size="saleGroupModel.paging.rows"
          layout="total, sizes, prev, pager, next"
          :total="saleGroupModel.paging.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroup">保存</el-button>
        <el-button @click="cancelGroup">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量选择商品" size="small" v-model="batchSelectModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <span class="label-sign" style="display: inline">请输入销售商品码(SG)</span>
        <el-input type="textarea" placeholder="请输入销售商品码(SG),多个可用,，、空格或者换行分割"  :rows="2" v-model.trim="batchSelectModel.saleCode"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBatchSelect">保存</el-button>
        <el-button @click="cancelBatchSelect">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑排序" size="large" v-model="groupSortModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="item-table">
        <el-table :data="groupSortModel.list" max-height="300" style="width: 100%;">
          <el-table-column  label="排序" width="80" align="center">
              <template scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
          <el-table-column prop="saleGoodsCode" label="销售商品码" width="160" align="center"></el-table-column>
          <el-table-column prop="longTitle" label="销售长名称"  align="center"></el-table-column>
          <el-table-column prop="deliverAreaName" label="发货地" width="120" align="center"></el-table-column>
          <el-table-column prop="saleGoodsCode" label="操作" width="120" align="center">
              <template scope="scope">
                <el-input v-model="scope.row.sort" size="small" style="width: 100px" @blur="sortListBlur" @change="sortListChange(scope.row.sort,scope.row)"></el-input>
                <!--<el-button v-if="scope.$index" size="small" @click="sortListIdx(scope.$index,1)">上移</el-button>-->
                <!--<el-button v-if="scope.$index != groupSortModel.list.length-1" size="small" @click="sortListIdx(scope.$index,2)">下移</el-button>-->
              </template>
            </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroupSort">保存</el-button>
        <el-button @click="cancelGroupSort">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="saleGroupStatusModel.type == 1 ? '设置销售商品不展现' : '设置销售商品展现'" size="tiny" v-model="saleGroupStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{saleGroupStatusModel.list.length}} 个【{{saleGroupStatusModel.type == 1 ? '展现' : '不展现'}}】商品，是否将其设置为【{{saleGroupStatusModel.type == 1 ? '不展现' : '展现'}}】？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroupStatus">确认</el-button>
        <el-button @click="cancelGroupStatus">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置商品删除" size="tiny" v-model="saleGoodsStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box">
        <p>已选择 {{saleGoodsStatusModel.saleStatus}} 个【上架】商品，{{saleGoodsStatusModel.disSaleStatus}} 个【下架】商品，删除后不可恢复可用，上架商品将立即下架，是否确认删除？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSaleStatus">确认</el-button>
        <el-button @click="cancelSaleStatus">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="saleGoodsSaleModel.type == 1 ? '设置销售商品下架' : '设置销售商品上架'" size="tiny" v-model="saleGoodsSaleModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="block-box goods-sale-item">
        <p>已选择 {{saleGoodsSaleModel.list.length}} 个【{{saleGoodsSaleModel.type == 1 ? '上架' : '下架'}}】商品，请选择{{saleGoodsSaleModel.type == 1 ? '下架' : '上架'}}方式:</p>
        <template v-if="saleGoodsSaleModel.type == 1">
          <div>
            <el-radio class="radio" v-model="saleGoodsSaleModel.chooseType" label="1">立即下架</el-radio>
          </div>
          <div>
            <el-radio class="radio" v-model="saleGoodsSaleModel.chooseType" label="2">定时下架</el-radio>
            <el-date-picker v-if="saleGoodsSaleModel.chooseType == 2" v-model="saleGoodsSaleModel.opts.offTime" type="datetime"
                            placeholder="请选择下架时间"
                            @change="checkStatusTime('下架','offTime')"
                            class="input-item-middle input-item-large" size="small">
            </el-date-picker>
          </div>

        </template>
        <template v-else>
          <div>
            <el-radio class="radio" v-model="saleGoodsSaleModel.chooseType" label="1">立即上架</el-radio>
          </div>
          <div>
            <span style="padding-left: 22px">定时下架</span>
            <el-date-picker v-if="saleGoodsSaleModel.chooseType == 1" v-model="saleGoodsSaleModel.opts.offTime" type="datetime"
                            placeholder="请选择下架时间"
                            @change="checkStatusTime('下架','offTime')"
                            class="input-item-middle input-item-large" size="small">
            </el-date-picker>
          </div>
          <div>
            <el-radio class="radio" v-model="saleGoodsSaleModel.chooseType" label="2">定时上架</el-radio>
            <el-date-picker v-if="saleGoodsSaleModel.chooseType == 2" v-model="saleGoodsSaleModel.opts.onTime" type="datetime"
                            placeholder="请选择上架时间"
                            @change="checkStatusTime('上架','onTime')"
                            class="input-item-middle input-item-large" size="small">
            </el-date-picker>
          </div>
          <div>
            <span style="padding-left: 22px">定时下架</span>
            <el-date-picker v-if="saleGoodsSaleModel.chooseType == 2" v-model="saleGoodsSaleModel.opts.offTime" type="datetime"
                            placeholder="请选择下架时间"
                            @change="checkStatusTime('下架','offTime')"
                            class="input-item-middle input-item-large" size="small">
            </el-date-picker>
          </div>


        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGoodsSale">确认</el-button>
        <el-button @click="cancelGoodsSale">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog  :title="'销量和库存'" size="large" v-model="storageModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="item-table mg-t-h mg-b">
          <el-table  border :row-class-name="tableRowClassName" :data="storageModel.list" style="width: 100%;">
            <el-table-column label="销售属性值" prop="name" align="center">
              <template scope="scope">
                <span  :class="scope.row.status == 0 || scope.row.status == 2 ? 'c-red' : ''">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联SKU码" prop="skuCode" align="center"> </el-table-column>
            <el-table-column label="SKU销售属性" prop="skuName" align="center"> </el-table-column>
            <el-table-column label="销售件数" prop="count" align="center"> </el-table-column>
            <el-table-column label="销售总价" prop="price" align="center">
              <template scope="scope">
                <span>{{scope.row.price ?  scope.row.price * scope.row.count : ''}}</span>
              </template>
            </el-table-column>
            <!--<el-table-column label="待付款锁定" prop="availCount" align="center"> </el-table-column>-->
            <el-table-column label="可售库存" prop="availCount" align="center"> </el-table-column>
            <el-table-column label="销量" prop="saleVolume" align="center"> </el-table-column>
            <el-table-column label="近30日销量" prop="thirtyVolume" align="center"> </el-table-column>
          </el-table>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="cancelStorageModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog  title="销售排期" size="large" v-model="saleStatusListModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="item-table mg-t-h mg-b">
          <el-table  border  :data="saleStatusListModel.list" style="width: 100%;" max-height="500">
            <template v-for="item in saleStatusListModel.configItem">
              <el-table-column v-if="item.type == 'status'" :label="item.label" :prop="item.key" align="center">
                <template scope="scope">
                  <span  :class="scope.row.saleStatus == 0 ? 'c-red' : ''">{{scope.row.saleStatus == 1 ? '上架' : '下架'}}</span>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.type == 'time'" :label="item.label" :prop="item.key" align="center">
                <template scope="scope">
                  <span v-if="scope.row[item.key]">{{scope.row[item.key] | transTimeDate}}</span>
                </template>
              </el-table-column>
              <el-table-column v-else :label="item.label" :prop="item.key" align="center"> </el-table-column>
            </template>
          </el-table>
      </div>
      <el-pagination
        @current-change="handleCurrentChangeSaleStatus"
        :current-page="saleStatusListModel.opts.page"
        :page-sizes="[20]"
        small
        :page-size="saleStatusListModel.opts.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="saleStatusListModel.opts.total">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="cancelSaleStatusListModel">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="销售组合" size="small" v-model="saleSetsListModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <div class="item-table mg-t-h mg-b">
        <el-table  border  :data="saleSetsListModel.list" style="width: 100%;" max-height="500">
          <el-table-column  label="销售组合码" prop="saleSetsCode" align="center">
          </el-table-column>
          <el-table-column label="销售组合名称" prop="title" align="center">
              <template scope="scope">
                <a v-if="scope.row.status == 1" :href="'/#/saleGroup/list?saleSetsCode='+scope.row.saleSetsCode+'&channel='+channelSetsType" target="_blank">{{scope.row.title}}</a>

              </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @current-change="handleCurrentChangeSaleSetsList"
        :current-page="saleSetsListModel.opts.page"
        :page-sizes="[20]"
        small
        :page-size="saleSetsListModel.opts.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="saleSetsListModel.total">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="cancelSaleSetsListModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'

  export default{
    computed:{
      ...mapState(['channelConfigStates','searchConfig','searchParams','saleWayList','roleMenuDetail','webEnv'])
    },
    created(){
      this.initView()
    },
    props:['salGroupConfig'],
    filters:{
      transTimeDate(rs){
        let _str = UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',new Date(rs))
        return _str
      },
      grossRateFilter(rs){
        let _rate = (Number(rs).toFixed(2)+'').replace(/\.?0+$/,'')

        return _rate ? _rate+'%' :  '--'
      }
    },
    data:()=>({
      HQBSGoodsLink:{
        'dev':'https://test-font.51bushou.com/h5/product/detail/',
        'prod':'https://m.51bushou.com/h5/product/detail/'
      },
      loading:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      pageBatchShow:false,
      searchResult:{},
      mapChannels:{
        1:'格格家',
        2:'环球捕手',
        3:'燕网',
        4:'第三方',
        5:'B2B',
        6:'脉宝云店',
        7:'燕窝酵素'
      },
      createGoodsModel:{
        isShow:false,
        saleType:'',
        createType:2,
        channelType:'',
        baseGoodsId:'',
      },
      linkTarget:false,
      linkHref:'',
      batchList:[],
      saleGroupModel:{
        isShow:false,
        list:[],
        pageList:[],
        paging:{
          total:0,
          page:1,
          rows:10
        },
        saleType:'',
        saleSetsId:'',
        saleTypeOpts:[]
      },
      batchSelectModel:{
        isShow:false,
        saleCode:''
      },
      groupSortModel:{
        list:[],
        isShow:false
      },
      saleGroupStatusModel:{
        type:'',
        list:[],
        isShow:false
      },
      saleGoodsSaleModel:{
        type:'',
        list:[],
        isShow:false,
        opts:{
          type:'',
          onTime:'',
          offTime:''
        },
        chooseType:''
      },
      saleSetsId:'',
      storageModel:{
        isShow:false,
        list:[]
      },
      saleGoodsStatusModel:{
        isShow:false,
        list:[],
        disSaleStatus:0,
        saleStatus:0
      },
      saleStatusListModel:{
        isShow:false,
        list:[],
        configItem:[
          {
            label:'操作',
            key:'saleStatus',
            type:'status'
          },
          {
            label:'生效时间',
            key:'effectiveTime',
            type:'time'
          },
          {
            label:'操作时间',
            key:'operateTime',
            type:'time'
          },
          {
            label:'操作人',
            key:'operatorName'
          }
        ],
        opts:{
          page:1,
          rows:20,
          total:0,
          saleGoodsId:''
        }
      },
      saleSetsListModel:{
        isShow:false,
        list:[],
        opts:{
          page:1,
          rows:20,
          saleGoodsCode:''
        },
        saleGoodsCode:'',
        total:0,
      },
      saleResultPageName:'',
      mapChannel:{
        1:'saleGoodsGGJ',
        2:'saleGoodsHQBS',
        8:'saleGoodsMSMS'
      },
      channelSetsType:'',
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast','getSaleProductList','checkCreateBaseGoods','saveJoinGroup','getGroupSaleTypeList'
      ,'groupProductSort','setBatchExport','getSaleStorageList',
      'setSaleGoodsSaleStatus','setSaleGoodsUpdateStatus','getSaleStatusList',
      'getSaleGroupList']),
      noRole(){
        this.getToast('权限不足，请联系主管申请。')
        return false
      },
      initView(){
        let _opts = {
          channel : this.channelConfigStates.channel
        }

        if(this.$route.name == 'saleGroupList'){
          this.saleResultPageName = this.mapChannel[this.$route.query.channel]
          this.channelSetsType = this.$route.query.channel
        } else {
          this.saleResultPageName = this.$route.name
          this.channelSetsType = this.channelConfigStates.channel
        }


        // saleGoodsGGJ
        // saleGoodsHQBS
        // saleGoodsMSMS
        const query = UtilTool.parseQuery(this.$route.query)
        let params = UtilTool.paramsAssign(query,this.searchParams,_opts)
        if(this.salGroupConfig.isGroup && this.salGroupConfig.saleSetsCode){
          params.saleSetsCode = this.salGroupConfig.saleSetsCode
          params.source = 1
          this.saleSetsId = this.salGroupConfig.saleSetsId
        }
        this.setPageBatchExport(false,[])

        if((params.marginGrossStart && !params.marginGrossStart.match(RegExpType.negativePrice)) || (params.marginGrossEnd && !params.marginGrossEnd.match(RegExpType.negativePrice))){
          setTimeout(function(){
            this.getToast('定价毛利率格式不正确')
          }.bind(this),300)

          // params.marginGrossStart = ''
          // params.marginGrossEnd = ''
          this.setSearchParams(params)
          // this.searchList(params)
          return false
        }
        if(params.marginGrossEnd || params.marginGrossStart){
          params.marginGrossStart = params.marginGrossStart ? params.marginGrossStart : (Number(params.marginGrossEnd) - 10) + ''
          params.marginGrossEnd = params.marginGrossEnd ? params.marginGrossEnd : (Number(params.marginGrossStart) + 10) + ''
        }
        if(params.marginGrossEnd && params.marginGrossStart){
          params.marginGrossEnd = Number(params.marginGrossEnd) - Number(params.marginGrossStart) > 10 ? (Number(params.marginGrossStart) + 10)+'' : params.marginGrossEnd
        }
        this.setSearchParams(params)
        this.searchList(params)
      },
      setPageBatchExport(check,rs){
        let _batchExport = {
          isBatch:check,
          batchList:rs
        }
        this.setBatchExport(_batchExport)
      },
      searchList(params){
        this.loading = true
        this.pageBatchShow = false
        return new Promise((reslove)=>{
          this.getSaleProductList(params)
            .then((item)=>{
              this.searchResult = item
              reslove()
              this.setPage()
            },()=>{
              this.pagingShow = true
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
      createSaleGoods(){
        this.createGoodsModel.isShow = true
        this.createGoodsModel.channelType = this.channelConfigStates.channel
        this.linkTarget = false
      },
      cancelSaleEditModel(){
        this.createGoodsModel.isShow = false
        this.createGoodsModel.saleType = ''
        this.createGoodsModel.createType = 2
        this.createGoodsModel.channelType = ''
        this.createGoodsModel.baseGoodsId = ''
      },
      editSaleGoods(type,id){
        switch (type){
          case 1:
            this.$router.push({
              name: 'saleGoodsDetail',
              query:{
                goodsId:id
              }
            })
              break
          case 2:
            if(!this.createGoodsModel.channelType){
              this.getToast('请选择销售渠道')
              return false
            }
            if(!this.createGoodsModel.saleType){
              this.getToast('请选择渠道销售类型')
              return false
            }
            if(this.createGoodsModel.createType == 2 && !this.createGoodsModel.baseGoodsId){
              this.getToast('请输入基本商品码')
              return false
            }

            let query = {
              type:'new',
              channelType:this.createGoodsModel.channelType,
              saleType:this.createGoodsModel.saleType
            }
            if(this.createGoodsModel.createType == 2){
              let _opt = {
                baseGoodsCode:this.createGoodsModel.baseGoodsId
              }
              this.checkCreateBaseGoods(_opt)
                .then((rs)=>{
                  if(rs < 1){
                    this.getToast('当前基础商品码不能快捷创建销售商品')
                    return false
                  }
                  query.baseGoodsId = rs
//                  let _s = []
//                  for(let i in query){
//                    _s.push(i+'='+query[i])
//                  }
//                  this.linkHref = '/#/saleGoods/detail?'+_s.join('&')
//                  this.linkTarget = true
                  this.$router.push({
                    name: 'saleGoodsDetail',
                    query:query
                  })
                })
            }
            else {
//              this.$router.push({
//                name: 'saleGoodsDetail',
//                query:query
//              })
            }

              break
        }

      },
      changeLink(){
         if(this.createGoodsModel.createType == 1 && this.createGoodsModel.channelType && this.createGoodsModel.saleType){
           this.linkHref = '/#/saleGoods/detail?type=new&channelType='+this.createGoodsModel.channelType+'&saleType='+this.createGoodsModel.saleType
           this.linkTarget = true
         } else {
           this.linkTarget = false
         }
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
          createArr = [],
          _len = arr.length
        5 ,8 ,7
        arr.map((item,index)=>{
          if(_len == 5){
            createArr.push(createElement('div', {class: {'split-title-f':true}}, item))
          } else if(_len == 7){
            createArr.push(createElement('div', {class: {'split-title-s':true}}, item))
          } else if(_len == 8){
            createArr.push(createElement('div', {class: {'split-title-e':true}}, item))
          }
        })
        return createElement(
          'div',
          {class:{'split-title-flex-wrap':true}},
          createArr
        );
      },
      //销量库存
      storageList(id){
          const _opt = {
            saleGoodsId:id
          }
          this.getSaleStorageList(_opt)
            .then((rs)=>{
              this.setStorageList(rs)
            })
      },
      setStorageList(rs){
        let _list = []
        rs.map((item)=>{
            let _obj = {
              name:item.propertyValues,
              skuCode:'',//关联SKU码
              skuName:'',//SKU销售属性
              count:'',//销售件数
              price:'',//销售价,
              saleVolume:item.saleVolume,//销售件数
              thirtyVolume:item.thirtyVolume,//销售件数
              availCount:item.availCount,//可售库存
            }
          _list.push(_obj)
          item.unitSKUs.map((subItem)=>{
            let _proList = []
            subItem.properties.map((_pro)=>{
              _proList.push(_pro.pvName)
            })
            let _subObj = {
              name:subItem.status == 1 ? '可用' : subItem.status == 2 ? '删除' :'停用',
              status:subItem.status,
              skuCode:subItem.skuCode,//关联SKU码
              skuName:_proList.join('-') || '默认',//SKU销售属性
              count:subItem.count,//销售件数
              price:subItem.price / 100,//销售价,
              availCount:subItem.availCount,//可售库存
            }
            _list.push(_subObj)
          })
        })
        this.storageModel.list = _list
        this.storageModel.isShow = true
      },
      cancelStorageModel(){
        this.storageModel.list = []
        this.storageModel.isShow = false
      },
      tableRowClassName(row, index) {
        if (!row.skuCode) {
          return 'sale-unit-row';
        } else{
          return '';
        }

      },
      //批量选择商品
      resetSearch(){
        let params = {}
        this.searchConfig.searchItem.map((item)=>{
          if(item.items){
            item.items.map((subItem)=>{
              params[subItem.key] = subItem.intKey
            })
          } else {
            params[item.key] = item.intKey
          }

        })
        this.setSearchParams(params)
      },
      batchSelect(){
        this.batchSelectModel.isShow = true
      },
      cancelBatchSelect(){
        this.batchSelectModel.saleCode = ''
        this.batchSelectModel.isShow = false
      },
      submitBatchSelect(){
        if(!this.batchSelectModel.saleCode){
          this.getToast('请输入销售商品码')
          return false
        }
        let _codeList = this.batchSelectModel.saleCode.split(/[,，、\s]/g).filter((item)=>item);
        let _opt = {
          page:1,
          rows:_codeList.length,
          saleGoodsCode:_codeList,
          channel:this.channelConfigStates.channel
        }
//        this.resetSearch()
        this.setPageBatchExport(true,_codeList)
        this.searchList(_opt)
          .then(()=>{
            this.searchResult.rows.map((item)=>{
              this.$refs.saleTable.toggleRowSelection(item);
            })
            this.pageBatchShow = true
          })
        this.cancelBatchSelect()
      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      //加入组合
      callGroup(){
        if(!this.batchList.length){
          this.getToast('请选择销售商品')
          return false
        }
        let _saleTypeId = this.batchList[0].saleTypeId
        for(let i = 1,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i].saleTypeId != _saleTypeId){
            this.getToast('所选销售商品的销售类型必须一致')
            return false
          }
        }
        this.saleGroupModel.saleType = _saleTypeId
        this.saleGroupModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.saleGroupModel.saleSetsId = ''
        this.saleGroupModel.paging.page = 1
        this.saleGroupModel.paging.rows = 10
        this.handleCurrentChange(1)
        this.saleGroupModel.isShow = true
//        let _opts = {
//          channel:this.channelConfigStates.channel,
//          saleTypeId:_saleTypeId
//        }
//        this.getGroupSaleTypeList(_opts)
//          .then((rs)=>{
//            this.saleGroupModel.saleTypeOpts = []
//            rs.map((item)=>{
//                let _opts = {
//                  label:item.title,
//                  value:item.id
//                }
//                this.saleGroupModel.saleTypeOpts.push(_opts)
//            })
//            this.saleGroupModel.saleSetsId = ''
//            this.saleGroupModel.paging.page = 1
//            this.saleGroupModel.paging.rows = 10
//            this.handleCurrentChange(1)
//            this.saleGroupModel.isShow = true
//          })
      },
      remoteMethodGroup(query){
        if(!query){
          this.saleGroupModel.saleTypeOpts = []
          return false
        }
        let _opts = {
          channel:this.channelConfigStates.channel,
          saleTypeId:this.saleGroupModel.saleType,
          title:query
        }

        this.getGroupSaleTypeList(_opts)
          .then((rs)=>{
            this.saleGroupModel.saleTypeOpts = []
            rs.map((item)=>{
              let _opts = {
                label:item.saleSetsCode + ' - ' + item.title,
                value:item.id
              }
              this.saleGroupModel.saleTypeOpts.push(_opts)
            })
          })
      },
      handleCurrentChange(val){
        this.saleGroupModel.paging.page = val || this.saleGroupModel.paging.page
        let _idx = (this.saleGroupModel.paging.page - 1) * this.saleGroupModel.paging.rows
        let _end = this.saleGroupModel.paging.rows * this.saleGroupModel.paging.page
        this.saleGroupModel.paging.total = this.saleGroupModel.list.length
        this.saleGroupModel.pageList = this.saleGroupModel.list.slice(_idx,_end)
      },
      delGroupList(idx){
        let _idx = (this.saleGroupModel.paging.page - 1) * this.saleGroupModel.paging.rows + idx
        this.saleGroupModel.list.splice(_idx,1)
        this.handleCurrentChange()
      },
      cancelGroup(){
        this.saleGroupModel.groupId = ''
        this.saleGroupModel.isShow = false
      },
      submitGroup(){
         if(!this.saleGroupModel.saleSetsId){
           this.getToast('请选择要加入的组合')
           return false
         }
         if(!this.saleGroupModel.list.length){
           this.getToast('请添加销售商品')
           return false
         }
         let setsGoods = []
         this.saleGroupModel.list.map((item,idx)=>{
             let _opt = {
               saleGoodsId:item.id,
               sort:idx,
               isShow:1
             }
           setsGoods.push(_opt)
         })
        let _opts = {
          saleSetsId:this.saleGroupModel.saleSetsId,
          setsGoods
        }
        this.saveJoinGroup(_opts)
          .then(()=>{
            this.setStartToast({
              isShow:true,
              msg:'加入成功',
              type:'success'
            })
            this.cancelGroup()
            this.initView()
          })

      },
      //移出组合
      moveGroup(){
        if(!this.batchList.length){
          this.getToast('请选择要移出的销售商品')
          return false
        }
        let _opts = {
          saleSetsId:this.saleSetsId,
          setsGoods:[]
        }
        this.batchList.map((item,idx)=>{
          let _opt = {
            saleGoodsId:item.id
          }
          _opts.setsGoods.push(_opt)
        })
        this.$confirm('是否确认将已选择的销售商品移出组合?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupProductSort(_opts)
            .then(()=>{
              this.initView()
            })
        }).catch(()=>{})

      },
      //编辑展现
      editShow(){
        if(!this.batchList.length){
          this.getToast('请选择销售组合商品')
          return false
        }
        let _status = this.batchList[0].isShow
        for(let i = 1,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i].isShow != _status){
            this.$alert('请选择展现/不展现状态一致的商品进行批量操作。', '提示', {
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
        let _opts = {
          saleSetsId:this.saleSetsId,
          setsGoods:[]
        }
        this.batchList.map((item,idx)=>{
          let _opt = {
            saleGoodsId:item.id,
            isShow:this.saleGroupStatusModel.type == 1 ? 0 : 1
          }
          _opts.setsGoods.push(_opt)
        })
        this.groupProductSort(_opts)
          .then(()=>{
            this.cancelGroupStatus()
            this.initView()
          })
      },
      cancelGroupStatus(){
        this.saleGroupStatusModel.isShow = false
      },
      //编辑上下架
      editStatus(){
        if(!this.batchList.length){
          this.getToast('请选择销售商品')
          return false
        }
        let _key = 'saleStatus'
        let _status = this.batchList[0][_key]
        for(let i = 0,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i][_key] != _status && i != 0){
            this.$alert('请选择上架/下架状态一致的商品进行批量操作。', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
          if(this.batchList[i].status != 1){
            this.$alert('请选择可用的商品进行上下架。', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
        }
        this.saleGoodsSaleModel.type = _status
        this.saleGoodsSaleModel.chooseType = '1'
        this.saleGoodsSaleModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.saleGoodsSaleModel.isShow = true
      },
      submitGoodsSale(){
        if(!this.saleGoodsSaleModel.chooseType){
          this.getToast('请选择'+ (this.saleGoodsSaleModel.type == 1 ? '下' : '上') +'架方式')
          return false
        }
        //下架
        if(this.saleGoodsSaleModel.type == 1){
          this.saleGoodsSaleModel.opts.type = 0
          if(this.saleGoodsSaleModel.chooseType == 1){
                //立即下架
              this.saleGoodsSaleModel.opts.offTime = ''
            }
          else {
              if(!this.saleGoodsSaleModel.opts.offTime)  {
                this.getToast('请选择下架时间')
                return false
              }
              if(this.saleGoodsSaleModel.opts.offTime.getTime() < new Date().getTime() + 3600000){
                this.getToast('下架时间至少大于当前时间1小时')
                return false
              }
            }
        }
        //上架
        else {
          this.saleGoodsSaleModel.opts.type = 1
          if(this.saleGoodsSaleModel.chooseType == 1){
            //立即下架
          }
          else {
            if(!this.saleGoodsSaleModel.opts.onTime)  {
              this.getToast('请选择上架时间')
              return false
            }
            if(this.saleGoodsSaleModel.opts.offTime && this.saleGoodsSaleModel.opts.offTime < this.saleGoodsSaleModel.opts.onTime){
              this.getToast('下架时间应该大于上架时间')
              return false
            }
          }
        }

//        this.saleGoodsSaleModel.opts.offTime = UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',this.saleGoodsSaleModel.opts.offTime)
//        this.saleGoodsSaleModel.opts.onTime = UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',this.saleGoodsSaleModel.opts.onTime)
        let _idList = []
        this.batchList.map((item,idx)=>{
          _idList.push(item.id)
        })
        let _opts = {
          ...this.saleGoodsSaleModel.opts,
          ids:_idList
        }
        this.setSaleGoodsSaleStatus(_opts)
          .then(()=>{
            this.cancelGoodsSale()
            this.loading = true
            setTimeout(function(){
               this.initView()
            }.bind(this),1000)
          })
      },
      checkStatusTime(str,time){

        if(this.saleGoodsSaleModel.opts[time] && this.saleGoodsSaleModel.opts[time].getTime() < new Date().getTime() + 3600000){
          this.getToast(str+'时间至少大于当前时间1小时')
          this.saleGoodsSaleModel.opts[time] = ''
        }
      },
      cancelGoodsSale(){
        this.saleGoodsSaleModel.opts.onTime = ''
        this.saleGoodsSaleModel.opts.offTime = ''
        this.saleGoodsSaleModel.chooseType = ''
        this.saleGoodsSaleModel.isShow = false
      },
      //停用商品
      disableGoods(){
        if(!this.batchList.length){
          this.getToast('请选择销售商品')
          return false
        }
        let _key = 'status'
        for(let i = 0,_len = this.batchList.length;i<_len;i++){
          if(this.batchList[i][_key] != 1 ){
            this.$alert('请选择可用的商品进行批量操作。', '提示', {
              confirmButtonText: '我知道了',
            })
            return false
          }
        }
        this.batchList.map((item)=>{
          item.saleStatus == 1 ? this.saleGoodsStatusModel.saleStatus ++ : this.saleGoodsStatusModel.disSaleStatus ++
        })
        this.saleGoodsStatusModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.saleGoodsStatusModel.isShow = true
      },
      submitSaleStatus(){
        let _idList = []
        this.batchList.map((item,idx)=>{
          _idList.push(item.id)
        })
//        let _opts = {
//          ids:_idList,
//        }
        let _opts = {
          ids:_idList.join(','),
          status:2
        }
        this.setSaleGoodsUpdateStatus(_opts)
          .then(()=>{
            this.cancelSaleStatus()
            this.initView()
          })
      },
      cancelSaleStatus(){
        this.saleGoodsStatusModel.isShow = false
        this.saleGoodsStatusModel.list = []
        this.saleGoodsStatusModel.saleStatus = 0
        this.saleGoodsStatusModel.disSaleStatus = 0
      },
      //销售排期
      callSaleStatusList(id){
        this.saleStatusListModel.opts.saleGoodsId = id
        this.callGetSaleStatusList()
        this.saleStatusListModel.isShow = true
      },
      callGetSaleStatusList(){
        const {page,rows,saleGoodsId} = this.saleStatusListModel.opts
        let _opt = {
          page,
          rows,
          saleGoodsId
        }
        this.getSaleStatusList(_opt)
          .then((rs)=>{
            this.saleStatusListModel.list = rs.rows
            this.saleStatusListModel.opts.total = rs.total

          })
      },
      handleCurrentChangeSaleStatus(page){
        this.saleStatusListModel.opts.page = page
        if(this.saleStatusListModel.isShow){
          this.callGetSaleStatusList()
        }

      },
      cancelSaleStatusListModel(){
        this.saleStatusListModel.isShow = false
        this.saleStatusListModel.list = []
        this.saleStatusListModel.opts = {
          page:1,
          rows:20,
          total:0,
          saleGoodsId:''
        }
      },
      //组合商品票排序 先写功能
      sortList(){

        let _opts = {
          page:1,
          rows:10000,
//          rows:this.searchResult.total,
          channel : this.channelConfigStates.channel,
          saleSetsCode : this.salGroupConfig.saleSetsCode,
//          status:this.searchParams.status,
          source : 1
        }
        this.getSaleProductList(_opts)
          .then((rs)=>{
            this.groupSortModel.list = JSON.parse(JSON.stringify(rs.rows))
//            this.groupSortModel.list.map((item,idx)=>{
//              item.sort = this.groupSortModel.list.length - idx
//            })
            this.groupSortModel.isShow = true
          })
      },
      sortListChange(val,rs){

        if(!(val+'').match(RegExpType.Num)){
          this.$nextTick()
            .then(()=>{
              rs.sort = ''
            })
        }


      },
      sortListBlur(){
        this.groupSortModel.list.sort(function(b,a){
          if (a.sort < b.sort ) {           // 按某种排序标准进行比较, a 小于 b
            return -1;
          }
          if (a.sort > b.sort ) {
            return 1;
          }
          if(a.sort == b.sort){
            return b.id - a.id
          }
          // a must be equal to b
//          return 0;
        })
      },
      sortListIdx(idx,type){
        let _cur = this.groupSortModel.list[idx],
            _nIdx = type == 1 ? idx - 1 : idx + 1
        this.groupSortModel.list[idx] = this.groupSortModel.list[_nIdx]
        this.groupSortModel.list[_nIdx] = _cur
        this.groupSortModel.list.push({})
        this.groupSortModel.list.pop()
      },
      cancelGroupSort(){
        this.groupSortModel.isShow = false
      },
      submitGroupSort(){
        let _opts = {
          saleSetsId:this.saleSetsId,
          setsGoods:[]
        }
        for(let i = 0,j=this.groupSortModel.list.length;i<j;i++){
            let item = this.groupSortModel.list[i]
            if(!(item.sort+'')){
              this.getToast('请填写'+item.longTitle+'排序值')
              return false
            }
          let _opt = {
            saleGoodsId:item.id,
            sort:item.sort
          }
          _opts.setsGoods.push(_opt)
        }
//        this.groupSortModel.list.map((item,idx)=>{
////          console.log(item)
//          let _opt = {
//            saleGoodsId:item.id,
////            sort:this.groupSortModel.list.length - idx
//            sort:item.sort
//          }
//          _opts.setsGoods.push(_opt)
//        })
        this.groupProductSort(_opts)
          .then(()=>{
            this.cancelGroupSort()
            this.initView()
          })

      },

      saleSetsList(saleGoodsCode){
          if(saleGoodsCode){
            this.saleSetsListModel.opts.saleGoodsCode = saleGoodsCode
          }

          let _opts = this.saleSetsListModel.opts
          this.getSaleGroupList(_opts)
            .then((rs)=>{
              this.saleSetsListModel.list = rs.rows
              this.saleSetsListModel.total = rs.total
              if(!this.saleSetsListModel.isShow) this.saleSetsListModel.isShow = true
            })
      },
      handleCurrentChangeSaleSetsList(page){
        this.saleSetsListModel.opts.page = page
        if(this.saleSetsListModel.isShow){
          this.saleSetsList()
        }
      },
      cancelSaleSetsListModel(){
        this.saleSetsListModel.isShow = false
        this.saleSetsListModel.list = []
        this.saleSetsListModel.total = 0
        this.saleSetsListModel.opts = {
          page:1,
          rows:20,
          saleGoodsCode:''
        }
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
      },
      'saleGoodsSaleModel.chooseType':function(){
          this.saleGoodsSaleModel.opts.offTime = ''
        this.saleGoodsSaleModel.opts.onTime = ''
      }
    },
    components: {
      vPagination
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .t-l{
    padding:10px 10px 10px 10px;
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
      font-size: 0px;
      &:nth-child(1){
        border-top: none;
      }
      >div{
        display: inline-block;
        /*width: 100px;*/
        height: 100%;
        font-size: 14px;
        /*border-right: 1px solid rgb(236, 223, 223);*/
        &:first-child{
          /*width: 150px;*/
        }
        &:last-child{
          /*border-right: none;*/
        }
      }
    }
  }
  .label-sign{
    width: 120px;
  }
  .goods-sale-item{
    >div{
      margin-top: 10px;
    }
  }
</style>
