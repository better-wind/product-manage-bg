export default {
  /*
  * 设置环境
  * */
  SET_WEB_ENV:(state,rs)=>{
    state.webEnv = rs
  },
  /*
  * 顶部菜单
  * */
  SET_HEADER_NAV:(state,rs)=>{
    state.headerNav = rs.data.nav
    state.goodsAreaUrl = rs.data.constUrl
  },
  /*
  * 权限配置
  * */
  SET_ROLE_MENU:(state,rs)=>{
    let list = {},
        _menuList = rs.data.menuList,
        _resourcesList = rs.data.resourcesList

    const {realname,username} = rs.data
    state.userMsg = {
      realname,
      username
    }
    state.roleParList = _menuList.filter((item)=>item.pid == 0)
    _menuList.filter((item)=>item.pid != 0).map((item)=>{
      if(!list[item.pid]){
        list[item.pid] = [item]
      } else {
        list[item.pid].push(item)
      }
    })
    _resourcesList.map((item)=>{
      state.roleMenuDetail[item.url] = item.name
    })
    state.roleMenuList = list
    // const mapIcon = {
    //   '属性管理':'&#xe7f6;',
    //   '类目管理':'&#xe618;',
    //   '基础商品':'&#xe609;',
    //   '商品审核':'&#xe69e;',
    //   '格格家销售商品':'&#xe625;',
    //   '环球捕手销售商品':'&#xe625;',
    //   '美食买手销售商品':'&#xe625;',
    //   '虚拟商品':'&#xe79b;',
    //   '销售单元状态码':'&#xe635;',
    //   '国旗管理':'&#xe624;',
    //   '品牌管理':'&#xe63f;',
    //   '运费收入模版':'&#xe67b;',
    //   '修改爆品类目':'&#xe63a;'
    // }
    state.roleParList.map((item)=>{
      item.name = (item.name+'').replace(/(^\s*)|(\s*$)/g, '');
      // item.icon = mapIcon[item.name]
      item.icon = item.menuClass || '&#xe618;'
    })
  },

  /*
  * 加载配置
  * */
  SET_LOADING:(state,rs)=>{
    if(rs){
      state.loadingConfig.loadList.push('1')
    } else {
      state.loadingConfig.loadList.pop()
    }

  },
  /*
  * 提醒配置
  * */
  SET_TOAST:(state,rs)=>{
    state.toastConfig = rs
  },
  /*
  * 当前搜索值
  * */
  SET_SEARCH_PARAMS:(state,rs)=>{
    state.searchParams = rs
  },
  /*
  * 当前搜索配置
  * */
  SET_SEARCH_CONFIG:(state,rs)=>{
    state.searchConfig = rs
  },
  /*
  * 图片预览
  * */
  SET_VIEW_IMAGE:(state,rs) => {
    state.viewImageConfig = rs
  },
  /*
  * 销售渠道
  * */
  SALE_WAY_LIST_CODE:(state,rs) =>{
    state.saleWayList = rs.data
  }
}
