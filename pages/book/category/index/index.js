//分类页
//获取应用实例
let  app = getApp()
let fetch=require("../../../../utils/fetch.js");
Page({
  data: {
    padding:32,
    pixelRatio:2,
    screenHeight:100,
    category: {},
    map: {
      male: "男生",
      female: "女生"
    }
  },
  //分享
  onShareAppMessage: function () {
  },
  //上拉刷新
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh....");
    wx.hideNavigationBarLoading() //完成停止加载
  },
  getCategoriesList: function (page, callback, type, major) {
    let self = this;
    fetch.get("api/categories",true).then((data) => {
      console.log(data);
      delete data['ok'];
      delete data['picture'];
      delete data['press'];
      for(let key in data){
        let ary=data[key];
        ary.forEach((item)=>{
            item.name=item.name == "古代言情" ? "古言" : item.name;
            item.name = item.name == "现代言情" ? "现言" : item.name;
            item.name = item.name == "青春校园" ? "校园" : item.name;
            item.name = item.name == "玄幻奇幻" ? "奇幻" : item.name;
            item.name = item.name == "武侠仙侠" ? "仙侠" : item.name;
            item.name = item.name == "游戏竞技" ? "游戏" : item.name;
            item.name = item.name == "悬疑灵异" ? "灵异" : item.name;

            let bookCover = item.bookCover;
            let newAry=[];
            bookCover.forEach((cover) => {
              cover = decodeURIComponent(cover.replace('/agent/', ''));
              console.log(cover);
              newAry.push(cover);
            })
            item.bookCover = newAry;
        })
      }
      self.setData({
        category: data
      })
    }).catch((err) => {
      console.log(err);
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title:"分类"
    })
    let sefl=this;
    wx.getSystemInfo({
      success: function (res) {
        let { pixelRatio, screenHeight}=res;
        sefl.setData({
          pixelRatio,
          padding: pixelRatio==2?30:34,
          screenHeight
        })
      }
    })
    this.getCategoriesList();
  }
})
