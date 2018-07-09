// pages/login/index.js
let app = getApp()
let fetch = require("../../utils/fetch.js");
//获取应用实例
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {

  },
  // 登录系统更新登录时间等信息
  updateUserInfo :function (openid)  {
      fetch.get(`wx/updateInfo/${openid}`,false).then((response) => {});
  },
  getUserInfo: function (e) {
      var self=this;
      // 登录
      wx.login({
          success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              // console.log(res.code)
              let { code } = res;
              if (code) {
                  console.log("登录");
                  fetch.get(`wx/login/${code}`, false).then((resp) => {
                      wx.getUserInfo({
                          success: function (res) {
                              let userInfo = res.userInfo;
                              let { openid, token } = resp;

                              wx.setStorageSync("userInfo", userInfo);
                              wx.setStorageSync("openid", openid);
                             // app.globalData.userInfo = userInfo;
                             // app.globalData.openid = openid;
                              
                              
                              //调用后台接口看是否需要注册用户
                              fetch.get(`wx/exist/${openid}`, false).then((token) => {
                                  //返回true代表已经创建
                                  if (!token) {
                                      //创建用户信息
                                      let user = {
                                          nickName: userInfo.nickName,
                                          tid: openid,
                                          loginType: 1,
                                          roleId: '3e709f4c5ed34dd284de3c7a7e4a7ea3',
                                          pic: userInfo.avatarUrl
                                      }
                                      // 注册用户
                                      fetch.post(`wx/wxRegister`, user).then((result) => {
                                         wx.setStorageSync("token", result);
                                          // app.globalData.token = result;
                                          //登录系统更新登录时间等信息
                                          self.updateUserInfo(openid);
                                      })
                                  } else {
                                    wx.setStorageSync('token', token);
                                    // app.globalData.token = token;
                                      //登录系统更新登录时间等信息
                                    self.updateUserInfo(openid);
                                  }
                                wx.navigateBack({
                                   delta:-1
                                })
                              })
                          }
                      });
                  })
              }

          },
          fail: err => {
              console.log('faile' + err);
          }
      })
  },


  login_success: function(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
  }
  // getUserInfo: function (e) {
  //   wx.navigateTo({
  //     url: '/pages/index/index'
  //   })
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  // }
})