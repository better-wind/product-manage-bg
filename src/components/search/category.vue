<template>
  <div class="inline-box cate-box" style="margin-bottom: 0">
    <template v-for="item in searchConfig.searchItem">
      <div v-if="item.type == 'cate'" class="inline-box" style="margin-bottom: 0">
        <span class="label-sign">{{item.label}}</span>
        <template v-for="(cate,idx) in item.items">
          <el-select @visible-change="visibleSelectLevel" @change="selectLevel(idx,'update')" v-if="cate.type =='select'" v-model="searchParams[cate.key]" class="input-item-middle" size="small"  :placeholder="cate.placeholder">
            <template v-for="subItem in levelList[idx].options">
              <el-option :label="subItem.name" :value="subItem.id"></el-option>
            </template>
          </el-select>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['searchConfig','searchParams'])
    },
    created(){
      this.initView()
    },
    data:()=>({
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
      visSelect:false
    }),
    methods:{
      ...mapActions(['getCateList','setSearchParams','setStartToast']),
      initView(){
//        for(let i in this.searchParams){
////            console.log(i+'---->'+typeof this.searchParams[i])
//        }
        const query = this.$route.query
        this.callCateList(0)
          .then((rs)=>{
            rs.map((item)=>{
              item.id += ''
            })
            this.levelList[0].options = rs
          })
        this.levelList.map((item,idx)=>{
          let id = 0
//          console.log(item.key)
//          if(query[item.key] && item.key != 'firstCategoryId'){
//            id = query[this.levelList[idx].key]
////            console.log('遍历出'+id)
//          }
          if(query[item.key]){
            id = query[this.levelList[idx].key]
//            console.log('调用'+id)
              this.callCateList(id)
              .then((rs)=>{
                rs.map((item)=>{
                  item.id += ''
                })
                if(idx != 3){
                  this.levelList[idx+1].options = rs
                }
              })
          }

//          if(item.key == 'firstCategoryId' || (query[item.key] && item.key != 'firstCategoryId')){
//             this.callCateList(item.mapId)
//               .then((rs)=>{
//                 item.options = rs
//               })
//          }
        })
      },
      callCateList(type){
        const _self = this;
        let id = type ? type : 0
        return new Promise(function(resolve){
            _self.getCateList({categoryId:id})
              .then((rs)=>{
                resolve(rs)
              })
        })
      },
      visibleSelectLevel(val){
        this.visSelect = true
      },
      selectLevel(idx,type){
        if(!this.visSelect || !this.searchParams[this.levelList[idx].key])
            return false
        this.callCateList(this.searchParams[this.levelList[idx].key])
          .then((rs)=>{
            let i = idx
            let keyList = []
            while(i < 3){
              i++
              this.levelList[i].options = []
              keyList.push(this.levelList[i].key)
            }
            this.setParams(keyList)
            idx < 3 ? this.levelList[idx+1].options = rs : ''
          })

      },
      setParams(list){
        let params = Object.assign({},this.searchParams)
        list.map((item)=>{
          params[item] = ''
        })
        this.setSearchParams(params)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .inline-box{
    .input-item-middle{
      width: 180px;
      margin-right: 10px;
    }
  }

</style>
