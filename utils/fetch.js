
  let globalConfig=require("../config.js");
// console.log(globalConfig.api);

function isLogin(){
   return new Promise((resolve, reject)=>{
     wx.request({
       url: globalConfig.api +'wx/checkLogin',
       method:'post',
       data: {
         token: wx.getStorageSync('token')
       },
       success: function (res) {
          // console.log(res);
          resolve(res)
       }, fail: function (error) {
         reject(error);
       }
     })
   })
 }




  let fetch=config=>{
      let {url,method,data,isShow}=config;
      url = globalConfig.api+url;
      // url+=(url.indexOf("?") > -1?'&':'?')+"temp="+Math.random();
      // console.log(`url>>>${url}`);
      console.log(`%c URL Fetch:${url}`, `color:#409EFF`);
      method=method == null ? "GET":method;
      data=data==null?{}:data;

      if (isShow==null){
        isShow=true;
      }
      
      isShow?wx.showLoading({
        title: '加载中'
      }):null;

      wx.showNavigationBarLoading();
      return new Promise((resolve,reject)=>{
        isLogin().then((res) => {
          let isLogin = res.data;
          if (url.indexOf('/login') > -1 || url.indexOf('/exist') > -1 || url.indexOf('/wxRegister') > -1 ){
              isLogin=true;
          }
          if (!isLogin){
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/login/index',
              })
            },100);
            //  return;
          }
          wx.request({
            url: url,
            data: data,
            method,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              // console.log(res.data)

              // if (res.data){
              //     console.log("好像需要跳转登录...");
              // }

              resolve(res.data);
              wx.hideNavigationBarLoading() //完成停止加载
              // setTimeout(() => {
                isShow ? wx.hideLoading() : null;
              // }, 2000)

            },
            fail: function (error) {
              reject(error);
              wx.hideNavigationBarLoading() //完成停止加载
              isShow ? wx.hideLoading() : null;
            }
          })
        }).catch((err)=>{
          wx.hideNavigationBarLoading() //完成停止加载
          isShow ? wx.hideLoading() : null;
          reject(err);
        })
      })
}

let post = (url, data, isShow)=>{
  return fetch({ url, method: 'POST', data, isShow})
}
let get = (url,isShow) => {
  return fetch({ url, isShow})
}
module.exports={
  post: post,
  get: get
}