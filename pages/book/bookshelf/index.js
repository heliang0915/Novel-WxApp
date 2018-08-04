/**
 * 书架列表页面
 */
//获取应用实例
let  app = getApp()
let fetch=require("../../../utils/fetch.js");
let config = require("../../../config.js");
let { getShelfBooksIds, removeStorageIds}=require('../../../utils/util')
Page({
  data: {
     list:[],
     bookSelect:{},
     isSelectAll:false, //是否选中
     isEdit:false //是否编辑
  },
  onReachBottom:function(){},
  onPullDownRefresh:function(){},
  // 删除
  deleteBook(event){
    let { bookSelect} = this.data;
    let _this=this;
    wx.showModal({
      title: '提示',
      content: '确认删除所选书籍吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定' + Object.keys(bookSelect))
          let ids = Object.keys(bookSelect).toString();
          removeStorageIds(config.storage.shelfList, ids).then(({ ShelfList, openId})=>{
              _this.setData({
                isEdit: false //是否编辑
              })
            _this.initBookShelf();
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获取加入书架书籍 
  getShelfBooks(list){
      let _this=this;
      if(list.length){
        list=list.toString();
        let url=`wx/getShelfBooks/${list}`;
         fetch.get(url, false).then((data) => {
              _this.setData({
                list:data
              });
         });
      }else{
        _this.setData({
          list
        });
      }
  },
  //选中书籍
  selectBook(event){
    let dataset = event.currentTarget.dataset;
    let { id } = dataset;
    let { bookSelect, list } = this.data;
    let isInList = bookSelect[id];
    let isSelectAll=false;
    if (isInList){
       delete bookSelect[id]
    }else{
      bookSelect[id] = id;
    }
    if (Object.keys(bookSelect).length==list.length){
      isSelectAll=true;
    }else{
      isSelectAll = false;
    }
    this.setData({
      bookSelect,
      isSelectAll
    })
  },
  goToBookDetail(e){
      app.gotoDetail(e);
  },
  //封面点击动作
  clickBook(e){
    let { isEdit}=this.data;
    isEdit == true ? this.selectBook(e) : this.goToBookDetail(e)
  },
  //全选动作
  selectAll(){
    let {isSelectAll}=this.data;
    let { bookSelect, list } = this.data;
    if (!isSelectAll){
        list.forEach((item)=>{
          bookSelect[item._id]=item._id;
        })
     }else{
        list.forEach((item) => {
          delete bookSelect[item._id];
        })
     }
    this.setData({
      isSelectAll: !isSelectAll,
      bookSelect
    })
  },
  //进入编辑状态此时不能响应点击进入详情页事件
  inEdit(){
    this.setData({
       isEdit:true
    })
  },
  onShow:function(){
    this.initBookShelf();
  },
  
  initBookShelf(){
    let _this = this;
    getShelfBooksIds().then(({ ShelfList, openId }) => {
      _this.getShelfBooks(ShelfList);
    }).catch((err) => {
      _this.getShelfBooks([]);
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
