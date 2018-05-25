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
		          	<el-cascader style="width: 500px"  :props="step1.props" :options="step1.categoryOptions" @active-item-change="handleItemChange" v-model="step1.selectedCategory">
		         	</el-cascader>
	        	</div>
		        <div style="margin-top:180px" class="block-box t-c">
		          	<el-button @click="selectCate" type="primary" size="small">下一步，填写商品信息</el-button>
		        </div>
	      	</template>
	      	<template v-if="editStep == 2">
		        <div class="item-box">
		          	<div class="block-item">
		            	<span class="label-sign">当前选择类目</span>
		            	{{cateTitle}}
		            	<!-- {{ step1.selectedCategory | categoryFilter }} -->
		            	<el-button @click="showSelectCate" size="small">修改类目</el-button>
		          	</div>
		        </div>
		        <div class="item-box ">
			        <div class="sub-title-box mg-b">
			            基本信息
			        </div>
		          	<div class="block-box base-box">
		            	<!-- <span class="label-sign">商品名称</span> -->
		            	<span class="label-sign"><span class="c-red">*</span>商品名称</span>
		            	<el-input v-model="saveProductEdit.name" :maxlength="40" class="input-item-middle input-item-large" size="small"></el-input>
		            	<span>{{saveProductEdit.name.length}}/40</span>
		          	</div>
		          	<div class="block-box base-box label-float-layout">
		            	<div class="label-sign-wrap">
		             		<!-- <span class="label-sign">卖点文案</span> -->
		             		<span class="label-sign"><span class="c-red">*</span>卖点文案</span>
		            	</div>
		            	<div class="inline-box">
		              		<el-input type="textarea" :rows="4" :maxlength="140" style="width: 600px" v-model="saveProductEdit.sellingPoint" class="input-item-middle input-item-large" size="small"></el-input>
		              		<span>{{saveProductEdit.sellingPoint.length}}/140</span>
		            	</div>
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
												    <el-option v-for="subItem in item.options" :key="item.value" :label="subItem.pvName" :value="subItem.pvName">
												    	{{subItem.pvName}}
												    </el-option>
												</el-select>
				                      		</template>
				                    	</div>
				                    	<div class="inline-box" v-else>
				                      		<template v-for="subItem in item.options">
				                        		<el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
				                      		</template>
				                    	</div>
				                  	</template>
				                  <!--单选可自定义-->
				                  	<template v-else-if="item.inputType == 2">
				                    	<div class="inline-box">
				                      		<template v-for="subItem in item.options">
				                        		<el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
						                    </template>
						                    <el-radio class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
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
						                          	<el-checkbox class="mg-b-h" :disabled="subItem.pvName ? false : true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
						                        </template>
						                    </el-checkbox-group>
					                    </div>
					                </template>
				                  <!--输入框-->
					                <template v-else-if="item.inputType == 5">
					                    <div class="inline-box">
					                      	<el-input v-model="item.selected" class="input-item-middle input-item-large" size="small"></el-input>
					                    </div>
					                </template>
				                </template>
			              	</div>
			            </template>
	          		</template>
	          		<div class="block-box base-box">
						<!-- <span class="label-sign">货品归属</span> -->
						<span class="label-sign"><span class="c-red">*</span>货品归属</span>
						<div class="inline-box" v-if="editType == 'edit'">
							{{goodsDetailFetch.rs.sellerMainName}}
						</div>
						<el-select filterable v-model="selectedBelong" placeholder="请选择" @change="sellerMainIdChange" v-else>
		    				<el-option v-for="item in sellerOptions" :key="item.value" :label="item.label" :value="item.obj">
						    </el-option>
						</el-select>
						<!-- <el-select filterable v-model="selectedBelong" @change="sellerMainIdChange" class="input-item-middle" placeholder="货品归属商家">
				            <template v-for="item in sellerOptions">
				                <el-option :label="item.label" :value="item.obj"></el-option>
				            </template>
			            </el-select> -->
					</div>
					<div class="block-box base-box">
						<!-- <span class="label-sign">发货地</span> -->
						<span class="label-sign"><span class="c-red">*</span>发货地</span>
						<div class="inline-box" :style="{'width':'80%'}" v-show="shipAreaOptions.length>0">
							<el-checkbox-group v-model="shipAreaValue">
							    <el-checkbox v-for="(item,i) in shipAreaOptions" :disabled="item.isEditable ? false : true" :key="i" :label="item.deliverAreaId" class="mg-b-h">
							    	{{item.deliverAreaName}}
							    </el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="inline-box" v-show="shipAreaOptions.length == 0">
							暂无发货地
						</div>
					</div>
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
					                    <span class="label-sign"><span class="c-red">*</span>{{item.propertyName}}</span>
					                </div>
				                  <!--单选不可自定义-->
				                  	<template v-if="item.inputType == 1">
				                    	<div class="inline-box" v-if="item.options.length>5">
				                      		<template>
				                        		<el-select class="mg-b-h" v-model="item.selected" placeholder="请选择">
												    <el-option v-for="subItem in item.options" :key="item.value" :label="subItem.pvName" :value="subItem.pvName">
												    	{{subItem.pvName}}
												    </el-option>
												</el-select>
				                      		</template>
				                    	</div>
				                    	<div class="inline-box" v-else>
				                      		<template v-for="subItem in item.options">
				                        		<el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
				                      		</template>
				                    	</div>
				                  	</template>
				                  <!--单选可自定义-->
				                  	<template v-else-if="item.inputType == 2">
				                    	<div class="inline-box">
				                      		<template v-for="subItem in item.options">
				                        		<el-radio class="mg-b-h" v-model="item.selected"  :label="subItem.pvName">{{subItem.pvName}}</el-radio>
						                    </template>
						                    <el-radio class="mg-b-h" v-model="item.selected" :disabled="item.inputValue ? false : true" :label="item.inputValue"><el-input v-model="item.inputValue" @blur="checkPvName(item,item.inputValue)" class="input-item-middle" size="small"></el-input></el-radio>
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
						                          	<el-checkbox class="mg-b-h" :disabled="subItem.pvName ? false : true" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
						                        </template>
						                    </el-checkbox-group>
					                    </div>
					                </template>
				                  <!--输入框-->
					                <template v-else-if="item.inputType == 5">
					                    <div class="inline-box">
					                      	<el-input v-model="item.selected" class="input-item-middle input-item-large" size="small"></el-input>
					                    </div>
					                </template>
				                </template>
			              	</div>
			            </template>
	          		</template>
	        	</div>
		        <div class="item-box">
		          	<div class="sub-title-box mg-b">
		            	销售属性
		          	</div>
		          	<template v-for="(item,idx) in goodsPropertyConfig">
		            	<template v-if="item.propertyType == 2">
			              	<template v-if="item.isOther">
			                	<!-- <div class="inline-box c-dis">
				                  	<span class="label-sign">{{item.propertyName}}</span>
				                  	<span>{{item.selected}}</span>
				                  	<span>该属性项已在类目属性中删除，保存提交后将从商品中删除</span>
			                	</div> -->
			              	</template>
		              		<template v-else>
				                <div class="block-box property-box label-float-layout">
				                  	<div class="label-sign-wrap">
				                    	<!-- <span class="label-sign">{{item.propertyName}}</span> -->
				                    	<span class="label-sign"><span class="c-red">*</span>{{item.propertyName}}</span>
				                  	</div>
				                  	<template v-if="item.inputType == 4">
				                    	<div class="inline-box" :style="{'position':'relative'}">
				                      		<el-checkbox-group v-model="item.selected" @change="mulSelectChange(item.propertyNameId,$event,item)">
						                        <template v-for="subItem in item.options">
						                          	<el-checkbox class="mg-b-h" :disabled="(subItem.saleDis ? true : false) || saleUnitDis" :label="subItem.pvName"></el-checkbox>
						                        </template>
						                        <template v-for="(subItem,sIdx) in item.mulOptions">
						                          	<el-checkbox class="mg-b-h" :disabled="(subItem.pvName ? false : true) || saleUnitDis" @change="mulSelect(idx,$event,sIdx)" :label="subItem.pvName"><el-input v-model="subItem.pvName" @blur="checkPvName(item,subItem.pvName,sIdx)" class="input-item-middle" size="small"></el-input></el-checkbox>
						                        </template>
				                      		</el-checkbox-group>
				                      		<div class="hide-click" @click="handleHideClick()" v-if="saleUnitDis"></div>
				                    	</div>
				                  	</template>
				                </div>
			              	</template>
			            </template>
			        </template>
		          	<div class="item-table">
			            <el-table :data="goodsSkuConfig" style="width: 100%;" >
				            <el-table-column align="center" label="销售状态">
				                <template scope="scope" >
				                  	<el-button size="small" :type="scope.row.status == 1 ? 'primary' : ''" :class="scope.row.status == 1 ? '' : 'c-red'" @click="changeSkuStatus(scope.row.status,scope.$index)">{{scope.row.status == 1 ? '可售' : '停售'}}</el-button>
				                </template>
				            </el-table-column>
			              	<el-table-column  prop="skuName" label="销售属性值"  align="center">
				                <template scope="scope">
				                  	<span class="key-item">{{scope.row.skuName | changeSkuCode}}</span>
				                  	<el-button size="small" type="primary" v-if="scope.row.type == 1" @click="editSaleProperty(scope.row.skuId,scope.$index,1)">补充属性</el-button>
                  					<el-button size="small" type="primary" v-else-if="scope.row.type == 2" @click="editSaleProperty(scope.row.skuId,scope.$index,2)">修改属性</el-button>
				                </template>
			              	</el-table-column>
						    <el-table-column prop="barcode" align="center" label="商品条码" width="120">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input v-model="scope.row.barcode" class="input-item-middle"></el-input></span>
								</template>
						    </el-table-column>
						    <el-table-column prop="grossWeight" align="center" label="毛重(g)" width="120">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input class="input-item-middle" v-model="scope.row.grossWeight"></el-input></span>
								</template>
						    </el-table-column>
						    <el-table-column prop="marketPrice" align="center" label="市场价" width="120">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input class="input-item-middle" v-model="scope.row.marketPrice"></el-input></span>
								</template>
						    </el-table-column>
						    <el-table-column prop="retailPrice" align="center" label="建议售价" width="120">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input class="input-item-middle" v-model="scope.row.retailPrice"></el-input></span>
								</template>
						    </el-table-column>
						    <el-table-column prop="costPrice" align="center" label="成本价(不含邮费)" width="120">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input class="input-item-middle" v-model="scope.row.costPrice"></el-input></span>
								</template>
						    </el-table-column>
						    <!-- <el-table-column prop="code2" align="center" label="发货编码" width="120">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input class="input-item-middle" v-model="scope.row.code2"></el-input></span>
								</template>
						    </el-table-column> -->
						    <el-table-column prop="code" align="center" :label="'发货编码('+shipAreaOptions.filter((obj)=>obj.deliverAreaId==item)[0].deliverAreaName+')'" width="120" :key="i" v-for="(item,i) in shipAreaValue" v-if="shipAreaOptions.length>0">
						    	<template scope="scope">
								    <span class="cell-edit-input"><el-input class="input-item-middle" v-model="scope.row['code'+i]" @focus="deliverCodeFocus(scope.row['code'+i],scope.row,i)" @blur="deliverCodeBlur(scope.row['code'+i],scope.row,i)"></el-input></span>
								</template>
						    </el-table-column>
			            </el-table>
		          	</div>
		        </div>
		        <div class="item-box" v-if="configSaleUnitImages.isRequiredImage">
		          	<div class="sub-title-box mg-b">
		            	SKU主图（销售属性项：{{skuImagePropertyName}}）
		          	</div>
		          	<div class="block-box c-dis">SKU主图：必填，分辨率640x640，文件小于400KB！</div>
			        <div class="block-box" v-if="goodsPropertyConfig[configSaleUnitImages.idx]">
			            <div class="inline-box mg-r" style="overflow: hidden" v-for="item in goodsPropertyConfig[configSaleUnitImages.idx].selected">
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
					                <el-upload class="avatar-wrap avatar-uploader" action="/goodsAdmin/goods/file/imageUpload" :data="picUpload" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
					                    <i class="el-icon-plus avatar-uploader-icon"></i>
					                </el-upload>
				                </template>
				            </div>
			            </div>
			        </div>
		        </div>
	        	<v-upload :uploadConfig="uploadConfig" />
		        <div class="item-box t-c">
		          	<el-button @click="saveProduct" type="primary" >保 存 商 品</el-button>
		        </div>
	      	</template>

	      <!--:close-on-press-escape="false"-->

	      	<el-dialog title="修改销售状态" size="tiny" v-model="editSkuStatusModel.isShow" :close-on-click-modal="false"  :show-close="false">
		        <div class="block-box">
		          	<el-radio v-model="editSkuStatusModel.type"  :label="1">可售</el-radio>
		          	<el-radio v-model="editSkuStatusModel.type"  :label="0">停售</el-radio>
		        </div>
		        <div slot="footer" class="dialog-footer">
		          	<el-button @click="cancelEditSkuStatusModel">取 消</el-button>
		          	<el-button type="primary" @click="submitEditSkuStatusModel">确 定</el-button>
		        </div>
	      	</el-dialog>
	      	<el-dialog :title="saleEditModel.type == 1 ? '补充属性' : '修改属性'"  size="small" v-model="saleEditModel.isShow" :close-on-click-modal="false"  :show-close="false">
	      		<div class="block">
		          	<span v-if="saleEditModel.type == 1">补充销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
		          	<span v-else-if="saleEditModel.type == 2">修改销售属性的操作保存后不可修改。请确认该SKU的销售属性为：</span>
		        </div>
		        <div class="block-box property-box label-float-layout" v-for="item in saleEditModel.propertyList">
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
		          	<el-button type="primary"  @click="submitSaleEditModel(saleEditModel.fn)">确 定</el-button>
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
      ...mapState(['productUpload'])
    },
    filters: {
      categoryFilter(data){
//        console.log(data)
        let str = ''
        data.map((item,i)=>{
          str+=item.name+' '
        })
        return str
      },
      changeSkuCode(str){
        let _str = ''
        _str = str.replace(/&/g,'-')
        return _str
      },
    },
    data:()=>({
      goodsId:'',
      cateTitle: '',
      goodsDetailFetch:{
        fetch:false,
        rs:{}
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
      sellerOptions:[],
      selectedBelong: {
		  	name: '',
		  	id: 0
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
    }),
    methods:{
      ...mapActions(['setViewImage','setProductUpload','getPropertyDetail','getBaseGoodsDetail','getCateList','getCategoryPath','getGoodsBelong','getShipArea','saveBaseGoods','validCategoryIdChange','setStartToast']),
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
								id: this.goodsDetailFetch.rs.sellerMainId
							},function(){
								//展示已选择的发货地
								_this.goodsDetailFetch.rs.skuArray[0].deliverAreas.map((data,j)=>{
									_this.goodsDetailFetch.rs.deliverAreas.map((area,i)=>{
										if(data.deliverAreaId == area.deliverAreaId){
											_this.shipAreaValue.push(area.deliverAreaId)
										}
									})
								})
								//遍历显示不可编辑的发货地
								_this.shipAreaOptions.map((area,i)=>{
									_this.goodsDetailFetch.rs.deliverAreas.map((data,j)=>{
										if (area.deliverAreaId == data.deliverAreaId) {
											area.isEditable = data.isEditable
										}
									})
								})
							})
							console.log(this.shipAreaOptions,this.shipAreaValue)
              this.checkProperty(this.editType)
            })
        } else {
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
	        			}
	        		})
	        	})
	        })
