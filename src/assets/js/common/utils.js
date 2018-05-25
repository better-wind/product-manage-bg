const UtilTool = {
  deepCopy: (pre) => {
    let ch = pre.constructor === Array ? [] : {};
    if(typeof pre !== 'object'){
      ch = pre;
    }
    else if(window.JSON){
      ch = JSON.parse(JSON.stringify(pre))
    }
    else{
      for(var i in pre){
        ch[i] = typeof pre[i] === 'object' ?
          (pre[i].constructor === Array ? pre[i].slice() : deepCopy(pre[i]))
          : pre[i]
      }
    }
    return ch;
  },
  stringifyQuery:(query)=>{
    let opts = {}
    for(let i in query){
      let _opt = query[i]
      if(Object.prototype.toString.call(_opt) === '[object Array]'){
        if(_opt.length){
          opts[i] =  _opt.length == 1 ? _opt.join('Asp,Asp')+'Asp,Asp' : _opt.join('Asp,Asp')
        }
      } else if(_opt){
        opts[i] =  _opt
      }
    }
    return opts
  },
  parseQuery:(query)=>{
    let queryParams = {}
    for(let i in query){
      let _opt = query[i]
      if(_opt){
        queryParams[i] = (_opt+'').indexOf('Asp,Asp') > -1 ? (_opt+'').split('Asp,Asp').filter((item)=>item) : _opt
      }
    }
    return queryParams
  },
  parseCheck:(query)=>{
    let queryParams = {}
    for(let i in query){
      if(query[i].regType){
        queryParams[query[i].key] = query[i].regType
      }
    }
    return queryParams
  },
  paramsAssign:(query,params,defParams)=>{
    let _params = Object.assign({},params)
    const _paramsKey = Object.keys(_params)
    for(let i in query){
      if(_paramsKey.indexOf(i) > -1){
        _params[i] = query[i]
      }
    }
    if(defParams){
      _params = Object.assign({},_params,defParams)
    }
    return _params
  },
  formatDate: (format,date) => {
    let sDate = '';
    if(date){
      if(typeof date == 'string'){
        sDate = date
      }
      else{
        let sYear = date.getFullYear(),
          sMonth = date.getMonth() + 1,
          sDay = date.getDate(),
          sHour = date.getHours(),
          sMin = date.getMinutes(),
          sSec = date.getSeconds();
          sMonth = sMonth < 9 ? '0'+sMonth :sMonth
          sDay = sDay < 10 ? '0'+sDay : sDay
          sHour = sHour < 10 ? '0'+sHour : sHour
          sMin = sMin < 10 ? '0'+sMin: sMin
          sSec = sSec < 10 ? '0'+sSec : sSec
          if(format == 'yyyy-mm-dd hh:mm:ss'){
            sDate = sYear+'-'+sMonth+'-'+sDay+' '+sHour+':'+sMin+':'+sSec
          } else if (format == 'yyyy-mm-dd'){
            sDate = sYear+'-'+sMonth+'-'+sDay
          }
      }
    }
    return sDate
  },
  accMul: (arg1, arg2) => {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  accAdd: (arg1, arg2) => {
    var r1, r2, m, c;

    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }

    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }

    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2))
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      }
      else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    }
    else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m
  },
  ObjectToArray:(obj) => {
    if(!obj) return []
    let _arr = []
    for(let i in obj){
      if(obj[i]){
        _arr.push(obj[i])
      }
    }
    return _arr
  },
  now:()=> new Date(),
  throttle:(func, wait, options)=>{
    var timeout, context, args, result;
    // 最近一次func被调用的时间点
    var previous = 0;
    if (!options) options = {};

    // 创建一个延后执行的函数包裹住func的执行过程
    var later = function () {
      // 执行时，刷新最近一次调用时间
      previous = options.leading === false ? 0 : new Date();
      // 清空定时器
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    // 返回一个throttled的函数
    var throttled = function () {
      // ----- 节流函数开始执行----
      // 我们尝试调用func时，会首先记录当前时间戳
      var now = new Date();
      // 是否是第一次调用
      if (!previous && options.leading === false) previous = now;
      // func还要等待多久才能被调用 =  预设的最小等待期-（当前时间-上一次调用的时间）
      // 显然，如果第一次调用，且未设置options.leading = false，那么remaing=0，func会被立即执行
      var remaining = wait - (now - previous);
      // 记录之后执行时需要的上下文和参数
      context = this;
      args = arguments;

      // 如果计算后能被立即执行
      if (remaining <= 0 || remaining > wait) {
        // 清除之前的“最新调用”
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        // 刷新最近一次func调用的时间点
        previous = now;
        // 执行func调用
        result = func.apply(context, args);
        // 如果timeout被清空了，
        if (!timeout) context = args = null;

      } else if (!timeout && options.trailing !== false) {
        // 如果设置了trailing edge，那么暂缓此次调用尝试的执行
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  },
  debounce:(func, wait, immediate)=>{
    // immediate默认为false
    var timeout, args, context, timestamp, result;

    var later = function() {
      // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
      var last = UtilTool.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = UtilTool.now();
      // 第一次调用该方法时，且immediate为true，则调用func函数
      var callNow = immediate && !timeout;
      // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }

}
const RegExpType = {
  Num: /^[0-9]{1}[0-9]*$/g,
  NumEZ: /[1-9]+/g,
  Price: /^[0-9]{1}[0-9]*(\.[0-9]{1,2})?$/g,
  negativePrice: /^\-{0,1}[0-9]{1}[0-9]*(\.[0-9]{1,2})?$/g,
  Qq: /^\d{6,}$/g,
  Tel:/^1(3|4|5|7|8)\d{9}$/g,
  Email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g,
  En:/^[a-zA-Z\d\-_\.\\/·&\s']+$/g,
  deliverCode:/^[a-zA-Z\d\-_@%\.\*\\/\+]+$/
}
window.UtilTool = UtilTool
window.RegExpType = RegExpType
