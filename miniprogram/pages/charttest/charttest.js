// pages/charttest/charttest.js
import * as echarts from '../../ec-canvas/echarts';
const moment = require('../../utils/moment.min.js');
let chart=null;
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
function initData(canvas,width,height,dpr){
  const upColor='#ec0000';
  const upBorderColor = '#8A0000';
  const downColor = '#00da3c';
  const downBorderColor = '#008F28';

  chart=echarts.init(canvas,null,{
    width:width,
    height:height,
    devicePixelRatio:dpr
  });
  canvas.setChart(chart);

  let dataset=wx.getFileSystemManager().readFileSync(wx.env.USER_DATA_PATH+'/data.txt','utf-8');
  dataset=JSON.parse(dataset);

  const length=dataset['categoryData'].length;
  let option={
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
  chart.setOption(option);
  return chart;
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
      onInit:initData
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
