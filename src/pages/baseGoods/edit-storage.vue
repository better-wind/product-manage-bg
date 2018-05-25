<template>
  <div>
    <div class="title-box">
      <template v-if="editType == 'new'">
        <span v-if="editStep == 1">新建基础商品/选择类目</span>
        <span v-else>新建基础商品</span>
      </template>
      <template v-else>
        <span v-if="editStep == 1">新建基础商品/切换类目</span>
        <span v-else>编辑基础商品</span>
      </template>
    </div>
    <div class="section-box">
      <template v-if="editStep == 1">
        <div class="block-box">
          <el-cascader style="width: 500px" :props="step1.props" :options="step1.categoryOptions"
                       @active-item-change="handleItemChange" v-model="step1.selectedCategory">
          </el-cascader>
        </div>
        <div style="margin-top:180px" class="block-box t-c">
          <el-button v-if="showCancelEditStep" @click="cancelEditStep" size="small">取消</el-button>
          <el-button @click="selectCate" type="primary" size="small">下一步，填写商品信息</el-button>
        </div>
      </template>
      <template v-if="editStep == 2">
        <div class="item-box">
          <div class="block-item">
            <span class="label-sign">当前选择类目</span>
            {{cateTitle}}
            <el-button @click="showSelectCate" size="small">修改类目</el-button>
          </div>
        </div>
        <div class="item-box ">
          <div class="sub-title-box mg-b">
            基本信息
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>货品归属</span>
            <div class="inline-box" v-if="editType == 'edit'">
              {{selectedBelong.name}}
            </div>
            <el-select filterable size="small" v-model="selectedBelong" placeholder="请选择" @change="sellerMainIdChange"
                       v-else>
              <el-option v-for="item in sellerOptions" :key="item.value" :label="item.label" :value="item.obj">

              </el-option>
            </el-select>
            <span v-if="sellerMainExtra" class="c-dis mg-l c-tip">自营商家只能选择一个发货地</span>
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>发货地</span>
            <div class="inline-box" :style="{'width':'80%'}" v-show="shipAreaOptions.length>0">
              <!--{{shipAreaOptions}}-->
              <!--{{sellerMainExtra}}-->
              <!--:max="sellerMainExtra ? 1 : 100"-->
              <el-checkbox-group :max="sellerMainExtra ? 1 : 100" v-model="shipAreaValue" @change="mapValue">
                <el-checkbox v-for="(item,i) in shipAreaOptions"
                             :disabled="!item.isEditable || item.isInStorage == 1 || item.deliverAreaStatus == 0"
                             :key="i" :label="item.deliverAreaId" class="mg-b-h">
                  {{item.deliverAreaName}}
                </el-checkbox>

              </el-checkbox-group>
            </div>
            <div class="inline-box" v-show="shipAreaOptions.length == 0">
              暂无发货地
            </div>
          </div>
          <div class="block-box base-box" v-for="(item,i) in mapShipAreaValue" v-if="mapShipAreaValue.length>0">
            <span class="label-sign" :style="{'width':'160px'}">配送地区({{item.deliverAreaName}})</span>
            <el-select size="small" v-model="item.sellerMainId" placeholder="请选择" clearable>
              <el-option v-for="tpl in tplOptions[item.sellerMainIdP]" :key="tpl.id" :label="tpl.name" :value="tpl.obj">
              </el-option>
            </el-select>
            <span class="c-dis mg-l c-tip">注：全国发货可不填</span>
          </div>

          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>商品名称</span>
            <el-input v-model="saveProductEdit.name" :maxlength="40" class="input-item-middle input-item-large"
                      size="small"></el-input>
            <span>{{saveProductEdit.name.length}}/40</span>
          </div>
          <div class="block-box base-box label-float-layout">
            <div class="label-sign-wrap">
              <!-- <span class="label-sign">卖点文案</span> -->
              <span class="label-sign"><span class="c-red">*</span>卖点文案</span>
            </div>
            <div class="inline-box" style="margin-left: 4px">
              <el-input type="textarea" :rows="4" :maxlength="140" style="width: 600px;"
                        v-model="saveProductEdit.sellingPoint" class="input-item-middle input-item-large"
                        size="small"></el-input>
              <span>{{saveProductEdit.sellingPoint.length}}/140</span>
            </div>
          </div>
          <div class="block-box base-box">
            <span class="label-sign"><span class="c-red">*</span>品牌</span>
            <el-select :disabled="selectedBelong.id ? false : true" v-if="selectedBelong.extra == 1" filterable
                       clearable remote :remote-method="remoteMethodSaleBrand" v-model="saveProductEdit.brandId"
                       class="input-item-middle input-item-large" size="small" placeholder="请选择品牌">
              <template v-for="subItem in saleBrandNameList">
                <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code">
                  {{subItem.name}}
                </el-option>
              </template>
            </el-select>
            <el-select :disabled="selectedBelong.id ? false : true" v-else filterable clearable
                       v-model="saveProductEdit.brandId" class="input-item-middle input-item-large" size="small"
                       placeholder="请选择品牌">
              <template v-for="subItem in saleBrandNameList">
                <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code">
                  {{subItem.name}}
                </el-option>
              </template>
            </el-select>
            <span v-if="!selectedBelong.id" class="c-dis mg-l c-tip">请先选择货品归属</span>
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 1">
              <div class="block-box property-box label-float-layout">
                <template v-if="item.isOther">
                  <div class="inline-box c-dis">
                    <span class="label-sign">{{item.propertyName}}</span>
                    <span>{{item.selected}}</span>
                    <span>该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
                  </div>
                </template>
                <template v-else>
                  <div class="label-sign-wrap">
                    <!-- <span class="label-sign">{{item.propertyName}}</span> -->
                    <span class="label-sign"><span class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <!--单选不可自定义-->
                  <template v-if="item.inputType == 1">
                    <div class="inline-box" v-if="item.options.length>5">
                      <template>
                        <el-select class="mg-b-h" v-model="item.selected" placeholder="请选择">
                          <el-option v-for="subItem in item.options" :key="item.value" :label="subItem.pvName"
                                     :value="subItem.pvName">
                            {{subItem.pvName}}
                          </el-option>
                        </el-select>
                      </template>
                    </div>
                    <div class="inline-box" v-else>
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected" :label="subItem.pvName">{{subItem.pvName}}
                        </el-radio>
                      </template>
                    </div>
                  </template>
                  <!--单选可自定义-->
                  <template v-else-if="item.inputType == 2">
                    <div class="inline-box">
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected" :label="subItem.pvName">{{subItem.pvName}}
                        </el-radio>
                      </template>
                      <el-radio class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true"
                                :label="item.inputValue">
                        <el-input v-model.trim="item.inputValue" @blur="checkPvName(item,item.inputValue)"
                                  class="input-item-middle" size="small"></el-input>
                      </el-radio>
                    </div>
                  </template>
                  <!--多选不可自定义-->
                  <template v-else-if="item.inputType == 3">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--多选可自定义-->
                  <template v-else-if="item.inputType == 4">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <el-checkbox class="mg-b-h" :disabled="subItem.pvName ? false : true"
                                       @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName">
                            <el-input v-model.trim="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)"
                                      class="input-item-middle" size="small"></el-input>
                          </el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--输入框-->
                  <template v-else-if="item.inputType == 5">
                    <div class="inline-box">
                      <el-input v-model="item.selected" class="input-item-middle input-item-large"
                                size="small"></el-input>
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
        <div class="item-box" v-if="goodsPropertyConfig.filter((item)=>item.propertyType == 3).length>0">
          <!-- <div class="item-box"> -->
          <div class="sub-title-box mg-b">
            商品属性
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 3">
              <div class="block-box property-box label-float-layout">
                <template v-if="item.isOther">
                  <div class="inline-box c-dis">
                    <span class="label-sign">{{item.propertyName}}</span>
                    <span>{{item.selected}}</span>
                    <span>该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
                  </div>
                </template>
                <template v-else>
                  <div class="label-sign-wrap">
                    <!-- <span class="label-sign">{{item.propertyName}}</span> -->
                    <span class="label-sign"><span v-if="item.isRequired"
                                                   class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <!--单选不可自定义-->
                  <template v-if="item.inputType == 1">
                    <div class="inline-box" v-if="item.options.length>5">
                      <template>
                        <el-select class="mg-b-h" v-model="item.selected" placeholder="请选择">
                          <el-option v-for="subItem in item.options" :key="item.value" :label="subItem.pvName"
                                     :value="subItem.pvName">
                            {{subItem.pvName}}
                          </el-option>
                        </el-select>
                      </template>
                    </div>
                    <div class="inline-box" v-else>
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected" :label="subItem.pvName">{{subItem.pvName}}
                        </el-radio>
                      </template>
                    </div>
                  </template>
                  <!--单选可自定义-->
                  <template v-else-if="item.inputType == 2">
                    <div class="inline-box">
                      <template v-for="subItem in item.options">
                        <el-radio class="mg-b-h" v-model="item.selected" :label="subItem.pvName">{{subItem.pvName}}
                        </el-radio>
                      </template>
                      <el-radio class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true"
                                :label="item.inputValue">
                        <el-input v-model.trim="item.inputValue" @blur="checkPvName(item,item.inputValue)"
                                  class="input-item-middle" size="small"></el-input>
                      </el-radio>
                    </div>
                  </template>
                  <!--多选不可自定义-->
                  <template v-else-if="item.inputType == 3">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--多选可自定义-->
                  <template v-else-if="item.inputType == 4">
                    <div class="inline-box">
                      <el-checkbox-group v-model="item.selected">
                        <template v-for="subItem in item.options">
                          <el-checkbox class="mg-b-h" :label="subItem.pvName"></el-checkbox>
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <el-checkbox class="mg-b-h" :disabled="subItem.pvName ? false : true"
                                       @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName">
                            <el-input v-model.trim="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)"
                                      class="input-item-middle" size="small"></el-input>
                          </el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <!--输入框-->
                  <template v-else-if="item.inputType == 5">
                    <div class="inline-box">
                      <el-input v-model="item.selected" class="input-item-middle input-item-large"
                                size="small"></el-input>
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
          <div class="sub-title-box mg-b" :style="{'height':'38px','line-height':'36px'}">
            销售属性
            <el-button size="small"
                       :style="{'marginLeft':'10px','padding':'6px 20px','width':'150px','vertical-align':'middle'}"
                       v-if="editType == 'edit'" @click="costPriceChangeRecord" type="primary">成本价调价记录
            </el-button>
          </div>
          <template v-for="(item,idx) in goodsPropertyConfig">
            <template v-if="item.propertyType == 2">
              <template v-if="item.isOther">
              </template>
              <template v-else>
                <div class="block-box property-box label-float-layout">
                  <div class="label-sign-wrap">
                    <span class="label-sign"><span v-if="item.isRequired"
                                                   class="c-red">*</span>{{item.propertyName}}</span>
                  </div>
                  <template v-if="item.inputType == 4">
                    <div class="inline-box" :style="{'position':'relative'}">
                      <el-checkbox-group v-model="item.selected"
                                         @change="mulSelectChange(item.propertyNameId,$event,item)">
                        <template v-for="subItem in item.options">

                          <template v-if="subItem.saleDis">
                            <el-checkbox class="mg-b-h" disabled :label="subItem.pvName"></el-checkbox>
                          </template>
                          <template v-else>
                            <el-checkbox class="mg-b-h"
                                         :disabled="(saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis)"
                                         :label="subItem.pvName"></el-checkbox>
                          </template>
                          <!--<el-checkbox class="mg-b-h" :disabled="(subItem.saleDis ? true : false) || saleUnitDis" :label="subItem.pvName"></el-checkbox>-->
                        </template>
                        <template v-for="(subItem,sIdx) in item.mulOptions">
                          <el-checkbox class="mg-b-h"
                                       :disabled="(subItem.pvName ? false : true) || ((saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis))"
                                       @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName">
                            <el-input v-model.trim="subItem.pvName" :disabled="item.selected.includes(subItem.pvName)"
                                      @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle"
                                      size="small"></el-input>
                          </el-checkbox>
                        </template>
                      </el-checkbox-group>
                      <!--<div class="hide-click" @click="handleHideClick()" v-if="saleUnitDis"></div>-->
                      <div class="hide-click" @click="handleHideClick()"
                           v-if="(saleUnitDisType == 1 && !item.selected.length && saleUnitDis) || (saleUnitDisType == 2 && saleUnitDis)"></div>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </template>
          <div class="multiple-box" :style="'right:'+Number(shipAreaValue.length*120+2)+'px'">
            <div class="multiple-wrap">
              <div style="width: 100px">
                批量设置：
              </div>
              <div style="width: 120px">
                <el-input style="width: 100px" :disabled="(selectedBelong.extra==1 && shipAreaValue.length == 1 && mapArrToObj[shipAreaValue[0]] && mapArrToObj[shipAreaValue[0]].outWMS > 0)?true:false" class="input-item-middle" size="small" v-model.trim="multipleConfig.grossWeight" @blur="multipleBlur(multipleConfig.grossWeight,'grossWeight')" placeholder="毛重(g)"></el-input>
              </div>
              <div style="width: 120px">
                <el-input style="width: 100px"  class="input-item-middle" size="small" v-model.trim="multipleConfig.marketPrice" @blur="multipleBlur(multipleConfig.marketPrice,'marketPrice')" placeholder="市场价"></el-input>
              </div>
              <div style="width: 120px">
                <el-input style="width: 100px"  class="input-item-middle" size="small" v-model.trim="multipleConfig.retailPrice" @blur="multipleBlur(multipleConfig.retailPrice,'retailPrice')" placeholder="建议售价"></el-input>
              </div>
              <div style="width: 120px">
                <el-input style="width: 100px" :disabled="editType == 'edit'" class="input-item-middle" @blur="multipleBlur(multipleConfig.costPrice,'costPrice')" size="small" v-model.trim="multipleConfig.costPrice" placeholder="成本价"></el-input>
              </div>

            </div>
          </div>
          <div class="item-table">
            <el-table :data="goodsSkuConfig"  style="width: 100%;">
              <el-table-column align="center" label="销售状态">
                <template scope="scope">
                  <el-button v-if="scope.row.status == 2" size="small" :disabled="saleUnitDis && saleUnitDisType == 2"
                             class="c-red">删除
                  </el-button>
                  <el-button v-else size="small" :disabled="saleUnitDis && saleUnitDisType == 2"
                             :type="scope.row.status == 1 ? 'primary' : ''"
                             :class="scope.row.status == 1 ? '' : 'c-red'"
                             @click="changeSkuStatus(scope.row.status,scope.$index)">{{scope.row.status == 1 ? '可用' :
                    '停用'}}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="skuName" label="销售属性值" align="center">
                <template scope="scope">
                  <span class="key-item">{{scope.row.skuName | changeSkuCode}}</span>
                  <el-button size="small" type="primary" v-if="saleUnitDisType == 1 && saleUnitDis "
                             @click="editSaleProperty(scope.row.skuId,scope.$index,1)">补充属性
                  </el-button>
                  <el-button size="small" type="primary" v-if="scope.row.type == 2"
                             @click="editSaleProperty(scope.row.skuId,scope.$index,2)">修改属性
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-if="selectedBelong.extra==1 && shipAreaValue.length == 1 && mapArrToObj[shipAreaValue[0]] && mapArrToObj[shipAreaValue[0]].outWMS > 0"
                prop="purchaseGoodsId" align="center" label="采购商品ID" width="120">
                <template scope="scope">

                  <el-button size="small" @click="associate(scope.row.purchaseGoodsId,scope.$index)">
                    {{scope.row.purchaseGoodsId == null ? '待关联' : scope.row.purchaseGoodsId}}
                  </el-button>
                </template>
              </el-table-column>

              <!--<el-table-column prop="barcode" align="center" label="商品条码" width="120">-->
              <!--<template scope="scope">-->
              <!--<span class="cell-edit-input"><el-input v-model="scope.row.barcode" :disabled="selectedBelong.extra==1?true:false" class="input-item-middle"></el-input></span>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column prop="grossWeight" align="center" label="毛重(g)" width="120">
                <template scope="scope">
                  <span class="cell-edit-input"><el-input size="small" class="input-item-middle"
                                                          :disabled="(selectedBelong.extra==1 && shipAreaValue.length == 1 && mapArrToObj[shipAreaValue[0]] && mapArrToObj[shipAreaValue[0]].outWMS > 0)?true:false"
                                                          v-model="scope.row.grossWeight"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="marketPrice" align="center" label="市场价" width="120">
                <template scope="scope">
                  <span class="cell-edit-input"><el-input size="small" class="input-item-middle"
                                                          v-model="scope.row.marketPrice"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="retailPrice" align="center" label="建议售价" width="120">
                <template scope="scope">
                  <span class="cell-edit-input"><el-input size="small" class="input-item-middle"
                                                          v-model="scope.row.retailPrice"></el-input></span>
                </template>
              </el-table-column>
              <el-table-column prop="costPrice" align="center" label="成本价(不含邮费)" width="120">
                <template scope="scope">
                  <span class="cell-edit-input"><el-input size="small" class="input-item-middle"
                                                          :disabled="editType=='edit'&&scope.row.disabled"
                                                          v-model="scope.row.costPrice"></el-input></span>
                </template>
              </el-table-column>
              <template v-if="shipAreaOptions.length>0" v-for="(item,i) in shipAreaValue" >
                <el-table-column prop="code" align="center"
                                 :label="'发货编码('+shipAreaOptions.filter((obj)=>obj.deliverAreaId==item)[0].deliverAreaName+')'"
                                 width="120">
                  <template scope="scope">
								          <span class="cell-edit-input">
                            <el-input size="small" class="input-item-middle"
                                      :disabled="((selectedBelong.extra==1 && shipAreaValue.length == 1 && mapArrToObj[item] && mapArrToObj[item].outWMS > 0) || mapArrToObj[item].isInStorage == 1)?true:false"
                                      v-model="scope.row['code'+item]"
                                      @focus="deliverCodeFocus(scope.row['code'+item],scope.row,i)"
                                      @blur="deliverCodeBlur(scope.row['code'+item],scope.row,i)">

                          </el-input>
                          </span>
                  </template>
                </el-table-column>

              </template>

            </el-table>
          </div>
        </div>
        <div class="item-box" v-if="configSaleUnitImages.isRequiredImage">
          <div class="sub-title-box mg-b">
            SKU主图（销售属性项：{{skuImagePropertyName}}）
          </div>
          <div class="block-box c-dis">SKU主图：必填，分辨率640x640，文件小于400KB！</div>
          <div class="block-box" v-if="goodsPropertyConfig[configSaleUnitImages.idx]">
            <div class="inline-box mg-r" style="overflow: hidden"
                 v-for="item in goodsPropertyConfig[configSaleUnitImages.idx].selected">
              <!-- <div class="label-sign-wrap" style="display: inline-block;float: left">
                          <span class="label-sign">{{item}}</span>
                      </div> -->
              <span class="label-sign" style="display: inline-block;width: 60px;word-break:break-all;">{{item}}</span>
              <div class="avatar-wrap" @click="setSkuImageIdx(item)">
                <template v-if="configSaleUnitImages.list[item]">
                  <img :src="configSaleUnitImages.list[item].url" class="avatar">
                  <div class="avatar-menu">
                    <i class="el-icon-search" @click="showProductImage(configSaleUnitImages.list[item].url)"></i>
                    <i class="el-icon-delete" @click="delProductImage(item)"></i>
                  </div>
                </template>
                <template v-else>
                  <el-upload class="avatar-wrap avatar-uploader" action="/goodsAdmin/goods/file/imageUpload"
                             :data="picUpload" :show-file-list="false" :on-success="handleSuccess"
                             :before-upload="beforeUpload">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </template>
              </div>
            </div>
          </div>
        </div>
        <v-upload :uploadConfig="uploadConfig"/>
        <div class="item-box t-c">
          <el-button @click="saveProduct" type="primary">保 存 商 品</el-button>
        </div>
      </template>

      <!--:close-on-press-escape="false"-->

      <el-dialog title="修改销售状态" size="tiny" v-model="editSkuStatusModel.isShow" :close-on-click-modal="false"
                 :show-close="false">
        <div class="block-box">
          <el-radio v-model="editSkuStatusModel.type" :label="1">可用</el-radio>
          <el-radio v-model="editSkuStatusModel.type" :label="0">停用</el-radio>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditSkuStatusModel">取 消</el-button>
          <el-button type="primary" @click="submitEditSkuStatusModel">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="saleEditModel.type == 1 ? '补充属性' : '修改属性'" size="small" v-model="saleEditModel.isShow"
                 :close-on-click-modal="false" :show-close="false">
        <div class="block">
          <span v-if="saleEditModel.type == 1">补充销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
          <span v-else-if="saleEditModel.type == 2">修改销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
        </div>
        <div class="block-box property-box label-float-layout" v-for="item in saleEditModel.propertyList">
          <div class="label-sign-wrap">
            <span class="label-sign">{{item.propertyName}}</span>
          </div>
          <!--单选可自定义-->
          <div class="inline-box" style="max-width: 430px">
            <template v-for="subItem in item.options">
              <el-radio class="mg-b-h" v-model="item.selected" :label="subItem.pvName">{{subItem.pvName}}</el-radio>
            </template>
            <el-radio v-if="!saleEditModel.noKey" class="mg-b-h" v-model="item.selected"
                      :disabled="item.inputValue ? false : true" :label="item.inputValue">
              <el-input v-model.trim="item.inputValue" @blur="checkPvName(item,item.inputValue)"
                        class="input-item-middle" size="small"></el-input>
            </el-radio>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelSaleEditModel">取 消</el-button>
          <el-button type="primary" @click="submitSaleEditModel(saleEditModel.fn)">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="调价纪录" size="large" :visible.sync="changeCostPriceShow" :close-on-click-modal="false"
                 :show-close="true">
        <template v-if="selectedBelong.extra==0">
          <el-table :data="changeCostPriceConfig" border>
            <el-table-column property="date" label="提交审核信息" align="center">
              <template scope="scope">
                <p>提交审核时间：{{scope.row.createTime}}</p>
                <p>审核状态：{{scope.row.status==0?'待审核':scope.row.status==1?'审核通过':'审核失败'}}</p>
              </template>
            </el-table-column>
            <el-table-column property="skuCode" label="SKU码" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.auditCostPriceDetailList">{{ data.skuCode }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="propertyValue" label="销售属性值" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.auditCostPriceDetailList">{{ data.propertyValue }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="oldCostPrice" label="原成本价" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.auditCostPriceDetailList">{{ data.oldCostPrice |
                    toFixedFilter }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="adjustType" label="调价类型" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div :class="[{ 'c-red': data.oldCostPrice>data.newCostPrice }, 'line']"
                       v-for="data in scope.row.auditCostPriceDetailList">{{
                    data.oldCostPrice>data.newCostPrice?'降价':'提价' }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="newCostPrice" label="调后成本价" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.auditCostPriceDetailList">{{ data.newCostPrice |
                    toFixedFilter }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="info" label="审核信息" align="center">
              <template scope="scope">
                <p>待启用日期：{{scope.row.effectiveDate}}</p>
                <p>调价原因：{{scope.row.reason}}</p>
                <p v-if="scope.row.auditResult">审核结果：{{scope.row.auditResult}}</p>
                <p>审核时间：{{scope.row.auditTime}}</p>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-else>
          <el-table :data="changeCostPriceConfig" border>
            <el-table-column property="effectiveDate" label="调整时间" align="center"></el-table-column>
            <el-table-column property="skuArray" label="SKU码" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.skuArray">{{ data.skuCode }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="skuArray" label="销售属性值" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.skuArray">
                    <span v-if="data.status != 1" class="c-red">({{data.status == 0 ? '停用' : '删除'}})</span>
                    {{data.properties | propertiesFilter}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="skuArray" label="原成本价" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.skuArray">{{ data.preCostPrice | toFixedFilter }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="skuArray" label="调价类型" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div :class="[{ 'c-red': data.adjustType==1 }, 'line']" v-for="data in scope.row.skuArray">{{
                    data.adjustType==1?'降价':'提价' }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="skuArray" label="调后成本价" align="center">
              <template scope="scope">
                <div class="line-wrap">
                  <div class="line" v-for="data in scope.row.skuArray">{{ data.postCostPrice | toFixedFilter }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange1"
          :current-page="pageObj1.paging.currentPage"
          :page-sizes="pageObj1.paging.pageSizes"
          :page-size="pageObj1.paging.pageSize"
          :total="pageObj1.paging.total">
        </el-pagination>
      </el-dialog>
      <el-dialog :title="'待关联SKU:'+saveProductEdit.name" size="large" v-model="associateSkuShow"
                 :close-on-click-modal="false" @close="closeAssociate" :show-close="true">
        <div class="section-box search-goods-box">
          <div class="inline-box mg-r">
            <span class="label-sign">采购商品ID</span>
            <el-input v-model="associateSearchConfig.id" class="input-item-middle" size="small"
                      :style="{'width':'150px'}"></el-input>
          </div>
          <div class="inline-box mg-r">
            <span class="label-sign">商品条码</span>
            <el-input v-model="associateSearchConfig.barcode" class="input-item-middle" size="small"
                      :style="{'width':'150px'}"></el-input>
          </div>
          <div class="inline-box mg-r">
            <span class="label-sign">商品名称</span>
            <el-input v-model="associateSearchConfig.name" class="input-item-middle" size="small"
                      :style="{'width':'150px'}"></el-input>
          </div>
          <div class="block-box">
            <span class="label-sign">品牌</span>
            <el-select filterable clearable remote :remote-method="remoteMethodBrand"
                       v-model="associateSearchConfig.brandId" class="input-item-middle" size="small"
                       :style="{'width':'150px'}">
              <template v-for="subItem in brandNameList">
                <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code">
                  {{subItem.name}}
                </el-option>
              </template>
            </el-select>
          </div>
          <div class="block-box inline-r">
            <el-button size="small" type="primary" @click="search()">查询</el-button>
            <el-button size="small" type="primary" @click="resetAssociate()">重置</el-button>
          </div>
        </div>
        <template>
          <el-table :data="associateSkuConfig" v-loading="associateSkuLoading" element-loading-text="拼命加载中" border>
            <el-table-column property="id" label="采购商品ID" align="center"></el-table-column>
            <el-table-column property="barcode" label="商品条码" align="center"></el-table-column>
            <el-table-column property="name" label="商品名称" align="center"></el-table-column>
            <el-table-column property="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column property="specification" label="规格" align="center"></el-table-column>
            <el-table-column property="grossWeight" label="毛重(g)" align="center"></el-table-column>
            <el-table-column property="providerName" label="供应商名称" align="center"></el-table-column>
            <el-table-column property="storageName" label="入库仓库" align="center"></el-table-column>
            <el-table-column align="center" label="操作">
              <template scope="scope">
                <el-button size="small" type="primary" @click="selectAssociateSku(scope.$index)">选中</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="item-box">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange2"
            :current-page="pageObj2.paging.currentPage"
            :page-sizes="pageObj2.paging.pageSizes"
            :page-size="pageObj2.paging.pageSize"
            :total="pageObj2.paging.total">
          </el-pagination>
        </div>
      </el-dialog>
      <el-dialog title="" size="large" :visible.sync="isChangeAssociateId" :close-on-click-modal="false"
                 :show-close="true">
        <template>
          <el-button :style="{'margin-bottom':'10px'}" @click="isChangeAssociateId=false;associateSkuShow=true"
                     v-if="editType == 'new'">修改关联采购商品
          </el-button>
          <el-table :data="displayedAssociateSku" border>
            <el-table-column property="id" label="采购商品ID" align="center" width="110"></el-table-column>
            <el-table-column property="barcode" label="商品条码" align="center" width="110"></el-table-column>
            <el-table-column property="name" label="商品名称" align="center" width="110"></el-table-column>
            <el-table-column property="brandName" label="品牌" align="center" width="110"></el-table-column>
            <el-table-column property="specification" label="规格" align="center" width="110"></el-table-column>
            <el-table-column property="grossWeight" label="毛重(g)" align="center" width="110"></el-table-column>
            <el-table-column property="providerName" label="供应商名称" align="center" width="110"></el-table-column>
            <el-table-column property="storageName" label="入库仓库" align="center" width="110"></el-table-column>
          </el-table>
        </template>
      </el-dialog>
      <el-dialog title="保存后不可修改，请确认无误！" size="small" :visible.sync="confirmSelectShow" :close-on-click-modal="false"
                 :show-close="true">
        <template>
          <p :style="{'padding':'10px 0'}">采购商品名称：{{selectedAssociateSku.name}}</p>
          <p :style="{'padding':'10px 0'}">采购商品规格：{{selectedAssociateSku.specification}}</p>
          <p :style="{'padding':'10px 0'}">基础商品名称：{{saveProductEdit.name}}</p>
          <p :style="{'padding':'10px 0'}">
            SKU销售属性值：{{skuIndex===null?'':goodsSkuConfig[skuIndex].skuName|changeSkuCode}}</p>
          <span slot="footer" class="dialog-footer">
					    <el-button @click="confirmSelectShow = false">取 消</el-button>
					    <el-button type="primary" @click="confirmSelectAssociateSku">确 定</el-button>
					</span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
	import vPagination from '@/components/tools/Pagination'
  import vUpload from '@/components/productLibrary/uploadImage'
  import Mixin from '../../assets/js/common/mixin'
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['productUpload'])
    },
    filters: {
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
      propertiesFilter(arr){
      	return arr.map( el => el.pvName ).join('-')
      },
      toFixedFilter(n){
      	return parseInt(n)/100
      }
    },
    data:()=>({
      skuSplitStr:'$&&$',
      skuSplitStrReg:/\$&&\$/g,
    	baseGoodsCode: '',
      goodsId:'',
      cateTitle: '',
      goodsDetailFetch:{
        fetch:false,
        rs:{}
      },
      saleBrandNameList:[],//详情页品牌数组
      sellerMainExtra:false,//是否是自营商家
      pageObj1:{
      	show:true,
	      paging:{
	        currentPage:1,
	        pageSizes:[5],
	        pageSize:0,
	        total:0
	      },
      },
      pageObj2:{
      	show:true,
	      paging:{
	        currentPage:1,
	        pageSizes:[5],
	        pageSize:0,
	        total:0
	      },
      },
      editType:'new',
      editStep:1,
      isChangeCate: false,
      deliverCodePre: '',
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
      allShipData: [],
      allTplId: [],
      sellerOptions:[],
      selectedBelong: {
		  	name: '',
		  	id: 0,
		  	extra: 0,   //1 - 自营商家，需手动关联采购商品, 0 - 非自营商家
		  },
			shipAreaValue: [
				// {
		     //        "deliverAreaId": 1904,
		     //        "deliverAreaName": "上海伊翼商贸有限公司-fahudi",
		     //        "sellerMainId": null,
		     //        "sellerMainName": null
		     //    }
			],
			shipAreaOptions: [

			],
      storageAreaOptions: [],
			tplOptions: {

      },
			mapArrToObj: {},
			mapShipAreaValue: [],
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
      saveProductEdit:{
      	sellerMainId:'',
        categoryId:'',
        name: '',
        brandId:'',
        sellingPoint: '',
        properties:[],
        // detail:{
        //   id:'',
        //   detail:''
        // },
        detail: '',
        images:[],
      },
      configSaleUnitImages :{
        idx:'',
        isRequiredImage:false,
        skuImagePropertyNameId:'',
        list:{},
        saleUnitImages:[],
        currentSkuImage:''
      },
      changeCostPriceShow: false,
      skuImagePropertyName: '',
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
      picUpload:{
        file: null
      }, //上传格式
      changeCostPriceConfig:[
				// {
			 //    "effectiveDate": "2017-08-20 10:22:33",
			 //    "skuArray": [
				//     {
				//         "id": 1,
				//         "skuCode": "100_1230",
				//         "properties": [
				// 	        {
				//             "id": 84083,
				//             "propertyNameId": 353,
				//             "propertyValueId": 3357,
				//             "pnName": "口味",
				//             "pvName": "半干葡萄酒",
				//             "createTime": null,
				//             "updateTime": null
				// 	        },
				// 	        {
				//             "id": 84083,
				//             "propertyNameId": 353,
				//             "propertyValueId": 3357,
				//             "pnName": "口味",
				//             "pvName": "半干葡萄酒",
				//             "createTime": null,
				//             "updateTime": null
				// 	        }
				// 	      ],
				//         "preCostPrice": 12,
				//         "postCostPrice": 13,
				//         "adjustType": 1,
				//         "status": 0
				//     },
				//     {
				//         "id": 1,
				//         "skuCode": "100_1230",
				//         "properties": [
				// 	        {
				//             "id": 84083,
				//             "propertyNameId": 353,
				//             "propertyValueId": 3357,
				//             "pnName": "口味",
				//             "pvName": "半干葡萄酒",
				//             "createTime": null,
				//             "updateTime": null
				// 	        }
				// 	      ],
				//         "preCostPrice": 12,
				//         "postCostPrice": 13,
				//         "adjustType": 0,
				//         "status": 1
				//     }
				//   ]
				// }
			],
			skuIndex: null,
			associateSkuLoading:false,
			associateSkuShow: false,
			isChangeAssociateId: false,
			associateSearchConfig:{
				id:'',
				name:'',
				barcode:'',
				brandId:'',
			},
			brandNameList:[],
			associateSkuConfig:[],
			selectedAssociateSku: {},
			displayedAssociateSku: [],
			storageId: null,
			confirmSelectShow: false,
      multipleConfig:{
        grossWeight:'',
        marketPrice:'',
        retailPrice:'',
        costPrice:''
      }
    }),
    methods:{
      ...mapActions(['setViewImage','setProductUpload','getPropertyDetail','getBaseGoodsDetail',
        'getCateList','getCategoryPath','getGoodsBelong','getShipArea','saveBaseGoods',
        'validCategoryIdChange','setStartToast','getStorageId','getPurchaseGoodsList',
        'getPurchaseGood','getPurchaseGoodsChangeRecord','getBaseGoodsChangeRecord',
        'getGoodsSellerMainDeliver','getSaleBrandNameList','getExtraSaleBrand']),
      initView(){
        //初始化
        //获取类目
        const query = this.$route.query
        this.editType = query.goodsId ? 'edit' : 'new'
        this.goodsId = query.goodsId ? query.goodsId : ''
        if(this.editType == 'edit'){
        	const _this = this
          this.editStep = 2
          this.callGetProductDetail()
            .then(()=>{
              return this.callGetPropertyDetail()
            })
            .then(()=>{
            	//根据sellerMainId获取发货地
							this.sellerMainIdChange({
								id: this.goodsDetailFetch.rs.sellerMainId,
                extra: this.goodsDetailFetch.rs.sellerMainType == 1 ? true : false
							},function(){
								//展示已选择的发货地
								let detailDeliverAreas = _this.goodsDetailFetch.rs.deliverAreas
                let _mapDeliverAreas = {}
                _this.goodsDetailFetch.rs.skuArray.map((item)=>{
								    item.deliverAreas.map((area)=>{
								      if(!_mapDeliverAreas[area.deliverAreaId]){
                        _mapDeliverAreas[area.deliverAreaId] = area.deliverAreaId
                        _this.shipAreaValue.push(area.deliverAreaId)
                      }
                    })
                })



                //展示发货地配送模板
                for(let j=0;j<_this.shipAreaOptions.length;j++){
								   if(_this.shipAreaValue.includes(_this.shipAreaOptions[j].deliverAreaId)){
                     _this.mapShipAreaValue.push(_this.shipAreaOptions[j])
                   }

                }
                _this.mapShipAreaValue.map((item,i)=>{
                    if(item.deliverAreaTemplateId){
                      _this.tplOptions[item.sellerMainId].map((tpl,k)=>{
                        if(tpl.id == item.deliverAreaTemplateId){
                          item.sellerMainId = tpl.obj
                        }
                      })
                    }
                    else{
                      item.sellerMainId = {
                        id:'',
                        name:''
                      }
                    }
                })
							})
              this.checkProperty(this.editType)
            })
        }
        else {
          this.editStep = 1
          this.handleItemChange([])
          this.getGoodsBelong().then((rs)=>{
	        	rs.map((item,i)=>{
	        		this.sellerOptions.push({
	        			id: item.code,
	        			value: item.name,
	        			label: item.name,
	        			obj: {
	        				name: item.name,
	        				id: item.code,
	        				extra: item.extra,
	        				//extra: 1
	        			}
	        		})
	        	})
	        })
          this.demoSelectEdit()
        }
        //编辑
        this.setProductUpload({detail:'',images:[],detailVideos:[],imagesVideo:[]})
        //接口获取
      },
      accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
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
      shipAreaPromise(id){
	      const _this = this;
	      return new Promise(function(resolve){
            _this.getShipArea({sellerMainId:id}).then((rs)=>{
            	_this.allShipData = rs
	            resolve(rs)
	        	})
	      })
	    },
	    sellerMainIdChange(obj,fn) {

	    	this.shipAreaValue = []
	    	this.saveProductEdit.sellerMainId = obj.id
        //自营商家自能选择一个发货地
        if(obj.extra){
          this.sellerMainExtra = true
        } else {
          this.sellerMainExtra = false
        }
//        console.log(obj)
	    	//获取发货地
	    	this.shipAreaPromise(obj.id).then((rs)=>{
	    		rs.map((data,i)=>{
	    			data.isEditable = true
	    		})
	    		if (this.editType == 'edit') {
	    			if (rs.length == 0) {
		    			this.shipAreaOptions = this.goodsDetailFetch.rs.deliverAreas
		    		} else{
		    			this.shipAreaOptions = this.goodsDetailFetch.rs.deliverAreas
              //商品下的 发货地 合并商家下的 发货地
              //入仓发货地 合并 到 发货地列表
              //合并发货地 数据
		    			rs.map((item,i)=>{
		    			  let _item = this.shipAreaOptions.filter((area)=>item.deliverAreaId == area.deliverAreaId)
                if(_item.length){
                  this.shipAreaOptions.map((area)=>{
                    if(item.deliverAreaId == area.deliverAreaId && item.outWMS){
                      area.outWMS = item.outWMS
                    }
                  })
                } else {
                  this.shipAreaOptions.push(item)
                }
		    			})
              //合并入仓 数据
              this.goodsDetailFetch.rs.skuDeliverAreas.map((item)=>{
		    			  let _item = this.shipAreaOptions.filter((area)=>item.deliverAreaId == area.deliverAreaId)
                if(_item.length){
                  this.shipAreaOptions.map((area)=>{
//                    && item.isInStorage
                      if(item.deliverAreaId == area.deliverAreaId ){
//                          console.log(item)
                          area.isInStorage = item.isInStorage
                          area.deliverAreaStatus = item.deliverAreaStatus
                      }
                  })
                } else {
                  this.shipAreaOptions.push(item)
                }
              })
		    		}
	    		}
	    		else{
	    			this.shipAreaOptions = rs
	    		}
          this.storageAreaOptions = []
          this.shipAreaOptions.map((item)=>{
	    		    if(item.isInStorage == 1){
                this.storageAreaOptions.push(item.deliverAreaId)
              }
          })
	    		let _allArr = this.shipAreaOptions
	    		this.mapShipAreaValue = []
	      	for(let i=0;i<_allArr.length;i++){
	      		this.mapArrToObj[_allArr[i].deliverAreaId] = _allArr[i]
	      	}
	      	//获取配送地区
          let _sellerMainIdMap = [],
            _sellerMainIdCount = []
          this.shipAreaOptions.map((item)=>{
              item.sellerMainIdP = item.sellerMainId || obj.id
	      	    if(item.sellerMainIdP && !_sellerMainIdMap.includes(item.sellerMainIdP)){
                _sellerMainIdMap.push(item.sellerMainIdP)
              }
          })
          _sellerMainIdMap.map((_sellerMainId,i)=>{
            this.getGoodsSellerMainDeliver({sellerMainId:_sellerMainId})
              .then((rs)=>{
                rs.map((item,i)=>{
                  item.obj = {
                    id: item.id,
                    name: item.name,
                  }
                })
                this.tplOptions[_sellerMainId] = rs
                _sellerMainIdCount.push(_sellerMainId)
                if(_sellerMainIdCount.length == _sellerMainIdMap.length){
                  fn&&fn()
                }
              })
          })
	    	})
	    },
      cancelEditStep(){
        this.editStep = 2
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
//            console.log(item)
            _listArr.push(item.name)
        })
