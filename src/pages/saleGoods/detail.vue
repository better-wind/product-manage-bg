<template>
  <div>
    <div class="title-box">
      <template v-if="editType == 'new'">
        <span v-if="editStep == 1">新建销售商品/选择类目</span>
        <span v-else>新建销售商品</span>
      </template>
      <template v-else>
        <span v-if="editStep == 1">销售商品详情/切换类目</span>
        <span v-else>编辑销售商品</span>
      </template>
    </div>
    <div class="section-box">
      <template v-if="editStep == 1">
        <div class="block-box">
          <el-cascader style="width: 500px"  :props="step1.props" :options="step1.categoryOptions" @active-item-change="handleItemChange" v-model="step1.selectedCategory">
          </el-cascader>
        </div>
        <div style="margin-top:180px" class="block-box t-c">
          <el-button v-if="showCancelEditStep" @click="cancelEditStep" >取消</el-button>
          <el-button @click="selectCate"  type="primary" >下一步，填写商品信息</el-button>
        </div>
      </template>
      <template v-if="editStep == 2">
        <div class="item-box">
          <div class="block-item">
            <span class="label-sign">渠道销售类型</span>
            {{mapChanelType[saveProductEdit.channel]}}
            <span v-if="mapSaleType[saveProductEdit.saleTypeId]">- {{mapSaleType[saveProductEdit.saleTypeId]}}</span>
          </div>
          <div class="block-item">
            <span class="label-sign">关联基础商品</span>
            <span v-if="baseGoodsId">
              （{{baseGoodsMsg.code}}）{{baseGoodsMsg.name}} --{{baseGoodsMsg.sellerMainName}}
              <a :href="'/#/baseGoods/edit?goodsId='+baseGoodsMsg.id" target="_blank">
                <el-button style="margin-left: 40px" size="small">编辑基础商品</el-button>
              </a>
            </span>
            <span v-else>
              未关联基础商品，可自由编辑本商品信息
            </span>

          </div>
          <div class="block-item">
            <span class="label-sign">当前选择类目</span>
            {{cateTitle}}
            <el-button v-if="!baseGoodsId" @click="showSelectCate" size="small">修改类目</el-button>
          </div>
        </div>
        <div class="item-box">
          <div class="sub-title-box mg-b">
            <span>基本信息</span>
            <el-button class="mg-l" v-if="baseGoodsId" size="small" type="text" @click="setSyncRule">设置商品同步规则</el-button>
          </div>
          <div class="block-box base-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign"><span class="c-red">*</span>销售类目</span>
            </div>
            <div class="inline-box">
              <div class="mg-b " style="margin-left: 4px" v-for="(item,index) in [1,2,3]">
                <el-cascader
                  style="width: 500px;"
                  :props="frontCate.props"
                  :options="frontCate.categoryOptions"
                  @active-item-change="frontCateChange"
                  v-model="frontCate.selectedCategory[index]"
                  clearable>
                </el-cascader>
              </div>
              <!--<el-button @click="showFrontCateSelect">显示</el-button>-->
            </div>
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>销售长名称</span>
            <el-input v-model="saveProductEdit.longTitle" :maxlength="60" class="input-item-middle input-item-large" style="width: 600px" size="small" placeholder="请输入销售长名称"></el-input>
            <span class="c-dis mg-l c-tip">不包含销售件数，可包含提炼卖点，限60字</span>
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>销售短名称</span>
            <el-input v-model="saveProductEdit.shortTitle" :maxlength="30" style="width: 600px" class="input-item-middle input-item-large" size="small" placeholder="请输入销售短名称"></el-input>
            <span class="c-dis mg-l c-tip">简要描述商品名称、规格，限30字</span>
          </div>
          <div class="block-box base-box label-float-layout">

            <div :class="baseGoodsId && baseSyncConfig.isSyncSellingPoint == 1 ? 'label-sign-wrap c-dis' : 'label-sign-wrap'">
              <span class="label-sign"><span class="c-red">*</span>卖点</span>
            </div>
            <div class="inline-box" style="margin-left: 4px">
              <el-input type="textarea" :disabled="baseGoodsId && baseSyncConfig.isSyncSellingPoint == 1" :maxlength="140" :rows="4" style="width: 600px" v-model="saveProductEdit.sellingPoint" class="input-item-middle input-item-large" size="small" placeholder="请输入卖点"></el-input>
              <span>{{saveProductEdit.sellingPoint.length}}/140</span>
            </div>
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>品牌</span>
            <el-select :disabled="baseGoodsId ? true : false" filterable clearable remote :remote-method="remoteMethodSaleBrand"  v-model="saveProductEdit.brandId" class="input-item-middle input-item-large" size="small"  placeholder="请选择品牌">
              <template v-for="subItem in saleBrandNameList">
                <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code">
                  {{subItem.name}}
                </el-option>
              </template>
            </el-select>
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 1">
              <div class="block-box property-box label-float-layout">
                <template v-if="item.isOther">
                  <div class="inline-box c-dis">
                    <span class="label-sign">{{item.propertyName}}</span>
                    <span>{{item.selected}}</span>
                    <span v-if="!baseGoodsId">该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
                  </div>
                </template>
                <template v-else>
                  <div :class="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1 ? 'label-sign-wrap c-dis' : 'label-sign-wrap'">
                    <span class="label-sign"><span class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <!--单选不可自定义-->
                  <template v-if="item.inputType == 1">
                    <div class="inline-box">
                      <!--<template v-for="subItem in item.options">-->
                        <!--<el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>-->
                      <!--</template>-->
                      <template v-if="item.options.length < 6">
                        <template v-for="subItem in item.options">
                          <el-radio class="mg-b-h" :disabled="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1" v-model="item.selected" :placeholder="'请选择'+item.propertyName" :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                        </template>
                      </template>
                      <el-select :disabled="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1"  v-else v-model="item.selected" style="width: 180px"  class="input-item-middle" size="small"  placeholder="请选择">
                        <template v-for="subItem in item.options">
                          <el-option  :label="subItem.pvName" :value="subItem.pvName"></el-option>
                        </template>
                      </el-select>
                    </div>
                  </template>
                  <!--单选可自定义-->
                  <template v-else-if="item.inputType == 2">
                    <div class="inline-box">
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" :disabled="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                      </template>
                      <template v-if="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1">
                        <el-radio class="mg-b-h" :disabled="true" v-model="item.selected"  :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
                      </template>
                      <template v-else>
                        <el-radio class="mg-b-h"  v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
                      </template>
                    </div>
                  </template>
                  <!--多选不可自定义-->
                  <template v-else-if="item.inputType == 3">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox :disabled="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1" class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--多选可自定义-->
                  <template v-else-if="item.inputType == 4">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox :disabled="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1" class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <template v-if="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1">
                            <el-checkbox  class="mg-b-h" :disabled="true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                          </template>
                          <template v-else>
                            <el-checkbox  class="mg-b-h" :disabled="subItem.pvName ? false : true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                          </template>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--输入框-->
                  <template v-else-if="item.inputType == 5">
                    <div class="inline-box">
                      <el-input v-model="item.selected" :disabled="baseGoodsId && baseSyncConfig.isSyncKeyProperty == 1" class="input-item-middle input-item-large" :placeholder="'请输入'+item.propertyName"size="small"></el-input>
                    </div>
                  </template>
                  <template v-else-if="item.inputType == 6">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="date"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>
                  <template v-else-if="item.inputType == 7">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="datetime"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>

                </template>
              </div>

            </template>
          </template>
        </div>
        <div class="item-box">
          <div v-if="goodsPropertyConfig.filter((item)=>item.propertyType == 3).length" class="sub-title-box mg-b">
            <span>商品属性</span>
            <el-button class="mg-l" v-if="baseGoodsId" size="small" type="text" @click="callWhySync">为什么这些信息置灰不可编辑？</el-button>
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 3">
              <div class="block-box property-box label-float-layout">
                <template v-if="item.isOther">
                  <div class="inline-box c-dis">
                    <span class="label-sign">{{item.propertyName}}</span>
                    <span>{{item.selected}}</span>
                    <span v-if="!baseGoodsId">该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
                  </div>
                </template>
                <template v-else>
                  <div :class="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1 ? 'label-sign-wrap c-dis' : 'label-sign-wrap'">
                    <span class="label-sign"><span v-if="item.isRequired" class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <!--单选不可自定义-->
                  <template v-if="item.inputType == 1">
                    <div class="inline-box">
                      <!--<template v-for="subItem in item.options">-->
                      <!--<el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>-->
                      <!--</template>-->
                      <template v-if="item.options.length < 6">
                        <template v-for="subItem in item.options">
                          <el-radio class="mg-b-h" :disabled="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1" v-model="item.selected" :placeholder="'请选择'+item.propertyName" :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                        </template>
                      </template>
                      <el-select :disabled="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1"  v-else v-model="item.selected" style="width: 180px"  class="input-item-middle" size="small"  placeholder="请选择">
                        <template v-for="subItem in item.options">
                          <el-option  :label="subItem.pvName" :value="subItem.pvName"></el-option>
                        </template>
                      </el-select>
                    </div>
                  </template>
                  <!--单选可自定义-->
                  <template v-else-if="item.inputType == 2">
                    <div class="inline-box">
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" :disabled="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
                      </template>
                      <template v-if="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1">
                        <el-radio class="mg-b-h" :disabled="true" v-model="item.selected"  :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
                      </template>
                      <template v-else>
                        <el-radio class="mg-b-h"  v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
                      </template>
                    </div>
                  </template>
                  <!--多选不可自定义-->
                  <template v-else-if="item.inputType == 3">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox :disabled="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1" class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--多选可自定义-->
                  <template v-else-if="item.inputType == 4">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox :disabled="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1" class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <template v-if="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1">
                            <el-checkbox  class="mg-b-h" :disabled="true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                          </template>
                          <template v-else>
                            <el-checkbox  class="mg-b-h" :disabled="subItem.pvName ? false : true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                          </template>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--输入框-->
                  <template v-else-if="item.inputType == 5">
                    <div class="inline-box">
                      <el-input v-model="item.selected" :disabled="baseGoodsId && baseSyncConfig.isSyncGoodsProperty == 1" class="input-item-middle input-item-large" :placeholder="'请输入'+item.propertyName"size="small"></el-input>
                    </div>
                  </template>
                  <!--日期选择-->
                  <template v-else-if="item.inputType == 6">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="date"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>
                  <!--时间选择-->
                  <template v-else-if="item.inputType == 7">
                    <div class="inline-box">
                      <el-date-picker v-model="item.selected" type="datetime"
                                      placeholder="选择日期"
                                      class="input-item-middle input-item-large">
                      </el-date-picker>
                    </div>
                  </template>

                </template>
              </div>
            </template>
          </template>
        </div>
        <div class="item-box">
          <div class="sub-title-box mg-b">
            销售单元
          </div>
          <div :style="baseGoodsId ? 'display: none' : ''" v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 2">
              <template v-if="item.isOther">
              </template>
              <template v-else>
                <div class="block-box property-box label-float-layout">
                  <div :class="baseGoodsId ? 'label-sign-wrap c-dis' : 'label-sign-wrap'">
                    <span class="label-sign"><span v-if="item.isRequired" class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <template v-if="item.inputType == 4">
                    <div class="inline-box mask-box-wrap" style="line-height: 30px">
                      <el-checkbox-group v-model="item.selected" @change="mulSelectChange(item.propertyNameId,$event,item)">
                        <template v-if="baseGoodsId">
                          <template v-for="subItem in item.options">
                            <el-checkbox class="mg-b-h"  :disabled="true" :label="subItem.pvName"></el-checkbox>
                          </template>
                          <template v-for="(subItem,sIdx) in item.mulOptions">
                            <el-checkbox class="mg-b-h" :disabled="true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input  v-model="subItem.pvName"  @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
                          </template>
                        </template>
                        <template v-else>
                          <template v-for="subItem in item.options">
                            <template v-if="subItem.saleDis">
                              <el-checkbox class="mg-b-h" disabled :label="subItem.pvName"></el-checkbox>
                            </template>
                            <template v-else>
                              <el-checkbox class="mg-b-h" :disabled="(saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis)" :label="subItem.pvName"></el-checkbox>
                            </template>
                            <!--<el-checkbox class="mg-b-h"  :disabled="(subItem.saleDis ? true : false) || saleUnitDis" :label="subItem.pvName"></el-checkbox>-->
                          </template>
                          <template v-for="(subItem,sIdx) in item.mulOptions">
                            <el-checkbox class="mg-b-h" :disabled="(subItem.pvName ? false : true) || ((saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis))" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName">
                              <el-input  v-model="subItem.pvName" :disabled="item.selected.includes(subItem.pvName)"  @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input>
                            </el-checkbox>
                          </template>
                        </template>

                      </el-checkbox-group>
                      <!--<div class="mask-box" v-if="saleUnitDis" @click="maskHandler"></div>-->
                      <div class="mask-box" v-if="(saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis)" @click="maskHandler"></div>
                    </div>
                  </template>
                </div>
              </template>

            </template>
          </div>
          <div v-if="baseGoodsId" class="item-table">
            <el-table ref="multipleTable" :data="goodsSkuConfig" style="width: 100%;" @selection-change="skuUnitBatch">

              <el-table-column v-if="baseSaleUnitReady" type="selection" align="center" :selectable="selectableSKU" width="55">

              </el-table-column>
              <el-table-column prop="status" label="销售状态" align="center">
                <template scope="scope" >
                  <el-button v-if="scope.row.status == 2" size="small" :disabled="saleUnitDis"  class="c-red" >删除</el-button>
                  <el-button v-else size="small" :disabled="saleUnitDis" :type="scope.row.status == 1 ? 'primary' : ''" :class="scope.row.status == 1 ? '' : 'c-red'" @click="changeSkuStatus(scope.row.status,scope.$index)">{{scope.row.status == 1 ? '可用' : '停用'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column  prop="skuName"  label="销售单元"  align="center">
                <template scope="scope">
                  <span class="key-item">{{scope.row.skuName | changeSkuCode}}</span>
                </template>
              </el-table-column>
              <el-table-column  prop="skuCode" width="180" label="关联sku"  align="center">

              </el-table-column>
              <el-table-column v-if="baseSaleUnitReady" prop="count" label="销售件数" width="90" align="center">
                <template scope="scope" >
                  <span v-if="scope.row.isSave || editType == 'edit'">{{scope.row.count}}</span>
                  <el-input v-else v-model="scope.row.count" @change="baseSkuCount(scope.row.count,scope.row)" size="small" class="input-item-middle" style="width: 80px"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-if="baseSaleUnitReady" prop="marketPrice" label="市场价"  align="center">
                <template scope="scope">
                  <span class="key-item">{{Number(scope.row.count) ? accMul(scope.row.marketPrice,scope.row.count) || scope.row.marketPrice : ''}} </span>
                </template>
              </el-table-column>
              <el-table-column v-if="baseSaleUnitReady" prop="retailPrice" label="建议售价"  align="center">
                <template scope="scope">
                  <span class="key-item">{{Number(scope.row.count) ? accMul(scope.row.retailPrice,scope.row.count) || scope.row.retailPrice : ''}} </span>
                </template>
              </el-table-column>
              <el-table-column v-if="baseSaleUnitReady" prop="costPrice" label="成本价(不含邮)" width="140" align="center">
                <template scope="scope">
                  <span class="key-item">{{Number(scope.row.count) ? accMul(scope.row.costPrice,scope.row.count) || scope.row.costPrice : ''}} </span>
                </template>
              </el-table-column>
              <el-table-column v-if="baseSaleUnitReady" prop="price" label="单位销售价" width="90" align="center">
                <template scope="scope" >
                  <el-input v-model="scope.row.price" @change="baseSkuRate(scope.row.price,scope.row)" size="small" class="input-item-middle" style="width: 80px"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-if="baseSaleUnitReady" prop="price" label="总销售价"  align="center">
                <template scope="scope" >
                  <span class="key-item">{{Number(scope.row.count) ? accMul(scope.row.price,scope.row.count) || scope.row.price : ''}} </span>
                </template>
              </el-table-column>
              <template v-if="baseSaleUnitReady && mapChannelRate[saveProductEdit.channel]">
                <template v-for="(rate,rateKey) in mapChannelRate[saveProductEdit.channel]">
                  <el-table-column v-if="rate.type == 'radio'" :label="rate.label" width="200" align="center">
                    <template scope="scope">
                      <el-radio class="radio" v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" :label="0">常规分佣</el-radio>
                      <el-radio class="radio" v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" :label="1">微商品分佣</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column v-else-if="rate.type == 'input'" :label="rate.label" width="90" align="center">
                    <template scope="scope">
                      <el-input v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" @change="planRate(scope.row,rate.key,scope.row[channelRateKey[saveProductEdit.channel]][rate.key])" size="small"  class="input-item-middle" style="width: 70px;"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column v-else :label="rate.label"  align="center" width="90">
                    <template scope="scope">
                      <el-input disabled v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" size="small"  class="input-item-middle" style="width: 70px;"></el-input>
                    </template>
                  </el-table-column>
                </template>
              </template>

            </el-table>
          </div>
          <div v-else class="item-table">
            <el-table  :data="goodsSkuConfig" style="width: 100%;" >
              <el-table-column align="center">
                <template scope="scope" >
                  <el-button v-if="scope.row.status == 2" size="small" :disabled="saleUnitDis && saleUnitDisType == 2"  class="c-red" >删除</el-button>
                  <el-button v-else size="small" :disabled="saleUnitDis && saleUnitDisType == 2" :type="scope.row.status == 1 ? 'primary' : ''" :class="scope.row.status == 1 ? '' : 'c-red'" @click="changeSkuStatus(scope.row.status,scope.$index)">{{scope.row.status == 1 ? '可用' : '停用'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column  prop="skuName" label="销售单元"  align="center">
                <template scope="scope">
                  <span class="key-item">{{scope.row.skuName | changeSkuCode}}</span>
                  <el-button size="small" type="primary" v-if="saleUnitDisType == 1 && saleUnitDis" @click="editSaleProperty(scope.row.skuPvId,scope.$index,1)">补充属性</el-button>
                  <el-button size="small" type="primary" v-if="scope.row.type == 2" @click="editSaleProperty(scope.row.skuPvId,scope.$index,2)">修改属性</el-button>
                </template>
              </el-table-column>
              <el-table-column  label="关联sku"  align="center">
                <template scope="scope">
                  <el-button size="small" :disabled="scope.row.type == 2 || (saleUnitDisType == 2 && saleUnitDis)" type="primary" @click="callManageSku">管理</el-button>
                </template>
              </el-table-column>
              <el-table-column  prop="count" label="销售件数"  align="center">

              </el-table-column>
              <el-table-column  prop="marketPrice" label="市场价"  align="center">

              </el-table-column>
              <el-table-column  prop="retailPrice" label="建议售价"  align="center">

              </el-table-column>
              <el-table-column  prop="costPrice" label="成本价(不含邮)" width="200" align="center">

              </el-table-column>
              <el-table-column  prop="price" label="销售价"  align="center">
                <template scope="scope">
                  <!--{{scope.row.price}}-->
                  {{scope.row.totalPrice}}
                </template>
              </el-table-column>
              <template v-for="(rate,rateKey) in mapChannelRate[saveProductEdit.channel]">
                <el-table-column v-if="rate.type == 'radio'" :label="rate.label" width="200" align="center">
                  <template scope="scope">
                    <el-radio class="radio" v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" :label="0">常规分佣</el-radio>
                    <el-radio class="radio" v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" :label="1">微商品分佣</el-radio>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="rate.type == 'input'" :label="rate.label" width="90" align="center">
                  <template scope="scope">
                    <el-input v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" @change="planRate(scope.row,rate.key,scope.row[channelRateKey[saveProductEdit.channel]][rate.key])" size="small"  class="input-item-middle" style="width: 70px;"></el-input>
                  </template>
                </el-table-column>
                <el-table-column v-else :label="rate.label"  align="center" width="90">
                  <template scope="scope">
                    <el-input disabled v-model="scope.row[channelRateKey[saveProductEdit.channel]][rate.key]" size="small"  class="input-item-middle" style="width: 70px;"></el-input>
                  </template>
                </el-table-column>
              </template>

              <!--channel-->

            </el-table>
          </div>
        </div>
        <div class="item-box">
          <template v-if="baseGoodsId && editType == 'new'">
            <div class="sub-title-box mg-b">
              发货信息
            </div>
            <div class="block-box base-box">
              <span class="label-sign"><span class="c-red">*</span>发货地</span>
              <el-select clearable :disabled="editType == 'edit' ? true : false" @change="baseAreaTempChange" v-model="baseGoodsDeliverArea.deliverArea.deliverAreaId" class="input-item-middle input-item-large-select" size="small">
                <template v-for="subItem in baseGoodsDeliverArea.options">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
            </div>
            <div class="block-box base-box">
              <span class="label-sign"><span class="c-red">*</span>结算运费模板</span>
              <template v-if="sellerDeliver.mapTemp[baseGoodsDeliverArea.deliverArea.deliverAreaId]">
                <span v-if="sellerDeliver.mapTemp[baseGoodsDeliverArea.deliverArea.deliverAreaId].freightSubmitType == 2">【{{sellerDeliver.mapTemp[baseGoodsDeliverArea.deliverArea.deliverAreaId].freightTemplateName}}】</span>
                <span v-if="sellerDeliver.mapTemp[baseGoodsDeliverArea.deliverArea.deliverAreaId].freightSubmitType == 2">
                  (按重量、配送区域计价)
                </span>
                <span v-else-if="sellerDeliver.mapTemp[baseGoodsDeliverArea.deliverArea.deliverAreaId].freightSubmitType == 1">
                  每订单运费{{sellerDeliver.mapTemp[baseGoodsDeliverArea.deliverArea.deliverAreaId].freight || 0}}元/单
                </span>
              </template>
              <span v-else>
              请选择发货地
            </span>
              <a v-if="baseGoodsDeliverArea.deliverArea.deliverAreaId" :href="goodsAreaUrl.freightUrl+mapDeliverIdSellerMainId[baseGoodsDeliverArea.deliverArea.deliverAreaId]" target="_blank">
                <el-button class="mg-l"  type="primary" size="small">查看结算运费模板</el-button>
              </a>
            </div>
            <div class="block-box base-box">
              <!--<span class="c-red">*</span>-->
              <span class="label-sign">配送地区</span>
              <el-select clearable :disabled="true" v-model="baseGoodsDeliverArea.deliverArea.sellerDeliverAreaTemplateId" class="input-item-middle input-item-large-select" size="small">
                <template v-for="subItem in baseGoodsDeliverArea.templateOpts">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
              <!--<a :href="goodsAreaUrl.deliverAreaUrl" target="_blank">-->
                <el-button v-if="baseGoodsDeliverArea.deliverArea.sellerDeliverAreaTemplateId" class="mg-l"  type="primary" @click="deliverAreaTempDetail('baseGoodsDeliverArea')" size="small">查看配送地区</el-button>
              <!--</a>-->
            </div>
            <div class="block-box base-box">
              <span class="label-sign"><span class="c-red">*</span>运费收入模板</span>
              <el-select clearable v-model="baseGoodsDeliverArea.deliverArea.freightTemplateId" class="input-item-middle input-item-large-select" size="small">
                <template v-for="subItem in freightTemplateIdList">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
              <!--<a v-if="baseGoodsDeliverArea.deliverArea.freightTemplateId" :href="'/#/saleFreightProvince?freightId='+baseGoodsDeliverArea.deliverArea.freightTemplateId" target="_blank">-->
                <!--<el-button class="mg-l"  type="primary" size="small">查看运费收入模板</el-button>-->
              <!--</a>-->
              <a v-if="baseGoodsDeliverArea.deliverArea.freightTemplateId" href="/#/saleFreight" target="_blank">
                <el-button class="mg-l"  type="primary" size="small">查看运费收入模板</el-button>
              </a>
            </div>
          </template>
          <template v-else>
            <div class="sub-title-box mg-b">
              发货信息
            </div>
            <div class="block-box base-box">
              <span class="label-sign"><span class="c-red">*</span>发货地</span>
              <el-select clearable :disabled="editType == 'edit' ? true : false"  v-model="saveProductEdit.deliverArea.deliverAreaId" class="input-item-middle input-item-large-select" size="small">
                <template v-for="subItem in sellerDeliver.options">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
            </div>
            <div class="block-box base-box">
              <span class="label-sign"><span class="c-red">*</span>结算运费模板</span>
              <template v-if="sellerDeliver.mapTemp[saveProductEdit.deliverArea.deliverAreaId]">
                <span v-if="sellerDeliver.mapTemp[saveProductEdit.deliverArea.deliverAreaId].freightSubmitType == 2">【{{sellerDeliver.mapTemp[saveProductEdit.deliverArea.deliverAreaId].freightTemplateName}}】</span>
                <span v-if="sellerDeliver.mapTemp[saveProductEdit.deliverArea.deliverAreaId].freightSubmitType == 2">
                  (按重量、配送区域计价)
                </span>
                <span v-else-if="sellerDeliver.mapTemp[saveProductEdit.deliverArea.deliverAreaId].freightSubmitType == 1">
                  每订单运费{{sellerDeliver.mapTemp[saveProductEdit.deliverArea.deliverAreaId].freight || 0}}元/单
                </span>
              </template>
              <span v-else>
              请选择发货地
            </span>
              <a v-if="saveProductEdit.deliverArea.deliverAreaId" :href="goodsAreaUrl.freightUrl+mapDeliverIdSellerMainId[saveProductEdit.deliverArea.deliverAreaId]" target="_blank">
                <el-button class="mg-l"  type="primary" size="small">查看结算运费模板</el-button>
              </a>
            </div>
            <div class="block-box base-box">
              <!--<span class="c-red">*</span>-->
              <span class="label-sign">配送地区</span>
              <el-select clearable :disabled="baseGoodsId ? true : false" v-model="saveProductEdit.deliverArea.sellerDeliverAreaTemplateId" class="input-item-middle input-item-large-select" size="small">
                <template v-for="subItem in sellerDeliver.areaTempOpts">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
              <!--<a :href="goodsAreaUrl.deliverAreaUrl" target="_blank">-->
                <el-button v-if="saveProductEdit.deliverArea.sellerDeliverAreaTemplateId" class="mg-l" @click="deliverAreaTempDetail('saveProductEdit')" type="primary" size="small">查看配送地区</el-button>
              <!--</a>-->

            </div>
            <div class="block-box base-box">
              <span class="label-sign"><span class="c-red">*</span>运费收入模板</span>
              <el-select clearable v-model="saveProductEdit.deliverArea.freightTemplateId" class="input-item-middle input-item-large-select" size="small">
                <template v-for="subItem in freightTemplateIdList">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
              <!--<a v-if="saveProductEdit.deliverArea.freightTemplateId" :href="'/#/saleFreightProvince?freightId='+saveProductEdit.deliverArea.freightTemplateId" target="_blank">-->
                <!--<el-button class="mg-l"  type="primary" size="small">查看运费收入模板</el-button>-->
              <!--</a>-->
              <a v-if="saveProductEdit.deliverArea.freightTemplateId" href="/#/saleFreight" target="_blank">
                <el-button class="mg-l"  type="primary" size="small">查看运费收入模板</el-button>
              </a>
            </div>
          </template>
        </div>
        <div class="item-box" v-if="configSaleUnitImages.isRequiredImage">
          <div class="sub-title-box mg-b">
            销售单元主图(销售属性项：{{configSaleUnitImages.skuImagePropertyName}})
          </div>
          <div class="block-box c-dis c-tip">销售单元主图：必填，分辨率640x640，文件小于400KB！</div>
          <div class="block-box" v-if="goodsPropertyConfig[configSaleUnitImages.idx]">
            <div class="inline-box mg-r" style="overflow: hidden;margin-bottom: 10px" v-for="item in goodsPropertyConfig[configSaleUnitImages.idx].selected">
              <!--<div class="label-sign-wrap" style="display: inline-block;width: 60px;float:left">-->
                <span class="label-sign" style="display: inline-block;width: 60px;word-break:break-all;">{{item}}</span>
              <!--</div>-->
              <template v-if="baseGoodsId">
                <div class="avatar-wrap">
                  <img v-if="configSaleUnitImages.list[item]" :src="configSaleUnitImages.list[item].url" class="avatar">
                    <div v-if="configSaleUnitImages.list[item]" class="avatar-menu">
                      <i class="el-icon-search" @click="showProductImage(configSaleUnitImages.list[item].url)"></i>
                    </div>
                </div>
              </template>
              <template v-else>
                <div class="avatar-wrap" @click="setSkuImageIdx(item)">
                  <template v-if="configSaleUnitImages.list[item]">
                    <img :src="configSaleUnitImages.list[item].url" class="avatar">
                    <div class="avatar-menu">
                      <i class="el-icon-search" @click="showProductImage(configSaleUnitImages.list[item].url)"></i>
                      <i class="el-icon-delete" @click="delProductImage(item)"></i>
                    </div>
                  </template>
                  <template v-else>
                    <el-upload class="avatar-wrap avatar-uploader"   action="/goodsAdmin/goods/file/imageUpload" :data="picUpload" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </template>

                </div>
              </template>

            </div>
          </div>
        </div>
        <v-upload :uploadConfig="uploadConfig" >
          <template v-if="baseGoodsId">
            <template slot="sync-edit">
              <el-button class="mg-l" size="small" type="text" @click="setSyncRule">设置商品同步规则</el-button>
            </template>
            <template slot="sync-edit-detail">
              <el-button class="mg-l" size="small" type="text" @click="setSyncRule">设置商品同步规则</el-button>
            </template>
          </template>
        </v-upload>
        <div class="item-box t-c">
          <el-button @click="saveProduct" type="primary" >保 存 商 品</el-button>
        </div>
      </template>
      <el-dialog :title="'设置商品同步规则'" size="small" v-model="baseSyncModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <p>请选择需要与基础商品保持同步的商品信息：</p>
        <div class="inline-block mg-t mg-b">
          <el-checkbox v-model="baseSyncModel.opts.isSyncSellingPoint">卖点文案</el-checkbox>
          <!--<el-checkbox :disabled="true" v-model="baseSyncModel.opts.isSyncKeyProperty">关键属性</el-checkbox>-->
          <!--<el-checkbox :disabled="true" v-model="baseSyncModel.opts.isSyncGoodsProperty">商品属性</el-checkbox>-->
          <!--<el-checkbox :disabled="true" v-model="baseSyncModel.opts.isSyncSaleUnit">销售属性</el-checkbox>-->
          <!--<el-checkbox :disabled="true" v-model="baseSyncModel.opts.isSyncSKUImage">销售单元主图</el-checkbox>-->
          <el-checkbox v-model="baseSyncModel.opts.isSyncGoodsImage">商品主图</el-checkbox>
          <el-checkbox v-model="baseSyncModel.opts.isSyncDetail">商品详情</el-checkbox>
        </div>
        <p>取消勾选则可编辑该部分商品信息，但当基础商品信息更新时无法同步更新。</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSyncModel">取 消</el-button>
          <el-button type="primary"  @click="submitSyncModel">确 定</el-button>
        </div>
      </el-dialog>
      <!--:close-on-press-escape="false"-->
      <el-dialog :title="saleEditModel.type == 1 ? '补充销售单元' : '修改销售单元'" size="small" v-model="saleEditModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="block">
          <span v-if="saleEditModel.type == 1">补充销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
          <span v-else-if="saleEditModel.type == 2">修改销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
        </div>
        <div class="block-box property-layout-box label-float-layout" v-for="item in saleEditModel.propertyList">
          <div class="label-sign-wrap">
            <span class="label-sign">{{item.propertyName}}</span>
          </div>
          <!--单选可自定义-->
          <div class="inline-box">
              <template v-for="subItem in item.options">
                <el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
              </template>
              <el-radio v-if="!saleEditModel.noKey" class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue">
                <el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input>
              </el-radio>
          </div>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSaleEditModel">取 消</el-button>

          <el-button type="primary"  @click="submitSaleEditModel(saleEditModel.fn)">{{saleEditModel.type == 3 ? '立即生效' : '确 定'}}</el-button>
        </div>
      </el-dialog>
      <el-dialog title="管理SKU" size="large"  v-model="saleManageModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="item-table unit-table"  v-for="(table,idx) in managerSkuList">
          <el-table :data="table" :row-class-name="tableRowClassName" :show-header="idx == 0 ? true : false" style="width: 100%;" >
            <el-table-column  label="销售单元"  align="center">
              <template scope="scope">
                <template v-if="scope.row.isSave">
                  <span class="key-item" v-if="scope.row.skuName"><span v-if="scope.row.status == 0" class="c-red">(停用)</span>{{scope.row.skuName | changeSkuCode}}</span>
                  <span v-else>
                    <span v-if="scope.row.status == 1">可用</span>
                    <span v-else class="c-red">{{scope.row.status == 0 ? '停用' : '删除'}}</span>
                  </span>
                </template>
                <template v-else>
                  <span class="key-item" v-if="scope.row.skuName"><span v-if="scope.row.status != 1" class="c-red">({{scope.row.status == 0 ? '停用' : '删除'}})</span>{{scope.row.skuName | changeSkuCode}}</span>
                  <el-button v-else @click="delSkuUnit(idx,scope.$index)" size="small">删除</el-button>
                </template>

              </template>
            </el-table-column>
            <el-table-column  label="关联SKU"  align="center">
              <template scope="scope">
                <template v-if="scope.row.isSave">
                  <el-button size="small" type="primary" v-if="scope.row.skuName" @click="showSkuUnit(scope.row.id)">查看SKU</el-button>
                  <span class="key-item" v-else>
                    <span>{{scope.row.skuCode}}</span>
                  </span>
                </template>
                <template v-else>
                  <el-button size="small" type="primary" @click="addSkuUnit(idx)" v-if="scope.row.skuName">增加SKU</el-button>
                  <span class="key-item" v-else>
                     <span><span v-if="scope.row.status != 1" class="c-red">({{scope.row.status == 0 ? '停用' : '删除'}})</span>{{scope.row.skuCode}}</span>
                  </span>
                </template>

              </template>
            </el-table-column>
            <el-table-column  label="SKU销售属性"  align="center">
              <template scope="scope">
                <template v-if="scope.row.isSave">
                  <span class="key-item" v-if="!scope.row.skuName">
                    <span>{{scope.row.properties | skuNameFilter}}</span>
                  </span>
                  <template v-else>
                    <el-button size="small" type="primary" @click="editSaleProperty(scope.row.skuPvId,idx,3,true)">修改销售单元</el-button>
                  </template>
                </template>
                <template v-else>
                  <span>{{scope.row.properties | skuNameFilter}}</span>
                </template>

              </template>
            </el-table-column>
            <el-table-column  label="销售件数"  align="center">
              <template scope="scope">
                <template v-if="scope.row.isSave">
                  <template v-if="scope.row.skuName">
                    <span class="key-item" v-if="table.length > 2">组合装</span>
                    <span class="key-item" v-else>{{getRowArr(table,1,2)}}件装</span>
                  </template>
                  <span class="key-item" v-else>{{scope.row.count}}</span>
                </template>
                <template v-else>
                  <template v-if="scope.row.skuName">
                    <span class="key-item" v-if="table.length > 2">组合装</span>
                    <span class="key-item" v-else-if="table.length == 1"> </span>
                    <span class="key-item" v-else>{{getRowArr(table,1,2)}}件装</span>
                  </template>
                  <el-input v-else class="input-item-middle" size="small" v-model="scope.row.count"></el-input>
                </template>
              </template>
            </el-table-column>
            <el-table-column  label="市场价"  align="center">
              <template scope="scope">
                <template v-if="scope.row.skuName">
                  <span class="key-item">{{getRowArr(table,1,2) ? getRowArr(table,2,2) : '' }} </span>
                </template>
                <!--<span class="key-item" v-else>{{scope.row.marketPrice}}</span>-->
                <el-input v-else class="input-item-middle" size="small" v-model="scope.row.marketPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="建议售价"  align="center">
              <template scope="scope">
                <template v-if="scope.row.skuName">
                  <span class="key-item">{{getRowArr(table,1,2) ? getRowArr(table,3,2) : ''}}</span>
                </template>
                <span class="key-item" v-else>{{scope.row.retailPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="成本价(不含邮)"  align="center">
              <template scope="scope">
                <template v-if="scope.row.skuName">
                  <span class="key-item">{{getRowArr(table,1,2) ? getRowArr(table,4,2) : ''}}</span>
                </template>
                <span class="key-item" v-else>{{scope.row.costPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="单位销售价"  align="center">
              <template scope="scope">
                <template v-if="scope.row.skuName">
                  <!--<span class="key-item">{{getRowArr(table,1,2)  ? getRowArr(table,5,2) : ''}}</span>-->
                </template>
                <el-input v-else class="input-item-middle" size="small" v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="总销售价"  align="center">
              <template scope="scope">
                <template v-if="scope.row.skuName">
                  <span class="key-item">{{getRowArr(table,1,2) ? getRowArr(table,6,2) : ''}}</span>
                </template>
                <span class="key-item" v-else>
                  {{accMul(scope.row.price,scope.row.count)}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSaleManageModel">取 消</el-button>
          <el-button type="primary" @click="submitSaleManageModel">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改销售状态" size="tiny" v-model="editSkuStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="block-box">
          <span class="label-sign">修改销售状态</span>
          <el-radio v-model="editSkuStatusModel.type"  :label="1">可用</el-radio>
          <el-radio v-model="editSkuStatusModel.type"  :label="0">停用</el-radio>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditSkuStatusModel">取 消</el-button>
          <el-button type="primary" @click="submitEditSkuStatusModel">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="增加SKU" size="tiny" v-model="addSkuModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="block-box">
          <span>请输入一个或多个基础商品码 或 SKU码</span>
          <div>
            <el-input size="small" type="textarea" placeholder="多个用英文逗号间隔"  :rows="2" style="width: 360px" v-model="addSkuModel.skuId"></el-input>
          </div>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddSkuModel">下一步</el-button>
          <el-button @click="cancelAddSkuModel">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="selectAddSkuModel.type == 1 ? '选择SKU' : '已关联SKU'" size="large" v-model="selectAddSkuModel.isShow" :close-on-click-modal="false"  :show-close="false">

        <div class="item-table " >
          <el-table :data="selectAddSkuModel.list"  style="width: 100%;" @selection-change="selectAddSkuList" >
            <el-table-column v-if="selectAddSkuModel.type == 1" type="selection" align="center" width="55">

            </el-table-column>
            <el-table-column prop="skuCode"  label="SKU码"  align="center">

            </el-table-column>
            <el-table-column prop="baseGoodsName" label="商品名称"  align="center">

            </el-table-column>
            <el-table-column  label="SKU销售属性"  align="center">
              <template scope="scope">
                <span>{{scope.row.properties | skuNameFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="realSellerName" label="货品归属"  align="center">
            </el-table-column>
            <el-table-column  label="发货地"  align="center">
              <template scope="scope">
              {{scope.row.deliverAreas | changeAreaName}}
              </template>
            </el-table-column>
            <el-table-column prop="grossWeight" label="毛重"  align="center">

            </el-table-column>
            <el-table-column prop="" label="发货编码"  align="center">
              <template scope="scope">
                {{scope.row.deliverAreas | changeAreaCode}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSelectAddSkuModel">取 消</el-button>
          <el-button type="primary" @click="submitSelectAddSkuModel">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="配送地区详情" size="small" v-model="deliverTempDetailModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div>
          <div class="block-box">
            <span class="label-sign">商家名称</span>
            {{deliverTempDetailModel.opts.sellerName}}
          </div>
          <div class="block-box">
            <span class="label-sign">模版名称</span>
            {{deliverTempDetailModel.opts.name}}
          </div>
          <div class="block-box">
            <span class="label-sign">限制类型</span>
            {{deliverTempDetailModel.opts.type == 1 ? '以下地区发货' : '以下地区不发货'}}
          </div>
          <div class="block-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign" style="line-height: normal">选择地区</span>
            </div>
            <div style="display: inline-block;width: 400px;">
              {{deliverTempDetailModel.opts.select.length ? deliverTempDetailModel.opts.select.join('，') : '暂无信息'}}
            </div>

          </div>
          <div class="block-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign" style="line-height: normal">例外地区</span>
            </div>

            <div style="display: inline-block;width: 400px;">
              {{deliverTempDetailModel.opts.except.length ? deliverTempDetailModel.opts.except.join('，') : '暂无信息'}}
            </div>

          </div>
          <div class="block-box">
            <span class="label-sign">地区描述</span>
            {{deliverTempDetailModel.opts.desc}}
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cancelDeliverTempDetailModel">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import vUpload from '@/components/productLibrary/uploadImage'
  import Mixin from '../../assets/js/common/mixin'
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
//    mixins: [Mixin],
    computed:{
      ...mapState(['productUpload','goodsAreaUrl'])
    },
    filters: {
      skuNameFilter(data){
        let arr = []
        if(!data){
          return ''
        }
        let _rs = data || []
        _rs.map((item)=>{
          arr.push(item.pvName)
        })
        return arr.length ? arr.join('-') : '默认'

      },
      categoryFilter(data){
        let str = ''
        data.map((item,i)=>{
          str+=item.name+' '
        })
        return str
      },
      changeSkuCode(str){
         let _str = ''
         _str = str.replace(/\$&&\$/g,'-')
        return _str
      },
      changeAreaName(rs){
        let s = []
        rs.map((item)=>{

          s.push(item.deliverAreaName)
        })
        return s.join(',')
      },
      changeAreaCode(rs){
        let s = []
        rs.map((item)=>{
            s.push(item.deliverCode)
        })
        return s.join(',')
      },
    },
    data:()=>({
      skuSplitStr:'$&&$',
      skuSplitStrReg:/\$&&\$/g,
      mapFrontCate:{},
      frontCate:{
        categoryOptions: [

        ],
        options: [
          {
            value: 'zhinan',
            label: '指南',
            children: [
                {
                  value: 'shejiyuanze',
                  label: '设计原则',
                  children: [
                      {
                        value: 'yizhi',
                        label: '一致'
                      }
                  ]
                },
            ]
          }
        ],
        selectedCategory: [
            [],[],[]
        ],
        props:{
          children: 'cates'
        },
      },
      goodsId:'',
      baseGoodsId:'',
      channelRateKey:{
        2:'saleUnitHqbs',
        8:'saleUnitMsms',
      },
      channelRateKeys:{
        2:{
          commissionRateType:0,
          totalProfit:'',
          seniorAgentRate:'',
          ycAgentRate:'',
          managerRate:'',
          ycManagerRate:'',
          directorRate:'',
          ycDirectorRate:'',
        },
        8:{
          commissionRateType:0,
          agentPrice:'',
          seniorAgentRate:'25',
          ycAgentRate:'0',
          managerRate:'25',
          ycManagerRate:'3.75',
          directorRate:'12.5',
          ycDirectorRate:'2.5',
        }
      },
      mapChannelRate:{
          2:[
            {
              label:'佣金分配规则',
              type:'radio',
              key:'commissionRateType'
            },
            {
              label:'总分出利润',
              type:'input',
              key:'totalProfit'
            },
            {
              label:'高级代理利润',
              key:'seniorAgentRate'
            },
            {
              label:'育成代理利润',
              key:'ycAgentRate'
            },
            {
              label:'经理利润',
              key:'managerRate'
            },
            {
              label:'育成经理利润',
              key:'ycManagerRate'
            },
            {
              label:'总监利润',
              key:'directorRate'
            },
            {
              label:'育成总监利润',
              key:'ycDirectorRate'
            }
          ],
        8:[
          {
            label:'佣金分配规则',
            type:'radio',
            key:'commissionRateType'
          },
          {
            label:'初级代理价',
            key:'agentPrice'
          },
          {
            label:'高级代理利润',
            key:'seniorAgentRate'
          },
          {
            label:'育成代理利润',
            key:'ycAgentRate'
          },
          {
            label:'经理利润',
            key:'managerRate'
          },
          {
            label:'育成经理利润',
            key:'ycManagerRate'
          },
          {
            label:'总监利润',
            key:'directorRate'
          },
          {
            label:'育成总监利润',
            key:'ycDirectorRate'
          }
        ]
      },
      goodsDetailFetch:{
        fetch:false,
        rs:{}
      },
      editType:'new',
      editStep:1,
      step1: {
        categoryOptions: [

        ],
        selectedCategory: [],
        props: {
//          value: 'label',
          children: 'cates'
        },
      },
      showCancelEditStep:false,
      cateTitle:'',
      mapChanelType:{
        1:'格格家',
        2:'环球捕手',
        6:'脉宝云店',
        8:'美食买手'
      },
      mapChanelLink:{
        1:'saleGoodsGGJ',
        2:'saleGoodsHQBS',
        6:'saleGoodsMBYD',
        8:'saleGoodsMSMS'
      },
      mapSaleType:{},
      getCateByCheck:false,
      editStepCheck:false,
      editCatePathIdArr:[],
      uploadConfig:{
        detailConfig:{
          isShow:true, // 是否有详情
          editType:2,// 1 不可修改  2 可修改 3 弹框修改
        },
        imageConfig:{
          isShow:true, // 是否有主图
          editType:2, // 1不可修改 2可修改
        }
      },
      saleBrandNameList:[], //品牌列表
      saveProductEdit:{
        channel:'',
        saleTypeId:'',
        id:'',
        saleGoodsCode:'',
        baseGoodsId:'',
        brandId:'',
        categoryId:'',
        longTitle: '',
        shortTitle: '',
        sellingPoint: '',
        properties:[],
        deliverArea:{
          id: '',
          deliverAreaId: '',
          sellerDeliverAreaTemplateId: '',
          freightTemplateId:''
        },
        detail:{
          id:'',
          detail:''
        },
        saleGoodsImages:[],
        saleUnitImages:[],
      },
      baseGoodsDeliverArea:{
        deliverArea:{
          deliverAreaId: '',
          sellerDeliverAreaTemplateId: '',
          freightTemplateId:'',
        },
        options:[],
        templateOpts:[],
        mapAreaTempId:{}
      },
      freightTemplateIdList:[],//运费收入模板
      configSaleUnitImages :{
        idx:'',
        isRequiredImage:false,
        skuImagePropertyNameId:'',
        list:{},
        saleUnitImages:[],
        currentSkuImage:''
      },
      noSalePro:false,// 销售属性是否为空
      cateProperty:[], //类目属性
      goodsProperty:[], //商品详情属性
      goodsPropertyConfig:[

      ], //商品详情属性配置
      mapCateProperty:{},
      goodsSku:[],
      goodsSkuConfig:[],
      mapGoodsSkuConfig:{},
      skuDimen:{},
      goodsSaleUnit:[],
      saleUnitDis:false,
      saleUnitDisType:'',
      saleSelectClear:false,
      saleEditModel:{
        type:1, // 1 补全 2 // 修改
        isShow:false,
        propertyList:[],
        skuIdx:'',
        fn:false, // 管理时
        noKey:false  // 是否有销售属性
      },
      saleManageModel:{
        isShow:false
      },
      managerSkuList:[],
      mapCategoryId:{},
      selectCategoryId:'',
      editSkuStatusModel:{
        isShow:false,
        type:'',
        idx:''
      },
      addSkuModel:{
        isShow:false,
        skuId:'',
        idx:''
      },//添加SKU
      selectAddSkuModel:{
        isShow:false,
        batchList:[],
        list:[],
        type:''
      },
      sellerDeliver:{
        options:[],
        mapTemp:{},
        templateOpts:[],
        freightTemplateName:'',
        freightSubmitType:'',
        freight:'',
        hasSellerDeliver:false,
        mapAreaTemp:{},
        areaTempOpts:[]
      },
      deliverTempDetailModel:{
        isShow:false,
        dOpts:{
          seller:'',
          name:'',
          type:'',
          desc:'',
          select:[],
          except:[]
        },
        opts:{
          select:[],
          except:[]
        }
      },
      initSellerDeliver:{
        deliverAreaIds:[],
        sellerMainId:''
      },
      picUpload:{
        file:null
      }, //上传格式
      deliverAreaIdsChange:false, //是否改变发货地  用于新增时
      skuUnitBatchList:[],
      baseSkuList:[],
      baseSyncConfig:{
        baseGoodsId: '',
        id: '',
        isSyncDetail: 1,
        isSyncGoodsImage: 1,
        isSyncGoodsProperty: 1,
        isSyncKeyProperty: 1,
        isSyncSKUImage: 1,
        isSyncSaleUnit: 1,
        isSyncSellingPoint: 1,
        saleGoodsId: ''
      },
      baseSyncModel:{
        isShow:false,
        opts:{
          isSyncDetail: true,
          isSyncGoodsImage: true,
          isSyncGoodsProperty: true,
          isSyncKeyProperty: true,
          isSyncSKUImage: true,
          isSyncSaleUnit: true,
          isSyncSellingPoint: true,
        }

      },
      baseGoodsMsg:{
        id:'',
        code:'',
        name:'',
        sellerMainName:''
      },
      baseSaleUnitReady:false,
      copySellerDeliver:{
        options:[],
        areaTempOpts:[],
        deliverAreaId:'',
        sellerDeliverAreaTemplateId : ''
      },
      mapDeliverIdSellerMainId:{}
    }),
    methods:{
      ...mapActions(['setViewImage','setProductUpload','getPropertyDetail','getSaleProductDetail','getCateList','getGoodsSkuList','getCategoryPath',
        'getUnitSkuList','saveSaleGoods','getGoodsSellerDeliver','getGoodsSellerMainDeliver','setStartToast','getProductFreightTemplate','getSellerArea',
        'checkCateGoods','getBaseGoodsDetail','getSaleListCode','getFrontCateChildList',
        'getSaleBrandNameList','getDeliverAreasTemplateDetail','getSaleFreightTempList']),
      initView(){
        //初始化
        //获取类目
        const query = this.$route.query
        this.editType = query.goodsId ? 'edit' : 'new'
        if(this.editType == 'edit'){
          // 编辑时
          this.goodsId = query.goodsId ? query.goodsId : ''
          this.editStep = 2
          this.callGetProductDetail()
            .then(()=>{
              return this.callGetPropertyDetail()
            })
            .then(()=>{
              this.checkProperty(this.editType)
            })
        }
        else {
          // 新增时
          this.baseGoodsId = query.baseGoodsId ? query.baseGoodsId : false
          this.initMapSaleCode(query.channelType)
          this.saveProductEdit.channel = query.channelType
          this.saveProductEdit.saleTypeId = query.saleType
          if(this.baseGoodsId){
              //新增快捷创建商品入口
            this.editStep = 2
            this.callGetBaseProductDetail()
              .then(()=>{
                return this.callGetPropertyDetail()
              })
              .then(()=>{
                this.checkProperty('new-base')
              })

          }
          else {
              //新建常规创建商品
            this.editStep = 1
            this.handleItemChange([])
            this.setProductUpload({detail:'',images:[]})
            this.demoSelectEdit()
          }

          // 获取新增时前端类目
          this.initFrontCateChange([])
        }
        this.callGetSaleFreightTempList()
      },
      //乘
      accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
      },
      //加
      accAdd(arg1, arg2) {

        var r1, r2, m, c;

        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }

        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }

        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2))
        if (c > 0) {
          var cm = Math.pow(10, c);
          if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
          }
          else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
          }
        }
        else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m

      },
      demoSelectEdit(){
        return false
        var a = [
          {
            id: 1255,
            idx: 0,
            name: "百货"
          },
          {
            id: 1256,
            idx: 0,
            name: "3C数码"
          },
          {
            id: 1257,
            idx: 0,
            name: "二级"
          }
        ]
        this.step1.selectedCategory = a
        this.editStep = 2
        this.selectCate()
      },
      //代理费用自动计算
      planRate(rs,key,value){
//        高级代理利润A：总分出利润/1.25 再向下取整
//        育成代理利润B：A*0.25
//        经理利润C；A*0.2
//        育成经理利润D：A*0.06
//        总监利润：A*0.06
//        育成经理利润：A*0.018
        let _rule = [
          {
            label:'高级代理利润',
            key:'seniorAgentRate',
            base:1
          },
          {
            label:'育成代理利润',
            key:'ycAgentRate',
            base:0.25
          },
          {
            label:'经理利润',
            key:'managerRate',
            base:0.2
          },
          {
            label:'育成经理利润',
            key:'ycManagerRate',
            base:0.06
          },
          {
            label:'总监利润',
            key:'directorRate',
            base:0.06
          },
          {
            label:'育成总监利润',
            key:'ycDirectorRate',
            base:0.018
          }
        ]
        const _base = Math.floor(value/1.25)
        _rule.map((item)=>{
            let _result = _base * item.base,
                _num = _result.toFixed(4),
                _rNum = _num.replace(/\.?0+$/,'')

            rs.saleUnitHqbs[item.key] = _rNum
        })


      },
      //买手快捷创建
      baseSkuRate(price,rs){

        if(this.saveProductEdit.channel == 8 && rs.count && rs.price){
          rs.saleUnitMsms.agentPrice = this.accMul(rs.price,rs.count)
        }
      },
      //获取运费收入模板
      callGetSaleFreightTempList(){
        this.getSaleFreightTempList()
          .then((rs)=>{
            this.freightTemplateIdList = []
            rs.rows.map((item)=>{
                let _opts = {
                  label:item.name,
                  value:item.id
                }
                this.freightTemplateIdList.push(_opts)
            })
          })
      },
      //初始化销售类型
      initMapSaleCode(channel){
        this.getSaleListCode({channel:channel})
          .then((rs)=>{
            rs.map((item)=>{
                this.mapSaleType[item.code] = item.name
            })
//            console.log(rs)
          })
      },
      //确认选择类目
      selectCate(){
        let _list = JSON.parse(JSON.stringify(this.step1.selectedCategory))
        if(!_list.length){
            this.getToast('请选择类目')
            return false
        }
        let _cateId = _list.length ? _list.pop().id : 0
        let _listArr = []
        this.step1.selectedCategory.map((item)=>{
            _listArr.push(item.name)
        })
        if(this.editType == 'edit'){
          this.checkCateGoods({saleGoodsId:this.goodsId,categoryId:_cateId})
            .then((rs)=>{
              this.selectCategoryId = _cateId
              this.cateTitle = _listArr.join(' > ')
              this.callGetPropertyDetail(this.selectCategoryId)
                .then(()=>{
                  return this.callGetProductDetail()
                })
                .then(()=>{
                  this.editStep = 2
                  this.checkProperty(this.editType)
                })
            })
        }
        else {
          this.selectCategoryId = _cateId
          this.cateTitle = _listArr.join(' > ')
          this.callGetPropertyDetail(this.selectCategoryId)
            .then(()=>{
              this.editStep = 2
              this.checkProperty(this.editType)
              this.initSellerDeliver.sellerMainId = ''
              this.initSellerDeliver.deliverAreaIds = []
              this.saveProductEdit.deliverArea.deliverAreaId=''
              this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId =''
              this.sellerDeliver.options = []
              this.sellerDeliver.areaTempOpts = []
            })
        }
      },
      cancelEditStep(){
        this.editStep = 2
      },
      //显示选择类目面板
      showSelectCate(){
        this.$confirm('修改类目将导致商品编辑页面尚未保存的类目属性信息丢失，是否确认修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if(this.editType == 'edit' && !this.editStepCheck){
            this.editStepCheck = true
            this.step1.selectedCategory = []
            this.editStep = 1
            this.handleItemChange([])
          }
          else{
            this.editStep = 1
            this.step1.selectedCategory = []
          }
          this.showCancelEditStep = true
        }).catch(() => {
        });
      },
      //比较类目 和 商品详情
      checkProperty(type){
        //根据类目初始化
        this.saleSelectClear = false  //清空销售属性值选中  用在补充属性中
        this.mapCateProperty = {}
        this.goodsPropertyConfig = []
        this.skuDimen = {}
        this.goodsSkuConfig = []
        if(!this.baseGoodsId){
          this.cateProperty.map((item,idx)=> {
            let opts = {
              selected:null,
              isDisabled:false,
              options:[]
            }
            opts.propertyName = item.propertyName
            opts.propertyNameId = item.propertyNameId
            opts.inputType = item.inputType
            opts.isRequired = item.isRequired
            opts.propertyType = item.propertyType
            opts.sortOrder = item.sortOrder
            this.mapCateProperty[item.propertyNameId] = idx
            if(opts.inputType == 2 || opts.inputType == 6 || opts.inputType == 7){
              opts.inputValue = ''
            }
            if(opts.inputType == 3 || opts.inputType == 4){
              opts.selected = []
            }
            if(opts.inputType == 4){
              opts.mulOptions = [
                {
                  pvName:''
                }
              ]
            }
            item.propertyPairs = item.propertyPairs ? item.propertyPairs : []
            item.propertyPairs.map((subItem)=>{
              let opt = {
                id:subItem.id,
                propertyValueId:subItem.propertyValueId,
                pvName:subItem.pvName,
                propertyNameId:subItem.propertyNameId
              }
              opts.options.push(opt)
            })
            this.goodsPropertyConfig.push(opts)
          })
          this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
        }
        //根据详情初始化
        if(type == 'new'){
            // 是否有销售属性 新增时
          if(this.noSalePro){
            let _opts = {
              id:'',
              skuName:'默认',
              skuPvId:[],
              unitSKUs:[],
              marketPrice:'',
              retailPrice:'',
              costPrice:'',
              price:'',
              count:'',
              status:1
            }
            if(this.channelRateKey[this.saveProductEdit.channel]){
                let _rate = {}
                _rate[this.channelRateKey[this.saveProductEdit.channel]] = UtilTool.deepCopy(this.channelRateKeys[this.saveProductEdit.channel])
               _opts = Object.assign({},_opts,_rate)
            }
            this.goodsSkuConfig.push(_opts)
          }
          return false
        }
        this.goodsProperty.map((item,idx) =>{
          //存在
          if(this.mapCateProperty[item.propertyNameId] != null){
            let _idx = this.mapCateProperty[item.propertyNameId],
                _opts = this.goodsPropertyConfig[_idx],
                _type = _opts.inputType
            if(item.propertyPairs.length){
              let arr = [],
                  extArr = [],
                  arrMap = {}
              _opts.options.map((subItem)=>{
                arrMap[subItem.pvName] = subItem.pvName
              })
              item.propertyPairs.map((subItem)=>{
                if(!arrMap[subItem.pvName]){
                  let opt = {
                    propertyValueId:'',
                    pvName:subItem.pvName,
                    propertyNameId:subItem.propertyNameId
                  }
                  extArr.push(opt)
                }
                arr.push(subItem.pvName)
              })
              Array.prototype.push.apply(_opts.options,extArr)
              // 已选sku 维度
              if(_opts.propertyType == 2){
                const _skuOpt = {
                  id:item.propertyNameId,
                  value:arr
                }
                this.skuDimen[item.propertyNameId] = _skuOpt
                let _skuMapArr = {}
                arr.map((item)=>{
                  _skuMapArr[item] = item
                })
                _opts.options.map((item)=>{
                  if(_skuMapArr[item.pvName]){
                      item.saleDis = true //已选置灰
                  }
                })
//////                console.log(_opts.options)
//////                console.log(arr)
              }


              _opts.selected =  _type == 1 || _type == 2 || _type == 5 || _type == 6 || _type == 7? arr[0] : arr
            }
            this.goodsPropertyConfig[_idx] = _opts
          }
          else {
            let opts =  {
              isOther:true,
              selected:'',
              propertyName:item.propertyName,
              propertyType:item.propertyType,
              propertyNameId:item.propertyNameId
            }
            let arr = [],
                selectArr = []
            item.propertyPairs.map((subItem)=>{
              arr.push({
                pvName:subItem.pvName,
                propertyPairId:subItem.id
              })
              selectArr.push(subItem.pvName)
            })
            if(this.baseGoodsId){
              if(item.propertyType == 2){
                opts.isOther = false
                opts.selected = selectArr
                opts.inputType = 4
                opts.options = arr
//              arr.map((subItem)=>{
//                opts.options.push({pvName:subItem.pvName})
//              })
                opts.mulOptions = []
              }
              else {
                opts.selected = selectArr.join(',')
              }
              this.mapCateProperty[item.propertyNameId] = idx
            }
            this.goodsPropertyConfig.push(opts)
          }
        })

        // 设置已选的 sku
//        this.goodsSkuConfig = []
        let saleUnit = this.goodsSaleUnit
        let saleProperty = [] // 销售属性
        this.cateProperty.filter((item)=>item.propertyType == 2).map((item)=>{
          saleProperty.push(item.propertyNameId)
        })

        //快捷创建  sku 初始化
        if(this.baseGoodsId){
          let _mapSaleUnit = {}
          saleUnit.map((item)=>{
            let arr = [],
              arr_vn = []
            if(item.properties.length){
              let _this = this
              item.properties.map((subItem)=>{
                arr.push(subItem.pvName)
                arr_vn.push(subItem.propertyNameId)
                this.callMapGoodsSkuConfig()
              })
            }
            else {
              arr = item.name ? [item.name] : ['默认']
              arr_vn = []
            }
            // 1 组合装 2 市场价 3 建议售价 4 成本价 5 销售价
            //快捷创建时编辑
            let _opts = {}
            if(type == 'new-base'){
              item.marketPrice = item.marketPrice / 100
              item.retailPrice = item.retailPrice / 100
              item.costPrice = item.costPrice / 100
              _opts = {
                skuName:arr.join(this.skuSplitStr),
                skuPvId:arr_vn,
                skuPvId:arr_vn,
                unitSKUs:[item],
                status:item.status,
                marketPrice:item.marketPrice,
                retailPrice:item.retailPrice,
                costPrice:item.costPrice,
                count:'',
                price:'',
                isBase:true,
                isSave:false,
                skuCode:item.skuCode
              }
              if(this.channelRateKey[this.saveProductEdit.channel]){
                let _rate = {}
                _rate[this.channelRateKey[this.saveProductEdit.channel]] = UtilTool.deepCopy(this.channelRateKeys[this.saveProductEdit.channel])
                _opts = Object.assign({},_opts,_rate)

              }
            }
            else {
              _opts = {
                id:item.id,
                skuName:arr.join(this.skuSplitStr),
                skuPvId:arr_vn,
                unitSKUs:item.unitSKUs,
//                marketPrice:this.getRowArr(item.unitSKUs,2,1),
//                retailPrice:this.getRowArr(item.unitSKUs,3,1),
//                costPrice:this.getRowArr(item.unitSKUs,4,1),
//                price:this.getRowArr(item.unitSKUs,5,1),
                marketPrice:item.unitSKUs[0].marketPrice,
                retailPrice:item.unitSKUs[0].retailPrice,
                costPrice:item.unitSKUs[0].costPrice,
                price:item.unitSKUs[0].price,
                count:item.unitSKUs[0].count,
                status:item.status,
                isSave:true,
                skuCode:item.unitSKUs[0].skuCode,
                skuId:item.unitSKUs[0].skuId
              }
              if(this.channelRateKey[this.saveProductEdit.channel]){
                let _rate = {}
                _rate[this.channelRateKey[this.saveProductEdit.channel]] = UtilTool.deepCopy(item[this.channelRateKey[this.saveProductEdit.channel]])
                if(this.saveProductEdit.channel == 2){
                    _rate.saleUnitHqbs.totalProfit = _rate.saleUnitHqbs.seniorAgentRate + _rate.saleUnitHqbs.ycAgentRate
                }
                _opts = Object.assign({},_opts,_rate)
              }
              _mapSaleUnit[item.unitSKUs[0].skuId] = _opts
            }
            this.goodsSkuConfig.push(_opts)

          })
          let _this = this
          this.baseSkuList.map((item)=>{
            let arr = [],
              arr_vn = []
            if(item.properties.length){
              let _this = this

              item.properties.map((subItem)=>{
                arr.push(subItem.pvName)
                arr_vn.push(subItem.propertyNameId)
                this.callMapGoodsSkuConfig()
              })
            }
            else {
              arr = arr = item.name ? [item.name] : ['默认']
              arr_vn = []
            }
            item.marketPrice = item.marketPrice / 100
            item.retailPrice = item.retailPrice / 100
            item.costPrice = item.costPrice / 100
            let _opts = {
              skuName:arr.join(this.skuSplitStr),
              skuPvId:arr_vn,
              skuPvId:arr_vn,
              unitSKUs:[item],
              status:item.status,
              marketPrice:item.marketPrice,
              retailPrice:item.retailPrice,
              costPrice:item.costPrice,
              count:this.goodsSkuConfig[0].count,
              price:'',
              isSave:false,
              skuCode:item.skuCode
            }
            if(this.channelRateKey[this.saveProductEdit.channel]){
              let _rate = {}
              _rate[this.channelRateKey[this.saveProductEdit.channel]] = UtilTool.deepCopy(this.channelRateKeys[this.saveProductEdit.channel])
              _opts = Object.assign({},_opts,_rate)

            }
            if(_mapSaleUnit[item.id]){
              let saleUnit = _mapSaleUnit[item.id]
              saleUnit.skuName = arr.join(this.skuSplitStr)
              saleUnit.skuPvId = arr_vn
              saleUnit.unitSKUs = [item]
            }
            else {
              this.goodsSkuConfig.push(_opts)
            }

          })
          setTimeout(function(){
            _this.changeSKUList()
          },100)
        }
        // 常规创建 sku 初始化
        else {
          saleUnit.map((item)=>{
            let arr = [],
              arr_vn = []

            if(item.properties.length){
              let _this = this
              item.properties.sort(function(a,b){
                // 存在
                if(typeof _this.mapCateProperty[a.propertyNameId] == 'number' && typeof _this.mapCateProperty[b.propertyNameId] == 'number'){
                    return  _this.goodsPropertyConfig[_this.mapCateProperty[b.propertyNameId]].sortOrder - _this.goodsPropertyConfig[_this.mapCateProperty[a.propertyNameId]].sortOrder

                }
                else {
                  //不存在
                  return a.propertyNameId - b.propertyNameId
                }
              })
              item.properties.map((subItem)=>{
                arr.push(subItem.pvName)
                arr_vn.push(subItem.propertyNameId)
                this.callMapGoodsSkuConfig()
              })
            }
            else {
              arr = [item.name]
              arr_vn = []
            }
            //                  1 组合装 2 市场价 3 建议售价 4 成本价 5 销售价

              let _opts = {
                id:item.id,
                skuName:arr.join(this.skuSplitStr),
                skuPvId:arr_vn,
                unitSKUs:item.unitSKUs,
//                marketPrice:this.getRowArr(item.unitSKUs,2,1),
                marketPrice:item.marketPrice/100,
                retailPrice:this.getRowArr(item.unitSKUs,3,1),
                costPrice:this.getRowArr(item.unitSKUs,4,1),
                price:this.getRowArr(item.unitSKUs,5,1),
                totalPrice:this.getRowArr(item.unitSKUs,6,1),
                count:item.unitSKUs.length > 1 ? '组合装' : this.getRowArr(item.unitSKUs,1,1)+'件装',
                status:item.status,
                isSave:true
              }
            if(this.channelRateKey[this.saveProductEdit.channel]){
              let _rate = {}
              _rate[this.channelRateKey[this.saveProductEdit.channel]] = UtilTool.deepCopy(item[this.channelRateKey[this.saveProductEdit.channel]])
              if(this.saveProductEdit.channel == 2){
                _rate.saleUnitHqbs.totalProfit = _rate.saleUnitHqbs.seniorAgentRate + _rate.saleUnitHqbs.ycAgentRate
              }
              _opts = Object.assign({},_opts,_rate)
            }
              // 判断子集
              if(this.checkIncludesArr(saleProperty,arr_vn)){
                //是子集 数量不同 补充
                if(saleProperty.length != arr_vn.length){
                  _opts.type = 1
                  this.saleUnitDis = true
                  this.saleUnitDisType = 1
                }
              }
              else {
                //不是子集 存在数量  修改
                if(saleProperty.length || arr_vn.length){
                  _opts.type = 2
                  this.saleSelectClear = true
                  this.saleUnitDis = true
                  this.saleUnitDisType = 2
                }
              }
              this.goodsSkuConfig.push(_opts)


          })
          this.goodsSkuConfig.sort((a,b)=>{
            if(a.skuName > b.skuName){
              return 1
            }  else if(a.skuName < b.skuName){
              return -1
            } else {
              return 0
            }
          })
          this.callMapGoodsSkuConfig()

          //补充属性时 清空已选择的 属性值
          if(this.saleSelectClear){
            this.goodsPropertyConfig.map((item)=>{
              if(item.propertyType == 2 && !item.isOther){
                item.selected = []
////                console.log('!!!!!')
////                console.log(item.options)
//                if()
                item.options.map((subItem)=>{
                  subItem.saleDis = false
                })
              }
            })
          }
        }

        // sku主图ID
        this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
        this.mapSKUImage()
      },
      //类目选择切换
      handleItemChange(val){
        let list = this.step1.categoryOptions
        let valItem = {}
        if(val.length){
          valItem = val[val.length-1]
        } else {
          valItem.id = 0
        }
        if(this.mapCategoryId[valItem.id] != null){
            return false
        }
        this.mapCategoryId[valItem.id] = valItem.id

        val.map((item)=>{
          list = list[item.idx].cates
        })
        this.categoryPromise(valItem.id)
          .then((rs)=>{
            if(!rs.length)
                return false
            rs.map((item,idx)=>{
              let _opts = {
                label:item.name,
                cates:[],
                value:{
                  idx:idx,
                  id:item.id,
                  name:item.name
                }
              }
              if(item.isLeaf)
                delete _opts.cates
              list.push(_opts)
            })

          })
////        console.log(this.step1.categoryOptions)
      },
      //获取下一级类目集合
      categoryPromise(id){
        const _this = this;
        let _id = id ? id : 0
        return new Promise(function(resolve){
          _this.getCateList({categoryId:_id})
            .then((rs)=>{
            resolve(rs)
          })
        })
      },
      /*
      * 前端类目初始化 新建 修改
      * */
      initFrontCateChange(arr){
        if(arr.length){
//          this.frontCate.selectedCategory = arr
          this.frontCateChange([])
            .then(()=>{
              arr.map((item,index)=>{
                this.frontCateChange(item.slice(0,1))
                  .then(()=>{
                    this.frontCate.selectedCategory[index] = item
                    return this.frontCateChange(item.slice(0,2))
                  })
                  .then(()=>{
                    this.frontCate.selectedCategory[index] = item
                    return this.frontCateChange(item.slice(0,3))
                  })
                  .then(()=>{
                    this.frontCate.selectedCategory[index] = item
                  })
              })

            })

        } else{
          this.frontCateChange([])
        }

      },
      showFrontCateSelect(){
          console.log(this.frontCate.selectedCategory)
      },
      //前端类目切换
      frontCateChange(val){
        let _self = this
        return new Promise((reslove)=>{
          let list = _self.frontCate.categoryOptions
          let valItem = {}
          if(val.length){
            valItem.id = val[val.length -1]
          }
          else {
            valItem.id = 0
          }
          //是否存在
          if(_self.mapFrontCate[valItem.id]){
            reslove()
            return false
          }
          _self.mapFrontCate[valItem.id] = true
          // 获取下标
          val.map((item)=>{
            var _index = _self.mapFrontCateIdToIdx(list,item)
            list = list[_index].cates
          })
          _self.frontCatePromise(valItem.id)
            .then((rs)=>{
              reslove()
              //没有数据 结束
              // 有数据
              rs.map((item)=>{
                let _opts = {
                  value:item.id,
                  label:item.name,
                  cates:[],
                }
                // 如果是最后节点 删除 cates
                if(item.isLeaf){
                  delete _opts.cates
                }
                list.push(_opts)
              })
            })
        })

      },
      mapFrontCateIdToIdx(list,id){
        let _len = list.length,
            _index = -1
        while(_len--){
            if(list[_len].value == id){
               _index = _len
            }
        }
        return _index
      },
      frontCatePromise(id){
        const _this = this;
        let _id = id ? id : 0
        return new Promise(function(resolve){
          _this.getFrontCateChildList({parentId:_id,channel:_this.saveProductEdit.channel})
            .then((rs)=>{
              resolve(rs)
            })
        })
      },
      // 详情页品牌获取
      remoteMethodSaleBrand(query,type){
        if(!query){
          this.saleBrandNameList = []
          return false
        }
        let opts = {}
//        console.log(type)
        if(type){
          opts.brandId = query
        } else {
          opts.brandName = query
        }


        this.getSaleBrandNameList(opts).then((rs)=>{
          let list = []
          this.saleBrandNameList = rs
        })
      },
      //获取类目属性详情
      callGetPropertyDetail(){
////        console.log('===获取类目===Id='+this.selectCategoryId)
        const _this = this
        return new Promise(function(resolve){
//            _this.selectCategoryId
          _this.getPropertyDetail({categoryId:_this.selectCategoryId})
            .then((rs)=>{
              rs.goodsProperties = rs.goodsProperties ? rs.goodsProperties : []
              rs.keyProperties = rs.keyProperties ? rs.keyProperties : []
              rs.saleProperties = rs.saleProperties ? rs.saleProperties : []
              _this.noSalePro = rs.saleProperties.length ? false : true
              let list = rs.saleProperties.concat(rs.keyProperties,rs.goodsProperties)
              _this.cateProperty = list
              _this.cateProperty.sort(function(a,b){
                return b.sortOrder - a.sortOrder
//                  if(a.sortOrder < b.sortOrder){
//                      return 1
//                  } else if(a.sortOrder > b.sortOrder){
//                      return -1
//                  } else {
//                      return 0
//                  }

              })
              if(!_this.baseGoodsId){
                _this.configSaleUnitImages = {
                  idx:'',
                  isRequiredImage:rs.isRequiredSKUImage,
                  skuImagePropertyNameId:rs.skuImagePropertyId,
                  skuImagePropertyName:rs.skuImagePropertyName,
                  list:{},
                  saleUnitImages:_this.configSaleUnitImages.saleUnitImages
                }
              }
              resolve()
            })
        })
      },
      //快捷创建 新增时 获取基本商品详情
      callGetBaseProductDetail(){
//        console.log('===获取基本商品详情===')
        const _this = this
        return new Promise(function(resolve){
          _this.getBaseGoodsDetail({baseGoodsId:_this.baseGoodsId})
            .then((rs)=>{
              _this.initBaseDetail(rs,resolve)
            })
        })
      },
      //切换SKU
      changeSKUList(){
        this.goodsSkuConfig.map((item)=>{
          if(item.isSave || item.isBase){
            this.$refs.multipleTable.toggleRowSelection(item);
          }
        })
        this.baseSaleUnitReady = true

      },
      //快捷创建SKU件数同步
      baseSkuCount(val,rs){
        let _val = val
//        if(!(val+'').match(RegExpType.Num)){
////          this.getToast('销售件数格式不正确')
//          _val = ''
//          val = ''
////          return false
//        }

        this.goodsSkuConfig.map((item)=>{
           item.count = _val
           this.baseSkuRate(item.price,item)
        })
      },
      //快捷创建是否可选
      selectableSKU(row){
        return !row.isSave
      },
      //销售属性选择清空
      //选择同步规则
      setSyncRule(){
        Object.keys(this.baseSyncModel.opts).map((item)=>{
          this.baseSyncModel.opts[item] = Boolean(this.baseSyncConfig[item])
        })
        this.baseSyncModel.isShow = true
      },
      //为什么不可以选
      callWhySync(){
        this.$alert('快捷创建的销售商品，其类目属性相关信息（包括商品类目、关键属性、商品属性、销售属性、销售单元主图）默认与基础商品保持同步，如需编辑请修改基础商品。', '提示', {
          confirmButtonText: '我知道了',
        }).then(() => {

        }).catch(() => {

        });
      },
      //取消同步选择
      cancelSyncModel(){
        this.baseSyncModel.isShow = false
        Object.keys(this.baseSyncModel.opts).map((item)=>{
          this.baseSyncModel.opts[item] = false
        })
      },
      //提交同步选择
      submitSyncModel(){
        Object.keys(this.baseSyncModel.opts).map((item)=>{
          this.baseSyncConfig[item] = Number(this.baseSyncModel.opts[item])
        })
        this.uploadConfig.detailConfig.editType = this.baseSyncConfig.isSyncDetail ? 1 : 2
        this.uploadConfig.imageConfig.editType = this.baseSyncConfig.isSyncGoodsImage ? 1 : 2
        this.cancelSyncModel()
      },
      clearSaleUnitSelect(){
        this.goodsPropertyConfig.map((item)=>{
          if(item.propertyType == 2){
            item.selected = []
          }
        })
      },
      //快捷创建SKU勾选
      skuUnitBatch(list){
        this.skuUnitBatchList = list
        this.clearSaleUnitSelect()
        list.map((item)=>{
           item.unitSKUs[0].properties.map((subItem)=>{
               if(this.mapCateProperty[subItem.propertyNameId] != null && !this.goodsPropertyConfig[this.mapCateProperty[subItem.propertyNameId]].selected.includes(subItem.pvName)){
                   this.goodsPropertyConfig[this.mapCateProperty[subItem.propertyNameId]].selected.push(subItem.pvName)
               }
           })
        })
        this.mapSKUImage()
      },
      //同步SKU图片
      mapSKUImage(){
        if(this.configSaleUnitImages.isRequiredImage){
          let _list =  JSON.parse(JSON.stringify(this.configSaleUnitImages.list))
          this.configSaleUnitImages.list = {}
          this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.map((unit,u_idx)=>{
            if(_list[unit]){
              this.configSaleUnitImages.list[unit] =  _list[unit]
            }  else {
              let _propertyPairs = []
              this.goodsProperty.map((item)=>{
                if(item.propertyNameId == this.configSaleUnitImages.skuImagePropertyNameId){
                  _propertyPairs = item.propertyPairs
                }
              })
              let _pairsId = ''
              _propertyPairs.map((item)=>{

                if(item.pvName == unit){
////                  console.log(item.pvName)
////                  console.log(unit)
                  _pairsId = item.id
                }
              })
              this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages.filter((item)=>item.propertyPairId == _pairsId)[0]

            }
          })
        }

      },
      //快捷创建运费模板修改 快捷创建新建
      baseAreaTempChange(){
        this.baseGoodsDeliverArea.deliverArea.sellerDeliverAreaTemplateId = this.baseGoodsDeliverArea.mapAreaTempId[this.baseGoodsDeliverArea.deliverArea.deliverAreaId]
      },
      //快捷创建详情初始化
      initBaseDetail(rs,resolve){
        let _this = this

        _this.baseGoodsMsg.code = rs.baseGoodsCode
        _this.baseGoodsMsg.id = rs.id
        _this.baseGoodsMsg.name = rs.name
        _this.baseGoodsMsg.sellerMainName = rs.sellerMainName
        _this.goodsProperty = rs.properties
        // 基础商品发货地
        _this.mapDeliverIdSellerMainId = {}
        rs.deliverAreas.map((item)=>{
          let _opt = {
            label:item.deliverAreaName,
            value:item.deliverAreaId
          }
          _this.baseGoodsDeliverArea.mapAreaTempId[item.deliverAreaId] = item.deliverAreaTemplateId ? item.deliverAreaTemplateId : ''

          _this.mapDeliverIdSellerMainId[item.deliverAreaId] = item.sellerMainId
//          _this.baseGoodsDeliverArea.mapAreaTempId[item.deliverAreaId] = item.deliverAreaTemplateId
          _this.baseGoodsDeliverArea.options.push(_opt)
          if(item.deliverAreaTemplateId){
              let _tempOpt = {
                label:item.deliverAreaTemplateName,
                value:item.deliverAreaTemplateId
              }
            _this.baseGoodsDeliverArea.templateOpts.push(_tempOpt)
          }
        })
        //详情销售单元
        _this.goodsSaleUnit = rs.skuArray
        _this.uploadConfig.detailConfig.editType = _this.baseSyncConfig.isSyncDetail ? 1 : 2
        _this.uploadConfig.imageConfig.editType = _this.baseSyncConfig.isSyncGoodsImage ? 1 : 2
        //同步基本信息
        _this.saveProductEdit.longTitle= rs.name
        _this.saveProductEdit.shortTitle= ''
        _this.saveProductEdit.sellingPoint = rs.sellingPoint
        _this.saveProductEdit.brandId = rs.brandId
        _this.remoteMethodSaleBrand(_this.saveProductEdit.brandId,'id')

        let _dList = []
        rs.deliverAreas.map((item)=>{
            _dList.push(item.deliverAreaId)
        })
        _this.initSellerDeliver.deliverAreaIds = _dList
        _this.initDeliverAreasTemp(_this.initSellerDeliver.deliverAreaIds)

        _this.initSellerDeliver.sellerMainId = rs.sellerMainId
        _this.initDeliverAreas()


        //同步商品图片详情
//        _this.saveProductEdit.detail = rs.detail
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
            _this.editCatePathIdArr = _rs.path.split('/').filter((item)=>item)
            let  _pathNameArr = _rs.pathName.split(',')
            _this.editCatePathIdArr.map((item,idx)=>{
              let _opts = {
                idx:0,
                id:Number(item),
                name:_pathNameArr[idx]
              }
              _this.step1.selectedCategory.push(_opts)
            })
          })
        resolve()
      },
      //获取商品详情
      callGetProductDetail(){
////        console.log('===获取详情===')
        const _this = this
        return new Promise(function(resolve){
           if(_this.goodsDetailFetch.fetch){
             _this.initDetail(_this.goodsDetailFetch.rs,resolve)
           } else {
             _this.getSaleProductDetail({baseGoodsId:_this.goodsId})
               .then((rs)=>{
                 //详情属性
                 _this.goodsDetailFetch.fetch = true
                 _this.goodsDetailFetch.rs = JSON.parse(JSON.stringify(rs))
                 _this.initDetail(rs,resolve)
               })
           }

        })
      },
      //详情初始化
      initDetail(rs,resolve){
        let _this = this
        _this.baseGoodsId = rs.baseGoodsId || false
        _this.goodsProperty = rs.properties || []
        //详情销售单元
        rs.saleUnits.map((item)=>{
          item.price = item.price / 100
          item.unitSKUs.map((subItem)=>{
            subItem.price = subItem.price / 100
            subItem.retailPrice = subItem.retailPrice / 100
            subItem.marketPrice = subItem.marketPrice / 100
            subItem.costPrice = subItem.costPrice / 100
          })
        })
        if(_this.baseGoodsId){
          if(rs.sync){
            _this.baseSyncConfig =  rs.sync
            _this.uploadConfig.detailConfig.editType = _this.baseSyncConfig.isSyncDetail ? 1 : 2
            _this.uploadConfig.imageConfig.editType = _this.baseSyncConfig.isSyncGoodsImage ? 1 : 2
            _this.baseSkuList = rs.skus
          }
          _this.baseGoodsMsg.code = rs.baseGoodsCode
          _this.baseGoodsMsg.id = rs.baseGoodsId
          _this.baseGoodsMsg.name = rs.baseGoodsName
          _this.baseGoodsMsg.sellerMainName = rs.sellerMainName
        }
        _this.goodsSaleUnit = rs.saleUnits
        //同步基本信息
        _this.saveProductEdit.saleGoodsCode= rs.saleGoodsCode
        _this.saveProductEdit.id= rs.id
        this.initMapSaleCode(rs.channel)
        _this.saveProductEdit.channel = rs.channel
        _this.saveProductEdit.saleTypeId = rs.saleTypeId
        const frontCategoryIds =  rs.frontCategoryIds || []

        _this.initFrontCateChange(frontCategoryIds)
        _this.saveProductEdit.longTitle = rs.longTitle
        _this.saveProductEdit.shortTitle = rs.shortTitle
        _this.saveProductEdit.sellingPoint = rs.sellingPoint
        _this.saveProductEdit.brandId = rs.brandId
        _this.remoteMethodSaleBrand(_this.saveProductEdit.brandId,'id')

        _this.saveProductEdit.deliverArea = rs.deliverArea
        _this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId = _this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId === 0 ? '' :  _this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId
        _this.initSellerDeliver.deliverAreaIds = [_this.saveProductEdit.deliverArea.deliverAreaId]
        _this.initDeliverAreasTemp(_this.saveProductEdit.deliverArea.deliverAreaId)
        if(_this.goodsSaleUnit.length){
          let unitId = _this.goodsSaleUnit[0].id
          this.getUnitSkuList({saleUnitId:unitId})
            .then((rs)=>{
              _this.initSellerDeliver.sellerMainId = rs[0].sellerMainId
              _this.initDeliverAreas()
            })
        }

          //同步商品图片详情
        _this.saveProductEdit.detail.id = rs.detail.id
        _this.setProductUpload({detail:rs.detail.detail,images:rs.saleGoodsImages})
        if(_this.baseGoodsId && rs.saleUnitImages.length){
          _this.configSaleUnitImages = {
            idx:'',
            isRequiredImage:true,
            skuImagePropertyNameId:rs.saleUnitImages[0].propertyNameId,
            skuImagePropertyName:rs.saleUnitImages[0].pnName,
            list:{},
            saleUnitImages:[]
          }
        }
        _this.configSaleUnitImages.saleUnitImages = rs.saleUnitImages
        //同步商品已选择类目
        _this.selectCategoryId = _this.selectCategoryId ? _this.selectCategoryId : rs.categoryId
        _this.getCategoryPath({categoryId:_this.selectCategoryId})
          .then((_rs)=> {
            _this.cateTitle = _rs.pathName.split(',').join(' > ')
            _this.editCatePathIdArr = _rs.path.split('/').filter((item)=>item)
            let  _pathNameArr = _rs.pathName.split(',')
            _this.editCatePathIdArr.map((item,idx)=>{
              let _opts = {
                idx:0,
                id:Number(idx),
                name:_pathNameArr[idx]
              }
              _this.step1.selectedCategory.push(_opts)
            })
          })
        resolve()
      },
      //初始化发货地
      initDeliverAreasTemp(){
        let opts = {
          deliverAreaIds:this.initSellerDeliver.deliverAreaIds
        }
        this.sellerDeliver.options = []
        this.mapDeliverIdSellerMainId = {}
        this.getSellerArea(opts)
          .then((rs)=>{
            rs.map((item)=>{
              let _opt = {
                label:item.deliverAreaName,
                value:item.deliverAreaId,
                seller:item.realSellerMainName,
                sellerMainId:item.sellerMainId
              }
              this.mapDeliverIdSellerMainId[item.deliverAreaId] = item.sellerMainId
              this.sellerDeliver.options.push(_opt)
              this.sellerDeliver.mapTemp[item.deliverAreaId] = {
                freightTemplateName: item.freightTemplateName ? item.freightTemplateName : item.deliverAreaName + '运费模板',
                freightSubmitType:item.freightType,
                freight: item.freightMoney
              }
            })
          })
      },
      //初始化配送模板
      initDeliverAreas(){
//        this.getGoodsSellerDeliver({sellerMainId:this.initSellerDeliver.sellerMainId})
//          .then((rs)=>{
//            rs.map((item)=>{
//              this.sellerDeliver.mapAreaTemp[item.deliverAreaId] = item.deliverAreaTemplates
//              this.sellerDeliver.hasSellerDeliver = true
//            })
//          })
        this.sellerDeliver.areaTempOpts = []
        this.getGoodsSellerMainDeliver({sellerMainId:this.initSellerDeliver.sellerMainId})
          .then((rs)=>{
            rs.map((item)=>{
              let _opt = {
                label:item.name,
                value:item.id,
                type:item.type,
                name:item.name,
                desc:item.desc
              }
              this.sellerDeliver.areaTempOpts.push(_opt)
////              console.log(item)
//              this.sellerDeliver.areaTempOpts = rs
//              this.sellerDeliver.hasSellerDeliver = true
            })
          })
      },
      //选择发货地、
      selectFreight(id){
////        console.log(id)
        //获取模板
        this.getProductFreightTemplate()
          .then((rs)=>{
//            this.sellerDeliver.freightTemplateName=rs.freightTemplateName
//            this.sellerDeliver.freightSubmitType =rs.freightSubmitType
//            this.sellerDeliver.freight = rs.freight
          })
//        this.sellerDeliver.templateOpts = this.sellerDeliver.mapTemp[id]
//        this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId = ''
      },
      //运费 发货地 跳转
      manageTemp(type){
        alert('地址还没放，先不跳')
      },
      //查看运费模板详情
      deliverAreaTempDetail(key){
        if(!this[key].deliverArea.sellerDeliverAreaTemplateId){
            this.getToast('请选择配送地区')
            return false
        }
        let _opts = {
          freightTemplateId:this[key].deliverArea.sellerDeliverAreaTemplateId
        }
        let deliverAreaId = this[key].deliverArea.deliverAreaId
        let sellerDeliverAreaTemplateId = this[key].deliverArea.sellerDeliverAreaTemplateId
        this.getDeliverAreasTemplateDetail(_opts)
          .then((rs)=>{
            this.setDeliverAreaTempDetail(rs,deliverAreaId,sellerDeliverAreaTemplateId)
          })
      },
      setDeliverAreaTempDetail(rs,dId,tId){
          let _deliverArea = this.sellerDeliver.options.length,
              _areaTempOpts = this.sellerDeliver.areaTempOpts.length,
              _opts = {
                select:[],
                except:[]
              }
        while(_deliverArea--){
            let _item = this.sellerDeliver.options[_deliverArea]
          if(_item.value == dId){
              _opts.sellerName = _item.seller
              break
            }
          }
        while(_areaTempOpts--){
          let _item = this.sellerDeliver.areaTempOpts[_areaTempOpts]
          if(_item.value == tId){
            _opts.name = _item.name
//            _opts.type = _item.type == 1 ? '以下地区发货' : '以下地区不发货'
            _opts.type = _item.type
            _opts.desc = _item.desc
            break
          }
        }
        rs.map((item)=>{

            if(item.isExcept){
              let _name = item.provinceName + (item.cityCode == 1 ? '': item.cityName) + (item.districtCode == 1 ? '' : item.districtName)
              _opts.except.push(_name)
            } else {
              let _name = item.provinceName
              _opts.select.push(_name)
            }
        })
        this.deliverTempDetailModel.opts = _opts
        this.deliverTempDetailModel.isShow = true
      },
      cancelDeliverTempDetailModel(){
        this.deliverTempDetailModel.isShow = false
        this.deliverTempDetailModel.opts = this.deliverTempDetailModel.dOpts
      },
      //判断自定义 pvName 重复
      checkPvName(rs,val,idx){
//        console.log('=========判断===========')
        if(!val){
          return false
        }
        for(let i in rs.options){
          let item = rs.options[i]
          if(val == item.pvName){
            if(rs.mulOptions && rs.mulOptions.length){
              rs.mulOptions[idx].pvName = ''
            } else {
              rs.inputValue = null
            }

            this.getToast('属性值已存在')
            return false
          }
        }
        if(rs.mulOptions && rs.mulOptions.length){
          let _check = 0
          rs.mulOptions.map((item)=>{
            if(val == item.pvName){
              _check ++
            }
          })
          if(_check > 1){
            rs.mulOptions[idx].pvName = ''
            this.getToast('属性值已存在')
            return false
          }
        }
      },
      //数组间包含关系
      checkIncludesArr(pre,child){
        let mapPre = {},
            check = true
        pre.map((item)=>{
          mapPre[item] = item
        })
        if(!child.length){
          check = false
        }
        else {
          child.map((item)=>{
            if(!mapPre[item]){
              check = false
            }
          })
        }
////        console.log(check)
        return check
      },
      //补充 修改是 销售属性点击 弹框
      maskHandler(){
        this.$alert('销售单元与商品类目的销售属性不相符，请先在销售属性列表中完成【修改属性】操作。', '提示', {
          confirmButtonText: '我知道了',
        }).then(() => {

        }).catch(() => {

        });
      },
      //设置选择sku选择维度
      mulSelectChange(idx,event,rs){
        let _rs = JSON.parse(JSON.stringify(rs)),
            _list = _rs.options.concat(rs.mulOptions),
            _mapList = {}
        _list.map((item)=>{
          _mapList[item.pvName] = item.pvName
        })
        let _event = event.filter((item)=>_mapList[item])
        rs.selected = _event

        const _opts = {
          id:idx,
          value:_event
        }
        this.skuDimen[idx] = _opts
        let _len = 0
        for(let i in this.skuDimen){
          if(this.skuDimen[i].value.length){
              _len ++
          }
        }
//        if(_len != this.cateProperty.filter((item)=>item.propertyType == 2).length){
//          this.goodsSkuConfig = []
//          this.callMapGoodsSkuConfig()
//          return false
//        }
        this.mapSKUImage()
        this.parseSelectSale()
      },
      //展开已选择的销售属性
      parseSelectSale(){
        let arr = []
        let _skuDimen = []
        for(let i in this.skuDimen){
          _skuDimen.push(this.skuDimen[i])
        }
        let _this = this
        _skuDimen.sort(function(a,b){
            return  _this.goodsPropertyConfig[_this.mapCateProperty[b.id]].sortOrder - _this.goodsPropertyConfig[_this.mapCateProperty[a.id]].sortOrder
        })
        let _skuId = []
        for(let i in _skuDimen){
          let item = _skuDimen[i]
          let _itemArr = []
          _skuId.push(item.id)
          item.value.map((arrItem)=>{

            if(arr.length){
              arr.map((subArrItem)=>{
                _itemArr.push(subArrItem+this.skuSplitStr+arrItem)
              })
            } else {
              _itemArr.push(arrItem)
            }
          })
          if(_itemArr.length){
            arr = _itemArr
          }
        }
        let _goodsSkuConfig = []
        arr.map((item)=>{
          let _item =  item
          // 常规创建 新增时 新建商品
          let _opts = {
            costPrice:'',
            skuName:_item,
            skuPvId:_skuId,
            unitSKUs:[],
            status:1,
          }
          if(this.channelRateKey[this.saveProductEdit.channel]){
            let _rate = {}
            _rate[this.channelRateKey[this.saveProductEdit.channel]] = UtilTool.deepCopy(this.channelRateKeys[this.saveProductEdit.channel])
            _opts = Object.assign({},_opts,_rate)
          }
          if(this.mapGoodsSkuConfig[_item] != null){
            _opts = this.goodsSkuConfig[this.mapGoodsSkuConfig[_item]]
          }
          _goodsSkuConfig.push(_opts)
        })
        this.goodsSkuConfig = _goodsSkuConfig

        this.goodsSkuConfig.sort((a,b)=>{
         if(a.skuName > b.skuName){
             return 1
         }  else if(a.skuName < b.skuName){
             return -1
         } else {
             return 0
         }
        })
        this.callMapGoodsSkuConfig()
      },
      //已选sku Map
      callMapGoodsSkuConfig(){
        let _map = {}
        this.goodsSkuConfig.map((item,idx)=>{
//          console.log(item.skuName)
          _map[item.skuName] = idx
        })
        this.mapGoodsSkuConfig = _map
      },
      //补全 修改 sku
      editSaleProperty(sku,idx,type,fn){
        this.saleEditModel.skuIdx = idx
        this.saleEditModel.fn = fn ? fn : false
        let _cateProperty = this.cateProperty.filter((item)=>item.propertyType == 2)
        let list = []
        if(type == 1){
          _cateProperty.map((item)=>{
            let _check = true
            sku.map((skuId)=>{
              if(skuId == item.propertyNameId){
                _check = false
              }
            })
            if(_check){
              list.push(this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]])
            }
          })
        }
        else if(type == 2){
          list = this.goodsPropertyConfig.filter((item)=>item.propertyType == 2 && !item.isOther)
        }
        else if (type == 3){
          _cateProperty.map((item)=>{
            let _check = false
            sku.map((skuId)=>{
              if(skuId == item.propertyNameId){
                _check = true
              }
            })
            if(_check){
              list.push(this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]])
            }
          })
        }
        this.callShowEdit(list,type)
      },
      //补全 修改SKU
      callShowEdit(list,type){
        this.saleEditModel.type = type
        this.saleEditModel.propertyList = []
        let _list = JSON.parse(JSON.stringify(list))
        _list.map((item,idx)=>{
          let opt = {
            selected:'',
            inputValue:null,
            options:item.options,
            inputType:item.inputType,
            propertyName:item.propertyName,
            propertyNameId:item.propertyNameId,
            propertyType:item.propertyType,
            sortOrder:item.sortOrder
          }
          if(this.saleEditModel.fn){
            let _arr =  this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName.split(this.skuSplitStr)
            opt.selected = _arr[idx]
          }
          this.saleEditModel.propertyList.push(opt)
        })
        this.saleEditModel.noKey = _list.length ? false : true
        if(this.saleEditModel.noKey){
            let opt = {
              selected:'',
              inputValue:null,
              options:[{
                pvName:'默认'
              }],
              inputType:1,
              propertyName:'默认销售属性',
              propertyNameId:'',
              propertyType:2
            }
          this.saleEditModel.propertyList.push(opt)
        }

//        this.saleEditModel.propertyList = _list
        this.saleEditModel.isShow = true
      },
      //提交 补全 修改SKU
      submitSaleEditModel(){
        let s = '',
          sarr = [],
          checkArr = [],
          selectCheck = false
        for(let i = 0;i<this.saleEditModel.propertyList.length;i++){
          let item = this.saleEditModel.propertyList[i]
          if(!item.selected && this.saleEditModel.type == 2){
            this.getToast('请选择'+item.propertyName)
            return false
          }
          if(item.selected){
            checkArr.push(item.selected)
            selectCheck = true
          }
        }
        if(!selectCheck && this.saleEditModel.type == 1){
          this.getToast('请至少选择一个销售属性补充')
          return false
        }
        if(this.saleEditModel.noKey){
          this.saleUnitDis = false
          this.goodsSkuConfig[0].skuName = '默认'
          this.goodsSkuConfig[0].type = 3
        }
        else {
          let _selectName = checkArr.join(this.skuSplitStr)
          for(let i in this.goodsSkuConfig){
            let item = this.goodsSkuConfig[i]
            if(i != this.saleEditModel.skuIdx && _selectName == item.skuName){
              this.getToast('该销售单元已存在')
              return false
            }
            if(i == this.saleEditModel.skuIdx && _selectName == item.skuName){
              this.cancelSaleEditModel()
              return false
            }
          }
          if(this.saleEditModel.fn){
            let skuNameArr = []
            this.goodsSkuConfig.map((item)=>{
              skuNameArr.push(item.skuName.split(this.skuSplitStr))
            })

            let arr = skuNameArr[this.saleEditModel.skuIdx]
            this.saleEditModel.propertyList.map((item,idx)=>{
              if(item.selected != arr[idx]){
                if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){

                  let _len = false
                  skuNameArr.map((sku,skuIdx)=>{
                    if(this.saleEditModel.skuIdx != skuIdx && sku[idx] == arr[idx]){
                      _len = true
                    }
                  })
                  if(_len){
//                    console.log('存在')
                    this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
                  }
                  else {
//                    console.log('不存在')
                    let _selected = [item.selected]
                    this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.map((sku)=>{
                      if(sku != arr[idx]){
                        _selected.push(sku)
                      }
                    })
                    this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected = _selected
                  }
                  let _check = true
                  this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].options.map((subItem)=>{
                    if(this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(subItem.pvName)){
                      subItem.saleDis = true
                    }else{
                      subItem.saleDis = false
                    }
                    if(subItem.pvName == item.selected){
                      _check = false
                    }
                  })
                  if(_check){
                    const  opt = {
                      id:'',
                      propertyNameId:item.propertyNameId,
                      propertyValueId:'',
                      pvName:item.selected,
                      saleDis:true
                    }
                    this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].options.push(opt)
                  }
                  const _skuOpt = {
                    id:item.propertyNameId,
                    value:this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected
                  }
                  this.skuDimen[item.propertyNameId] = _skuOpt
//                  console.log(this.skuDimen)
                }
                else {
////                  console.log('')
////                  console.log(item.selected)
////                  console.log(arr[idx])
                }
              }
              else{
////                console.log(item.selected)
////                console.log('哈哈哈哈 我存在了 所以 我就 过滤了')
              }
              sarr.push(item.selected)
            })
