let str = "123中文  ";
let rgx = /.*[\u4e00-\u9Fd5]+.*$/;
var reg = new RegExp(".*[\\u4E00-\\u9FFF]+.*", "g");
if (rgx.test(str)) {
  console.log(true);
} else console.log(false);

if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
  console.log("不能含有汉字！");
} else console.log("pass");