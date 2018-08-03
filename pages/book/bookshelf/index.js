//index.js
//获取应用实例
let  app = getApp()

let fetch=require("../../../utils/fetch.js");
let {getShelfBooksIds}=require('../../../utils/util')
Page({
  data: {
     list:[]
  },
  onReachBottom:function(){},
  onPullDownRefresh:function(){},

  getShelfBooks(list){
      // let {list}=this.data;
      let _this=this;
      list=list.toString();
      let url=`wx/getShelfBooks/${list}`;
       fetch.get(url, false).then((data) => {
             // console.log(data);
            _this.setData({
              list:data
            });
       });
  },
  onLoad: function () {
    // this.getBlogList(1);
    let _this=this;
    wx.setNavigationBarTitle({
      title: "书架"
    })
    getShelfBooksIds().then(({ShelfList,openId})=>{
       // this.setData({
       //    list:ShelfList
       // })
       _this.getShelfBooks(ShelfList);
    })
  }
})
