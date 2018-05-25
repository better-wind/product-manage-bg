export default {
  SET_SALE_FLAG_NAME_LIST:(state,rs)=>{
    let opts = []

    rs.data.map((item)=>{
      const _opts = {
        value:item.code+'',
        label:item.name
      }
      opts.push(_opts)
    })
    state.saleFlagNameList = opts
  },
  SET_SALE_FRONT_CATE_LIST:(state,rs)=>{
    // saleFrontCateList
    let opts = []

    rs.data.map((item)=>{
      const _opts = {
        value:item.id+'',
        label:item.name
      }
      opts.push(_opts)
    })
    state.saleFrontCateList = opts
  }
}
