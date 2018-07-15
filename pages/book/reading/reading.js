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
      id:'',
      title:'',
      chapterIndex:0, //章节索引
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
  onReachBottom:function(){
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //防止滚动目录页面 后边和页面也跟着动
  catalogMove(event){

  },
  changeFontSizeSilder(e){
    let {value} = e.detail;
    console.log(value);
    this.setData({
      curFont: value
    })
    console.log(`发生change事件，携带值为`, e.detail.value)
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
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff'
    // });
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
  getBookSource: function () {
    let self=this;
    let { id, sourceSel } = this.data;
    fetch.get(`api/book-sources?view=summary&book=${id}`, true).then((data) => {
      let sources = data;
      self.setData({
        sources:data
      })
      
      console.log(sources);
      self.getBookChapters(sources[0], sourceSel);
      // console.log(books)
    })
  },
  //获取章节list
  getBookChapters: function (source, index) {
    let { id,link } = this.data;
    this.setData({
      chapters :[],
      sourceSel:index
    })
    let { _id } =source
    let self = this;
    fetch.get(`api/book-chapters/${_id}`,true).then((data) => {
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
    })
  },
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
    let { chapterIndex, chapters } = this.data;
    if (chapterIndex < 1) {
      wx.showToast({
        title: '已经是第一章了',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    chapterIndex--;
    this.gotoPage(null,chapterIndex);
  },
  nextPage() {
    let { chapterIndex, chapters } = this.data;
    if (chapterIndex >= chapters.length - 1) {
      wx.showToast({
        title: '已经是最后一章了',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    chapterIndex++;
    this.gotoPage(null,chapterIndex);
  },
  // 根据索引去指定章节
  gotoPage(event,chapterIndex){
    let self = this;
    if (event){
      let dataset = event.currentTarget.dataset;
      let { indx} = dataset;
      chapterIndex = indx;
   }
    console.log("chapterIndex:::" + chapterIndex);
    let { chapters}=this.data;
    let chapter= chapters[chapterIndex];
    let { link } = chapter;
    this.setData({
      link,
      showtoolbar: false,
      showcatalog: false,
      chapterIndex
    })

   
    this.getBookContent(()=>{
      self.setData({
        scrollTop: 0
      })
    });
    // this.goToReading(link, chapterIndex);
  },
  //去目录页
  gotoCatalog(event){
    let { showcatalog}=this.data;
    this.setData({
      showcatalog: !showcatalog
    })
    // let dataset = event.currentTarget.dataset;
    // let { id ,title} = dataset;
    // wx.navigateTo({
    //   url: `/pages/book/catalog/catalog?id=${id}&title=${title}`,
    //   success: function () {
    //     console.log("跳转成功");
    //   },
    //   fail: function (e) {
    //     console.log("调用失败...." + JSON.stringify(e));
    //   }
    // });
  },
  onLoad: function (options) {
    let { id, title, link, indx} = options;
    let { curFont, fontColor, curBg}=this.data;
    let w = (curFont - minFontSize)*unit;
    let windowHeight=0;
    let self=this;


    console.log("w::::"+w);
    console.log("unit::::" + unit);
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
    console.log(link);
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
        self.getBookSource();
      }
    })
  }
})
