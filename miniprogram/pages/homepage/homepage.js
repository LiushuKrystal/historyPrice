// miniprogram/pages/a_homepage/homepage.js
const moment = require('../../utils/moment.min.js');
var app=getApp();
Component({
  data:{
    input:'',
    startdate:'',//默认是三个月前
    enddate:'',//默认是今天，交给后端判断是否是交易日
    frequency:'d',
    adjustFlag:3,
    searchHistory:[],
  },
pageLifetimes:{
  show:function(){
    //组件所在页面显示的时候触发
    //console.log('homepage.js attached');
    let enddate=new Date();
    console.log(enddate);
    this.data.enddate=moment(enddate).format('YYYY-MM-DD');
    this.data.startdate=moment(enddate).add(-3,'months').format('YYYY-MM-DD');
    console.log(this.data.startdate);
    console.log(this.data.enddate);
    let q="history_list";
    let historyList=[];
    try{
     historyList=wx.getStorageSync(q);
     }catch(e){
      console.log(e);
    }
    if(historyList.length!=0){
      console.log('history_list不是空')
      this.setData({
        searchHistory:historyList
      })
     }
     else{
      console.log('history_list是空')
       try{
        wx.setStorage({
          data:[],
          key: 'history_list',
        })
       }catch(e){
         console.log(e);
       }
     }
  }
},
methods:{
    clearHistory:function(){
      this.setData({
        searchHistory:[],
      })
      try{//将缓存也清理掉,history_list键保留，内容清空
        wx.setStorage({
          data: [],
          key: 'history_list',
        })
      }catch(e){
        console.log(e);
      }
    },
    onChangeInput:function(e){
      var inputvalue=e.detail.value.input==undefined?e.detail.value:e.detail.value.input;
      this.setData({
        input:inputvalue
      })
    },
    checkField:function(){
      let that=this;
      let inputVal=that.data.input;
      if(inputVal==='') return false;
      else return true;
    },
    onSubmit:function(e){
     let that=this;
     if(!that.checkField()) return;
     /*这里为什么要对参数进行URL编码？搜索关键词可能不是股票代码而是股票名，也就是中文，不包括在US-ASCII字符集里面，所以需要编码*/
     let _url='/pages/detailComponent/detailComponent'+'?'+'searchKey='+encodeURIComponent(that.data.input)+'&startDate='+this.data.startdate+'&endDate='+this.data.enddate+'&frequency='+this.data.frequency+'&adjustFlag='+this.data.adjustFlag;
     console.log(_url);
     wx.navigateTo({
       url:_url
     })
    },
    onSubmitFromHistory(e){
      let idx=e.currentTarget.dataset.index;
      console.log(idx);
      if(idx>=0){
        let content=wx.getStorageSync('history_list');
        let _url='/pages/detailComponent/detailComponent'+'?'+'searchKey='+encodeURIComponent(content[idx])+'&startDate='+this.data.startdate+'&endDate='+this.data.enddate+'&frequency='+this.data.frequency+'&adjustFlag='+this.data.adjustFlag;
        console.log(_url);
        wx.navigateTo({
          url:_url
        })
      }
    }
 }})
 