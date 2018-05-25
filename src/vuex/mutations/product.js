export default {
  /*
   * 商品详情图片&主图
   * */
  SET_PRODUCT_UPLOAD:(state,rs)=>{
    state.productUpload = JSON.parse(JSON.stringify(rs))
  },
  /*
  * 销售渠道区分
  * */
  SET_CHANNEL_CONFIG:(state,rs)=>{
    state.channelConfigStates = rs
  },
  /*
  * 批量选择商品导出
  * */
  SET_BATCH_EXPORT:(state,rs) => {
    state.batchExport = rs
  }
}
