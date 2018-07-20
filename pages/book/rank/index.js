//detail.js
//获取应用实例
let  app = getApp()
let fetch=require("../../../utils/fetch.js");
let util = require("../../../utils/util.js");
let config = require("../../../config.js");
Page({
  data: {
    padding: 32,
    pixelRatio: 2,
    screenHeight: 100,
    loaded:false,
    RankCategoriesList:{},//分类
    leftList:[],
    selCate:0,
    books:[],
    selChannel:''
  },
  //事件处理函数
  gotoDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let { id, title } = dataset;
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${id}&title=${title}`,
      success: function () {
        console.log("跳转成功");
      },
      fail: function (e) {
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  getBookList: function (event) {
    let self = this;
    let { leftList}=this.data;
    let id = leftList[0]._id;
    let index=0;
    if (event){
      let dataset = event.currentTarget.dataset;
      id = dataset.id;
      index=dataset.index;
    }
    self.setData({
      loaded: false,
      selCate: index
    })
    fetch.get(`api/rank/${id}`, false).then((data) => {
      let {books} = data.ranking
      console.log(data);
      // delete data['ok'];
      // delete data['picture'];
      // delete data['press'];
      // for (let key in data) {
      //   let ary = data[key];
      books.forEach((item) => {
          // item.name = item.name == "古代言情" ? "古言" : item.name;
          // item.name = item.name == "现代言情" ? "现言" : item.name;
          // item.name = item.name == "青春校园" ? "校园" : item.name;
          // item.name = item.name == "玄幻奇幻" ? "奇幻" : item.name;
          // item.name = item.name == "武侠仙侠" ? "仙侠" : item.name;
          // item.name = item.name == "游戏竞技" ? "游戏" : item.name;
          // item.name = item.name == "悬疑灵异" ? "灵异" : item.name;
         let shortIntro = item.shortIntro;
         item.shortIntro = shortIntro.length > 26 ? shortIntro.substr(0, 26) + '...' : shortIntro
         let cover = item.cover;
          cover = decodeURIComponent(cover.replace('/agent/', ''));
          item.cover = cover;
      });
      console.log(books);
      // }
      self.setData({
        books: books,
        loaded:true
      })
    }).catch((err) => {
      console.log(err);
    })
  },

  //根据男生 女生切换左侧榜单
  goToMetail(event) {
    let id = 'male';
    if (event){
      let dataset = event.currentTarget.dataset;
      id = dataset.id;
    }
    let { RankCategoriesList}=this.data;
    let scrollTop = 0;
    let leftList = RankCategoriesList[id];
    leftList = leftList.slice(0,7)
    this.setData({
      scrollTop,
      selChannel:id,
      leftList
    })
    this.getBookList();
  },
  //获取男生女生排行 左侧标题
  getRankCategoriesList: function (page, callback, type, major) {
    let self = this;
    fetch.get("api/rank-category", true).then((data) => {
      delete data['epub'];
      delete data['ok'];
      delete data['picture'];
      this.setData({
        RankCategoriesList:data
      }) 
      self.goToMetail();
     
      // console.log(data);
    }).catch((err) => {
      console.log(err);
    })
  },
  onShareAppMessage: function () {
  },
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onLoad: function (options) {
    let self=this;
    wx.setNavigationBarTitle({
      title:'排行'
    })
    wx.getSystemInfo({
      success: function (res) {
        let { pixelRatio, screenHeight } = res;
        self.setData({
          pixelRatio,
          padding: pixelRatio == 2 ? 12 : 20,
          screenHeight
        })
      }
    })
    this.getRankCategoriesList();
   
  }
})
