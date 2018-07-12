//app.js
let fetch = require("/utils/fetch.js");
App({
  onLaunch: function (options) {
    console.log("onLaunch.....");
    console.log(JSON.stringify(options));
   let getWindowInfo=()=>{
     var w=wx.getSystemInfoSync().windowWidth;
     var h = wx.getSystemInfoSync().windowHeight;
     this.globalData.w = w;
     this.globalData.h= h;
   } 
    var self=this;
    wx.getSetting({
      success: (res) => {
        let {authSetting}=res;
          console.log("res::::" + JSON.stringify(res));
        if (authSetting && authSetting['scope.userInfo']){
          console.log("res::::" + JSON.stringify(res));
           
        }else{
          console.log("需要登录");
          setTimeout(()=>{
            wx.navigateTo({
              url: '../login/index',
            })
          },1000)
        }
      }
    })
  },
  onPageNotFound() {
    console.log("没有发现")
  },
  globalData: {
    w:null,
    h:null
  }
})