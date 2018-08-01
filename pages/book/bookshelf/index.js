//index.js
//获取应用实例
let  app = getApp()

let fetch=require("../../../utils/fetch.js");
Page({
  data: {
  },
  onReachBottom:function(){
      this.loadMore();
  },
  onPullDownRefresh:function(){

  },
  onLoad: function () {
    // this.getBlogList(1);
    wx.setNavigationBarTitle({
      title: "书架"
    })
  }
})
