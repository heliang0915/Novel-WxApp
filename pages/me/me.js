//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{},
    userId:null,
  },
  goMyZan(e){
      let { keyWord } = this.data;
      wx.navigateTo({
        url: `/pages/mylist/mylist?title=我的点赞&type=1`,
        success: function () {
          console.log("跳转成功");
        },
        fail: function (e) {
          console.log("调用失败...." + JSON.stringify(e));
        }
      })
  },
  goMyComment(e) {
    let { keyWord } = this.data;
    wx.navigateTo({
      url: `/pages/mylist/mylist?title=我的评论&type=2`,
      success: function () {
        console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  goAbout(){
      wx.navigateTo({
          url: `/pages/about/about?title=关于`,
          success: function () {
              console.log("跳转成功");
          },
          fail: function (e) {
              console.log("调用失败...." + JSON.stringify(e));
          }
      })
  } ,
  onLoad: function () {
      let userInfo=wx.getStorageSync('userInfo');
      let userId=wx.getStorageSync('userInfo');
    if (userInfo){
      this.setData({
        userInfo: userInfo
      })
    }

    if (userId){
      this.setData({
        userId: userId
      })
    }
   
    wx.setNavigationBarTitle({
      title:"个人中心"
    })
  }
})