//        return false
        if(this.editType == 'edit'){
          this.validCategoryIdChange({baseGoodsId:this.goodsId,categoryId:_cateId})
            .then((rs)=>{
              this.selectCategoryId = _cateId
              this.cateTitle = _listArr.join(' > ')
              this.callGetPropertyDetail(this.selectCategoryId)
                .then(()=>{
                  return this.callGetProductDetail()
                })
                .then(()=>{
                  this.editStep = 2
                  this.isChangeCate = true
                  this.checkProperty(this.editType)
                })
            })
        } else {
          this.selectCategoryId = _cateId
          this.cateTitle = _listArr.join(' > ')
          this.callGetPropertyDetail(this.selectCategoryId)
            .then(()=>{
              this.editStep = 2
              this.checkProperty(this.editType)
            })
        }
      },
      //显示选择类目面板
      showSelectCate(){
      	this.$confirm('修改类目将导致商品编辑页面尚未保存的类目属性信息丢失，是否确认修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{
        	if(this.editType == 'edit' && !this.editStepCheck){
	          this.editStepCheck = true
	          this.step1.selectedCategory = []
            this.editStep = 1
            this.handleItemChange([])
	        }
	        else{
	          this.editStep = 1
	          this.step1.selectedCategory = []
//	          console.log('编辑或新增===修改类目==不是第一次')
	        }
	        this.showCancelEditStep = true
        })

      },
      //比较类目 和 商品详情
      checkProperty(type){
        //根据类目初始化
        this.saleSelectClear = false
        this.mapCateProperty = {}
        this.goodsPropertyConfig = []
        this.skuDimen = {}
        this.goodsSkuConfig = []
        const _this = this
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
                pvName:'',
                propertyNameId: item.propertyNameId
              }
            ]
          }
          item.propertyPairs = item.propertyPairs ? item.propertyPairs : []
          item.propertyPairs.map((subItem)=>{
            let opt = {
              id:subItem.id,
              propertyValueId:subItem.propertyValueId,
              pvName:subItem.pvName,
              propertyNameId:subItem.propertyNameId,
            }
            opts.options.push(opt)
          })
          this.goodsPropertyConfig.push(opts)
        })
        // sku主图ID
        this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
