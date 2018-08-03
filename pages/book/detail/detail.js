//detail.js
//获取应用实例
let  app = getApp()
let fetch=require("../../../utils/fetch.js");
let util = require("../../../utils/util.js");
let config = require("../../../config.js");
let {getStorage,getShelfBooksIds}=util;

let {storage}=config;
let {shelfList:key,openid}=storage;
// let key=config.storageKey.shelfListInfo;
// let openId=config.storageKey.openid;
Page({
  data: {
    golds: [1,2,3,4,5], //分数
    empty_star: '../../../images/no-star.png',
    full_star: '../../../images/full-star.png',
    starId:0,
    id: 0,
    book: {},
    comments:[],
    recommends:[],
    isAdd:false //默认没有加入书架
  },
  onShareAppMessage: function () {
  },
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //获取章节list
  getBookChapters: function (source, index, page) {
    let { _id } = source
    fetch.get(`api/book-chapters/${_id}?page=1`, false).then((data) => { })
  },
  //获取书源
  getBookSource: function () {
    let self = this;
    let { id } = this.data;
    fetch.get(`api/book-sources?view=summary&book=${id}`, false).then((data) => {
      let sources = data;
      self.getBookChapters(sources[0], 0, 1, () => { });
    })
  },
  //检测数组中是否存在该书信息
  checkShelfs(bkIds,id){
    let isHas=false;
    for(let bkId of bkIds){
        if(bkId==id){
            isHas=true;
            break;
        }
    }
    return isHas;
  },
  //加入书架
  addShelf(event){
    let dataset = event.currentTarget.dataset;
    let { id } = dataset;
    let _this=this;
    let shelfListInfo={};
    getShelfBooksIds().then(({ShelfList,openId})=>{
      if(ShelfList){
          if(!_this.checkShelfs(ShelfList,id)){
              ShelfList.push(id);
          }
      }else{
        let ShelfList=[];
        ShelfList.push(id);
      }
      shelfListInfo[openId]=ShelfList;
      wx.setStorage({
        key:key,
        data:shelfListInfo
      })
      _this.setData({
         isAdd:true
      })
    }).catch(({err,openId})=>{
      let _this=this;
      let ShelfList=[];
      ShelfList.push(id);
      shelfListInfo[openId]=ShelfList;
      wx.setStorage({
        key,
        data:shelfListInfo
      })
      _this.setData({
         isAdd:true
      })
    })
    // getStorage(openId).then((openid)=>{
    //     getStorage(key).then((data)=>{
    //       let obj=JSON.parse(data);
    //       let ShelfList=obj[openid];
    //       if(ShelfList){
    //           if(!_this.checkShelfs(ShelfList,id)){
    //               ShelfList.push(id);
    //           }
    //       }else{
    //         let ShelfList=[];
    //         ShelfList.push(id);
    //       }
    //       shelfListInfo[openid]=ShelfList;
    //       wx.setStorage({
    //         key:key,
    //         data:JSON.stringify(shelfListInfo)
    //       })
    //       _this.setData({
    //          isAdd:true
    //       })
    //     }).catch((e)=>{
    //       let _this=this;
    //       let ShelfList=[];
    //       ShelfList.push(id);
    //       shelfListInfo[openid]=ShelfList;
    //       wx.setStorage({
    //         key,
    //         data:JSON.stringify(shelfListInfo)
    //       })
    //       _this.setData({
    //          isAdd:true
    //       })
    //     })
    // });
  },
  //获取加入书架状态
  isAddShelf(callback){
    let _this=this;
    let { id } = this.data;
    getShelfBooksIds().then((ShelfList)=>{
        if(ShelfList){
          callback(_this.checkShelfs(ShelfList,id));
        }else{
           callback(false)
        }
      }).catch((e)=>{
          callback(false)
    })

  },
  //获取书籍详情
  getBookDetail() {
    let { id } = this.data;
    let self = this;
    fetch.get(`api/book-info/${id}`, false).then((data) => {
      data.rating.score=Math.ceil(data.rating.score/2)+'.0';
      data.rating.count=data.rating.count>10000?(data.rating.count/10000).toFixed(2)+'万':data.rating.count;
      data.wordCount=data.wordCount>10000?(data.wordCount/10000).toFixed(1)+'万':data.wordCount;
      data.updated = util.getDateDiff(new Date(data.updated));
      self.setData({
        book: data,
        starId: data.rating.score
      })
      setTimeout(()=>{
        //预加载一下书源信息
        self.getBookSource();
      },100)
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
    let self=this;
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
    //获取是否加入书架
    this.isAddShelf((isAdd)=>{
      console.log(isAdd);
      self.setData({
        isAdd
      })
    })
  }
})
