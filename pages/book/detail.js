//detail.js
//获取应用实例
let  app = getApp()
let fetch=require("../../utils/fetch.js");
let config = require("../../config.js");
Page({
  data: {
    golds: [1,2,3,4,5], //分数
    empty_star: '../../images/no-star.png',
    full_star: '../../images/full-star.png',
    starId:0,
    id: 0,
    book: {},
    comments:[]
  },
  onShareAppMessage: function () {
  },
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },


  //获取书籍详情
  getBookDetail(callback) {
    let { id } = this.data;
    let self = this;
    fetch.get(`api/book-info/${id}`, {}, false).then((data) => {
      data.rating.score=Math.ceil(data.rating.score/2)+'.0';
      data.rating.count=data.rating.count>10000?(data.rating.count/10000).toFixed(2)+'万':data.rating.count;
      data.wordCount=data.wordCount>10000?(data.wordCount/10000).toFixed(1)+'万':data.wordCount;
      console.log(data);
      self.setData({
        book: data,
        starId: data.rating.score
      })
      callback == null ? function () { } : callback();
    }).catch((err) => {
      console.log(err);
      callback == null ? function () { } : callback();
    })
  },
  //获取书籍评论
  getBookComments() {
    let { id } = this.data;
    let self = this;
    fetch.get(`api/post/review/by-book?book=${id}&sort=created&start=0&limit=10`,{}, false).then((data) => {
      // console.log(data);
      let imageServer = config.imageServer;//"http://statics.zhuishushenqi.com";
      data.reviews.forEach((item)=>{
        let temp = item.author.activityAvatar;
        let temp2 = item.author.avatar;
        item.author.activityAvatar = `${imageServer}${temp}`;
        item.author.avatar = `${imageServer}${temp2}`;
      })
      self.setData({
        comments: data.reviews
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  onLoad: function (options) {
    let { id } = options;
    this.setData({
      id
    })
    this.getBookDetail();
    this.getBookComments();
  }
})
