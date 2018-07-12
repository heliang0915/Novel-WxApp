//detail.js
//获取应用实例
let  app = getApp()
let fetch=require("../../utils/fetch.js");
Page({
  data: {
    golds: [1,2,3,4,5], //分数
    empty_star: '../../images/no-star.png',
    full_star: '../../images/full-star.png',
    starId:0
  },
  onShareAppMessage: function () {
  },
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onLoad: function () {
    this.setData({ starId: 3 })
  }
})
