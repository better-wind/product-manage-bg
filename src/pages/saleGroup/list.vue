<template>
  <div>
    <div class="title-box">
      <!--分组商品列表 <span v-if="salGroupConfig.saleSetsCode">（{{salGroupConfig.saleSetsCode + ':' + salGroupConfig.saleSetsTitle}}）</span>-->
      分组商品列表 <span v-if="salGroupConfig.saleSetsCode">（{{'组合标题：' + salGroupConfig.saleSetsTitle}}）</span>
    </div>
    <v-list v-if="readyData" :salGroupConfig="salGroupConfig" />
  </div>
</template>
<script>
  import vList from '@/components/saleGoods/productList'
  import {mapActions,mapState} from 'vuex'
  export default{
    components:{
      vList
    },
    data:()=>({
      salGroupConfig:{
        isGroup:true,
        saleSetsCode:'',
        saleSetsId:'',
        saleSetsTitle:''
      },
      readyData:false
    }),
    created(){
      this.initView()
    },
    methods:{
      ...mapActions(['getGroupBaseMsg']),
      initView(){
        let _saleSetsCode = this.$route.query.saleSetsCode
        this.getGroupBaseMsg({saleSetsCode:_saleSetsCode})
          .then((rs)=>{
            this.salGroupConfig.saleSetsCode = rs.saleSetsCode
            this.salGroupConfig.saleSetsId = rs.id
            this.salGroupConfig.saleSetsTitle = rs.title
            this.readyData = true
          })
      }
    }
  }
</script>
