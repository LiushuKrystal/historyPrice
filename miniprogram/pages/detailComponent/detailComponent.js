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
      data:['K线','MA5','MA10','MA20','MA30']
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
          console.log('fromEchartsXAxis',d);
          if(d.length==6){
            //分钟线
            if(dataset.categoryData[0].slice(0,4)==dataset.categoryData[length-1].slice(0,4)){
              d=d[1]+'-'+d[2]+' '+d[3]+':'+d[4];
            }
            else d=d[0]+'-'+d[1]+'-'+d[2]+' '+d[3]+':'+d[4];
          }
          else{
            //如果开始和结束的年份相同就仅保留月-日
            if(moment(dataset.categoryData[0]).format('YYYY')==moment(dataset.categoryData[length-1]).format('YYYY')){
              d=d[1]+'-'+d[2]
            }
            else d=d[0]+'-'+d[1]+'-'+d[2];
          }
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
        name:dataset.freName,
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
  lifetimes:{
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    filterList:{
      'frequencyList':[{
        'id':0,
        'name':'日k线',
        'queryWord':'d',
      },{
        'id':1,
        'name':'周k线',
        'queryWord':'w'
      },{
        'id':2,
        'name':'月k线',
        'queryWord':'m'
      },{
        'id':3,
        'name':'5分钟线',
        'queryWord':'5'
      },{
        'id':4,
        'name':'15分钟线',
        'queryWord':'15'
      },{
        'id':5,
        'name':'30分钟线',
        'queryWord':'30'
      },{
        'id':6,
        'name':'60分钟线',
        'queryWord':'60'
      }
      ],
      'adjustFlagList':[{
        'id':0,
        'name':'不复权'
      },{
        'id':1,
        'name':'后复权'
      },{
        'id':2,
        'name':'前复权'
      }],
    },
    ec:{
      lazyLoad:true//置为true后可以延迟加载图表
    },
    searchObj:{},
    tabList:["近1月","近3月","近6月","近1年","近3年"],
    tabActive:0,
    freindex:0,
    adjindex:0,
    dateindex:0,
    hideCanvas:false,
    dataset:[],
    typeOfStock:['股票','指数','其他'],
    status:['退市','上市'],
    tabTxt:['频率类型','起止时间','复权类型'],
    tab:[true,true,true],
    selectorHeight:0,
    pickerConfig: {
      endDate: true,//是否包含结束日期
      column: "second",//精确到多少（有几列）
      initStartTime: "",
      initEndTime: "",
      limitStartTime: "1990-12-19 00:00:00",
      limitEndTime: ""
    },
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
    async changeFrequency(id){
      wx.showLoading({
        title: '查询中...',
      })
      let word=this.data.filterList.frequencyList.find(ele => ele.id==id).queryWord;
      this.data.searchObj.frequency=word;
      console.log('searchObj',this.data.searchObj);
      let renderresult=await this.renderResult();
      if(this.handleError(renderresult)){
        wx.hideLoading();
      }
      else{
        console.log('error from changeFrequency');
      }
    },
    async onLoad(options){
      wx.showLoading({
        title: '查询中...',
      })
      if(options.searchKey){
        //将查询的日期范围赋值给日期组件的config数组
        this.setData({
          initStartTime:options.startDate,
          initEndTime:options.endDate,
          limitEndTime:options.endDate
        })
        //从路径参数获取查询用的参数
        let searchKey=decodeURIComponent(options.searchKey);//从url中解码出搜索关键字
        //这里如果是中文输入，必须先通过接口获取到对应的股票代码
        let basicinfoResult=await this.basicInfoApi(searchKey,options);
        let judgebasicError=await this.handleError(basicinfoResult);
        if(!judgebasicError) return;
         //获取wxml页面的图表组件
        this.echartComponent=this.selectComponent('#mychart-dom-bar');
        //请求数据，渲染图表
        let renderresult=await this.renderResult();
        if(this.handleError(renderresult)){
          wx.hideLoading();
        }
      }
      else{
        console.log("error");
      }
    },
    async onReady(){
     
    },
      // 选项卡
  filterTab: function(e) {
    //将 canvas 通过 canvasToTempFilePath 转化为图片 并隐藏canvas
    if(e.currentTarget.dataset.index==1){
      const ec_component=this.echartComponent;
      ec_component.canvasToTempFilePath({
        success:res => {
          console.log('drawSuccess',res.tempFilePath);
            this.setData({
              hideCanvas:true,
              canvasImage:res.tempFilePath,
            })
        },
        fail: res => console.log('失败',res)
      })
    }
    var data = [true, true, true],
        index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
        tab: data
    })
    let str='#selector'+e.currentTarget.dataset.index;  
    this.setHeight(str);
  },
    //筛选项点击操作
    filter: function(e) {
      var self = this,
          id = e.currentTarget.dataset.id,
          txt = e.currentTarget.dataset.txt,
          tabTxt = this.data.tabTxt;
      switch (e.currentTarget.dataset.index) {
          case '0':
              tabTxt[0] = txt;
              self.setData({
                  data: [],
                  //tab: [true, true, true],
                  tabTxt: tabTxt,
                  freindex: id
              });
              this.changeFrequency(id);
              break;
          case '1':
              tabTxt[1] = txt;
              self.setData({
                  data: [],
                  //tab: [true, true, true],
                  tabTxt: tabTxt,
                  dateindex: id
              });
              break;
          case '2':
              tabTxt[2] = txt;
              self.setData({
                  data: [],
                  //tab: [true, true, true],
                  tabTxt: tabTxt,
                  adjindex: id
              });
              break;
      }   
    },
    setHeight:function(str){
      var query = wx.createSelectorQuery()
      query.select(str).boundingClientRect()
      var height;
      let that=this;
      query.exec(function (res) {//回调函数为匿名函数时，this会指向window，所以需要在外部对this进行绑定;如果是箭头函数，this的查找与常规变量的搜索方式一致，在外部环境中逐层查找。
        height=res[0].height;
        console.log(height);
        that.data.selectorHeight=height;
      })
    },
    hideWidget:function(){
      this.setData({
        hideCanvas:false,
        canvasImage:'',
      })
      const found=this.data.tab.findIndex(element => element==false)
      if(found==-1) return;
      console.log("found"+found);
      let height=this.data.selectorHeight;
      this.animate('#selector'+found,[{translateY:0},{translateY:-height}],50,()=>{
        this.setData({
            tab:[true,true,true]
        });
        this.clearAnimation('#selector'+found,{translateY:true});//也可以不加第二个参数，默认清除selector元素上的所有动画属性
      })
    },
    async handleError(result){
      if(result.code=='error'){
        let reason=result.msg;
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
        return false;
      }
      else{
        return true;
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
      let formattedData=this.constructDataFromSpider(responseData.data.data);
      formattedData['freName']=this.data.filterList.frequencyList[this.data.freindex].name;//“周k线”，用于在图表中显示出来。
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
      console.log("传给getOption函数的数据:",formattedData);
      that.chart.setOption(getOption(formattedData));
      this.setHistoryList();
      resultobj.code='success';
      return resultobj;
    },

    async basicInfoApi(key,options){
      let resultObj={};
      let searchData={};
      searchData.data=key;
      let rgx = /.*[\u4e00-\u9Fd5]+.*$/;//测试输入中是否含有中文字符
      if(rgx.test(key)){
          //含有中文，需要查找对应的股票代码
        searchData.flag=true;
      }
      else{
        searchData.flag=false;
      }
      try{
        var res=await new Promise((resolve,reject)=>wx.request({
          url:'http://localhost:5000/basic_info',
          method:'POST',
          data:{
            searchData:searchData,
          },
          success:res=>resolve(res),
          fail:err=>reject(err),
        }))
      }catch(e){
        console.log(e);
      }
      if(res.data.code!=0){
        resultObj.code='error';
        resultObj.msg=res.data.msg;
      }
      else{
        resultObj.code='success';
        let searchObj={};
        searchObj.code=res.data.data[0][0];
        searchObj.code_name=res.data.data[0][1];
        searchObj.ipoDate=res.data.data[0][2];
        searchObj.outDate=res.data.data[0][3];
        searchObj.type=res.data.data[0][4];
        searchObj.status=res.data.data[0][5];
        if(searchObj.status==0){
          //如果已经退市，需要把查询范围设置为退市日前三个月-退市日
          searchObj.endDate=searchObj.outDate;
          searchObj.startDate=moment(searchObj.outDate).add(-3,'months').format('YYYY-MM-DD');
          console.log(searchObj.startDate);
        }
        else{
          searchObj.startDate=options.startDate;
          searchObj.endDate=options.endDate;
        }
        searchObj.frequency=options.frequency;
        searchObj.adjustFlag=options.adjustFlag;
        if(searchObj.outDate=='') searchObj.outDate='-';
        this.setData({
          searchObj:searchObj
        })
      }
      return resultObj;
    },

    async spiderapi(){
      //请求爬虫数据接口
      try{
        var res=await new Promise((resolve,reject)=>wx.request({//箭头函数的this指向它的直接上层，也就是调用spiderapi的component对象
          //服务端地址
          url:'http://localhost:5000/price',
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
        let categoryData=[];//日期数据
        let values=[];//开盘价、收盘价、最低价、最高价数据
        //按开盘、收盘、最低、最高调整数组中的值的顺序
        for(let i=0;i<responseData.length;i++){
          if(this.data.freindex>=3){
            let dateTime=responseData[i].splice(0,3)[1];
            let dateStr=[dateTime.slice(0,4),dateTime.slice(4,6),dateTime.slice(6,8),dateTime.slice(8,10),dateTime.slice(10,12),dateTime.slice(12)].join('-');
            categoryData.push(dateStr);
          }
          else{
            //splice函数在数组特定位置插入/删除/替换元素，会改变原数组，并返回删除后的数组
            categoryData.push(responseData[i].splice(0,2)[0]);//取到日期数组
          }
          let element=[responseData[i].splice(0,1)[0]];//删除第一个数，开盘价，注意外面的中括号不能省略，说明element是一个数组而不是一个字符串
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
            return item===this.data.searchObj.code;
          })
          if(!picked_in_hl){
            hl.push(this.data.searchObj.code);
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
    },
    eventFromSon:function(e){
      this.setData({
        startDateTime:e.detail.startDateTime,
        endDateTime:e.detail.endDateTime
      })
    },
    }
  })