//        this.mapSKUImage()
        //根据详情初始化
        if(type == 'new'){
          if(this.noSalePro){
            let _opts = {
	        		"skuName":'默认',
	            "barcode": "",
	            "marketPrice": '',
	            "retailPrice": '',
	            "costPrice": '',
	            "grossWeight": '',
	            "status": 1,
	            "deliverAreas": [],
	            "id": '',
	            "purchaseGoodsId": null,
	            "disabled": false
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
                    //propertyNameId:item.propertyNameId,
                    propertyNameId:subItem.propertyNameId,
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
                  value:arr,
                  sortOrder:_opts.sortOrder
                }
                this.skuDimen[item.propertyNameId] = _skuOpt
                //this.skuDimen[item.sortOrder] = _skuOpt
                let _skuMapArr = {}
                arr.map((item)=>{
                  _skuMapArr[item] = item
                })
                _opts.options.map((item)=>{
                  if(_skuMapArr[item.pvName]){
                      item.saleDis = true
                  }
                })
              }
              _opts.selected =  _type == 1 || _type == 2 || _type == 5 || _type == 6 || _type == 7 ? arr[0] : arr
            }
            this.goodsPropertyConfig[_idx] = _opts
          }
          else {
            let opts =  {
              isOther:true,
              selected:'',
              propertyName:item.propertyName,
              propertyType:item.propertyType,
              sortOrder:item.sortOrder,
            }
            let arr = []
            item.propertyPairs.map((subItem)=>{
              arr.push(subItem.pvName)
            })
            opts.selected = arr.join(',')
            this.goodsPropertyConfig.push(opts)
          }
        })
        // 设置已选的 sku
