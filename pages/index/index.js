//index.js
//获取应用实例
let  app = getApp()
let fetch=require("../../utils/fetch.js");

var counter=0;
Page({
  data: {
    banners:[
      'https://i.zhulang.com/admin/bang/2018-07-09/5b42d8da6e978.jpg',
      'https://i.zhulang.com/admin/bang/2018-07-09/5b42d82d2ad29.jpg',
      'https://i.zhulang.com/admin/bang/2018-07-09/5b42d442223b2.jpg'
    ],
    lists:{
      hotList:[],
      hotRecommendList: [],
      femailHotRecommendList: [],
      femailEditorRecommendList: [],
    },
    loaded:false, //是否是加载完毕
    map:{
      "武侠": "hotList",
      "玄幻": "hotRecommendList",
      "同人": "femailHotRecommendList",
      "军事": "femailEditorRecommendList",
      "都市": "newBookList"
    },
    categorys:{
      "男频热推":"武侠",
      "热门推荐": "玄幻",
      "女频热销": "同人",
      "编辑推荐":"军事",
      "新书上架":"都市"
    },
    contentHeight: wx.getSystemInfoSync().windowHeight-160-56
  },
  //分享
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
  //上拉刷新
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh....");
    this.initList();
    wx.hideNavigationBarLoading() //完成停止加载
  },
  //事件处理函数
  gotoDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let {id}=dataset;
    wx.navigateTo({
      url: `/pages/book/detail?id=${id}`,
      success:function(){
        console.log("跳转成功");
      },
      fail:function(e){
        console.log("调用失败...." + JSON.stringify(e));
      }
    })
  },
  getHotList: function (page, callback, type, major){
    let self=this;
    fetch.get("api/category-info?gender=male&type=hot&major=" + major+"&minor=&start=0&limit=5",    {
      page: page==null?1:page,
      params: {}
    },false).then((data) => {
      let { map, lists}=self.data;
      let key=map[major];
      let itemList= lists[key]
      itemList = data.books;
      lists[key] = itemList;
      self.setData({
        lists
      })
      callback == null ? function(){}:callback();
    }).catch((err) => {
      console.log(err);
      callback == null ? function () { } : callback();
    })
  },
  initList:function(){
    let self=this;
    let { categorys } = this.data;
    for (let key in categorys) {
      // console.log(categorys[key]);
      this.getHotList(1, () => {
        counter++
        if (counter == Object.keys(categorys).length){
            self.setData({
                loaded:true
            })
        }
      }, null, categorys[key]);
    }
  },
  onLoad: function () {
    this.initList();
  }
})