//          this.selectCate()
        }
        //编辑
        this.setProductUpload({detail:'',images:[]})
        //接口获取
      },
      shipAreaPromise(id){
	      const _this = this;
	      return new Promise(function(resolve){
            _this.getShipArea({sellerMainId:id}).then((rs)=>{
	            resolve(rs)
	        	})
	      })
	    },
	    sellerMainIdChange(obj,fn) {
	    	this.shipAreaValue = []
	    	this.saveProductEdit.sellerMainId = obj.id
	    	this.shipAreaPromise(obj.id).then((rs)=>{
	    		rs.map((data,i)=>{
	    			data.isEditable = true
	    		})
	    		if (this.editType == 'edit') {
	    			if (rs.length == 0) {
		    			this.shipAreaOptions = this.goodsDetailFetch.rs.deliverAreas
		    		}else{
		    			this.shipAreaOptions = rs
		    			this.goodsDetailFetch.rs.deliverAreas.map((data1,i)=>{
		    				let _b = false
		    				rs.map((data2,j)=>{
		    					if (data1.deliverAreaId == data2.deliverAreaId) {
		    						_b = true
		    					}
		    				})
		    				if (!_b) {
		    					this.shipAreaOptions.push(data1)
		    				}
		    			})
		    		}
	    		}else{
	    			this.shipAreaOptions = rs
	    		}

	    		fn&&fn()
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
            console.log(item)
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
	          // console.log('编辑===修改类目==第一次')

	          // let _cateIdArr = JSON.parse(JSON.stringify(this.editCatePathIdArr))
	          // let list = this.step1.categoryOptions
	          // _cateIdArr.pop()
	          // _cateIdArr.unshift(0)
	          // let getCateBy=(c_idx)=>{
	          //   let idx = c_idx
	          //   if(idx >= _cateIdArr.length){
	          //     this.editStep = 1
	          //     return false
	          //   }
	          //   let item = _cateIdArr[idx]
	          //   this.categoryPromise(item)
	          //     .then((rs)=>{
	          //       let _idx_s = 0
	          //       rs.map((cate,_idx)=>{
	          //         if(cate.id == this.editCatePathIdArr[idx]){
	          //           this.step1.selectedCategory[idx].idx = _idx
	          //           this.mapCategoryId[this.step1.selectedCategory[idx].id] = this.step1.selectedCategory[idx].id
	          //           _idx_s = _idx
	          //         }
	          //         let _opts = {
	          //           label:cate.name,
	          //           cates:[],
	          //           value:{
	          //             idx:_idx,
	          //             id:cate.id,
	          //             name:cate.name
	          //           }
	          //         }
	          //         if(idx == 3){
	          //            delete _opts.cates
	          //         }
	          //         if(idx == 0){
	          //           this.step1.categoryOptions.push(_opts)
	          //         } else if(idx == 1){
	          //           console.log(this.step1.selectedCategory[0].idx)
	          //           this.step1.categoryOptions[this.step1.selectedCategory[0].idx].cates.push(_opts)
	          //         } else if(idx == 2){
	          //           this.step1.categoryOptions[this.step1.selectedCategory[0].idx].cates[this.step1.selectedCategory[1].idx].cates.push(_opts)
	          //         } else if (idx == 3){
	          //           this.step1.categoryOptions[this.step1.selectedCategory[0].idx].cates[this.step1.selectedCategory[1].idx].cates[this.step1.selectedCategory[2].idx].cates.push(_opts)
	          //         }
	          //       })
	          //       idx ++
	          //       getCateBy(idx)
	          //     })
	          // }
	          // getCateBy(0)
	        } else{
	          this.editStep = 1
	          this.step1.selectedCategory = []
	          console.log('编辑或新增===修改类目==不是第一次')
	        }
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
          if(opts.inputType == 2){
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
        this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
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
              _opts.selected =  _type == 1 || _type == 2 || _type == 5 ? arr[0] : arr
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
            skuName:arr.length>0?arr.join('&'):'默认',
            skuId:arr_vn,
            status:item.status,
            isSave:true,
            barcode:item.barcode,
            costPrice:item.costPrice/100,
            grossWeight:item.grossWeight,
            marketPrice:item.marketPrice/100,
            retailPrice:item.retailPrice/100,
            skuCode:item.skuCode
          }
          item.deliverAreas.map((area,i)=>{
						_opts['code'+i] = area.deliverCode
					})
          if(this.checkIncludesArr(saleProperty,arr_vn) || _opts.skuName == '默认'){
            if(saleProperty.length != arr_vn.length){
              _opts.type = 1
              this.saleUnitDis = true
            }
          } else if(saleProperty.length>0 && arr_vn.length>0){
            _opts.type = 2
            this.saleSelectClear = true
            this.saleUnitDis = true
          }
          this.goodsSkuConfig.push(_opts)
        })
        this.callMapGoodsSkuConfig()
        if (this.isChangeCate) {
        	// console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected)
        	// console.log(this.configSaleUnitImages.saleUnitImages)
        }else{
        	if(this.configSaleUnitImages.isRequiredImage){
	          this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.map((unit,u_idx)=>{
	            this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages[u_idx]
	          })
	        }
        }

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
        console.log(this.step1.categoryOptions)
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
      //获取类目属性详情
      callGetPropertyDetail(){
        console.log('===获取类目===Id='+this.selectCategoryId)
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
        console.log('===获取详情===')
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
        _this.goodsProperty = rs.properties
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

        //同步商品图片详情
        _this.saveProductEdit.detail = rs.detail
        _this.setProductUpload({detail:rs.detail,images:rs.images})
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
      	console.log(pre,child)
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
        console.log(check)
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
        if(_len != this.cateProperty.filter((item)=>item.propertyType == 2).length){
          this.goodsSkuConfig = []
          this.callMapGoodsSkuConfig()
          return false
        }
        this.mapSKUImage()
        this.parseSelectSale()
      },
      handleHideClick(){
      	this.$alert('销售单元与商品类目的销售属性不相符，请先在销售属性列表中完成【补充/修改属性】', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
      },
      parseSelectSale(){
        let arr = []
        let _skuDimen = []
        for(let i in this.skuDimen){
          _skuDimen.push(this.skuDimen[i])
        }
        let _this = this
        _skuDimen.sort(function(a,b){
          return _this.goodsPropertyConfig[_this.mapCateProperty[b.id]].sortOrder - _this.goodsPropertyConfig[_this.mapCateProperty[a.id]].sortOrder
        })
        for(let i in _skuDimen){
          let item = _skuDimen[i]
          let _itemArr = []
          item.value.map((arrItem)=>{
            if(arr.length){
              arr.map((subArrItem)=>{
                _itemArr.push(subArrItem+'&'+arrItem)
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
            status:1,
            barcode: '',
		        marketPrice: '',
		        retailPrice: '',
		        grossWeight: '',
          }
          if(this.mapGoodsSkuConfig[_item] != null){
            _opts = this.goodsSkuConfig[this.mapGoodsSkuConfig[_item]]
          }
          _goodsSkuConfig.push(_opts)
        })
        this.goodsSkuConfig = _goodsSkuConfig
        // this.goodsSkuConfig.sort((a,b)=>{
        //  if(a.skuName > b.skuName){
        //      return 1
        //  }  else if(a.skuName < b.skuName){
        //      return -1
        //  } else {
        //      return 0
        //  }
        // })
        this.callMapGoodsSkuConfig()
      },
      //已选sku Map
      callMapGoodsSkuConfig(){
        let _map = {}
        this.goodsSkuConfig.map((item,idx)=>{
          _map[item.skuName] = idx
        })
        this.mapGoodsSkuConfig = _map
        console.log(this.mapGoodsSkuConfig)
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
      //补全 修改 sku
      editSaleProperty(sku,idx,type,fn){
      	console.log(sku,idx,type,fn)
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
        // if(fn){
        //   this.callShowEdit(list,type)
        // } else {
        //   this.$confirm('SKU与商品类目的销售属性不相符，请先在销售属性列表中完成【补充/修改属性】操作。', '提示', {
        //     confirmButtonText: '我知道了',
        //   }).then(() => {
        //     this.callShowEdit(list,type)
        //   }).catch(() => {

        //   });
        // }

      },
      //补全 修改SKU
      // callShowEdit(list,type){
      //   this.saleEditModel.type = type
      //   this.saleEditModel.propertyList = JSON.parse(JSON.stringify(list))
      //   this.saleEditModel.propertyList.map((item)=>{
      //     item.selected = ''
      //     item.inputValue = null
      //   })
      //   this.saleEditModel.isShow = true
      // },
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
            let _arr =  this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName.split('&&')
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
      	if (this.editType == 'edit' && this.editSkuStatusModel.type == 0) {
      		this.$confirm('若将SKU改为【停售】状态，如有关联该SKU的销售单元正在上架销售中，相关联的所有销售单元也会立即停售，是否确认？', '提示', {
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
      submitSaleEditModel(){
        let s = '',
				  sarr = [],
				  checkArr = []
				for(let i = 0;i<this.saleEditModel.propertyList.length;i++){
				  let item = this.saleEditModel.propertyList[i]
				  if(!item.selected){
				    this.getToast('请选择'+item.propertyName)
				    return false
				  }
				  checkArr.push(item.selected)
				}
				if(this.saleEditModel.noKey){
				  this.saleUnitDis = false
				  this.goodsSkuConfig[0].skuName = '默认'
				  this.goodsSkuConfig[0].type = 3
				}else {
				  let _selectName = checkArr.join('&')
				  for(let i in this.goodsSkuConfig){
				    let item = this.goodsSkuConfig[i]
				    if(_selectName == item.skuName){
				      this.getToast('该sku已存在')
				      return false
				    }
				  }
				  if(this.saleEditModel.fn){
				    let skuNameArr = []
				    this.goodsSkuConfig.map((item)=>{
				      skuNameArr.push(item.skuName.split('&'))
				    })
				    console.log(skuNameArr)
				    let arr = skuNameArr[this.saleEditModel.skuIdx]
				    this.saleEditModel.propertyList.map((item,idx)=>{
				      if(item.selected != arr[idx]){
				        if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){
				          //判断是否在别的sku里选择了该销售属性值
				          let _len = false
				          skuNameArr.map((sku,skuIdx)=>{
				            if(this.saleEditModel.skuIdx != skuIdx && sku[idx] == arr[idx]){
				              _len = true
				            }
				          })
				          if(_len){
				            this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
				          }
				          else {
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
				        }
				      }
				      sarr.push(item.selected)
				    })
				    this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.join('&')
				    this.managerSkuList[this.saleEditModel.skuIdx][0].skuName = sarr.join('&')
				    this.callMapGoodsSkuConfig()
				    this.parseSelectSale()
				  }else{
				    this.saleEditModel.propertyList.map((item)=>{
				      if(this.saleEditModel.type == 1){
				        if(!this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.includes(item.selected)){
				          this.goodsPropertyConfig[this.mapCateProperty[item.propertyNameId]].selected.push(item.selected)
				        }
				      }else if(this.saleEditModel.type == 2){
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
				      s = item.selected+'&' + s
				      sarr.push(item.selected)
				    })
				    if(this.saleEditModel.type == 1){
				      let _skuName = this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName
				      let _skuId = this.goodsSkuConfig[this.saleEditModel.skuIdx].skuId
				      let _skuNameArr = _skuName.indexOf('&')>-1 ? _skuName.split('&') : [_skuName]
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
				        let _optSku = {
				          id:item.propertyNameId,
				          pv:item.selected,
				          sortOrder:item.sortOrder
				        }
				        _skuNamelist.push(_optSku)
				      })
				      //_skuNamelist.sort(function(a,b){return a.sortOrder < b.sortOrder})
				      _skuNamelist.sort(function(a,b){return b.sortOrder - a.sortOrder})
				      let _skuNameList = []
				      _skuNamelist.map((item)=>{
				        _skuNameList.push(item.pv)
				      })
				      this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = _skuNameList.join('&')
				    }else if (this.saleEditModel.type == 2){
				      this.goodsSkuConfig[this.saleEditModel.skuIdx].skuName = sarr.join('&')
				    }
				    this.goodsSkuConfig[this.saleEditModel.skuIdx].type = 3
				    let _itemType = true
				    this.goodsSkuConfig.map((item)=>{
				      if(item.type == 1 || item.type == 2){
				        _itemType = false
				      }
				    })
				    if(_itemType){
				      this.saleUnitDis = false
				      this.callMapGoodsSkuConfig()
				      this.parseSelectSale()
				    }
				  }
				  this.callMapGoodsSkuConfig()
				}
				this.cancelSaleEditModel()
      },
      checkPvName(rs,val,idx){
        console.log('=========判断===========')
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
        console.log(this.goodsPropertyConfig[idx])
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
        console.log(file)
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
        console.log(item)
        console.log(this.configSaleUnitImages.list[item])
        delete this.configSaleUnitImages.list[item]
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.push('')
        this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.pop()
        console.log(this.configSaleUnitImages.list)
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
        opts.skuArray = JSON.parse(JSON.stringify(this.goodsSkuConfig))
        opts.deliverAreas = []
        this.shipAreaValue.map((item,i)=>{
        	opts.deliverAreas.push({
        		deliverAreaId: item
        	})
        })
        opts.skuImages = []
        for(let i = 0;i<opts.skuArray.length;i++){
        	let num=0
          let item = opts.skuArray[i]
          let properties = []
          item.deliverAreas = []
          item.grossWeight = item.grossWeight
          item.marketPrice = item.marketPrice != ''?Number(item.marketPrice).toFixed(2)*100:''
          item.retailPrice = item.retailPrice != ''?Number(item.retailPrice).toFixed(2)*100:''
          item.costPrice = item.costPrice != ''?Number(item.costPrice).toFixed(2)*100:''
          if(!this.noSalePro){
            let arr = item.skuName.indexOf('&') >-1 ? item.skuName.split('&') : [item.skuName]
            let salePro = this.goodsPropertyConfig.filter((item)=>!item.isOther && item.propertyType ==2)
            // salePro.sort((a,b)=>{
            // 	return b.sortOrder-a.sortOrder
            // })
            // arr.map((subItem,idx)=>{
            //   salePro[idx].options.map((del)=>{
            //    	if(del.pvName == subItem){
            //       properties.push(del)
            //     }else if(salePro[idx].mulOptions.length > 1){
            //     	salePro[idx].mulOptions.map((subSalePro)=>{
            //     		console.log(subSalePro)
            //     		if (subItem == subSalePro.pvName && !subSalePro.stop) {
            //     			properties.push({
		          //       		pvName:subSalePro.pvName,
		          //       		propertyNameId:salePro[idx].propertyNameId
		          //       	})
		          //       	subSalePro.stop = true
            //     		}
            //     	})
            //   	}
            //   })
            // })
            arr.map((subItem,idx)=>{
            	let temp = salePro[idx]?salePro[idx].options.concat(salePro[idx].mulOptions):null
            	console.log(temp)
            	if (temp) {
            		temp.map((del)=>{
	               	if(del.pvName == subItem){
	                  properties.push(del)
	                }
	              })
            	}
            })
            console.log(properties)
          }
          if (this.saleUnitDis) {
          	this.$alert('SKU与商品类目的销售属性不相符，请先在销售属性列表中完成【补充/修改属性】操作。', '提示', {
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
          }else if(isNaN(item.marketPrice)){
          	this.getToast('SKU商品市场价请填写数字')
          	return false
          }else if(isNaN(item.retailPrice)){
          	this.getToast('SKU商品建议售价请填写数字')
          	return false
          }else if(isNaN(item.costPrice)){
          	this.getToast('SKU商品成本价请填写数字')
          	return false
          }
          while(item['code'+num] && this.shipAreaValue[num]){
          	item.deliverAreas.push({
              "deliverAreaId": this.shipAreaValue[num],
              "deliverCode": item['code'+num]
            })
            ++num
          }
          for(let i=0;i<item.deliverAreas.length;i++){
          	if (reg1.test(item.deliverAreas[i].deliverCode) || reg2.test(item.deliverAreas[i].deliverCode)) {
	          	this.getToast('发货编码不允许带空格和中文')
	          	return false
	          }
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
          // if(Object.keys(this.configSaleUnitImages.list).length != this.goodsPropertyConfig[this.configSaleUnitImages.idx].selected.length){
          //   this.getToast('请上传SKU主图')
          //   return false
          // }
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
            console.log(this.goodsPropertyConfig[this.configSaleUnitImages.idx].options)
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
        let _lenDetail = this.productUpload.detail ? this.productUpload.detail.match(/<img src=/g).length : 0
        if(_lenDetail > 22){
          this.getToast('详情图上传不超过22张')
          return false
        }
        opts.detail = this.productUpload.detail
//        console.log(opts)
        this.saveBaseGoods(opts)
          .then((rs)=>{
            if (rs) {
            	this.$router.push({
			          name: 'baseGoodsList'
			        })
            }
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
</style>
