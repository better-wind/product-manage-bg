<template>
  <div class="item-box" v-if="!searchConfig.noMenu">
    <div class="block-box">
      <template v-for="item in searchConfig.searchItem.filter((item)=>!item.isSearchHide)">
        <div v-if="item.type" class="inline-box mg-r">
          <span v-if="!item.isSlot && item.label && item.label != '-'" class="label-sign">{{item.label}}</span>
          <span style="margin-left: -15px" v-if="item.label == '-'">-</span>
          <el-input @keyup.enter.native="keyDown($event)" v-if="item.type == 'input'" v-model.trim="searchParams[item.key]" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" :placeholder="item.placeholder"></el-input>
          <el-select v-else-if="item.type =='select'" clearable :multiple="item.multiple ? true : false" v-model="searchParams[item.key]" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small"  :placeholder="item.placeholder">
            <template v-for="subItem in item.options">
              <el-option :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>
          <el-select v-else-if="item.type =='select-filterable'" filterable  v-model="searchParams[item.key]" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small"  :placeholder="item.placeholder">
            <template v-for="subItem in item.options">
              <el-option :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>
          <el-date-picker v-else-if="item.type =='datetime'" type="datetime" v-model="searchParams[item.key]"  class="input-item-middle" size="small" :placeholder="item.placeholder"></el-date-picker>
          <template v-else-if="item.type =='select-property'">
            <div style="position: relative;display: inline">
              <el-input v-model.trim="searchParams[item.key]" @focus="callPropertyValCheck(true)" @blur="callPropertyValCheck(false)" @change="changeName" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" :placeholder="item.placeholder"></el-input>
              <div v-if="propertyList.length && remoteMethodFocus" class="match-box">
                <p v-for="subItem in propertyList">
                  <span>{{subItem.name}}</span>
                </p>
              </div>
            </div>
          </template>
          <template v-else-if="item.type =='select-property-val'">
            <div style="position: relative;display: inline">
              <el-input v-model.trim="searchParams[item.key]" @focus="callPropertyValCheck(true)" @blur="callPropertyValCheck(false)" @change="changeValue" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" :placeholder="item.placeholder"></el-input>
              <div v-if="propertyList.length && remoteMethodFocus" class="match-box">
                <p v-for="subItem in propertyList">
                  <span>{{subItem.name}}</span>
                </p>
              </div>
            </div>
          </template>
          <template v-else-if="item.type =='select-property-brand-name'">
            <div style="position: relative;display: inline">
              <el-input v-model.trim="searchParams[item.key]" @focus="callPropertyValCheck(true)" @blur="callPropertyValCheck(false)" @change="changeBrand" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" :placeholder="item.placeholder"></el-input>
              <div v-if="propertyList.length && remoteMethodFocus" class="match-box">
                <p v-for="subItem in propertyList">
                  <span>{{subItem.name}}</span>
                </p>
              </div>
            </div>
          </template>
          <template v-else-if="item.type =='select-saleSetsTitle' && pageName != 'saleGroupList'">
            <div style="position: relative;display: inline">
              <span  class="label-sign">组合标题</span>
              <el-input v-model.trim="searchParams[item.key]" @focus="callPropertyValCheck(true)" @blur="callPropertyValCheck(false)" @change="changeSaleSetsTitle" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" :placeholder="item.placeholder"></el-input>
              <div v-if="propertyList.length && remoteMethodFocus" class="match-box">
                <p v-for="subItem in propertyList">
                  <span>{{subItem.title}}</span>
                </p>
              </div>
            </div>
          </template>
          <template v-else-if="item.type =='select-labelIds'">
            <div style="position: relative;display: inline">
              <el-input v-model.trim="searchParams[item.key]" @focus="labelIdsListFocus = true" @blur="labelIdsListFocus = false" @change="changeLabelIds" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small" :placeholder="item.placeholder"></el-input>
              <div v-if="labelIdsList.length && labelIdsListFocus" class="match-box">
                <p v-for="subItem in labelIdsList">
                  <span>{{subItem.name}}</span>
                </p>
              </div>
            </div>
          </template>
          <el-select v-else-if="item.type =='select-property-brand'"filterable clearable remote :remote-method="remoteMethodBrand"  v-model="searchParams[item.key]" :style="item.width ? 'width:'+item.width : ''" class="input-item-middle" size="small"  :placeholder="item.placeholder">
            <template v-for="subItem in propertyList">
              <el-option :key="subItem.code" :label="subItem.name" :value="subItem.code">
                {{subItem.name}}
              </el-option>
            </template>
          </el-select>
          <template v-else-if="item.items && item.type == 'check-group'">
            <template v-for="subItem in item.items">
              <el-checkbox :disabled="subItem.isDisabled ? true : false" v-model="searchParams[subItem.key]">{{subItem.label}}</el-checkbox>
            </template>
          </template>
          <template v-if="item.isSlot">
            <slot :name="item.slotName"></slot>
          </template>
        </div>
      </template>
    </div>
    <div class="block-box inline-r" >
      <template v-for="item in searchConfig.searchMenu">
        <el-button v-if="item.type == 'search'" :type="item.style" size="small" @click="searchSubmit">{{item.label}}</el-button>
        <template v-if="item.isSlot">
          <slot :name="item.slotName"></slot>
        </template>
      </template>
      <el-button size="small" @click="resetSearch">重 置</el-button>
    </div>
  </div>

