var moment = require('moment');
var fs = require('fs');

function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {
    while (currentDate.format('dddd') == 'Sunday' || currentDate.format('dddd') == 'Saturday') { //当目前的日期是休息日
      currentDate = moment(currentDate).add(1, 'days');
    }
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

function randomNum(minNum, maxNum) {
  return (Math.random() * (maxNum - minNum) + minNum).toFixed(2);
}

var dateArray = getDates('2017-10-29', '2020-10-29');
fs.writeFile('dates.txt', dateArray, function(error, result) {
  if (error) {
    console.log(error);
  }
})

var obj = {};
for (var i = 0; i < dateArray.length; i++) {
  obj[dateArray[i]] = randomNum(12, 15); //随机数取值范围不包含15
}

var objstring = JSON.stringify(obj);
fs.writeFile("stockdata.json", objstring, function(error, result) {
  if (error) {
    console.log(error);
  }
});