//        this.goodsSkuConfig = []
        const saleUnit =this.goodsSaleUnit
        let saleProperty = [] // 销售属性
        this.cateProperty.filter((item)=>item.propertyType == 2).map((item)=>{
          saleProperty.push(item.propertyNameId)
        })
        saleUnit.map((item)=>{
          let arr = [],
            arr_vn = []
          item.properties.map((subItem)=>{
            arr.push(subItem.pvName)
            arr_vn.push(subItem.propertyNameId)
            this.callMapGoodsSkuConfig()
          })
//                  1 组合装 2 市场价 3 建议售价 4 成本价 5 销售价

          let _opts = {
            id:item.id,
            skuName:arr.length>0?arr.join(this.skuSplitStr):'默认',
            skuId:arr_vn,
            status:item.status,
            isSave:true,
            barcode:this.sellerMainExtra ? item.deliverAreas[0].deliverCode : null,
            costPrice:item.costPrice/100,
            grossWeight:item.grossWeight,
            marketPrice:item.marketPrice/100,
            retailPrice:item.retailPrice/100,
            skuCode:item.skuCode,
            purchaseGoodsId:this.sellerMainExtra ? item.purchaseGoodsId : null,
            disabled:true
          }
          item.deliverAreas.map((area,i)=>{
						_opts['code'+area.deliverAreaId] = area.deliverCode
					})
//          || _opts.skuName == '默认'
          if(this.checkIncludesArr(saleProperty,arr_vn) ){
            if(saleProperty.length != arr_vn.length){
              _opts.type = 1
              this.saleUnitDis = true
              this.saleUnitDisType = 1
            }
          } else {
            if(saleProperty.length || arr_vn.length){
              _opts.type = 2
              this.saleSelectClear = true
              this.saleUnitDis = true
              this.saleUnitDisType = 2
            }
          }
          this.goodsSkuConfig.push(_opts)
        })
        this.callMapGoodsSkuConfig()
