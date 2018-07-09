//index.js
//获取应用实例
let  app = getApp()
console.log("APP"+JSON.stringify(app));

let fetch=require("../../utils/fetch.js");
Page({
  data: {
    banners:[
      'https://i.zhulang.com/admin/bang/2018-07-09/5b42d8da6e978.jpg',
      'https://i.zhulang.com/admin/bang/2018-07-09/5b42d82d2ad29.jpg',
      'https://i.zhulang.com/admin/bang/2018-07-09/5b42d442223b2.jpg'
    ],
    blogs:[],
    page:1,
    pageSize:0,
    total:0,
    isMore:true,
    keyWord:'',
    contentHeight: wx.getSystemInfoSync().windowHeight-160-56
  },
  onShareAppMessage: function () {
    return {
      title: '程序记录点滴',
      desc: '找伙伴一起来参与吧',
      imageUrl:'https://www.pimage.top/b050266a249e81fb0c2cbd1a554ae4bf?w=1500&h=330&q=100',
      path: '/pages/index/index',
      success: (res)=>{
        console.log("转发成功....");
      },
      fail:(res)=>{
        console.log("转发失败....");
      }
    }
  },
  onReachBottom:function(){
      this.loadMore();
  },
  onPullDownRefresh:function(){
    // wx.showNavigationBarLoading()
    this.setData({
      isMore: true,
      page: 1
    })
    this.getBlogList(1,()=>{
      // wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },'refrsh');
    // wx.stopPullDownRefresh()
  },
  //事件处理函数
  gotoDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let {title,uuid}=dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?title=${title}&uuid=${uuid}`,
      success:function(){
        console.log("跳转成功");
      },
      fail:function(e){
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  searchKey(e){
    this.setData({
      keyWord: e.detail.value
    })
  },
  gotoSearchList(e) {
    let { keyWord } = this.data;
    wx.navigateTo({
      url: `/pages/blogs/blogs?title=搜索&key=${keyWord}&desc=${keyWord}&color=#409EFF`,
      success: function () {
        console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  gotoTab: function () {
    wx.switchTab({
      url: '/pages/channels/channels',
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  getBlogList: function (page, callback,type){
    fetch.post("wx/blogList", {
      page: page==null?1:page,
      params: {}
    },false).then((data) => {
      let blogs = data.models;
      let pageSize=data.pageSize;
      let total=data.total;
      blogs.forEach((item) => {
        if (item.date&&item.date.indexOf('')>-1){
          item.date = item.date.split(' ')[0];
        }
        if (item.pic == null){
          item.pic = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522064329150&di=2721521f8b17e71ffea9625563f9a2ce&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F014fa5582d5ae2a84a0e282b39f87e.jpg";
        }
      })
      var bls = this.data.blogs.concat(data.models);
      if (type == "refrsh"){
        this.setData({
          blogs:[]
        });
        bls = data.models;
      }

      this.setData({
        blogs: bls,
        pageSize,
        total
      })
      callback == null ? function(){}:callback();
    }).catch((err) => {
      console.log(err);
      callback == null ? function () { } : callback();
    })
  },
  loadMore:function(){
    var { pageSize, total, page}=this.data;
    let maxPage = Math.ceil(total/pageSize);
    if (page<maxPage){
      this.setData({
        page: ++this.data.page
      })
      var page = this.data.page;
      this.getBlogList(page,()=>{
        this.setData({
          isMore: (page < maxPage)
        })
      });
    }
    
    // else{
    //   var self=this;
    //   self.setData({
    //     isMore: false
    //   })
    // }

  },
  onLoad: function () {
    // this.getBlogList(1);
  }
})
