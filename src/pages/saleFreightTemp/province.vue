<template>
  <div>
    <div class="title-box">
      {{this.title}}-省份运费管理
    </div>
    <div class="section-box">
      <div class="item-box">
        <div class="block-box menu-result">
          <el-button  @click="callEditMoney()">批量修改运费</el-button>
        </div>
        <div class="item-table">
          <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" @selection-change="handleSelectionChange" style="width: 100%;" >
            <el-table-column type="selection" align="center" width="55">

            </el-table-column>
            <template v-for="(item,index) in searchResultConfig">
              <el-table-column v-if="item.type == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template scope="scope">
                  <div class="opera-menu">
                    <el-button  type="primary" size="small" @click="callEditMoneyRow(scope.row)">修改运费</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>

            </template>
          </el-table>
        </div>
      </div>
      <el-dialog :title="editMoneyModel.name" size="small" v-model="editMoneyModel.isShow" :close-on-click-modal="false"  :show-close="false">
        <div class="block-box">
          <span  class="label-sign">运费</span>
          <div class="inline-box">
            <el-input size="small" placeholder="请输入运费" v-model.trim="editMoneyModel.opts.money"></el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditMoneyModel">确认</el-button>
          <el-button @click="cancelEditMoneyModel">取 消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{

    },
    created(){
      this.initView()
    },
    data:()=>({
      searchResultConfig:[
          {
            label: '省份',
            key: 'provinceName',
            type:'',
          },
          {
            label: '运费',
            key: 'freightMoney',
            type:'',
          },
          {
            label: '操作',
            key: 'opera',
            type: 'opera',
            fixed:'right',
            items:[
              {
                type:'edit',
                label:'编辑'
              },
            ]
          }
        ],
      searchResult:{
        rows:[]
      },
      loading:false,
      batchList:[],
      freightId:'',
      title:'',
      editMoneyModel:{
        isShow:false,
        name:'',
        list:[],
        opts:{
          money:'',
          ids:[]
        }
      }

    }),
    methods:{
      ...mapActions(['getSaleFreightProvince','editSaleFreightProvince','setStartToast']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        this.freightId = query.freightId
        this.title = query.name
        this.getSaleFreightProvince({freightId:this.freightId})
          .then((rs)=>{
            console.log(rs)
            this.searchResult.rows = rs
          })
      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      //启用停用
      callEditMoney(){
        if(!this.batchList.length){
          this.getToast('请选择省份')
          return false
        }
        this.editMoneyModel.name = '批量修改运费'
        this.editMoneyModel.list = JSON.parse(JSON.stringify(this.batchList))
        this.editMoneyModel.isShow = true
      },
      callEditMoneyRow(rs){
        this.editMoneyModel.name = '修改'+rs.provinceName+'运费'
        this.editMoneyModel.list = [{id:rs.id}]
        this.editMoneyModel.opts.money = rs.freightMoney
        this.editMoneyModel.isShow = true
      },
      submitEditMoneyModel(){
        let _list = []
        if(!this.editMoneyModel.opts.money){
          this.getToast('请输入运费')
          return false
        }
        if(!(this.editMoneyModel.opts.money+'').match(RegExpType.Price)){
          this.getToast('运费格式不正确')
          return false
        }
        this.editMoneyModel.list.map((item)=>{
          _list.push(item.id)
        })
        let _opts = {
          ids: _list,
          money: this.editMoneyModel.opts.money
        }
        this.editSaleFreightProvince(_opts)
          .then(()=>{
            this.cancelEditMoneyModel()
            this.initView()
          })
      },
      cancelEditMoneyModel(){
        this.editMoneyModel.isShow = false
        this.editMoneyModel.opts.money = ''

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

    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
