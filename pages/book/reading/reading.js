//detail.js
//获取应用实例
let  app = getApp()
let fetch = require("../../../utils/fetch.js");
let util = require("../../../utils/util.js");
let config = require("../../../config.js");
Page({
  data: {
      id:''
  },
  onShareAppMessage: function () {
  },
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onLoad: function (options) {
    let { id } = options;

    wx.setNavigationBarTitle({
      title: '小说阅读页面'
    })

    this.setData({
      id
    })

    
  
  }
})
