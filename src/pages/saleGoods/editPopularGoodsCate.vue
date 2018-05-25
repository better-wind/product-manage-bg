<template>
  <div>
    <div class="title-box">
      <span>修改爆品类目</span>
    </div>

    <div class="section-box">
      <div class="item-box">
        <div class="block-box label-float-layout">
          <div class="label-sign-wrap">
            <span class="label-sign"><span class="c-red">*</span>销售商品码</span>
          </div>
          <div class="inline-box">
            <el-input type="textarea"  v-model="editCateOpts.saleCode" :rows="8" style="width: 600px" class="input-item-middle input-item-large" size="small" placeholder="请输入销售商品码(SG),多个可用,，、空格或者换行分割"></el-input>
          </div>
        </div>
        <div class="block-box">
          <span class="label-sign"><span class="c-red">*</span>商品分组</span>
          <el-select filterable clearable v-model="editCateOpts.cateId" class="input-item-middle input-item-large" style="width: 400px;margin-left: 8px;" size="small"  placeholder="请选择商品分组">
            <template v-for="subItem in managerGroupList">
              <el-option :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>


        </div>
      </div>
      <div class="item-box t-c">
        <el-button @click="saveEdit" type="primary" >提 交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    data:()=>({
      managerGroupList:[],
      editCateOpts:{
        saleCode:'',
        cateId:''
      },
    }),
    methods:{
      ...mapActions(['getManagerGroupList','setStartToast','editPopularGoodsCate']),
      initView(){
         this.getManagerGroupList()
           .then((rs)=>{
             this.managerGroupList = []
             rs.map((item)=>{
               let _opts = {
                 label:item.groupName+'-'+item.managerName,
                 value:item.id+''
               }
               this.managerGroupList.push(_opts)
             })
           })
      },
      saveEdit(){
        if(!this.editCateOpts.saleCode){
          this.setStartToast({
            isShow:true,
            msg:'请输入销售商品码',
            type:'warning'
          })
          return false
        }
        if(!this.editCateOpts.cateId){
          this.setStartToast({
            isShow:true,
            msg:'请选择商品分组',
            type:'warning'
          })
          return false
        }
        let _codeList = this.editCateOpts.saleCode.split(/[,，、\s]/g).filter((item)=>item);
        _codeList = Array.from(new Set(_codeList))
        let _opts = {
          managerGroupId:this.editCateOpts.cateId,
          saleGoodsCodes:_codeList.join(',')
        }
//        console.log(_opts)
//        return false
        this.editPopularGoodsCate(_opts)
          .then(()=>{
            this.setStartToast({
              isShow:true,
              msg:'提交成功',
              type:'success'
            })
            this.editCateOpts.saleCode = ''
            this.editCateOpts.cateId = ''
          })
      },

    }

  }
</script>
<style lang="scss" rel="stylesheet/scss">
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
</style>
