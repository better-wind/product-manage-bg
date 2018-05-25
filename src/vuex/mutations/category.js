export default {
  /*
  * 商品分类经理
  * */
  SET_CATE_MANAGER_GROUP:(state,rs)=>{
    let opts = []
    rs.data.map((item)=>{
      const _opts = {
        value:item.id+'',
        label:item.groupName+'-'+item.managerName
      }
      opts.push(_opts)
    })
    state.managerGroupList = opts
  },
}
