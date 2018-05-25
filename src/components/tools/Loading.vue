<template>
  <div v-if="isLoading" class="fixed-view">
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
    }),
    watch: {
      'loadingConfig.loadList': function(newVal,oldVal){
        if (newVal) {
          if(newVal.length >= 1){
            this.isLoading = true
          } else{
            this.isLoading = false
          }
        }
      }
    }
  }
</script>
<style scoped>
  .fixed-view{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(220,220,220,.1);
    z-index: 99999;
  }
</style>