</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams','channelConfigStates'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      pageName:'',
      initSearch:{
        page:1,
        rows:20
      },
      propertyList:[],
      labelIdsList:[],
      labelIdsListFocus:false,
      remoteMethodFocus:false
    }),
    methods:{
      ...mapActions(['setSearchParams','setStartToast','matchNameList','matchValueList','getBrandSearchList','groupLabelSearch','getGroupSaleTypeList']),
      initView(){
        const name = this.$route.name
        this.pageName = name
        this.propertyList = []
        this.labelIdsList = []
        const brandIdPage = ['baseGoodsList']
        if(brandIdPage.includes(this.pageName) && this.$route.query.brandId){
          let _brandId = this.$route.query.brandId
          this.remoteMethodBrand(_brandId,true)
        }
      },
      callPropertyValCheck(type){
        this.remoteMethodFocus = type
      },
      debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },
      changeName(val){
        if(!val){
          this.propertyList = []
          return false
        }
        this.debounce(this.remoteMethod(val),300)
      },
      changeValue(val){
        if(!val){
          this.propertyList = []
          return false
        }
        this.debounce(this.remoteMethodVal(val),300)
      },
      changeBrand(val){
        if(!val){
          this.propertyList = []
          return false
        }
        this.debounce(this.remoteMethodBrand(val),300)
      },
      changeSaleSetsTitle(val){
        if(!val){
          this.propertyList = []
          return false
        }
        this.debounce(this.remoteMethodTitle(val),300)
      },
      changeLabelIds(val){
        if(!val){
          this.labelIdsList = []
          return false
        }
        this.debounce(this.remoteMethodLabelIds(val),300)
      },
      remoteMethod(query){
        if(!query){
          this.propertyList = []
          return false
        }
        let opts ={
          propertyName:query,
          preMatch:false
        }
        this.matchNameList(opts)
          .then((rs)=>{
            this.propertyList = rs
//            console.log(this.searchParams)
          })
      },
      remoteMethodVal(query){
        if(!query){
          this.propertyList = []
          return false
        }
        let opts ={
          propertyValue:query,
          preMatch:false
        }
        this.matchValueList(opts)
          .then((rs)=>{
            this.propertyList = rs
//            console.log(this.searchParams)
          })
      },
      remoteMethodBrand(query,byId){
        console.log(query,byId)
        if(!query){
          this.propertyList = []
          return false
        }
        let opts = {}
        if(byId){
          opts.brandId = query
        } else {
          opts.brandName = query
        }
        this.getBrandSearchList(opts)
          .then((rs)=>{
            rs.map((item)=>{
                item.code += ''
            })
            this.propertyList = rs
          })
      },
      remoteMethodTitle(query){
        if(!query){
          this.propertyList = []
          return false
        }
//        console.log(query)

        let opts ={
          channel:this.channelConfigStates.channel,
          title:query
        }
        this.getGroupSaleTypeList(opts)
          .then((rs)=>{
            this.propertyList = rs
////            console.log(this.searchParams)
          })
      },
      remoteMethodLabelIds(query){
        if(!query){
          this.labelIdsList = []
          return false
        }
//        console.log(query)

        let opts ={
          name:query
        }
        this.groupLabelSearch(opts)
          .then((rs)=>{
            this.labelIdsList = rs
////            console.log(this.searchParams)
          })
      },
      keyDown(ev){
//        console.log(ev)
        if(ev.keyCode==13){
          this.searchSubmit()
        }
      },
      searchSubmit(){
        const regType = UtilTool.parseCheck(this.searchConfig.searchItem)
        for(let i in this.searchParams){
          if(regType[i]){
            for(let j in regType[i]){
              let reg = regType[i][j]
              if(this.searchParams[i] && !this.searchParams[i].match(RegExpType[reg.type])){
                this.setStartToast({
                  isShow:true,
                  msg:reg.msg,
                  type:'warning'
                })
                return false
              }
            }
          }
        }

//        this.$router.push
//        this.$router.replace
        var _expectMatch = {}
        let _routerName = this.$route.name
        if(_routerName == 'saleGroupList'){
          _expectMatch.channel = this.$route.query.channel
        }
        this.$router.replace({
          path: this.$route.path,
          query: Object.assign({},UtilTool.stringifyQuery(this.searchParams),this.initSearch,{t:new Date().getTime()},_expectMatch)
        })
        _expectMatch = {}
      },
      toBoolean(val){
        return (/^true$/g).test(val)
      },
      resetSearch(){
        let params = {}
        this.searchConfig.searchItem.map((item)=>{
          if(item.items){
            item.items.map((subItem)=>{
              params[subItem.key] = subItem.isClear ?  '' : subItem.intKey
            })
          } else {
            params[item.key] = item.intKey
          }
        })

        if(this.$route.name == 'saleGroupList'){
          params.saleSetsCode = this.$route.query.saleSetsCode
          params.channel = this.$route.query.channel
        }
        if(this.$route.name == 'frontCategory'){
          params.level = this.$route.query.level
          params.parentId = this.$route.query.parentId
        }
        this.setSearchParams(params)
      },
    },
    watch:{
      '$route.name':function(){
        this.initView()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .input-item-middle{
    width: 180px;
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
    z-index: 99;
    p{
      padding: 4px 0 4px 20px;
    }
  }
  .item-box{
    padding-bottom: 0;
    >.block-box{
      padding: 0;
    }
  }
</style>
