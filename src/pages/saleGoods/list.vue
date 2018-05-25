<template>
  <div>
    <div class="title-box">
      销售商品管理
    </div>
    <v-list v-if="readyData" :salGroupConfig="salGroupConfig"/>
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
      readyData:false,
      salGroupConfig:{
        isGroup:false
      },
      channelConfig:{
        channel:'',
        channelName:'',
        opts:[]
      }
    }),
    created(){
      this.initView()
    },
    methods:{
      ...mapActions(['setChannelConfig']),
      initView(){
        const name = this.$route.name
        if(name == 'saleGoodsGGJ'){
          this.channelConfig.channel = 1
          this.channelConfig.channelName = '格格家'
        }
        else if(name == 'saleGoodsHQBS'){
          this.channelConfig.channel = 2
          this.channelConfig.channelName = '环球捕手'
        }
        else if (name == 'saleGoodsMSMS'){
          this.channelConfig.channel = 8
          this.channelConfig.channelName = '美食买手'
        }
        else if (name == 'saleGoodsMBYD'){
          this.channelConfig.channel = 6
          this.channelConfig.channelName = '脉宝云店'
        }
        this.setChannelConfig(this.channelConfig)
        this.readyData = true
      }
    },
    watch:{
      '$route.name':function(){
        this.initView()
      }
    },
  }
</script>
