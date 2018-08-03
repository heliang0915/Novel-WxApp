//index.js
//获取应用实例
let  app = getApp()

let fetch=require("../../../utils/fetch.js");
let {getShelfBooksIds}=require('../../../utils/util')
Page({
  data: {
     list:[],
     isSelectAll:false, //是否选中
     isEdit:false
  },
  onReachBottom:function(){},
  onPullDownRefresh:function(){},

  getShelfBooks(list){
      // let {list}=this.data;
      let _this=this;
      list=list.toString();
      let url=`wx/getShelfBooks/${list}`;
       fetch.get(url, false).then((data) => {
            _this.setData({
              list:data
            });
       });
  },
  goToBookDetail(e){
      app.gotoDetail(e);
  },
  selectAll(){
    let {isSelectAll}=this.data;
     this.setData({
        isSelectAll:!isSelectAll
     })
     console.log(isSelectAll);
  },
  inEdit(){
    this.setData({
       isEdit:true
    })
    console.log('inEdit..........');
  },
  onShow:function(){
    let _this=this;
    getShelfBooksIds().then(({ShelfList,openId})=>{
       _this.getShelfBooks(ShelfList);
    })
  },
  onLoad: function () {
    // this.getBlogList(1);
    let _this=this;
    wx.setNavigationBarTitle({
      title: "书架"
    })
  }
})
