<template>
  <div class="item-box">
    <div class="block-box menu-result">
      <el-button type="primary" @click="editBrand(1)" size="small">新增品牌</el-button>
    </div>
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="searchResult.rows" style="width: 100%;">
        <template v-for="(item,index) in searchConfig.searchResult">
          <el-table-column v-if="item.key == 'brandCategoryNameArr'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <template v-for="(item,idx) in scope.row.brandCategoryNameArr">
                <p v-if="idx < 10">{{item.split(',').join(' - ')}}</p>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template scope="scope">
              <template v-for="operaItem in item.items">
                <div style="margin: 5px 0">
                  <el-button v-if="operaItem.type== 'edit'" type="primary" @click="editBrand(2,scope.row)" size="small">编辑品牌</el-button>
                </div>
                <div style="margin: 5px 0">
                  <el-button v-if="operaItem.type== 'manage'" type="primary" @click="manageBrand(scope.row)" size="small">管理类目</el-button>
                </div>

              </template>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <!--title="品牌名称"-->
    <el-dialog :title="brandEditModel.type == 1 ? '新增品牌' : '编辑品牌'" size="tiny" v-model="brandEditModel.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div class="block-box">
        <span>品牌名称：</span>
        <el-input v-model.trim="brandEditModel.opts.brandName" class="input-item-large" size="small"></el-input>
        <p>采用中文/英文格式  例：苹果/Apple</p>
      </div>
      <div  slot="footer" class="dialog-footer">
        <el-button v-if="brandEditModel.type == 2" type="primary"  @click="saveBrandEdit(brandEditModel.type)" size="small">保 存</el-button>
        <el-button v-if="brandEditModel.type == 1" type="primary"  @click="saveBrandEdit(brandEditModel.type)" size="small">下一步：选择品牌经营类目</el-button>
        <el-button size="small" @click="cancelBrandEdit()">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="brand-dialog" :title="'品牌名称：'+brandManageModel.brandName" size="large" v-model="brandManageModel.isShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <template v-if="brandManageModel.type == 1">
        <div class="block-box">
          <span class="label-sign">类目筛选</span>
          <template v-for="(cate,idx) in levelList">
            <el-select :multiple="true" style="width: 180px;margin-right: 10px" @visible-change="visibleSelectLevel" @change="selectLevel(idx,brandManageModel.type)"  v-model="brandManageModel.opts[cate.key]" class="input-item-middle" size="small" >
              <template v-for="subItem in cate.options">
                <el-option :label="subItem.name" :value="subItem.id"></el-option>
              </template>
            </el-select>
          </template>
        </div>
        <div class="block-box mg-r" style="text-align: right">
          <el-button size="small" type="primary" @click="selectCateBrand">搜索</el-button>
        </div>
        <div class="block-box">
          <el-button type="primary"  @click="addBrandCate(1)" size="small">新增类目</el-button>
          <el-button type="primary"  @click="callDelBrandCateList(2)" size="small">批量删除</el-button>
        </div>
        <div class="item-table">
          <el-table  element-loading-text="拼命加载中"  max-height="250" :data="brandCateList.rows" style="width: 100%;" @selection-change="brandCateListDel">
            <el-table-column type="selection" align="center" width="55">

            </el-table-column>
            <el-table-column  label="叶子类目" align="center">
              <template scope="scope">

                <p>{{scope.row.brandCategoryName ? scope.row.brandCategoryName.split(',').join(' - ') : ''}}</p>
              </template>
            </el-table-column>
            <el-table-column  label="操作" align="center">
              <template scope="scope">
                <el-button type="primary" @click="callDelBrandCateList('1',scope.row.leafCategoryId)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="item-box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="brandManageModel.opts.page"
            :page-sizes="pageSizes"
            :page-size="brandManageModel.opts.rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="brandCateList.total">
          </el-pagination>
        </div>
      </template>
      <template v-if="brandManageModel.type == 2">
        <div class="block-box">
          <span class="label-sign">类目筛选</span>
          <template v-for="(cate,idx) in levelList">
            <el-select :multiple="true" style="width: 180px;margin-right: 10px" @visible-change="visibleSelectLevel" @change="selectLevel(idx,brandManageModel.type)"  v-model="brandManageAdd.opts[cate.key]" class="input-item-middle" size="small" >
              <template v-for="subItem in cate.options">
                <el-option :label="subItem.name" :value="subItem.id"></el-option>
              </template>
            </el-select>
          </template>
        </div>
        <div class="block-box mg-r" style="text-align: right">
          <el-button size="small" type="primary" @click="selectCateAll">搜索</el-button>
        </div>
        <div class="item-table">
          <el-table  element-loading-text="拼命加载中" max-height="250" :data="cateList.rows" style="width: 100%;" @selection-change="brandCateListAdd">
            <el-table-column type="selection" align="center" :selectable="selectable" width="55">
            </el-table-column>
            <el-table-column  label="叶子类目" align="center">
              <template scope="scope">
                <p><span v-if="scope.row.hasCheck" class="mg-r c-red">(已关联)</span>{{scope.row.pathName.split(',').join(' - ')}}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="item-box mg-b-h" style="overflow: hidden">
          <el-pagination
            @current-change="handleCateListChange"
            :current-page="brandManageAdd.opts.page"
            :page-sizes="pageSizes"
            :page-size="brandManageAdd.opts.rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cateList.total"
            style="float: left">
          </el-pagination>
          <div class="block-box" style="float: right;padding: 0">
            <el-button type="primary"  @click="addBatchBrandCate" size="small">确认添加</el-button>
          </div>
        </div>
        <div class="item-table">
          <el-table  element-loading-text="拼命加载中" max-height="250" :data="brandManageAdd.addList" style="width: 100%;">
            <el-table-column  label="叶子类目" align="center">
              <template scope="scope">
                <p>{{scope.row.pathName.split(',').join(' - ')}} <span v-if="scope.row.hasBrand" class="c-red">(无品牌 请取消)</span> </p>

              </template>
            </el-table-column>
            <el-table-column  label="操作" align="center">
              <template scope="scope">
                <el-button  type="primary"  @click="delCateAdd(scope.$index)" size="small">取消选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <div  slot="footer" class="dialog-footer">
        <el-button  type="primary" v-if="brandManageModel.type == 2" @click="saveCateEdit(brandManageAdd.type)" size="small">保 存</el-button>
        <el-button size="small" v-if="brandManageModel.type == 1" @click="cancelAddCate(brandManageModel.type,brandManageAdd.type)">确 定</el-button>
        <el-button size="small" v-else @click="cancelAddCate(brandManageModel.type,brandManageAdd.type)">取 消</el-button>
      </div>
    </el-dialog>
    <v-pagination v-if="pagingShow" :paging="paging" />
  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams'])
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
      brandEditModel:{
        isShow:false,
        type:1, // 1 新增 2 保存
        opts:{
          brandName:'',
          brandId:''
        }
      },
      pageSizes:[50],
      brandManageModel:{
        isShow:false,
        type:1, // 1 管理类目 2 新增类目
        brandName:'',
        brandId:'',
        opts:{
          firstCategoryId:[],
          secondCategoryId:[],
          thirdCategoryId:[],
          fourthCategoryId:[],
          page:1,
          rows:50
        },
        batchList:[]
      },
      brandCateList:{},
      brandManageAdd:{
        type:1, //1 管理入口  // 2 新增
        fourthCategoryId:[],
        batchList:[],
        opts:{
          firstCategoryId:[],
          secondCategoryId:[],
          thirdCategoryId:[],
          fourthCategoryId:[],
          page:1,
          rows:50
        },
        addList:[]
      },
      cateList:{},
      levelList:[
        {
          mapId:'0',
          key:'firstCategoryId',
          options:[]
        },
        {
          mapId:'1',
          key:'secondCategoryId',
          options:[]
        },
        {
          mapId:'2',
          key:'thirdCategoryId',
          options:[]
        },
        {
          mapId:'3',
          key:'fourthCategoryId',
          options:[]
        }
      ],
      visSelect:false,
      isUpdate:false
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast','getBrandManageList','getBrandCateList','delBrandCate','getMulCateList',
      'editBrandName','getBrandAddCateList','saveBrandCate']),
      initView(){
        const query = UtilTool.parseQuery(this.$route.query)
        const params = UtilTool.paramsAssign(query,this.searchParams)
        this.setSearchParams(params)
        this.searchList(params)
      },
      searchList(params){
        this.loading = true
        this.getBrandManageList(params)
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
      //编辑品牌
      editBrand(type,opt){
        if(type == 2){
          this.brandEditModel.opts.brandName = opt.name
          this.brandEditModel.opts.brandId = opt.id
        }
        this.brandEditModel.type = type
        this.brandEditModel.isShow = true
      },
      //取消编辑品牌
      cancelBrandEdit(){
        this.brandEditModel.type = 1
        this.brandEditModel.isShow = false
        this.brandEditModel.opts.brandName = ''
        this.brandEditModel.opts.brandId = ''
      },
      //保存品牌编辑
      saveBrandEdit(type){
//          console.log(type)
          if(!this.brandEditModel.opts.brandName){
              this.getToast('请输入品牌')
              return false
          }
          switch(type){
            case 1:
              this.brandManageModel.isShow = true
              this.brandManageModel.type = 2
              this.brandManageAdd.type = 2
              this.brandManageModel.brandName = this.brandEditModel.opts.brandName
              this.selectCateAll()
              this.callCateList([0])
                .then((rs)=>{
                  this.levelList[0].options = rs
                })
              break
            case 2:
              this.editBrandName(this.brandEditModel.opts)
                .then((rs)=>{
                  if(rs){
                    this.cancelBrandEdit()
                    this.initView()
                  }
                })
              break
          }
      },
      //品牌管理
      manageBrand(opt){
//        console.log('~~~')
//        console.log(opt)
        const name =  opt.name,
              Id = opt.id
        this.brandManageModel.brandName = name
        this.brandManageModel.type = 1
        this.brandManageModel.brandId = Id
        this.callCateList([0])
          .then((rs)=>{
            this.levelList[0].options = rs
          })
        this.selectCateBrand()
      },
      //过滤多个数组（可抽离）
      filterArray(){
        let arr = []
//        let args = Array.prototype.slice.call(arguments);
        var args = Array.from(arguments);
        args.map((item)=>{
          arr = item.length ? item : arr
        })
        return arr
      },
      //已选类目
      selectCateBrand(){
        let opts = {}
        opts.page = this.brandManageModel.opts.page
        opts.rows = this.brandManageModel.opts.rows
        opts.brandId = this.brandManageModel.brandId
        opts.categoryIds =  this.filterArray(this.brandManageModel.opts.firstCategoryId,this.brandManageModel.opts.secondCategoryId,this.brandManageModel.opts.thirdCategoryId,this.brandManageModel.opts.fourthCategoryId)
//        console.log(opts)

        this.callGetBrandCateList(opts)
          .then((rs)=>{
            this.setBrandCateList(rs)
            this.brandManageModel.isShow = true
          })
      },
      //设置已选类目表格
      setBrandCateList(rs){
        this.brandCateList = rs
      },
      //品牌类目 页数
      handleSizeChange(val) {
//        this.brandManageModel.opts.rows = val
//        this.brandManageModel.opts.page = 1
//        this.callGetBrandCateList(this.brandManageModel.opts)
//          .then((rs)=>{
//            this.setBrandCateList(rs)
//          })
      },
      handleCurrentChange(val) {

        this.brandManageModel.opts.page = val
        let opts = {}
        opts.page = this.brandManageModel.opts.page
        opts.rows = this.brandManageModel.opts.rows
        opts.brandId = this.brandManageModel.brandId
        opts.categoryIds =  this.filterArray(this.brandManageModel.opts.firstCategoryId,this.brandManageModel.opts.secondCategoryId,this.brandManageModel.opts.thirdCategoryId,this.brandManageModel.opts.fourthCategoryId)

        this.callGetBrandCateList(opts)
          .then((rs)=>{
            this.setBrandCateList(rs)
          })
      },
      //调用获取品牌类目接口
      callGetBrandCateList(opts){
        let _self = this;
        return new Promise(function(reslove){
          _self.getBrandCateList(opts)
            .then((rs)=>{
              reslove(rs)
            })
        })
      },
      //品牌批量删除选择赋值
      brandCateListDel(list){
        let arr = []
        list.map((item)=>{
          arr.push(item.leafCategoryId)
        })
        this.brandManageModel.batchList = arr
      },
      //删除已选类目
      callDelBrandCateList(type,id){
        if(type == 2){
          if(!this.brandManageModel.batchList.length){
            this.getToast('请选择类目')
            return false
          }
        }
        const opts = {
          categoryIds:type == 2 ? this.brandManageModel.batchList : [id],
//          brandName:this.brandManageModel.brandName
          brandId:this.brandManageModel.brandId
        }
////        console.log(this.brandManageModel)
//        return false
        this.delBrandCate(opts)
          .then((rs)=>{
            if(rs){
              this.selectCateBrand()
              this.isUpdate = true
            }
          })
      },

      //调用所有类目
      callGetCateList(opts){
        let _self = this;
        return new Promise(function(reslove){
          _self.getBrandAddCateList(opts)
            .then((rs)=>{
              reslove(rs)
            })
        })
      },
      selectable(row){
        let able = true
        if(row.hasCheck)  {
          able = false
        }
        return able
      },
      //
      selectCateAll(){
        let opts = {}
        opts.page = this.brandManageAdd.opts.page
        opts.rows = this.brandManageAdd.opts.rows
        opts.categoryIds =  this.filterArray(this.brandManageAdd.opts.firstCategoryId,this.brandManageAdd.opts.secondCategoryId,this.brandManageAdd.opts.thirdCategoryId,this.brandManageAdd.opts.fourthCategoryId)
        this.callGetCateList(opts)
          .then((rs)=>{
//            console.log('!!@@$#$#')
//            console.log(this.brandCateList.rows)
            if(this.brandCateList.rows &&　this.brandCateList.rows.length){
              this.brandCateList.rows.map((item)=>{
                rs.rows.map((rsItem)=>{
                  if(rsItem.categoryId == item.leafCategoryId){
                      rsItem.hasCheck = true
                  }
                })
//                rs.rows = rs.rows.filter((rsItem)=>rsItem.categoryId != item.leafCategoryId)
              })
            }
            this.cateList = rs
            this.brandManageModel.type = 2
          })
      },
      //新增类目
      addBrandCate(type){
        this.visSelect = false
        this.brandManageAdd.type = type
        this.brandManageAdd.addList = []
        this.selectCateAll()
      },
      // 页数
      handleCateListChange(val){
        this.brandManageAdd.opts.page = val
        let opts = {}
        opts.page = this.brandManageAdd.opts.page
        opts.rows = this.brandManageAdd.opts.rows
        opts.categoryIds =  this.filterArray(this.brandManageAdd.opts.firstCategoryId,this.brandManageAdd.opts.secondCategoryId,this.brandManageAdd.opts.thirdCategoryId,this.brandManageAdd.opts.fourthCategoryId)

        this.callGetCateList(opts)
          .then((rs)=>{
          if(this.brandCateList.rows.length){
            this.brandCateList.rows.map((item)=>{
              rs.rows.map((rsItem)=>{
                if(rsItem.categoryId == item.leafCategoryId){
                  rsItem.hasCheck = true
                }
              })
//              rs.rows = rs.rows.filter((rsItem)=>rsItem.categoryId != item.leafCategoryId)
              })
            }
            this.cateList = rs
          })
      },
      // 批量选择
      brandCateListAdd(list){
        this.brandManageAdd.batchList = list
      },
      // 模拟批量增加 预览
      addBatchBrandCate(){
        if(!this.brandManageAdd.batchList.length){
          this.getToast('请选择类目')
          return false
        }
        this.brandManageAdd.addList = []
        Array.prototype.push.apply(this.brandManageAdd.addList,this.brandManageAdd.batchList)
        this.brandManageAdd.addList.map((item)=>{
          item.hasBrand = false
        })
//        this.brandManageAdd.batchList = []
        this.brandManageAdd.addList.push({})
        this.brandManageAdd.addList.pop()
      },
      //取消选择
      delCateAdd(id){
        this.brandManageAdd.addList.splice(id,1)
      },
      saveCateEdit(type){
        let opts = {},
            arr = []
        if(!this.brandManageAdd.addList.length){
          this.getToast('请添加叶子类目')
          return false
        }
        for(let i in this.brandManageAdd.addList){
          let item = this.brandManageAdd.addList[i]
          if(item.hasBrand){
            this.getToast(item.pathName+'类目下无品牌，请取消选择')
            return false
          }
        }
        this.brandManageAdd.addList.map((item)=>{
          arr.push(item.categoryId)
        })
        switch (type){
          case 1:{
            opts = {
//              brandId:this.brandManageModel.brandId,
              brandName:this.brandManageModel.brandName,
              categoryIds:arr
            }
            break
          }
          case 2:{
            opts = {
              brandName:this.brandManageModel.brandName,
              categoryIds:arr
            }
            break
          }
        }
        this.saveBrandCate({rs:opts,type:type})
          .then((rs)=>{
            if(rs.length){
              this.$alert('已选择的叶子类目中存在类目属性设置未添加属性项品牌的类目，无法关联品牌名称，请根据提示取消选择这部分类目后重新保存', '', {
                confirmButtonText: '我知道了',
                callback: action => {}
              });
              let mapItem = {}
              rs.map((item)=>{
                 mapItem[item] = item
              })
              this.brandManageAdd.addList.map((item)=>{
                if(mapItem[item.categoryId]){
                  item.hasBrand = true
                }
              })
              this.brandManageAdd.addList.push({})
              this.brandManageAdd.addList.pop()
            } else {
              this.saveCateEditNext(type)
              this.brandManageAdd.addList = []
            }
//            if(rs){
//              this.saveCateEditNext(type)
//              this.brandManageAdd.addList = []
//            }
          })
      },
      saveCateEditNext(type){
        switch (type){
          case 1:{
            this.isUpdate = true
            this.cancelAddCate(2,1)
            this.selectCateBrand()
            break
          }
          case 2:{
            this.isUpdate = true
            this.cancelAddCate(1)
            this.cancelBrandEdit()
            break
          }
        }
      },
      //取消新增
      cancelAddCate(type,type2){
        switch(type){
          case 1:
            this.brandManageModel.isShow = false
            this.brandManageModel.opts.page = 1
            this.brandManageModel.opts.rows = 50
            this.brandManageModel.opts.firstCategoryId = []
            this.brandManageModel.opts.secondCategoryId = []
            this.brandManageModel.opts.thirdCategoryId = []
            this.brandManageModel.opts.fourthCategoryId = []
            this.brandCateList.rows = []
            if(this.isUpdate){
              this.initView()
              this.isUpdate = false
            }
            break
          case 2:
            this.brandManageModel.type = 1
            this.visSelect = false
            this.brandManageAdd.opts.page = 1
            this.brandManageAdd.opts.rows = 50
            this.brandManageAdd.opts.firstCategoryId = []
            this.brandManageAdd.opts.secondCategoryId = []
            this.brandManageAdd.opts.thirdCategoryId = []
            this.brandManageAdd.opts.fourthCategoryId = []
            this.brandManageAdd.addList = []
            this.brandManageAdd.batchList = []
            if(type2 == 2){
              this.brandManageAdd.type = 1
              this.brandManageModel.isShow = false
            }
        }
      },
      //类目
      visibleSelectLevel(val){
        this.visSelect = true
      },
      selectLevel(idx,type){
        const modelName = type == 1 ? 'brandManageModel' : 'brandManageAdd'
        if(!this.visSelect || !this[modelName].opts[this.levelList[idx].key].length)
          return false
        this.callCateList(this[modelName].opts[this.levelList[idx].key])
          .then((rs)=>{
            let i = idx
            while(i < 3){
              i++
              this.levelList[i].options = []
              this[modelName].opts[this.levelList[i].key] = []
            }
            idx < 3 ? this.levelList[idx+1].options = rs : ''
          })
      },
      callCateList(opt){
        const _self = this;
        return new Promise(function(resolve){
          _self.getMulCateList({categoryId:opt})
            .then((rs)=>{
              resolve(rs)
            })
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
  .brand-dialog .input-item-middle{
    width:220px!important;
  }
</style>
