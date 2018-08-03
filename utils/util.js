

let config=require("../config");
let {storage}=config;
let {shelfList:shelfListInfo,openid}=storage;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString()
  return n[1]
    ? n
    : '0' + n
}

function getDateDiff(dateTimeStamp) {
  var result = '';
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var week = day * 7;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / week;
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

//获取Storage中的值
function getStorage(key) {
  return new Promise(function(resolve, reject) {
    wx.getStorage({
      key,
      success: function(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}
//获取加入书架的书籍
function getShelfBooksIds(){
    return new Promise(function(resolve, reject) {
      getStorage(openid).then((openId)=>{
          getStorage(shelfListInfo).then((data)=>{
            let obj=data;
            let ShelfList=obj[openId];
              resolve({ShelfList,openId});
          }).catch((err)=>{
              reject({err,openId})
          })
      }).catch((err)=>{
         reject({err,openId});
      });
    });
}
module.exports = {
  formatTime: formatTime,
  getDateDiff: getDateDiff,
  getStorage,
  getShelfBooksIds
}
