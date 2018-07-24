// pages/book/finish/index.js
let fetch = require("../../../utils/fetch.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: {
      maleFreeList: [],
      femaleFreeList: []
    },
    loaded: false, //是否是加载完毕
    map: {
      "564eb878efe5b8e745508fde": "maleFreeList",
      "564eb8a9cf77e9b25056162d": "femaleFreeList",
    },
    categorys: {
      "男频免费": "564eb878efe5b8e745508fde",
      "女频免费": "564eb8a9cf77e9b25056162d"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "免费"
    })
    this.initList();
  },

  //获取分类下书籍
  getBooks(page, id) {
    let self = this;
    let url = `api/rank/${id}`;
    // url = encodeURI(url);
    this.setData({
      loaded: false
    })
    fetch.get(url, false).then((data) => {
      let { books } = data.ranking;
      books=books.splice(0,10);
      books.forEach((item) => {
        let cover = item.cover;
        let shortIntro = item.shortIntro;
        item.shortIntro = shortIntro.length > 30 ? shortIntro.substr(0, 30) + '...' : shortIntro
        cover = decodeURIComponent(cover.replace('/agent/', ''));
        item.cover = cover;
      })
      let { map, lists } = self.data;
      let key = map[id];
      let itemList = lists[key]
      itemList = books;
      lists[key] = itemList;

      // console.log(lists[key]);

      self.setData({
        lists,
        loaded: true
      })


    });
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
  initList: function () {
    let self = this;
    let { categorys } = this.data;
    for (let key in categorys) {
      // console.log(categorys[key]);
      this.getBooks(1, categorys[key], () => {
        counter++
        if (counter == Object.keys(categorys).length) {
          self.setData({
            loaded: true
          })
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})