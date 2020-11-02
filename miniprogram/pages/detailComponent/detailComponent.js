// pages/detailComponent/detailComponent.js
import * as echarts from '../../ec-canvas/echarts';
const moment = require('../../utils/moment.min.js');
function getOption(paramdataset){
  //定义图表
  const length=paramdataset.date.length;
  let options={
    title:{
      show:false,
    },
    dataset:{
      source: paramdataset
    },
    grid:{
      //show:true
      left:10,
      top:10,
      height:'80%',
      width:'88%',
      containLabel:true,
    },
    tooltip:{
      show:true,
      trigger:'axis',//触发器是axis，鼠标停在点上会显示坐标轴上的信息，也就是数据点的信息。
      axisPointer:{
        type:'cross',
      },
      backgroundColor:'rgba(5,5,5,0.8)',
      borderWidth:1,
      borderColor:'#000',
      padding:[5,10],
      textStyle:{
        color:'#fff'
      },
      formatter:function(params){
        return params[0].name+':'+params[0].data[1];//可能有多个series，params的一个维度代表一个series，这里指第一个series的x轴值和y轴值
      }
    },
    xAxis:{
      type:'category',
      axisLabel:{
        formatter:function(value){
          let d=value.split('-');
          if(moment(paramdataset.date[0]).format('YYYY')==moment(paramdataset.date[length-1]).format('YYYY')){
            d=d[1]+'-'+d[2]//只保留月-日
          }
          else d=d[0]+'-'+d[1]+'-'+d[2];
          return d;
        },
        interval:parseInt((length-3)/2),
        showMaxLabel:true,
      },
      axisTick:{
        alignWithLabel:true,
        show:false
      },
    },
    yAxis:{
      type:'value',
      min:function(value){
        return Math.floor(value.min-5)
      },
      max:function(value){
        return Math.ceil(value.max+5)
      },
    },
    series:[{
      type:'line',
      smooth:true,
    }]
  }
  return options;
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec:{
      lazyLoad:true//置为true后可以延迟加载图表
    },
    searchKey:"",
    tabList:["近1月","近3月","近6月","近1年","近3年"],
    tabActive:0,
    item:{},//商品的价格list
    dataset:{
      date:[],
      price:[]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    timeTabClick:function(e){
      this.setData({
        tabActive:e.currentTarget.dataset.index
      });
      console.log(this.data.tabActive);
      let startdate='';
      let currentDate=new Date();
      switch(this.data.tabActive){
        case 0:
          startdate=moment(currentDate).add(-1,'months').format('YYYY-MM-DD');
          break;
        case 1:
          startdate=moment(currentDate).add(-3,'months').format('YYYY-MM-DD');
          break;
        case 2:
          startdate=moment(currentDate).add(-6,'months').format('YYYY-MM-DD');
          break;
        case 3:
          startdate=moment(currentDate).add(-1,'years').format('YYYY-MM-DD');
          break;
        case 4:
          startdate=moment(currentDate).add(-3,'years').format('YYYY-MM-DD');
          break;
      }
      console.log(startdate);
      this.changeView(startdate);//换一个开始日期来渲染图表
    },
    async changeView(startDate){
      //根据tab改变显示的日期，重新构建图表
      startDate=moment(startDate);
      while(startDate.format('dddd')=='Sunday'||startDate.format('dddd')=='Saturday'){
        startDate.add(1,'days');
      }
      let dataset={'date':[],'price':[]};
      let alldata=this.data.dataset;
      let dates=alldata.date;
      let prices=alldata.price;
      console.log(dates);
      for(var i=dates.length-1;moment(dates[i]).isAfter(startDate);i--){
        dataset.date.push(dates[i]);
        dataset.price.push(prices[i]);
      };
      dataset.date.reverse();
      dataset.price.reverse();
      console.log(dataset);
      let chart=await new Promise(resolve=>{
        //初始化图表组件
        //初始化方法：获取页面元素，用init方法初始化，返回一个定义好的chart
        this.echartComponent.init((canvas,width,height,dpr)=>{
          let ch=echarts.init(canvas,null,{
            width:width,
            height:height,
            devicePixelRatio:dpr,//像素
          })
          resolve(ch)
          return ch;
        })
      })
      this.chart=chart;
      //用构造的数据渲染图表
      this.chart.setOption(getOption(dataset));
    },
    async onLoad(options){
      wx.showLoading({
        title: '查询中...',
      })
      let that=this;
      if(options.searchKey){
        //从路径参数获取searchKey
        let searchKey=decodeURIComponent(options.searchKey);//解码url
        console.log(searchKey)
        that.setData({
          searchKey:searchKey
        })
      }
      else{
        console.log("error");
      }
    },
    async onReady(){
      //获取wxml页面的图表组件
      this.echartComponent=this.selectComponent('#mychart-dom-bar');
      //请求数据，渲染图表
      await this.renderResult();
      wx.hideLoading();
    },
    async spiderapi(){
      //请求爬虫数据接口
      let res=await new Promise((resolve,reject)=>wx.request({//箭头函数的this指向它的直接上层，这里是Promise实例对象
        //服务端地址
        url:'http://localhost:5000/',
        method:'POST',
        data:{
          searchKey:this.data.searchKey,//将传入的参数作为请求参数
        },
        success:res=>resolve(res),
        fail:err=>reject(err),
      }))
      console.log(res.data);
      return res;
    },
    constructDataFromSpider(res){
      if(res.data.code==0&&res.data.data.list_data!=[]){
        console.log('请求成功且返回数组不为空');
        //请求成功
        that.setData({
          item:res.data.data.list_data
        })
        let dataset=[];
        res.data.data.list_data.forEach(item=>{
          let array=[];
          array.push(item.date);
          array.push((item.trade_money/item.trade_num/100).toFixed(2));
          dataset.push(array);
        })
        dataset=dataset.reverse();
        console.log(dataset);
        return dataset;
    }
   },
    setHistoryList(){
        //将记录不重复的添加到历史记录表里
        let hl=wx.getStorageSync('history_list');
        if(hl){//任意对象，除了null以外转换成Boolean类型都应该是true
          let picked_in_hl=hl.some(item=>{
            return item===this.data.searchKey;
          })
          if(!picked_in_hl){
            console.log('进入set')
            console.log(that.data.searchKey);
            hl.push(that.data.searchKey);
            console.log('添加元素后的数组：');
            console.log(hl);
            try{
              wx.setStorage({
                data:hl,
                key: 'history_list',
              })
              let newhl=wx.getStorageSync('history_list');
              console.log(newhl);
            }catch(e){
              console.log(e);
            }
          }
        }
      else{
        //请求失败
        wx.navigateBack({
          delta: 1,
        })
      }
    },
    async renderResult(){
      let dataset=this.fetchLocal();//获取到符合格式要求的数组
      let that=this;

      let chart=await new Promise(resolve=>{
        //初始化图表组件
        //初始化方法：获取页面元素，用init方法初始化，返回一个定义好的chart
        that.echartComponent.init((canvas,width,height,dpr)=>{
          let ch=echarts.init(canvas,null,{
            width:width,
            height:height,
            devicePixelRatio:dpr,//像素
          })
          resolve(ch)
          return ch;
        })
      })
      that.chart=chart;
      //用构造的数据渲染图表
      that.chart.setOption(getOption(dataset));
    },
    fetchLocal(){
      let obj=wx.getFileSystemManager().readFileSync(wx.env.USER_DATA_PATH+'/stockdata.json','utf-8');//注意和readfile的区别，readfilesync是一个同步接口，参数是字符串而不是对象
      console.log(obj);
      let result={};
      if(obj){
        obj=JSON.parse(obj);
        let date=[];
        let price=[];
        for(let item in obj){
          date.push(item);
          price.push(obj[item]);
        }
        result['date']=date;
        result['price']=price;
      }
      console.log(result);
      this.data.dataset=result;
      return result;
    }
  }
})
