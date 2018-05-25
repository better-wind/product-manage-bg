
<template>
  <div class="item-box">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paging.currentPage"
      :page-sizes="paging.pageSizes"
      :page-size="paging.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paging.total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    props:['paging'],
    methods: {
      handleSizeChange(val) {
        this.nextPage({rows:val})
      },
      handleCurrentChange(val) {
        this.nextPage({page:val})
      },
      nextPage(opts) {
        let query = Object.assign({},this.$route.query,opts)
        this.$router.push({
          path: this.$route.path,
          query: query
        })
      }
    },
  }
</script>
