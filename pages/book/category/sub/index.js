//二级分类页
//获取应用实例
let  app = getApp()
let fetch = require("../../../../utils/fetch.js");
Page({
  data: {
    con1: [{ hot: '热门' }, { new: '新书' }, { reputation: '好评' }, { over: '完结' }, { monthly:'VIP'}],
    title:'',
    type:'hot',
    gender:'male',
    minor:'',
    loaded:false,
    mins:[], 
    bookList:[]
  },
  //分享
  onShareAppMessage: function () {
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
  //获取子分类
  getSubCategory(){
    let url = `api/sub-categories`
    let self=this;
    let { gender,title}=this.data;
    fetch.get(url, false).then((data) => {
      let ary = data[gender];
      let mins=[];
      mins.push('');
      for(let item of ary){
        if (item.major == title){
          mins=mins.concat(item.mins);
          break;
        }
      }
      mins=mins.slice(0,5);
      self.setData({
        mins
      })
      // console.log(data);
    });
  },
  //获取分类下书籍
  getBooks(){
    let { title, type, gender, minor}=this.data;
    let major = title;
    let self=this;
    let url=`api/category-info?gender=${gender}&type=${type}&major=${major}&minor=${minor}&start=0&limit=20`;
    url=encodeURI(url);
    this.setData({
      loaded:false
    })
    fetch.get(url, false).then((data) => {
      let {books}=data;
      books.forEach((item)=>{
          let cover=item.cover;
          let shortIntro = item.shortIntro;
          item.shortIntro=shortIntro.length > 30 ? shortIntro.substr(0, 30) + '...' : shortIntro
          cover = decodeURIComponent(cover.replace('/agent/', ''));
          item.cover =cover;
      })
      self.setData({
        bookList:books,
        loaded: true
      })
    });
  },
  //上拉刷新
  onPullDownRefresh:function(){
    console.log("onPullDownRefresh....");
    wx.hideNavigationBarLoading() //完成停止加载
  },
  
  //改变
  changeCondation(event){
    let dataset = event.currentTarget.dataset;
    let { min, type } = dataset;
    if (min!=null){
      this.setData({
        minor:min
      })
     }
    if (type!=null){
      this.setData({
        type
      })
     }

    this.getBooks();
    // console.log(min);
    // console.log(type);
  },
  onLoad: function (options) {
    let { title,gender}= options;
    this.setData({
      title,
      gender
      
    })
    wx.setNavigationBarTitle({
      title
    })
    this.getSubCategory();
    this.getBooks();
  }
})
