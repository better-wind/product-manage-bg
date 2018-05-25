import baseActions from './base'
import fetchUrl from '../../assets/js/common/fetchUrl/goodsAudit'

export default {
  getGoodsAuditList({commit},rs){
    let _list = []
    if(rs.isAudit){
      _list.push(0)
    }
    if(rs.isAuditAgain){
      _list.push(1)
    }
    if(rs.isPass){
      _list.push(2)
    }
    if(rs.isFail){
      _list.push(4)
    }
    let _rs = JSON.parse(JSON.stringify(rs))
    delete _rs.isAudit
    delete _rs.isAuditAgain
    delete _rs.isPass
    delete _rs.isFail
    _rs.auditStatus = _list.length ? _list : null
    // console.log(_rs)
    const params = {
      data:Object.assign({},_rs),
    }
    const opts = Object.assign({},fetchUrl.GOODS_AUDIT_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  getPriceAuditList({commit},rs){
    let _list = []
    if(rs.isAudit){
      _list.push(0)
    }
    if(rs.isPass){
      _list.push(1)
    }
    if(rs.isFail){
      _list.push(2)
    }
    let _rs = JSON.parse(JSON.stringify(rs))
    delete _rs.isAudit
    delete _rs.isAuditAgain
    delete _rs.isPass
    delete _rs.isFail
    _rs.auditStatus = _list.length ? _list : null
    console.log(_rs)
    const params = {
      data:Object.assign({},_rs),
    }
    const opts = Object.assign({},fetchUrl.PRICE_AUDIT_LIST,params)
    return baseActions.fetch(commit,opts)
  },
  actionPriceAudit({commit},rs){
    const params = {
      data:Object.assign({},rs),
    }
    const opts = Object.assign({},fetchUrl.PRICE_AUDIT_ACTION,params)
    return baseActions.fetch(commit,opts)
  },
  goodsAuditDetail({commit},rs){
    const params = {
      url:fetchUrl.GOODS_AUDIT_DETAIL.url+rs.auditId
    }
    const opts = Object.assign({},fetchUrl.GOODS_AUDIT_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  goodsCodeDetail({commit},rs){
    const params = {
      url:fetchUrl.GOODS_CODE_DETAIL.url+rs.baseGoodsCode,
      method:'GET'
    }
    const opts = Object.assign({},fetchUrl.GOODS_CODE_DETAIL,params)
    return baseActions.fetch(commit,opts)
  },
  actionGoodAudit({commit},rs){
    const params = {
      data:Object.assign({},rs),
    }
    const opts = Object.assign({},fetchUrl.GOODS_AUDIT_ACTION,params)
    return baseActions.fetch(commit,opts)
  },
  getAreaTempList({commit},rs){
    const params = {
      url:fetchUrl.AREA_TEMP_LIST.url + rs.sellerMainId
    }
    const opts = Object.assign({},fetchUrl.AREA_TEMP_LIST,params)
    return baseActions.fetch(commit,opts)
  }
}
