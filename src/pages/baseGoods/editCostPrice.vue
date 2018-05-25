<template>
	<div :style="{'overflow':'hidden'}">
		<div :style="{'overflow':'hidden','padding-top':'20px'}">
			<el-button @click="openDialog">上传调价文档</el-button>
			<el-button @click="downloadChangePriceTpl">下载调价模板</el-button>
			<el-button @click="exportSkuInfo">导出SKU信息</el-button>
		</div>
		<el-dialog size="small" v-model="uploadShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<form method="post" id="importValue" ref="importValue" action="/goodsAdmin/goods/baseGoods/costPrice/upload" enctype="multipart/form-data">
		        <input type="file" ref="importFile" id="file" @change="changeFile" name="importFile"/>
		    </form>
		    <div slot="footer" class="dialog-footer">
		        <el-button size="small" @click="save">确 定</el-button>
		        <el-button size="small" @click="uploadShow=false">取 消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>
<script>
	import {mapActions,mapState} from 'vuex'
	export default{
	    created(){
	      	this.initView()
	    },
	    computed:{
	      	//...mapState(['exportSkuInfo'])
	    },
	    data:()=>({
	      	uploadShow: false,
	    }),
	    methods:{
	      	...mapActions(['exportSkuInfo','downloadChangePriceTpl','setStartToast']),
		    initView(){
		    
		    },
		    openDialog(){
		    	this.uploadShow = true
		    },
		    save(){
		    	let filePath = this.$refs.importFile.value;
	            if(!filePath){
	              this.getToast('请选择文件')
	              return false
	            }
	            this.$refs.importValue.submit()
	            this.uploadShow = false
	            this.$refs.importFile.value = ''
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
		    getToast(msg){
		        this.setStartToast({
		          	isShow:true,
		          	msg:msg,
		          	type:'warning'
		        })
		    },
	    },
	}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
	
</style>
