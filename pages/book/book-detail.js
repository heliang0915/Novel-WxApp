//index.js
//获取应用实例
let  app = getApp()
let fetch=require("../../utils/fetch.js");

Page({
  data: {
     id:0,
     book:{}
  },
  //获取书籍详情
  getBookDetail(callback){
      let {id}=this.data;
      let self=this;
      fetch.get(`api/book-info/${id}`,{},false).then((data) => {
          self.setData({
            book: data
          })
          callback == null ? function(){}:callback();
      }).catch((err) => {
          console.log(err);
          callback == null ? function () { } : callback();
      })
  },
  //获取书籍评论
  getBookComments(){
    
  },
  onLoad: function (options) {
    let {id}=options;
    this.setData({
        id
    })
    this.getBookDetail();
  }
})