//            this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.sort().join(this.skuSplitStr)
            this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.join(this.skuSplitStr)
//            this.managerSkuList[this.saleEditModel.skuIdx][0].skuName = sarr.sort().join(this.skuSplitStr)
            this.managerSkuList[this.saleEditModel.skuIdx][0].skuName = sarr.join(this.skuSplitStr)
            this.callMapGoodsSkuConfig()
            this.parseSelectSale()
            this.callManageSku()
          }
          else{
            this.saleEditModel.propertyList.map((item)=>{
              if(item.selected){
                if(this.saleEditModel.type == 1){
                  if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){
                    this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
                  }
                }
                else if(this.saleEditModel.type == 2){
                  if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){
                    this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
                  }
                }
                let _check = true
                this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].options.map((subItem)=>{
                  if(subItem.pvName == item.selected){
                    subItem.saleDis = true
                    _check = false
                  }
                })
                //不存在 添加
                if(_check){
                  const  opt = {
                    id:'',
                    propertyNameId:item.propertyNameId,
                    propertyValueId:'',
                    pvName:item.selected,
                    saleDis:true
                  }
                  this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].options.push(opt)
                }

                const _skuOpt = {
                  id:item.propertyNameId,
                  value:this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected
                }
                this.skuDimen[item.propertyNameId] = _skuOpt
                s = item.selected+this.skuSplitStr + s
                sarr.push(item.selected)
              }

            })
            if(this.saleEditModel.type == 1){
              this.goodsSkuConfig.map((skuConfig)=>{
                let _skuName = skuConfig.skuName
                let _skuPvId = skuConfig.skuPvId
                let _skuNameArr = _skuName.indexOf(this.skuSplitStr)>-1 ? _skuName.split(this.skuSplitStr) : [_skuName]
                let _skuNamelist = []
                _skuPvId.map((item,idx)=>{
                  let _optSku = {
                    id:item,
                    pv:_skuNameArr[idx],
                    sortOrder:this.goodsPropertyConfig[this.mapCateProperty[item]].sortOrder
                  }
                  _skuNamelist.push(_optSku)
                })
                this.saleEditModel.propertyList.map((item)=>{
                  if(item.selected){
                    let _optSku = {
                      id:item.propertyNameId,
                      pv:item.selected,
                      sortOrder:item.sortOrder
                    }
                    if(!_skuPvId.includes(item.propertyNameId)){
                      _skuPvId.push(item.propertyNameId)
                    }
                    _skuNamelist.push(_optSku)
                  }
                })
                _skuNamelist.sort(function(a,b){
                  return b.sortOrder - a.sortOrder
                })
                let _skuNameList = []
                _skuNamelist.map((item)=>{
                  _skuNameList.push(item.pv)
                })
                skuConfig.skuName = _skuNameList.join(this.skuSplitStr)
                skuConfig.skuPvId = _skuPvId
              })

            }
            else if (this.saleEditModel.type == 2){
              let _skuModelId = []
              this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.join(this.skuSplitStr)
              this.cateProperty.filter((item)=>item.propertyType == 2).map((properConfig)=>{
                _skuModelId.push(properConfig.propertyNameId)
              })
              this.goodsSkuConfig[this.saleEditModel.skuIdx].skuPvId = _skuModelId
            }
            this.goodsSkuConfig[this.saleEditModel.skuIdx].type = 3
            let _itemType = true
            let _itemTypeCheck = true
            let _catePropertyLength = this.cateProperty.filter((item)=>item.propertyType == 2).length
            this.goodsSkuConfig.map((item)=>{
//              if(item.type == 1 || item.type == 2){
//                _itemType = false
//              }
              if(item.type == 2){
                _itemType = false
              }
              if(this.saleUnitDisType == 1 && item.skuPvId.length != _catePropertyLength){
                _itemTypeCheck = false
              }
            })
            if(_itemType){
              if((this.saleUnitDisType == 1 && _itemTypeCheck) || this.saleUnitDisType == 2){
                this.saleUnitDis = false
              }
              this.callMapGoodsSkuConfig()
              this.parseSelectSale()
            }
          }
          this.callMapGoodsSkuConfig()
        }
        this.cancelSaleEditModel()
        this.mapSKUImage()
      },
      //取消 补全 修改SKU
      cancelSaleEditModel(){
        this.saleEditModel.isShow = false
      },
      //修改 SKU销售类型
      changeSkuStatus(status,id){
          this.editSkuStatusModel.type = status
          this.editSkuStatusModel.idx = id
          this.editSkuStatusModel.isShow = true
      },
      //提交 修改 SKU销售类型
      submitEditSkuStatusModel(){
        this.goodsSkuConfig[this.editSkuStatusModel.idx].status = this.editSkuStatusModel.type

//        this.goodsSkuConfig.sort((a,b)=>a.status < b .status)
        this.cancelEditSkuStatusModel()
      },
      //取消 修改 SKU销售类型
      cancelEditSkuStatusModel(){
        this.editSkuStatusModel.isShow = false
      },
      //多选自定义勾选时 逻辑处理
      mulSelect(idx,event,sIdx){

        if(!event.target.checked){
//          console.log(this.goodsPropertyConfig[idx].mulOptions)
//          return false
        }
//        let _length = 0
//        this.goodsPropertyConfig[idx].mulOptions.map((item,id)=>{
//          if(sIdx != id && item.pvName == ''){
//              _length ++
//          }
//        })
//        if(_length < 1){
//          let opt = {
//            pvName:''
//          }
//          this.goodsPropertyConfig[idx].mulOptions.push(opt)
//        }
        let _list = []
        this.goodsPropertyConfig[idx].mulOptions.map((item)=>{
            if(item.pvName){
                _list.push(item)
            }
        })
        _list.push({pvName:''})
        this.goodsPropertyConfig[idx].mulOptions = _list
      },
      //管理SKU表格显示
      tableRowClassName(row, index) {
        if (index === 0) {
          return 'sale-unit-row';
        } else{
          return '';
        }

      },
      //管理SKU
      callManageSku(){
        this.deliverAreaIdsChange = false
        this.managerSkuList = []
        let _goodsSkuConfig = JSON.parse(JSON.stringify(this.goodsSkuConfig))
        _goodsSkuConfig.map((item)=>{
          let subArr = []
          let opts = {
             id:item.id,
            "skuName":item.skuName,
            "skuPvId":item.skuPvId,
            "status":item.status,
            "baseGoodsId":"",
            "price":"",
            "marketPrice":"",
            "retailPrice":"",
            "costPrice":"",
            "count":"",
            isSave:item.isSave ? true : false
          }
          subArr.push(opts)
          item.unitSKUs.map((subItem)=>{
            subItem.isSave = item.isSave ? true : false
            subArr.push(subItem)
          })
          this.managerSkuList.push(subArr)
        })
        if(this.editType == 'new'){
          this.copySellerDeliver.options = JSON.parse(JSON.stringify(this.sellerDeliver.options))
          this.copySellerDeliver.areaTempOpts = JSON.parse(JSON.stringify(this.sellerDeliver.areaTempOpts))
          this.copySellerDeliver.deliverAreaId = this.saveProductEdit.deliverArea.deliverAreaId
          this.copySellerDeliver.sellerDeliverAreaTemplateId  = this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId
        }
        this.saleManageModel.isShow = true
      },
      //sku 合计
      getRowArr(list,type,getType){
        // 1 组合装 2 市场价 3 建议售价 4 成本价 5 销售价
        let _s = 0
        list.map((item,idx)=>{
          if((getType == 2 && idx != 0) || getType == 1){
            let _item = JSON.parse(JSON.stringify(item))

            switch (type){
              case 1:
                  _s = _item.count
                  break;
              case 2:
                  _s = this.accAdd(Number(_s),Number(this.accMul(_item.marketPrice,_item.count)))
                  break;
              case 3:
                  _s = this.accAdd(Number(_s),Number(this.accMul(_item.retailPrice,_item.count)))
                  break;
              case 4:
                  _s = this.accAdd(Number(_s),Number(this.accMul(_item.costPrice,_item.count)))
                  break;
              case 5:
                  _s = this.accAdd(Number(_s),Number((_item.price || 0)))
                  break;

              case 6:
                  _s = this.accAdd(Number(_s),Number(this.accMul((_item.price || 0),_item.count)))
                break;
            }
          }
        })
        return Number(_s)
      },
      //查看SKu
      showSkuUnit(id){
         this.getUnitSkuList({saleUnitId:id})
           .then((rs)=>{
//////             console.log(rs)
             this.selectAddSkuModel.type = 2
             this.selectAddSkuModel.isShow = true
             this.selectAddSkuModel.list = rs
           })
      },
      //新增SKU
      addSkuUnit(idx){
        this.addSkuModel.isShow = true
        this.addSkuModel.idx = idx
      },
      //新增SKU 添加
      submitAddSkuModel(){
        if(!this.addSkuModel.skuId){
          this.getToast('请输入基础商品码或SKU码')
          return false
        }
        let idList = []
        this.managerSkuList[this.addSkuModel.idx].map((item)=>{
            if(item.skuId){
                idList.push(item.skuId)
            }
        })
        this.getGoodsSkuList({codes:this.addSkuModel.skuId.split(',')})
          .then((rs)=>{
            this.selectAddSkuModel.list = rs.filter((item)=>!idList.includes(item.id))
            this.selectAddSkuModel.isShow = true
            this.selectAddSkuModel.type = 1
            this.cancelAddSkuModel()
//////            console.log(rs)
          })
//////        console.log(this.addSkuModel.skuId)
//        this.cancelAddSkuModel()
      },
      //取消 新增SKU 添加
      cancelAddSkuModel(){
        this.addSkuModel.skuId = ''
        this.addSkuModel.isShow = false
      },
      //批量多选 新增sku
      selectAddSkuList(list){
        this.selectAddSkuModel.batchList = list
      },
      submitSelectAddSkuModel(){
        if(this.selectAddSkuModel.type == 1){
          if(!this.selectAddSkuModel.batchList.length){
            this.getToast('请选择要添加的商品')
            return false
          }
          let _arr = JSON.parse(JSON.stringify(this.initSellerDeliver.deliverAreaIds))

          let mainId = ''
          for(let i in this.selectAddSkuModel.batchList){
            let _item = this.selectAddSkuModel.batchList[i]
            if(!_arr.length){
//              console.log('不存在发货地选择')
              _item.deliverAreas.map((item)=>{
                _arr.push(item.deliverAreaId)
                mainId = _item.sellerMainId
              })
            }
            else {
//              console.log('存在发货地选择')
////              console.log(_item)
              let _choose = false
              let _filterArr = []
              _item.deliverAreas.map((item)=>{
////                  console.log(item.deliverAreaId)
                 if(_arr.includes(item.deliverAreaId)){
                  _filterArr.push(item.deliverAreaId)
                  _choose = true
                 }
              })
              if(!_choose){
                this.getToast('选择SKU发货地必须相同')
                return false
              }
              _arr = _filterArr
            }

          }
//          console.log(_arr)
//          console.log(this.initSellerDeliver.deliverAreaIds)

          if(_arr.length != this.initSellerDeliver.deliverAreaIds.length){
            this.initSellerDeliver.deliverAreaIds = JSON.parse(JSON.stringify(_arr))
            this.initDeliverAreasTemp()
            this.saveProductEdit.deliverArea.deliverAreaId=''
          }
          if(!this.initSellerDeliver.sellerMainId){
            this.initSellerDeliver.sellerMainId = mainId
            this.initDeliverAreas()
            this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId =''
          }
          this.selectAddSkuModel.batchList.map((item)=>{
            let _opts = {
              id:'',
              baseGoodsId:item.baseGoodsId,
              skuCode:item.skuCode,
              skuId:item.id,
              price:item.price || '',
              marketPrice:item.marketPrice / 100,
              retailPrice:item.retailPrice / 100,
              costPrice:item.costPrice / 100,
              count:1,
              status:item.status,
              properties:item.properties,
              isSave:false,
            }
////            console.log(item.sellerMainId)
            this.managerSkuList[this.addSkuModel.idx].push(_opts)
            this.cancelSelectAddSkuModel()
          })
        }
        else {
          this.cancelSelectAddSkuModel()
        }


      },
      cancelSelectAddSkuModel(){
        this.selectAddSkuModel.isShow = false
        this.selectAddSkuModel.batchList = []
      },
      //删除Skuunit
      delSkuUnit(idx,_idx){
        this.managerSkuList[idx].splice(_idx,1)
        this.checkDelSkuUnit()

      },
      checkDelSkuUnit(){
        if(this.editType == 'new'){
          let _check = 0
          this.managerSkuList.map((item)=>{
            _check += item.length
          })
//          console.log(_check,this.managerSkuList.length)
          if(_check == this.managerSkuList.length){
            this.initSellerDeliver.sellerMainId = ''
            this.initSellerDeliver.deliverAreaIds = []
            this.deliverAreaIdsChange = true
//            this.saveProductEdit.deliverArea.deliverAreaId = ''
//            this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId = ''
          }
        }
      },
      //保存 sku管理
      changeSkuCodeMethod(str){
        let _str = ''
        _str = str.replace(this.skuSplitStrReg,'-')
        return _str
      },
      submitSaleManageModel(){
////        console.log(this.goodsSkuConfig)
        let _checkUnit = []
        for(let i = 0;i<this.managerSkuList.length;i++){
          let _item = this.managerSkuList[i]
          if(_item.length < 2){
            this.getToast('请添加'+this.changeSkuCodeMethod(_item[0].skuName)+'SKU')
            return false
          }
          let _unitSKU = []
          for(let j = 1;j<_item.length;j++){
            let _sku = _item[j]
            if(!_sku.count){
              this.getToast('请添加'+this.changeSkuCodeMethod(_item[0].skuName)+_sku.skuCode+'销售件数')
              return false
            }
            if(!(_sku.count+'').match(RegExpType.Num)){
              this.getToast(this.changeSkuCodeMethod(_item[0].skuName)+_sku.skuCode+'销售件数格式不正确')
              return false
            }
            if(!_sku.marketPrice){
              this.getToast('请添加'+this.changeSkuCodeMethod(_item[0].skuName)+_sku.skuCode+'市场价')
              return false
            }
            if(!(_sku.marketPrice+'').match(RegExpType.Price)){
              this.getToast(this.changeSkuCodeMethod(_item[0].skuName)+_sku.skuCode+'市场价格式不正确')
              return false
            }
            if(!_sku.price){
              this.getToast('请添加'+this.changeSkuCodeMethod(_item[0].skuName)+_sku.skuCode+'销售价')
              return false
            }
            if(!(_sku.price+'').match(RegExpType.Price)){
              this.getToast(this.changeSkuCodeMethod(_item[0].skuName)+_sku.skuCode+'销售价格式不正确')
              return false
            }
            _unitSKU.push(_sku.skuCode+'+'+_sku.count)
//            _unitSKU[_sku.skuCode] = _sku.count
          }

          _checkUnit.push({
              skuUnit:_unitSKU,
              skuName:this.changeSkuCodeMethod(_item[0].skuName)
            })
        }
        let _checkUnitMap = {}
        for(let i in _checkUnit){
          let _item = _checkUnit[i].skuUnit.sort(),
              _skuName = _checkUnit[i].skuName,
              _check_s = _item.join('-')
//          console.log(_check_s)
          if(_checkUnitMap[_check_s]){
            this.getToast(_skuName+'和'+_checkUnitMap[_check_s].name+'销售单元重复')
            return false
          }
          _checkUnitMap[_check_s] = {
            unit:_check_s,
            name:_checkUnit[i].skuName
          }
        }
        if(this.deliverAreaIdsChange){
            this.saveProductEdit.deliverArea.deliverAreaId=''
            this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId =''
        }
        let _managerSkuList = JSON.parse(JSON.stringify(this.managerSkuList))
        this.goodsSkuConfig.map((item,idx)=>{
          _managerSkuList[idx].shift()
          item.unitSKUs = _managerSkuList[idx]
          item.marketPrice=this.getRowArr(item.unitSKUs,2,1)
          item.retailPrice=this.getRowArr(item.unitSKUs,3,1)
          item.costPrice=this.getRowArr(item.unitSKUs,4,1)
          item.price= this.getRowArr(item.unitSKUs,5,1)
          if(this.saveProductEdit.channel == 8){
            item.saleUnitMsms.agentPrice = this.getRowArr(item.unitSKUs,6,1)
          }
          item.totalPrice= this.getRowArr(item.unitSKUs,6,1)
          item.count= item.unitSKUs.length > 1 ? '组合装' : this.getRowArr(item.unitSKUs,1,1)+'件装'
          item.status = _managerSkuList[idx].filter((subItem)=> subItem.status == 0).length ? 0 : item.status
        })
        this.goodsSkuConfig.push({})
        this.goodsSkuConfig.pop()
//        console.log(this.goodsSkuConfig)
//        console.log(_managerSkuList)
        this.saleManageModel.isShow = false
//        this.cancelSaleManageModel()
      },
      cancelSaleManageModel(){
        if(this.editType == 'new'){
          let _check = 0
          this.goodsSkuConfig.map((item)=>{
              _check += item.unitSKUs.length
          })
          if(_check == 0){
            this.initSellerDeliver.sellerMainId = ''
            this.initSellerDeliver.deliverAreaIds = []
            this.sellerDeliver.options = []
            this.sellerDeliver.areaTempOpts = []
            this.saveProductEdit.deliverArea.deliverAreaId=''
            this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId =''
          } else {
            this.sellerDeliver.options = JSON.parse(JSON.stringify(this.copySellerDeliver.options))
            this.sellerDeliver.areaTempOpts = JSON.parse(JSON.stringify(this.copySellerDeliver.areaTempOpts))
            this.saveProductEdit.deliverArea.deliverAreaId = this.copySellerDeliver.deliverAreaId
            this.saveProductEdit.deliverArea.sellerDeliverAreaTemplateId  = this.copySellerDeliver.sellerDeliverAreaTemplateId
          }
        }
        this.saleManageModel.isShow = false
      },
      handleSuccess(res){
        if(res.code != 1){
          this.getToast('上传失败')
          return false
        }
////        console.log(res)
        if(res.data.width != 640 || res.data.height != 640){
          this.getToast('图片限制640*640并且大小<=400k');
          return false;
        }
        let opts = {
          id: '',
          url:res.data.url,
          width:res.data.width,
          height:res.data.height,
        }
        this.configSaleUnitImages.list[this.configSaleUnitImages.currentSkuImage] = opts
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.push('')
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.pop()
      },
      setSkuImageIdx(item){
        this.configSaleUnitImages.currentSkuImage = item
      },
      beforeUpload(file){
////        console.log(file)
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
////        console.log(item)
////        console.log(this.configSaleUnitImages.list[item])
        delete this.configSaleUnitImages.list[item]
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.push('')
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.pop()
////        console.log(this.configSaleUnitImages.list)
      },
      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
      saveProduct(){
        let opts = JSON.parse(JSON.stringify(Object.assign({},this.saveProductEdit)))
        opts.baseGoodsId = this.baseGoodsId ? this.baseGoodsId : ''
        opts.categoryId = this.selectCategoryId
        const frontCateSelect = UtilTool.deepCopy(this.frontCate.selectedCategory)
        opts.frontCategoryIds = []
        if(!opts.categoryId){
          this.getToast('请选择类目')
          return false
        }
        if(!opts.channel){
          this.getToast('请选择销售渠道')
          return false
        }
        if(!opts.saleTypeId){
          this.getToast('请选择渠道销售类型')
          return false
        }
        frontCateSelect.map((item)=>{
          if(item.length){
            opts.frontCategoryIds.push(item.pop())
          }
        })
        if(!opts.frontCategoryIds.length){
          this.getToast('请至少填写一个销售类目')
          return false
        }
        const _frontCategoryIds = Array.from(new Set(opts.frontCategoryIds))
        if(_frontCategoryIds.length != opts.frontCategoryIds.length){
          this.getToast('销售类目重复')
          return false
        }
        if(!opts.longTitle){
          this.getToast('请填写销售长名称')
          return false
        }
        if(!opts.shortTitle){
          this.getToast('请填写销售短名称')
          return false
        }
        if(!opts.sellingPoint){
          this.getToast('请填写卖点')
          return false
        }
        if(!opts.brandId){
          this.getToast('请选择品牌')
          return false
        }
        if(this.saleUnitDis && this.saleUnitDisType == 2){
          this.getToast('存在销售单元未修改')
          return false
        }
        if(this.baseGoodsId){
          if(this.editType == 'new' &&  !this.skuUnitBatchList.length){
            this.getToast('请选择销售单元')
            return false
          }
          opts.saleUnits = JSON.parse(JSON.stringify(this.skuUnitBatchList))
        }
        else {
          opts.saleUnits = JSON.parse(JSON.stringify(this.goodsSkuConfig))
        }
        if(!opts.saleUnits.length){
          this.getToast('请选择一个销售属性创建销售单元')
          return false
        }
        for(let i = 0;i<opts.saleUnits.length;i++){
          let item = opts.saleUnits[i]
//          console.log(item.count)
//          console.log(typeof item.count)

          if(!item.count){
            this.getToast('请填写销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'销售件数')
            return false
          }
          if(this.saveProductEdit.channel == 2 && !(item.saleUnitHqbs.totalProfit+'')){
            this.getToast('请填写销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'总分出利润')
            return false
          }
          if(this.saveProductEdit.channel == 2 && !(item.saleUnitHqbs.totalProfit+'').match(RegExpType.Price)){
            this.getToast('销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'总分出利润格式不正确')
            return false
          }
          if(this.baseGoodsId && !(item.count+'').match(RegExpType.Num)){
            this.getToast('销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'销售件数格式不正确')
            return false
          }
//          if(item.price){
//            this.getToast('请填写销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'供货价')
//            return false
//          }
          if(this.baseGoodsId && !(item.price+'')){
            this.getToast('请填写销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'销售价')
            return false
          }
          if(this.baseGoodsId && !(item.price+'').match(RegExpType.Price)){
            this.getToast('销售单元'+item.skuName.replace(this.skuSplitStrReg,'-')+'销售价格式不正确')
            return false
          }

          item.price = this.accMul(item.price,100)
          item.costPrice = this.accMul(item.costPrice,100)
          item.marketPrice = this.accMul(item.marketPrice,100)
          item.retailPrice = this.accMul(item.retailPrice,100)

          if(this.baseGoodsId){
            item.unitSKUs.map((subItem)=>{
              subItem.price = item.price
              subItem.costPrice = item.costPrice
              subItem.marketPrice = item.marketPrice
              subItem.retailPrice = item.retailPrice
              subItem.count = item.count
              subItem.skuId = subItem.skuId ? subItem.skuId : subItem.id
            })
          }
          else {
            item.unitSKUs.map((subItem)=>{
              subItem.price = this.accMul(subItem.price,100)
              subItem.costPrice = this.accMul(subItem.costPrice,100)
              subItem.marketPrice = this.accMul(subItem.marketPrice,100)
              subItem.retailPrice = this.accMul(subItem.retailPrice,100)
            })
          }

          item.name = item.skuName.replace(this.skuSplitStrReg,'-')
          let properties = []
          if(!this.noSalePro){
            let arr = item.skuName.indexOf(this.skuSplitStr) >-1 ? item.skuName.split(this.skuSplitStr) : [item.skuName]
            let salePro = JSON.parse(JSON.stringify(this.goodsPropertyConfig.filter((_item)=>!_item.isOther && _item.propertyType ==2 && item.skuPvId.includes(_item.propertyNameId))))
            arr.map((subItem,idx)=>{
              let _check = false,
                _idx = idx
              if(this.baseGoodsId){
                let _pnId = item.skuPvId[idx]
                salePro.findIndex
                salePro.map((pnItem,_pnIdx)=>{
                  if(pnItem.propertyNameId == _pnId){
                    _idx = _pnIdx
                  }
                })
              }

              let _NameId = salePro[_idx].propertyNameId
              let _checkOpt = {
                propertyNameId:_NameId,
                pvName:subItem
              }
              properties.push(_checkOpt)
            })
          }
          item.properties = properties
        }
        let properties = []
        let goodsPropertyConfig = this.goodsPropertyConfig.filter((item)=> !item.isOther)
        for(let i = 0;i<goodsPropertyConfig.length;i++){
            let item = goodsPropertyConfig[i]
          if(item.inputType == 6){
            item.selected = item.selected ? UtilTool.formatDate('yyyy-mm-dd',item.selected) : item.selected
          }
          if(item.inputType == 7){
            item.selected = item.selected ? UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',item.selected) : item.selected
          }
//        || item.propertyType == 2
          if((item.propertyType == 1 ) && (!item.selected || item.selected.length < 1)){
            this.getToast('请选择'+item.propertyName+'属性值')
            return false
          }
          if((item.propertyType == 3 || item.propertyType == 2 ) && item.isRequired && (!item.selected || item.selected.length < 1)){
            this.getToast('请选择'+item.propertyName+'属性值')
            return false
          }
          if(!this.baseGoodsId && item.propertyType == 2 && item.selected.length > 19){
            this.getToast('销售属性项'+item.propertyName+'属性值不超过20个')
            return false
          }
          let _opts = {
            propertyId:item.propertyNameId,
            propertyType:item.propertyType,
            propertyPairs:[]
          }
          let arr = []
          if(item.selected){
            arr = Object.prototype.toString.call(item.selected) === '[object Array]' ? item.selected : [item.selected]
          }
          arr.map((pv)=>{
            let _opt = {
              propertyNameId:item.propertyNameId,
              propertyValue:pv
            }
            _opts.propertyPairs.push(_opt)
          })
          properties.push(_opts)
        }
        opts.properties = properties
        if(this.baseGoodsId && this.editType == 'new'){
          opts.deliverArea.deliverAreaId = this.baseGoodsDeliverArea.deliverArea.deliverAreaId
          opts.deliverArea.sellerDeliverAreaTemplateId = this.baseGoodsDeliverArea.deliverArea.sellerDeliverAreaTemplateId
          opts.deliverArea.freightTemplateId = this.baseGoodsDeliverArea.deliverArea.freightTemplateId
        }
        if(!opts.deliverArea.deliverAreaId){
          this.getToast('请选择发货地')
          return false
        }
        if(!opts.deliverArea.freightTemplateId){
          this.getToast('请选择运费收入模板')
          return false
        }
//        if(!opts.deliverArea.sellerDeliverAreaTemplateId){
//          this.getToast('请选择配送模板')
//          return false
//        }
        if(this.configSaleUnitImages.isRequiredImage){

//          console.log(Object.keys(this.configSaleUnitImages.list))
//          console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected)
          if(Object.keys(this.configSaleUnitImages.list).length != this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.length){
            this.getToast('请上传销售单元主图')
            return false
          }
          for(let i in this.configSaleUnitImages.list){
////            console.log(i)
            let item = this.configSaleUnitImages.list[i]
            if(!item){
              this.getToast('请上传'+i+'销售单元主图')
              return false
            }
            delete item.saleGoodsId
            let _check = false

            this.goodsPropertyConfig[this.configSaleUnitImages.idx].options.map((pro)=>{
              if(pro.pvName == i){
                _check = true
                  if(typeof pro.id == 'undefined'){
                    delete item.propertyPairId
                  } else {
                    item.propertyPairId = pro.id
                  }
                item.propertyValue = pro.pvName
              }
            })
            if(!_check){
              item.propertyValue = i
            }
            item.id = ''
            opts.saleUnitImages.push(item)
          }
        }
        opts.saleUnitImages.map((item,idx)=>{
          item.sortOrder = (idx+1)*10
        })
        if(!this.productUpload.images.length){
          this.getToast('请上传商品主图')
          return false
        }
        opts.saleGoodsImages = this.productUpload.images
        opts.saleGoodsImages.map((item,idx)=>{
          item.sortOrder = (idx+1)*10
          item.type = 1
          item.saleGoodsId = this.goodsId
          item.id = ''
        })
        if(!this.productUpload.detail){
          this.getToast('请填写商品详情')
          return false
        }
        let _lenDetail = this.productUpload.detail.match(/<img src=/g) ? this.productUpload.detail.match(/<img src=/g).length : 0
        if(_lenDetail > 22){
          this.getToast('详情图上传不超过22张')
          return false
        }
        opts.detail = this.productUpload.detail
        if(this.baseGoodsId){
          this.baseSyncConfig.baseGoodsId =  this.baseGoodsId
          opts.createType = 1
          opts.sync = this.baseSyncConfig
        }

//        console.log(opts)
//        return false
//        debugger
        this.saveSaleGoods(opts)
          .then((rs)=>{
            this.setStartToast({
              isShow:true,
              msg:'保存成功',
              type:'success'
            })
            this.$router.push({
              name: this.mapChanelLink[opts.channel],
            })
          })
      },
    },
    components:{
      vUpload
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
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
  .label-sign{
    display: inline-block;
  }
  .property-box{
    position: relative;
    display: block;
    .inline-box{
      max-width: 85%;
      line-height: 30px;
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
    .inline-box{
      max-width: 430px;
      line-height: 30px;
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
        line-height: 30px;
      }
    }
  }
  .mask-box-wrap{
    position: relative;
    .mask-box{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      z-index: 9;
    }
  }
  .unit-table{
    .input-item-middle{
      width: 80px;
    }
  }
</style>
