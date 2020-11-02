// miniprogram/pages/a_homepage/homepage.js
var app=getApp();
Component({
  data:{
    input:'',
    searchHistory:[],
  },
pageLifetimes:{
  show:function(){
    //组件所在页面显示的时候触发
    console.log('homepage.js attached');
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
      try{//将缓存也清理掉
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
     let _url='/pages/detailComponent/detailComponent'+'?'+'searchKey='+encodeURIComponent(that.data.input);
     console.log(_url);
     wx.navigateTo({
       url:_url
     })
    }
 }})
 