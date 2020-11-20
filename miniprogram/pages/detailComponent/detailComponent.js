// pages/detailComponent/detailComponent.js
import * as echarts from '../../ec-canvas/echarts';
const moment = require('../../utils/moment.min.js');
//计算MA值的函数
function calculateMA(dayCount,dataset){
  let result=[];
  for(var i=0,length=dataset.values.length;i<length;i++){
    if(i<dayCount-1){
      result.push('-');
      continue;
    }
    let sum=0;
    for(var j=0;j<dayCount;j++){
      sum+=parseFloat(dataset.values[i-j][1]);
    }
    result.push(sum/dayCount);
  }
  return result;
}
//echart为k线图规定了数据格式，是二维数组，四个值依次标识如下含义[open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
function getOption(dataset){
  //定义图表
  const length=dataset.values.length;
  const upColor='#ec0000';
  const upBorderColor = '#8A0000';
  const downColor = '#00da3c';
  const downBorderColor = '#008F28';

  let options={
    title:{
      show:false,
    },
    tooltip:{
      trigger:'axis',
      axisPointer:{
        type:'cross'
      }
    },
    legend:{
      data:['日K','MA5','MA10','MA20','MA30']
    },
    grid:{
      //show:true
      left:'10%',
      right:'10%',
      bottom:'15%'
    },
    xAxis:{
      type:'category',
      data:dataset.categoryData,
      boundaryGap:false,//设置成false，表示刻度不能仅作为分隔线，标签和数据点要和刻度线对齐
      axisLine:{onZero:false},//不用在另一个轴的0刻度线上（y轴没有0刻度）
      splitLine:{show:false},//类目轴默认不显示，数值轴默认显示
      min:'dataMin',
      max:'dataMax',//根据该轴上的数据的最大最小值设置坐标的最大最小值，类目轴也可以这样设置
      axisLabel:{
        formatter:function(value){
          let d=value.split('-');
          if(moment(dataset.categoryData[0]).format('YYYY')==moment(dataset.categoryData[length-1]).format('YYYY')){
            d=d[1]+'-'+d[2]//只保留月-日
          }
          else d=d[0]+'-'+d[1]+'-'+d[2];
          return d;
        },
        interval:parseInt((length-3)/2),
        showMaxLabel:true,
      },
      axisTick:{
        show:true
      },
    },
    yAxis:{
      type:'value',
      scale:true,//脱离0值比例，设置成true以后坐标轴不会强制包含0刻度，这里设置了min和max所以无效
      min:function(value){
        return (value.min-0.1).toFixed(1);
      },
      max:function(value){
        return (value.max+0.1).toFixed(1);
      },
      splitArea:{
        show:true
      }
    },
    dataZoom:[{
      type:'inside',
      end:100,//数据范围的百分比，可以通过定义start设置起始日期区间，但是可能和近1月有出入
    },
    {
      show:true,
      type:'slider',
      top:'90%',
      start:50,
      end:100
    }],
    series:[
      {
        name:"日K线",
        type:'candlestick',
        data:dataset.values,
        itemStyle:{
          color:upColor,
          color0:downColor,
          borderColor:upBorderColor,
          borderColor0:downBorderColor
        },
        markPoint:{
          symbolSize:40,
          label:{
            fontSize:9,
            formatter: function(param){
              return param!=null?param.value:'';
            }
          },
          data:[
            {
              name:'highest value',
              type:'max',
              valueDim:'highest'
            },
            {
              name:'lowest value',
              type:'min',
              valueDim:'lowest',
              itemStyle:{
                color:'rgb(41,60,85)'
              }
            },
            {
              name:'average value on close',
              type:'average',
              valueDim:'close',
              itemStyle:{
                color:'rgb(128,128,128)'
              }
            }
          ],
          tooltip:{
            formatter:function(param){
              return param.name+'<br>'+(param.data.coord||'');
            }
          }
        },
        markLine:{
          symbol:['none','none'],
          data:[
            [//数组第一项表示起点数据，第二项表示终点数据
              {
                name:'from lowest to highest',
                type:'min',
                valueDim:'lowest',
                symbol:'circle',
                symbolSize:10,
                label:{
                  show:false
                },
                emphasis:{
                  label:{
                    show:true
                  }
                }
              },
              {
                type:'max',
                valueDim:'highest',
                symbol:'circle',
                symbolSize:10,
                label:{
                  show:false
                },
                emphasis:{
                  label:{
                    show:true
                  }
                }
              }
            ],
            {
              name:'min line on close',
              type:'min',
              valueDim:'close'
            },
            {
              name:'max line on close',
              type:'max',
              valueDim:'close'
            }
          ]
        }
      },
      {
        name:'MA5',
        type:'line',
        data:calculateMA(5,dataset),
        smooth:true,
        lineStyle:{
          opacity:0.5
        }
      },
      {
        name:'MA10',
        type:'line',
        data:calculateMA(10,dataset),
        smooth:true,
        lineStyle:{
          opacity:0.5
        }
      },
      {
        name:'MA20',
        type:'line',
        data:calculateMA(20,dataset),
        smooth:true,
        lineStyle:{
          opacity:0.5
        }
      },
      {
        name:'MA30',
        type:'line',
        data:calculateMA(30,dataset),
        smooth:true,
        lineStyle:{
          opacity:0.5
        }
      }
  ]
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
    searchObj:{},
    tabList:["近1月","近3月","近6月","近1年","近3年"],
    tabActive:0,
    dataset:[],
    frequencyArray:['d','w','m',5,15,30,60],
    adjustFlagArray:[3,1,2],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    timeTabClick:function(e){
      this.setData({
        tabActive:e.currentTarget.dataset.index
      });
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
      for(var i=dates.length-1;moment(dates[i]).isAfter(startDate);i--){
        dataset.date.push(dates[i]);
        dataset.price.push(prices[i]);
      };
      dataset.date.reverse();
      dataset.price.reverse();
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
      if(options.searchKey){
        //从路径参数获取查询用的参数
        let searchObj={};
        searchObj.searchKey=decodeURIComponent(options.searchKey);//解码url
        searchObj.startDate=decodeURIComponent(options.startDate);
        searchObj.endDate=decodeURIComponent(options.endDate);
        searchObj.frequency=decodeURIComponent(options.frequency);
        searchObj.adjustFlag=decodeURIComponent(options.adjustFlag);
        this.setData({
          searchObj:searchObj
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
      let renderresult=await this.renderResult();
      if(renderresult.code=='error'){
        let reason=renderresult.msg;
        wx.hideLoading({
          success: (res) => {},
        })
         wx.showModal({
          title:'提示',
          content:reason,
          confirmText:'确定',
          success:(res)=>{
            if(res.confirm){
              console.log('用户点击确定');
              wx.navigateBack({
                delta: 1,
              })
            }
            else if(res.cancel){
              console.log('用户点击取消');
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      }
      else{
        wx.hideLoading();
      }
    },

    async renderResult(){
      let responseData=await this.spiderapi();//获取到数据，未经加工的原始返回数据from
      console.log(responseData);
      let resultobj={};
      if(responseData.data.code!='0'){//response是返回的整个数据包，包括header和cookies等
        resultobj.code='error';
        resultobj.msg=responseData.data.msg;
        return resultobj;
      }
      responseData=this.constructDataFromSpider(responseData);
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
      console.log("传给getOption函数的数据:",responseData);
      that.chart.setOption(getOption(responseData));
      this.setHistoryList();
      resultobj.code='success';
      return resultobj;
    },


    async spiderapi(){
      //请求爬虫数据接口'
      try{
        var res=await new Promise((resolve,reject)=>wx.request({//箭头函数的this指向它的直接上层，也就是调用spiderapi的component对象
          //服务端地址
          url:'http://localhost:5000/',
          method:'POST',
          data:{
            searchObj:this.data.searchObj,//将传入的参数作为请求参数
          },
          success:res=>resolve(res),
          fail:err=>reject(err),
        }))
      } catch(e){
        console.log(e);
        return e;
      }
      return res;
    },

    constructDataFromSpider(responseData){
      if(responseData.length!=0){
        console.log('返回数组不为空');
        //请求成功
        let categoryData=[];
        let values=[];
        //按开盘、收盘、最低、最高调整数组中值的顺序
        for(let i=0;i<responseData.length;i++){
          categoryData.push(responseData[i].splice(0,1)[0]);
          responseData[i].splice(0,1);
          let element=[responseData[i].splice(0,1)[0]];
          element=element.concat(responseData[i].splice(0,3).reverse());
          values.push(element);
        }
        let result={};
        result.categoryData=categoryData;
        result.values=values;
        console.log('构造的数组',result);
        let tofile=JSON.stringify(result);
        wx.getFileSystemManager().writeFile({
          filePath:wx.env.USER_DATA_PATH+'/data.txt',
          data:tofile,
          encoding:'utf-8',
          fail:function(e){
            if(e)
              console.log(e);
          }
        });
        return result;
    }
   },
    setHistoryList(){
        //将记录不重复的添加到历史记录表里
        let hl=wx.getStorageSync('history_list');
        if(hl){//任意对象，除了null以外转换成Boolean类型都应该是true
          let picked_in_hl=hl.some(item=>{
            return item===this.data.searchObj.searchKey;
          })
          if(!picked_in_hl){
            hl.push(this.data.searchObj.searchKey);
            try{
              wx.setStorage({
                data:hl,
                key: 'history_list',
              })
              let newhl=wx.getStorageSync('history_list');
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

    fetchLocal(){
      let obj=wx.getFileSystemManager().readFileSync(wx.env.USER_DATA_PATH+'/stockdata.json','utf-8');//注意和readfile的区别，readfilesync是一个同步接口，参数是字符串而不是对象
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
      this.data.dataset=result;
      return result;
    }
  }
})
