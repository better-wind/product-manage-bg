export default {
  /*
  * 设置前端类目管理接口
  * */
  SET_FRONT_CAtE_MANAGE_TITLE:(state,level)=>{
    let _title = '前台类目管理'
    switch (level){
      case 1:
        _title = '前台类目管理'
        break
      case 2:
        _title = '二级类目管理'
        break
      case 3:
        _title = '三级类目管理'
        break
    }
    state.frontCateManageTitle = _title
  }
}
