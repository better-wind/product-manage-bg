<template>
  <div></div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    computed: {
      ...mapState(['toastConfig'])
    },
    methods: {
      ...mapActions(['setStartToast'])
    },
    watch: {
      'toastConfig.isShow': function(newVal,oldVal){
        // console.log(newVal,oldVal)

        const _self = this
        if (newVal) {
          _self.$message({
            message: _self.toastConfig.msg,
            type: _self.toastConfig.type
          })
          const notice = {
            isShow:false,
            msg:'',
            type:''
          }
          this.setStartToast(notice)
        }
      }
    }
  }
</script>
