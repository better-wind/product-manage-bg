<template>
  <div v-if="isLoading" class="fixed-loading-progress">
    <div class="loading-progress" :style="'width:'+percentage+'%'">

    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export  default {
    computed: {
      ...mapState(['loadingConfig'])
    },
    data:()=>({
      isLoading:false,
      percentage:0,
    }),
    watch: {
      'loadingConfig.loadList': function(newVal,oldVal){
        if (newVal) {
          if(newVal.length >= 1){
            this.percentage = 50
            this.isLoading = true
          } else{
            this.percentage = 100
            let _this = this
            setTimeout(function(){
              if(_this.loadingConfig.loadList.length == 0){
                _this.isLoading = false
                _this.percentage = 0
              }
            },320)

          }
        }
      }
    }
  }
</script>
<style scoped>
  .fixed-loading-progress{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 8px;
    z-index: 999999;
  }
  .loading-progress{
    width: 0%;
    height: 4px;
    border-radius: 4px;
    background-color: rgba(252,75,77,.8);
    transition: all ease 300ms;
  }
</style>