//        if (this.isChangeCate) {
        	// console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected)
        	// console.log(this.configSaleUnitImages.saleUnitImages)
//        }
//        else{
//        	if(this.configSaleUnitImages.isRequiredImage){
//	          this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.map((unit,u_idx)=>{
//	            this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages[u_idx]
//	          })
//	        }
//        }

        //补充属性时 清空已选择的 属性值
        if(this.saleSelectClear){
          this.goodsPropertyConfig.map((item)=>{
            if(item.propertyType == 2){
              item.selected = []
              if (item.options) {
              	item.options.map((subItem)=>{
	                subItem.saleDis = false
	              })
              }
            }
          })
        }

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
//        console.log(this.step1.categoryOptions)
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
      mapValue(){
//        if(this.sellerMainExtra && this.shipAreaValue.length > 1){
//            this.shipAreaValue.shift()
//        }
      	let _selectArr = this.shipAreaValue
//        console.log(_selectArr)
      	let _map = this.mapArrToObj
      	if(this.mapShipAreaValue.length == 0){
      		this.mapShipAreaValue.push(_map[_selectArr[0]])
          if(!this.sellerMainExtra) return
      	}
      	if(_selectArr.length == 0){
      		this.mapShipAreaValue.pop()
      		return
      	}
      	if(_selectArr.length>this.mapShipAreaValue.length){
      		//新增
      		for(let i=0;i<_selectArr.length;i++){
      			let isEqual = false
      			for(let j=0;j<this.mapShipAreaValue.length;j++){
      				if(_selectArr[i]==this.mapShipAreaValue[j].deliverAreaId){
      					isEqual = true
      				}
      			}
      			if(!isEqual){
      				this.mapShipAreaValue.push(_map[_selectArr[i]])
      				break
      			}
      		}
      	}
      	else{
      		//删除
      		for(let i=0;i<this.mapShipAreaValue.length;i++){
      			let isEqual = false
      			for(let j=0;j<_selectArr.length;j++){
      				if(_selectArr[j]==this.mapShipAreaValue[i].deliverAreaId){
      					isEqual = true
      				}
      			}
      			if(!isEqual){
      				this.mapShipAreaValue.splice(i,1)
      				break
      			}
      		}
      	}
      	//选择发货地的时候判断采购商品发货编码
      	if (this.sellerMainExtra && this.goodsSkuConfig.length>0) {
      		for(let i=0;i<this.goodsSkuConfig.length;i++){
	      		if (this.goodsSkuConfig[i].purchaseGoodsId !== null) {
	      			for(let j=0;j<_selectArr.length;j++){
	      			  let _id =  _selectArr[j]
	      				if(!this.goodsSkuConfig[i]['code'+_id]){
                  this.goodsSkuConfig[i]['code'+_id] = this.goodsSkuConfig[i].barcode
                }
	      			}
	      		}
	      	}
      	}
//      	console.log(this.goodsSkuConfig)
      },
      associate(purchaseGoodsId,index){
      	let _shipAreaValue = this.shipAreaValue
      	let _ids = _shipAreaValue.length > 0 ? _shipAreaValue.join(',') : null
      	if (purchaseGoodsId === null) {
      		//新增
      		if(_ids === null){
	      		this.$alert('请先填写发货地', '提示', {
		          confirmButtonText: '确定',
		          callback: action => {}
		        });
	      	}
	      	else{
            this.storageId = _ids
            this.associateSkuShow = true
            this.associateSkuLoading = true
            this.skuIndex = index
            this.search()
	      	}
      	}
      	else{
      		//编辑
      		if(_ids === null){
	      		this.$alert('请先填写发货地', '提示', {
		          confirmButtonText: '确定',
		          callback: action => {}
		        });
	      	} else{
            this.getPurchaseGood({
              providerProductId: purchaseGoodsId,
            })
              .then((listData)=>{
                let _arr = new Array(listData)
                this.displayedAssociateSku = _arr
                this.isChangeAssociateId = true
                this.skuIndex = index
              })
	      	}
      	}
      },
      search(){
      	this.getPurchaseGoodsList({
  				params: {
    				providerProductId: this.associateSearchConfig.id,
    				barcode: this.associateSearchConfig.barcode,
    				name: this.associateSearchConfig.name,
    				brandId: this.associateSearchConfig.brandId,
            deliverAreaId: this.storageId
    			},
    			pageSize: 5,
    			pageIndex: this.pageObj2.paging.currentPage
  			}).then((listData)=>{
  				this.associateSkuConfig = listData.rows
  				this.associateSkuLoading = false
	        this.pageObj2.paging.total = listData.total
        })
      },
      closeAssociate(){
        this.associateSkuShow = false
        this.resetAssociate()
      },
      resetAssociate(){
        this.associateSearchConfig.id=''
        this.associateSearchConfig.barcode=''
        this.associateSearchConfig.name=''
        this.associateSearchConfig.brandId=''
        this.pageObj2.paging.total = 0
        this.pageObj2.paging.currentPage = 1

      },
      handleCurrentChange2(val){
        this.pageObj2.paging.currentPage = val
        this.associateSkuLoading = true
        if(!this.associateSkuShow) return
        this.search()
      },
      remoteMethodBrand(query){
        if(!query){
          this.brandNameList = []
          return false
        }
        let opts ={
          brandName:query
        }
        this.getSaleBrandNameList(opts).then((rs)=>{
          let list = []
          this.brandNameList = rs
        })
      },
      selectAssociateSku(index){
       this.selectedAssociateSku = this.associateSkuConfig[index]
       this.confirmSelectShow = true
      },
      confirmSelectAssociateSku(){
      	this.confirmSelectShow = false
      	this.closeAssociate()
      	let _goodsSkuConfig = this.goodsSkuConfig[this.skuIndex]
      	_goodsSkuConfig.purchaseGoodsId = this.selectedAssociateSku.id
      	_goodsSkuConfig.barcode = this.selectedAssociateSku.barcode
      	_goodsSkuConfig.grossWeight = this.selectedAssociateSku.grossWeight
      	for(let i=0;i<this.shipAreaValue.length;i++){
      	    let _id = this.shipAreaValue[i]
      		_goodsSkuConfig['code'+_id] = this.selectedAssociateSku.barcode
      	}
      	if (this.displayedAssociateSku.length === 0) {
      		this.displayedAssociateSku.push(this.selectedAssociateSku)
      	}else{
      		this.displayedAssociateSku.splice(0,1,this.selectedAssociateSku)
      	}
      },
      //批量设置
      multipleBlur(value,key){
        if(!value) return
        if(key == 'grossWeight'){
          if(!value.match(RegExpType.Num)){
            this.getToast('格式不正确')
            this.multipleConfig[key] = ''
            return false
          }
        }
        else {
          if(!value.match(RegExpType.Price)){
            this.getToast('格式不正确')
            this.multipleConfig[key] = ''
            return false
          }
        }
        this.goodsSkuConfig.map((item)=>{
          item[key] = value
        })
        this.multipleConfig[key] = ''
      },
      // 详情页品牌获取
      remoteMethodSaleBrand(query,type){
        if(!query){
          this.saleBrandNameList = []
          return false
        }
        let opts = {}
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
      // 详情品牌非自营
      saleBrandExtra(){
        this.getExtraSaleBrand({sellerMainId:this.selectedBelong.id})
          .then((rs)=>{
            this.saleBrandNameList = rs
          })
      },
      //获取类目属性详情
      callGetPropertyDetail(){
        const _this = this
        return new Promise(function(resolve){
          _this.getPropertyDetail({categoryId:_this.selectCategoryId})
            .then((rs)=>{
              rs.goodsProperties = rs.goodsProperties ? rs.goodsProperties : []
              rs.keyProperties = rs.keyProperties ? rs.keyProperties : []
              rs.saleProperties = rs.saleProperties ? rs.saleProperties : []
              _this.skuImagePropertyName = rs.skuImagePropertyName
              _this.noSalePro = rs.saleProperties.length ? false : true
              let list = rs.goodsProperties.concat(rs.keyProperties,rs.saleProperties)
              _this.cateProperty = list
              //_this.cateProperty.sort(function(a,b){return a.sortOrder < b.sortOrder})
              _this.configSaleUnitImages = {
                idx:'',
                isRequiredImage:rs.isRequiredSKUImage,
                skuImagePropertyNameId:rs.skuImagePropertyId,
                list:{},
                saleUnitImages:_this.configSaleUnitImages.saleUnitImages
              }

              resolve()
            })
        })
      },
      //获取商品详情
      callGetProductDetail(){

        const _this = this
        return new Promise(function(resolve){
           if(_this.goodsDetailFetch.fetch){
             _this.initDetail(_this.goodsDetailFetch.rs,resolve)
           } else {
             _this.getBaseGoodsDetail({baseGoodsId:_this.goodsId})
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
        _this.selectedBelong.extra = rs.sellerMainType
        _this.selectedBelong.id = rs.sellerMainId
        _this.selectedBelong.name = rs.sellerMainName
        _this.baseGoodsCode = rs.baseGoodsCode
        _this.goodsProperty = rs.properties
        //_this.mapShipAreaValue =
        //详情销售单元
        _this.goodsSaleUnit = rs.skuArray
        // if(_this.goodsSaleUnit.length){
        //   let unitId = _this.goodsSaleUnit[0].id
        //   this.getUnitSkuList({saleUnitId:unitId})
        //     .then((rs)=>{
        //       _this.initDeliverAreas(rs[0].sellerMainId)
        //     })
        // }
        //同步基本信息
        _this.saveProductEdit.name= rs.name
        _this.saveProductEdit.sellingPoint = rs.sellingPoint
        _this.sellerMainExtra = rs.sellerMainType ? true :false
        _this.saveProductEdit.brandId = rs.brandId
        _this.remoteMethodSaleBrand(_this.saveProductEdit.brandId,'id')
        //同步商品图片详情
//        _this.saveProductEdit.detail = rs.detail
//        _this.setProductUpload({detail:rs.detail,images:rs.images})
        _this.saveProductEdit.detail = this.convertDetail(rs.detail,2)
        _this.setProductUpload({detail:this.convertDetail(rs.detail,2),images:rs.images,detailVideos:rs.detailVideos || [],imagesVideo:rs.imagesVideo || []})

        _this.configSaleUnitImages.saleUnitImages = rs.skuImages
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
      //数组间包含关系
      checkIncludesArr(pre,child){
        let mapPre = {},
            check = true
        pre.map((item)=>{
          mapPre[item] = item
        })
        if(!child.length){
          check = false
        } else {
          child.map((item)=>{
            if(!mapPre[item]){
              check = false
            }
          })
        }
        return check
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
          value:event,
          sortOrder:this.cateProperty.filter((item)=>item.propertyNameId == idx)[0].sortOrder
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
      parseSelectSale(){
        let arr = []
        let _skuDimen = []
        for(let i in this.skuDimen){
//          _skuDimen.push(this.skuDimen[i])
          if(this.skuDimen[i].value.length){
            _skuDimen.push(this.skuDimen[i])
          }
        }
        let _this = this
        _skuDimen.sort(function(a,b){
          return _this.goodsPropertyConfig[_this.mapCateProperty[b.id]].sortOrder - _this.goodsPropertyConfig[_this.mapCateProperty[a.id]].sortOrder
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
          let _opts = {
            costPrice:'',
            skuName:item,
            skuId:_skuId,
            status:1,
            barcode: '',
            marketPrice: '',
            retailPrice: '',
            grossWeight: '',
            purchaseGoodsId: null,
            disabled: false
          }
          this.shipAreaValue.map((item,i)=>{
              _opts['code'+item] = ''
          })
          if(this.mapGoodsSkuConfig[_item] != null){
            _opts = this.goodsSkuConfig[this.mapGoodsSkuConfig[_item]]
          }
          _goodsSkuConfig.push(_opts)
        })
        this.goodsSkuConfig = _goodsSkuConfig
        this.callMapGoodsSkuConfig()
      },
      //已选sku Map
      callMapGoodsSkuConfig(){
        let _map = {}
        this.goodsSkuConfig.map((item,idx)=>{
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
        else {
          list = this.goodsPropertyConfig.filter((item)=>item.propertyType == 2 && !item.isOther)
        }
        this.callShowEdit(list,type)

      },
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
            if(_selectName == item.skuName){
              this.getToast('该sku已存在')
              return false
            }
          }
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
              let _skuId = skuConfig.skuId
              let _skuNameArr = _skuName.indexOf(this.skuSplitStr)>-1 ? _skuName.split(this.skuSplitStr) : [_skuName]
              let _skuNamelist = []
              _skuId.map((item,idx)=>{
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
                  _skuId.push(item.propertyNameId)
                  _skuNamelist.push(_optSku)
                }
              })
              _skuNamelist.sort(function(a,b){return b.sortOrder - a.sortOrder})
              let _skuNameList = []
              _skuNamelist.map((item)=>{
                _skuNameList.push(item.pv)
              })
              skuConfig.skuName = _skuNameList.join(this.skuSplitStr)
              skuConfig.skuId = _skuId
            })
          }
          else if (this.saleEditModel.type == 2){
            let _skuModelId = []
            this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.join(this.skuSplitStr)
            this.cateProperty.filter((item)=>item.propertyType == 2).map((properConfig)=>{
              _skuModelId.push(properConfig.propertyNameId)
            })
            this.goodsSkuConfig[this.saleEditModel.skuIdx].skuId = _skuModelId

          }

          this.goodsSkuConfig[this.saleEditModel.skuIdx].type = 3
          let _itemType = true
          let _itemTypeCheck = true
          let _catePropertyLength = this.cateProperty.filter((item)=>item.propertyType == 2).length
          this.goodsSkuConfig.map((item)=>{
//            if(item.type == 1 || item.type == 2){
//              _itemType = false
//            }

            if(item.type == 2){
              _itemType = false
            }
            if(item.skuId.length != _catePropertyLength){
              _itemTypeCheck = false
            }
          })
          if(_itemType){
            if(this.saleUnitDisType == 1 && _itemTypeCheck || this.saleUnitDisType == 2){
              this.saleUnitDis = false
            }
            this.callMapGoodsSkuConfig()
            this.parseSelectSale()
          }
          this.callMapGoodsSkuConfig()
        }
        this.cancelSaleEditModel()
      },
      cancelSaleEditModel(){
        this.saleEditModel.isShow = false
      },
      costPriceChangeRecord(){
      	if (this.selectedBelong.extra == 1) {
      		//采购商品
      		this.getPurchaseGoodsChangeRecord({
      			params: this.goodsId,
      			pageSize: 5,
      			pageIndex: this.pageObj1.paging.currentPage
      		}).then((rs)=>{
      			this.changeCostPriceConfig = rs.rows
      			//this.pageObj1.paging.pageSize = Number(20)
        		this.pageObj1.paging.total = rs.total
      		})
      	}else{
      		//非自营商品
      		this.getBaseGoodsChangeRecord({
      			params: {
      				baseGoodsCode: this.baseGoodsCode
      			},
      			pageSize: 5,
      			pageIndex: this.pageObj1.paging.currentPage
      		}).then((rs)=>{
      			this.changeCostPriceConfig = rs.rows
      			//this.pageObj1.paging.pageSize = Number(20)
        		this.pageObj1.paging.total = rs.total
      		})
      	}
      	this.changeCostPriceShow = true
        this.handleCurrentChange1(1)
      },
      handleCurrentChange1(val){
      	this.pageObj1.paging.currentPage = val
        if (this.selectedBelong.extra == 1) {
      		//采购商品
      		this.getPurchaseGoodsChangeRecord({
      			params: this.goodsId,
      			pageSize: 5,
      			pageIndex: this.pageObj1.paging.currentPage
      		}).then((rs)=>{
      			this.changeCostPriceConfig = rs.rows
      		})
      	}else{
      		//非自营商品
      		this.getBaseGoodsChangeRecord({
      			params: {
      				baseGoodsCode: this.baseGoodsCode
      			},
      			pageSize: 5,
      			pageIndex: this.pageObj1.paging.currentPage
      		}).then((rs)=>{
      			this.changeCostPriceConfig = rs.rows
      		})
      	}
      },
      handleHideClick(){
      	this.$alert('销售单元与商品类目的销售属性不相符，请先在销售属性列表中完成【修改属性】', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      },
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
                  _pairsId = item.id
                }
              })
              this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages.filter((item)=>item.propertyPairId == _pairsId)[0]

            }
          })
        }
      },
      //修改 SKU销售类型
      changeSkuStatus(status,id){
          this.editSkuStatusModel.type = status
          this.editSkuStatusModel.idx = id
          this.editSkuStatusModel.isShow = true
      },
      //提交 修改 SKU销售类型
      submitEditSkuStatusModel(){
      	if (this.editType == 'edit' && this.editSkuStatusModel.type == 0) {
      		this.$confirm('若将SKU改为【停用】状态，如有关联该SKU的销售单元正在上架销售中，相关联的所有销售单元也会立即停用，是否确认？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          this.goodsSkuConfig[this.editSkuStatusModel.idx].status = this.editSkuStatusModel.type
	        }).catch(() => {
	        })
      	}else{
      		this.goodsSkuConfig[this.editSkuStatusModel.idx].status = this.editSkuStatusModel.type
      	}
      	this.cancelEditSkuStatusModel()
      },
      //取消 修改 SKU销售类型
      cancelEditSkuStatusModel(){
        this.editSkuStatusModel.isShow = false
      },
      checkPvName(rs,val,idx){
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
      //多选自定义勾选时 逻辑处理
      mulSelect(idx,event,sIdx){
        if(!event.target.checked){
          return false
        }
        let _length = 0
        this.goodsPropertyConfig[idx].mulOptions.map((item,id)=>{
          if(sIdx != id && item.pvName == ''){
              _length ++
          }
        })
        if(_length < 1){
          let opt = {
            pvName:'',
            propertyNameId: this.goodsPropertyConfig[idx].propertyNameId
          }
          this.goodsPropertyConfig[idx].mulOptions.push(opt)
        }
//        console.log(this.goodsPropertyConfig[idx])
      },
      //管理SKU表格显示
      tableRowClassName(row, index) {
        if (index === 0) {
          return 'sale-unit-row';
        } else{
          return '';
        }

      },
      deliverCodeFocus(val,line,colomn){
      	if (this.editType == 'edit' && val) {
      		this.deliverCodePre = val
      	}
      },
      deliverCodeBlur(val,line,colomn){
      	if (this.editType == 'edit' && this.deliverCodePre && val!=this.deliverCodePre) {
	        this.$alert('发货编码为商品发货的重要依据，系统将记录你本次的修改行为，请确保操作准确无误！', '提示', {
	          confirmButtonText: '我知道了',
	          callback: action => {

	          }
	        });
      	}
      },
      handleSuccess(res){
        if(res.code != 1){
          this.getToast('上传失败')
          return false
        }
        if(res.data.width != 640 || res.data.height != 640){
          this.getToast('图片限制640*640并且大小<=400k');
          return false;
        }
        let opts = {
          id:'',
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
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';

        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传头像图片大小不能超过 400KB!');
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
        delete this.configSaleUnitImages.list[item]
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.push('')
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.pop()
//        console.log(this.configSaleUnitImages.list)
      },
      getToast(msg){
        this.setStartToast({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
      saveProduct(){
        let otherObj = {
          id: this.goodsId?this.goodsId:''
        }
        let opts = Object.assign({},this.saveProductEdit,otherObj)
        opts.categoryId = this.selectCategoryId
        opts.sellingPoint = opts.sellingPoint.replace(/[\s]/g,'')
        opts.skuArray = JSON.parse(JSON.stringify(this.goodsSkuConfig))
        opts.deliverAreas = []
        this.shipAreaValue.map((item,i)=>{
          let area = this.mapShipAreaValue.filter((aItem)=>item == aItem.deliverAreaId)[0]
        	opts.deliverAreas.push({
        		deliverAreaId: item,
        		deliverAreaTemplateId: area.sellerMainId===null?0:area.sellerMainId.id
        	})
        })
        opts.skuImages = []
        if(!opts.skuArray.length){
          this.getToast('请选择一个销售属性创建SKU')
          return false
        }
        for(let i = 0;i<opts.skuArray.length;i++){
          let item = opts.skuArray[i]
          let properties = []
          item.deliverAreas = []
          item.grossWeight = item.grossWeight
          item.marketPrice = item.marketPrice != ''? this.accMul(item.marketPrice,100):''
          item.retailPrice = item.retailPrice != ''?this.accMul(item.retailPrice,100):''
          item.costPrice = item.costPrice != ''?this.accMul(item.costPrice,100):''
          if(!this.noSalePro){
            let arr = item.skuName.indexOf(this.skuSplitStr) >-1 ? item.skuName.split(this.skuSplitStr) : [item.skuName]
            let salePro = JSON.parse(JSON.stringify(this.goodsPropertyConfig.filter((_item)=>!_item.isOther && _item.propertyType ==2 && item.skuId.includes(_item.propertyNameId))))
            arr.map((subItem,idx)=>{
            	let temp = salePro[idx] ? salePro[idx].options.concat(salePro[idx].mulOptions) : null
              if (temp) {
            		temp.map((del)=>{
	               	if(del.pvName == subItem){
	                  properties.push(del)
	                }
	              })
            	}
            })
          }
          if (this.saleUnitDis && this.saleUnitDisType == 2) {
          	this.$alert('SKU与商品类目的销售属性不相符，请先在销售属性列表中完成【修改属性】操作。', '提示', {
		          confirmButtonText: '我知道了',
		          callback: action => {
		          }
		        })
		        return
          }
          let reg1 = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
          let reg2 = /\s/g
          if (reg1.test(item.barcode) || reg2.test(item.barcode)) {
          	this.getToast('商品条码不允许带空格和中文')
          	return false
          }
          if (item.grossWeight%1 !== 0) {
          	this.getToast('SKU商品毛重请填写整数')
          	return false
          }
          if (item.grossWeight == 0) {
          	this.getToast('SKU商品毛重不能为0')
          	return false
          }
          if (isNaN(item.grossWeight)) {
          	this.getToast('SKU商品毛重请填写数字')
          	return false
          }
          else if(isNaN(item.marketPrice)){
          	this.getToast('SKU商品市场价请填写数字')
          	return false
          }else if(isNaN(item.retailPrice)){
          	this.getToast('SKU商品建议售价请填写数字')
          	return false
          }else if(isNaN(item.costPrice)){
          	this.getToast('SKU商品成本价请填写数字')
          	return false
          }
          this.shipAreaValue.map((area,id)=>{
            if(!this.storageAreaOptions.includes(area) || !item.isSave || (this.storageAreaOptions.includes(area) && item['code'+area])){
              item.deliverAreas.push({
                "deliverAreaId": area,
                "deliverCode": item['code'+area] || ''
              })
            }

          })
//          console.log(item.deliverAreas)
          for(let i=0;i<item.deliverAreas.length;i++){
            if(!(item.deliverAreas[i].deliverCode+'')){
              this.getToast('发货编码不能为空')
              return false
            }
            if(!(item.deliverAreas[i].deliverCode+'').match(RegExpType.deliverCode)){
              this.getToast('发货编码格式不正确')
              return false
            }
//          	if (reg1.test(item.deliverAreas[i].deliverCode) || reg2.test(item.deliverAreas[i].deliverCode)) {
//              this.getToast('发货编码不允许带空格和中文')
//              return false
//	          }
          }
          item.properties = properties
        }
        let properties = []
        let goodsPropertyConfig = this.goodsPropertyConfig.filter((item)=>!item.isOther)
        for(let i = 0;i<goodsPropertyConfig.length;i++){
            let item = goodsPropertyConfig[i]
          // if(item.isRequired && item.selected.length < 1){
          //   this.getToast('请选择'+item.propertyName+'属性值')
          //   return false
          // }
          let _opts = {
            propertyNameId:item.propertyNameId,
            propertyType:item.propertyType,
            propertyPairs:[],
          }
          let arr = []
          if(item.inputType == 6){
            item.selected = item.selected ? UtilTool.formatDate('yyyy-mm-dd',item.selected) : item.selected
          }
          if(item.inputType == 7){
            item.selected = item.selected ? UtilTool.formatDate('yyyy-mm-dd hh:mm:ss',item.selected) : item.selected
          }
          if(item.selected){
            arr = Object.prototype.toString.call(item.selected) === '[object Array]' ? item.selected : [item.selected]
          }
          arr.map((pv)=>{
            let _opt = {
              propertyNameId:item.propertyNameId,
              //propertyValue:pv,
              pvName:pv,
            }
            _opts.propertyPairs.push(_opt)
          })
          properties.push(_opts)
        }
        opts.properties = properties
        if(this.configSaleUnitImages.isRequiredImage){
           if(Object.keys(this.configSaleUnitImages.list).length != this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.length){
             this.getToast('请上传SKU主图')
             return false
           }
//          if (this.configSaleUnitImages.list.length>22) {
//          	this.getToast('详情图不能超过22张')
//          }
          for(let i in this.configSaleUnitImages.list){
            let item = this.configSaleUnitImages.list[i]
            if(!item){
              this.getToast('请上传'+i+'SKU主图')
              return false
            }
            item.propertyPairId = ''
//            console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].options)
            this.goodsPropertyConfig[this.configSaleUnitImages.idx].options.map((pro)=>{
              if(pro.pvName == i){
                item.propertyPairId = pro.id
              }else{
              	item.pvName = i
              }
            })
            opts.skuImages.push(item)
          }
        }
        if(!this.productUpload.images.length){
          this.getToast('请上传商品主图')
          return false
        }
        opts.images = this.productUpload.images
        for(let i=0,length=opts.images.length;i<length;i++){
					opts.images[i].sortOrder = (length-i)*10
				}
				for(let i=0,length=opts.skuImages.length;i<length;i++){
					opts.skuImages[i].sortOrder = (length-i)*10
				}
        if(!this.productUpload.detail){
          this.getToast('请填写商品详情')
          return false
        }
        let _lenDetail = this.productUpload.detail.match(/<img src=/g) ? this.productUpload.detail.match(/<img src=/g).length : 0,
            _lenVideo = this.productUpload.detail.match(/<iframe.+?src=/g) ? this.productUpload.detail.match(/<iframe.+?src=/g).length : 0

        if(_lenDetail+_lenVideo > 22){
          this.getToast('详情图上传不超过22张')
          return false
        }
//        opts.detail = this.productUpload.detail
        if(opts.skuArray[0].properties.length > 2){
          this.getToast('商品限制最多选择2级销售属性')
          return false
        }
        opts.detail = this.convertDetail(this.productUpload.detail,1)
        opts.detailVideos = this.productUpload.detailVideos
        opts.imagesVideo = this.productUpload.imagesVideo
        if(opts.detailVideos && opts.detailVideos.length && opts.detailVideos.length != 2){
          this.getToast('详情视频封面和视频需要一起上传')
          return false
        }
//        console.log(opts)
//        return false
        this.saveBaseGoods(opts)
          .then((rs)=>{
            if (rs) {
            	this.$router.push({
			          name: 'baseGoodsList'
			        })
            }
          })
      },
      convertDetail(detail,type){
          let reg = type == 1 ?
            new RegExp(/<iframe.+?<\/iframe>/g) :
            new RegExp(/<video.+?<\/video>/g)
          let _convert = detail.replace(reg,function($1){
              let _base = type == 1 ?
                  '<video src="" controls="controls">your browser does not support the video tag </video>' :
                  '<iframe class="ql-video" frameborder="0"  allowfullscreen="true" src=""></iframe>',
                _srcList = $1.match(/src="(.+?)"/),
                _src = _srcList.length > 1 ? _srcList[1] : '',
                _return = _base.replace(/src=""/,`src="${_src}"`)
            return _src ? _return : ''
          })
        return _convert
      }
    },
    components:{
      vUpload,
      vPagination
    },
    watch:{
        'selectedBelong.id':function(id,preId){
          if(preId != 0){
            this.saveProductEdit.brandId = ''
          }
          if(!this.selectedBelong.extra){
            this.saleBrandExtra()
          } else {
            if(preId != 0){
              this.saleBrandNameList = []
            }
          }

        }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	.mg-r {
		span {
			text-align: right;
		}
	}
	.hide-click {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
  .section-box{
    .unit-table{
      .el-table{
        .el-table__body-wrapper{}
        tbody{
          tr{
            background-color: #ccc;
          }
        }
      }

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
  .line-wrap{
    .line{
      padding: 10px 0;
      border-top:1px solid rgb(236, 223, 223);
      &:nth-child(1){
        border-top: none;
      }
    }
  }
  .match-box{
    position: absolute;
    top:24px;
    right:0;
    width: 180px;
    max-height: 120px;
    overflow-y: scroll;
    border: 1px solid rgb(229, 211, 209);
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    z-index: 999999;
    p{
      padding: 4px 0 4px 20px;
    }
  }
  .multiple-box{
    position: relative;
    height: 40px;
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
        /*border-top:1px solid rgb(236, 223, 223);*/
        border-right:1px solid transparent;
        &:first-child{
          border:none;
          border-right:1px solid transparent;
        }

      }
    }
  }
</style>
