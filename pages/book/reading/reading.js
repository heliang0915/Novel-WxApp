//detail.js
//获取应用实例
let  app = getApp()
let fetch = require("../../../utils/fetch.js");
let util = require("../../../utils/util.js");
let config = require("../../../config.js");
let { maxFontSize, minFontSize } = config.toolbar.fontSize;
//单位量
let unit = 100/(maxFontSize - minFontSize);
Page({
  data: {
      pageAry: [], //目录分页
      index:0, //当前页数
      id:'',
      title:'',
      chapterIndex:0, //章节索引
      realNum:0,
      chapters:[],
      sources:[],
      sourceSel:0,
      scrollTop:0,
      windowHeight:0,
      w: 0, //进度条比例
      curFont:36,//默认字体
      curBg:'#F2EBD9',//背景色
      activeId:'default',
      fontColor:'#000000',
      link:'', //章节链接
      chapter:'',//章节内容
      showtoolbar:false,
      showcatalog: false
  },
  onShareAppMessage: function () {
  },
  bindPickerChange: function (e,index,callback) {
    let { sources, sourceSel } = this.data;
    let value=null;
    if (e){
      value = e.detail.value;
    }
    if(index!=null){
      value=index;
    }
    this.setData({
      index: value
    })
    let page = parseInt(value)+1;
    this.getBookChapters(sources[0], sourceSel, page, callback);

  },
  //获取分页信息
  getCatalogPages(isShow){
    let { sources}=this.data;
    let isLoading=isShow==null?true:false;
    let { _id } = sources[0];
    let self=this;
    fetch.get(`wx/chapterPages/${_id}`, isLoading).then((data) => {
      self.setData({
        pageAry: data
      })
    })
  },
  backReading(){
     this.setData({
       showtoolbar: false,
       showcatalog: false
     })
  },
  
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //防止滚动目录页面 后边和页面也跟着动
  catalogMove(event){
  },
  changeFontSieSilder(e){
    let {value} = e.detail;
    console.log(value);
    this.setData({
      curFont: value
    })
    // console.log(`发生change事件，携带值为`, e.detail.value)
  },
  // 改变背景
  changeBg(event){
    let {target} = event;
    let { id} = target;
    let { curBg, fontColor, activeId}=this.data;
    if (id=="moon"){
      curBg ="#1d1d1f";
      fontColor ="#ffffff";
    }else if(id=="eye"){
      curBg = "#C7EDCC";
      fontColor = "#000000";
    }else{
      curBg = "#F2EBD9";
      fontColor = "#000000";
    }
    activeId = id
    this.setData({
      curBg,
      fontColor,
      activeId
    })
    wx.setNavigationBarColor({
      frontColor: fontColor,
      backgroundColor: curBg,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  //获取书源
  getBookSource: function (isShow) {
    let isLoading=true;
    if (isShow!=null){
      isLoading = isShow;
    }
    let self=this;
    let { id, sourceSel } = this.data;
    fetch.get(`api/book-sources?view=summary&book=${id}`, isLoading).then((data) => {
      let sources = data;
      self.setData({
        sources:data
      })
      self.getBookChapters(sources[0], sourceSel,1,()=>{});
    })
  },
  //获取章节list
  getBookChapters: function (source, index,page,callback) {
    let { id,link } = this.data;
    page=page==null?1:page;
    this.setData({
      chapters :[],
      sourceSel:index
    })
    let { _id } =source
    let self = this;
    fetch.get(`api/book-chapters/${_id}?page=${page}`, callback == null ? true:false).then((data) => {
      let chapters = data.chapters;
      this.setData({
        chapters
      })
      if (link==null||link==''){
        this.setData({
          link: chapters[0].link
        })
      }
      self.getBookContent();
      self.getCatalogPages(false);
      callback == null ? function () { } : callback();
    })
  },
  //获取内容
  getBookContent: function (callback) {
    let self = this;
    let {link}=this.data;
    fetch.get(`api/chapters/${encodeURIComponent(link)}`, true).then((data) => {
      let chapter = data.chapter;
      let reg='\n\n';
      let ary = chapter.cpContent.split(reg);
      let newAry=[];
      ary.forEach((item)=>{
        item = item.replace('　　', '');
        newAry.push(item);
      })
      chapter.cpContentAry = newAry;
      this.setData({
        chapter
      })
      callback == null ? function () {} : callback();
    })
  },

  showToolbar(){
    let {showtoolbar}=this.data;
    this.setData({
        showtoolbar: !showtoolbar
    })
  },
  changeFontSize(event){
    let dataset = event.currentTarget.dataset;
    let {dir}=dataset;
    let {curFont}=this.data;
    if(dir=="add"){
      curFont = curFont+1 > maxFontSize ? maxFontSize : curFont+1;
    }else{
      curFont=curFont-1 < minFontSize ? minFontSize:curFont-1;
    }
    let w = (curFont - minFontSize) * unit;
    console.log(curFont);
    console.log(w);
    this.setData({
      curFont,
      w
    })
  },
  prePage(){
    let self = this;
    let { chapterIndex, chapters, index } = this.data;
    let isOver=false; //是否要翻页
    if (chapterIndex < 1) {
        if(index<=0){
          wx.showToast({
            title: '已经是第一章了',
            icon: 'none',
            duration: 2000
          })
          return;
        }else{
          index--;
          isOver=true;
          chapterIndex=100;
          self.setData({
            index
          })
        }
    }
    chapterIndex--;
    if (isOver){
      this.bindPickerChange(null, index, () => {
        setTimeout(() => {
          self.gotoPage(null, chapterIndex);
        }, 100)
      });
    }else{
      self.gotoPage(null, chapterIndex);
    }
  },
  nextPage() {
    let self=this;
    let isOver = false; //是否要翻页
    let { chapterIndex, chapters, pageAry, index} = this.data;
    if (chapterIndex >= chapters.length - 1) {
      if (index >= pageAry.length) {
        wx.showToast({
          title: '已经是最后一章了',
          icon: 'none',
          duration: 2000
        })
        return;

      }else{
        index++;
        isOver=true;
        chapterIndex=-1;
        self.setData({
          index
        })
      }
    }
    chapterIndex++;
    if (isOver) {
      this.bindPickerChange(null, index, () => {
        self.gotoPage(null, chapterIndex);
      });
    }else{
      self.gotoPage(null, chapterIndex);
    }
  },
  changeFontSizeSilder(e) {
    let { value } = e.detail;
    console.log(value);
    this.setData({
      curFont: value
    })
  },
  // 根据索引去指定章节
  gotoPage(event, chapterIndex){
    let self = this;
    let {index}=this.data;
    if (event){
      let dataset = event.currentTarget.dataset;
      let { indx} = dataset;
      chapterIndex = indx;
   }
    let realNum= chapterIndex + (100 * (index));
    this.setData({
     realNum
    })
    console.log("realNum:::::::" + realNum);
    console.log("chapterIndex:::" + chapterIndex);
    let { chapters}=this.data;
    let chapter = chapters[chapterIndex];
    let { link } = chapter;
    this.setData({
      link,
      showtoolbar: false,
      showcatalog: false,
      chapterIndex,
      index
    })
    this.getBookContent(()=>{
      setTimeout(()=>{
        self.setData({
          scrollTop: 0
        })
      },100)
    });
  },
  //去目录页
  gotoCatalog(event){
    let { showcatalog}=this.data;
    this.setData({
      showcatalog: !showcatalog,
      showtoolbar: false
    })
  },
  onLoad: function (options) {
    let { id, title, link, indx} = options;
    let { curFont, fontColor, curBg}=this.data;
    let w = (curFont - minFontSize)*unit;
    let windowHeight=0;
    let self=this;

    wx.setNavigationBarTitle({
      title
    })
    wx.setNavigationBarColor({
      frontColor: fontColor,
      backgroundColor: curBg,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      },
      success(){
      },
      fail(err){
      console.log(err);
      }
    })
    link=link == null ? '' : link;
    // console.log(link);
    //获取设备信息
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          id,
          w,
          title,
          link,
          chapterIndex: indx == null ? 0 : indx,
          windowHeight: res.windowHeight
        })
        self.getBookSource(false);
      }
    })
  }
})
