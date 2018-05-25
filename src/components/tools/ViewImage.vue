<template>
  <el-dialog v-model="viewImageConfig.isShow" size="small">
    <img width="100%" :src="viewImageConfig.url" alt="">
  </el-dialog>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    computed:{
      ...mapState(['viewImageConfig'])
    },
    methods:{
      ...mapActions(['setViewImage'])
    },
  }
</script>
