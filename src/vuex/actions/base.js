import axios from 'axios'

axios.defaults.withCredentials = true
/*
* 重复请求拦截处理
* 取消前一条
* 取消当前请求
* */
// let _fetchConf = {}
// let CancelToken = axios.CancelToken
// // 拦截当前条
// let romoveFetch = (config,fn)=>{
//   let _url = config.url
//   if(_fetchConf[_url]){
//     if(fn) fn()
//     else delete _fetchConf[_url]
//   } else {
//     if(fn) _fetchConf[_url] = true
//   }
// }
// axios.interceptors.request.use( config =>{
//     config.cancelToken = new CancelToken((c)=>{
//       romoveFetch(config,c)
//     })
//     return config;
//   },
//   error => Promise.reject(error)
// );
//
// axios.interceptors.response.use( response => {
//     romoveFetch(response.config)
//     return response;
//   },
//   error=>Promise.reject(error)
// );
// // 拦截前一条
// let romoveFetch2 = (config,fn)=>{
//   let _url = config.url
//   if(_fetchConf[_url]){
//     if(fn) _fetchConf[_url]()
//     else  delete _fetchConf[_url]
//   }
// }
// axios.interceptors.request.use( config =>{
//     romoveFetch2(config,true)
//     config.cancelToken = new CancelToken((c)=>{
//       _fetchConf2[config.url] = c
//     })
//     return config;
//   },
//   error => Promise.reject(error)
// );
//
// axios.interceptors.response.use( response => {
//     romoveFetch2(response.config)
//     return response;
//   },
//   error=>Promise.reject(error)
// );
const fetch = (commit,opts,fn,p)=>{
  opts.data = (typeof opts.data === 'object' && !p) ? pageOpts(opts.data) : opts.data
  startLoading(commit)
  return new Promise((resolve,reject)=>{
    let cookieHeader = {withCredentials: true},
      _opts = Object.assign({},opts,cookieHeader)
     // let _opts = Object.assign({},opts)
    axios(_opts).then((response)=>{
      if(Object.prototype.toString.call(response.data) == '[object String]' && response.data.indexOf("window.location.href") != -1){
        eval(response.data.replace("<script>", "").replace("</script>",""));
      }
      if(response.data.code == 1){
        fn && commit(fn,response.data)
        resolve && resolve(response.data.data)
      }
      else {
        startToast(commit, {
          isShow:true,
          msg:response.data.message,
          type:'error'
        })
      }
      endLoading(commit)
      reject && reject()
    })
      .catch((err)=>{
        startToast(commit, {
            isShow:true,
            msg:'服务器异常，请稍后重试',
            type:'error'
          })
        endLoading(commit)
        reject && reject()
      })
  })

}
const startLoading = (commit,rs) => {
  commit('SET_LOADING',true)
}
const endLoading = (commit,rs) => {
  commit('SET_LOADING',false)
}
const startToast = (commit,rs) => {
  commit('SET_TOAST',rs)
}
const fromPost = (url, params,target) => {
  // 生成form
  var form = document.createElement('form');
  form.action = url;
  form.method = 'post';

  form.style.display = 'none';
  if (target) {
    form.target = target;
  }

  // 添加参数
  for(var key in params) {
      var opt = document.createElement('input');
      opt.name = key;
      opt.value = params[key];
      form.appendChild(opt);
    }
  // 提交form并移除
  var submit = document.createElement('input');
  submit.type = 'submit';
  form.appendChild(submit);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

const paramsOpts = (opts) => {


}
const trim = (s) => {
  const sT = (s+'').replace(/(^\s*)|(\s*$)/g, '');
  // return sT ? sT : null;
  return sT;
}
const checkTrim = (opt) =>{
  if(opt == null){
    return null
  }
  let obj = Object.prototype.toString.call(opt) === '[object Array]' ? [] : {}
  for(let i in opt){
    if(typeof opt[i] == 'object'){
      obj[i] = checkTrim(opt[i])
    } else {
      obj[i] = trim(opt[i])
    }
  }
  return obj
}
const pageOpts = (opts) => {
  let _opts = {},
      p_opts = Object.assign({},opts)
  if(p_opts.page || p_opts.rows){
    _opts.pageIndex = p_opts.page
    _opts.pageSize = p_opts.rows
    _opts.params = Object.assign({},p_opts)
    if(_opts.params.hasOwnProperty('firstCategoryId')){
      _opts.params.categoryId = _opts.params.fourthCategoryId || _opts.params.thirdCategoryId || _opts.params.secondCategoryId || _opts.params.firstCategoryId
      delete _opts.params.fourthCategoryId
      delete _opts.params.thirdCategoryId
      delete _opts.params.secondCategoryId
      delete _opts.params.firstCategoryId
    }
    delete _opts.params.page
    delete _opts.params.rows
    for(let i in _opts.params){
      // _opts.params[i] = _opts.params[i] ? _opts.params[i] : null
      _opts.params[i] = _opts.params[i] ? _opts.params[i] :
        ({}.toString.call(_opts.params[i]) == '[object Number]' ? _opts.params[i] : null )
    }
  }
  else {
    _opts = Object.assign({},p_opts)
  }
  return _opts
}
export default {
  API:'',
  fetch:fetch,
  fetchVue({commit},rs){
    return fetch(commit,rs)
  },
  setStartLoading({commit},rs){
    startLoading(commit,rs)
  },
  setEndLoading({commit},rs){
    endLoading(commit,rs)
  },
  setStartToast({commit},rs){
    startToast(commit,rs)
  },
  fromPost : fromPost,
  formData:(opts) => {
    let data = [];
    for(let i in opts){
      data.push(i + '='+opts[i])
    }
    return data.join('&');
  },
}

