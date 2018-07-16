//detail.js
//获取应用实例
let  app = getApp()
let fetch=require("../../../utils/fetch.js");
let util = require("../../../utils/util.js");
let config = require("../../../config.js");
Page({
  data: {
    golds: [1,2,3,4,5], //分数
    empty_star: '../../../images/no-star.png',
    full_star: '../../../images/full-star.png',
    starId:0,
    id: 0,
    book: {},
    comments:[],
    recommends:[]
  },
  onShareAppMessage: function () {
  },
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  //获取书籍详情
  getBookDetail() {
    let { id } = this.data;
    let self = this;
    fetch.get(`api/book-info/${id}`, {}, false).then((data) => {
      data.rating.score=Math.ceil(data.rating.score/2)+'.0';
      data.rating.count=data.rating.count>10000?(data.rating.count/10000).toFixed(2)+'万':data.rating.count;
      data.wordCount=data.wordCount>10000?(data.wordCount/10000).toFixed(1)+'万':data.wordCount;
      data.updated = util.getDateDiff(new Date(data.updated));
      self.setData({
        book: data,
        starId: data.rating.score
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  //获取书籍相关推荐 
  getBookRecommend(){
    let { id } = this.data;
    let self = this;
    fetch.get(`api/recommend/${id}`, {}, false).then((data) => {

      data.books.forEach((book)=>{
        book.title = book.title.length > 8 ? book.title.substr(0, 8) + "..." : book.title;
      })

      self.setData({
        recommends: data.books.slice(0,9)
      })
    }).catch((err) => {
      console.log(err);
    })

  },
  //获取书籍评论
  getBookComments() {
    let { id } = this.data;
    let self = this;
    fetch.get(`api/post/review/by-book?book=${id}&sort=created&start=0&limit=10`,{}, false).then((data) => {
      let imageServer = config.imageServer;
      data.reviews.forEach((item)=>{
        let temp = item.author.activityAvatar;
        let temp2 = item.author.avatar;
        item.author.activityAvatar = `${imageServer}${temp}`;
        item.author.avatar = `${imageServer}${temp2}`;
        item.created = util.getDateDiff(new Date(item.created).getTime())
      })
      self.setData({
        comments: data.reviews
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  
  //事件处理函数
  gotoDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let { id,title } = dataset;
    wx.redirectTo({
      url: `/pages/book/detail/detail?id=${id}&title=${title}`,
      success: function () {
        console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    });
  },
  goToReading(event){
    let dataset = event.currentTarget.dataset;
    let { id,title } = dataset;
    wx.navigateTo({
      url: `/pages/book/reading/reading?id=${id}&title=${title}`,
      success: function () {
        console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    });
  },
  onLoad: function (options) {
    let { id, title } = options;

    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      id
    })
    //书的详情
    this.getBookDetail();
    //评论
    this.getBookComments();
    //相关推荐
    this.getBookRecommend();
  }
})
