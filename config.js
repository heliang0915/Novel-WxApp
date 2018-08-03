
let config = {
  // api:"https://novel.blogapi.top/",
  api: "http://10.10.10.224:2222/",
  // api: "http://192.168.0.101:2222/",
  imageServer: "http://statics.zhuishushenqi.com",
  toolbar:{
    fontSize:{
      maxFontSize:60,
      minFontSize: 30,
    }
  },
  //storageKey
  storage:{
    shelfList:"shelfListInfo",
    openid:"openid"
  }
 }

module.exports=config;
