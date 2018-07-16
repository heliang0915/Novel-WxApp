//二级分类页
//获取应用实例
let  app = getApp()
let fetch = require("../../../../utils/fetch.js");
Page({
  data: {

  },
  //分享
  onShareAppMessage: function () {
  },
  //上拉刷新
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh....");
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title:"分类"
    })
  }
})
