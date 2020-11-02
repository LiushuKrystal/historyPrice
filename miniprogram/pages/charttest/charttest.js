// pages/charttest/charttest.js
import * as echarts from '../../ec-canvas/echarts';
let chart=null;
function initData(canvas,width,height,dpr){
  chart=echarts.init(canvas,null,{
    width:width,
    height:height,
    devicePixelRatio:dpr
  });
  canvas.setChart(chart);

  let xAxisData=["2020-09-09", "2020-09-10", "2020-09-11", "2020-09-14", "2020-09-15", "2020-09-16", "2020-09-17", "2020-09-18", "2020-09-21", "2020-09-22", "2020-09-23", "2020-09-24", "2020-09-25", "2020-09-28", "2020-09-29", "2020-09-30"];
  let yAxisData=["15.34", "15.24", "14.54", "14.35", "14.38", "14.68", "14.49", "14.54", "14.48", "14.05", "13.98", "13.83", "13.67", "13.72", "13.72", "13.63"];
  let adataset= {
    'date':xAxisData,
    'price':yAxisData
  }
  let testdataset={
    source: [
        ['2020-09-09', 15.34],
        ['2020-09-10', 15.24],
        ['2020-09-11', 14.54],
        ['2020-09-14',14.35]
    ]
}
  const length=xAxisData.length;
  let option={
    title:{
      show:false,
    },
    dataset:{
      source: [
          ['2020-09-09', 15.34],['2020-09-10', 15.24],['2020-09-11', 14.54],['2020-09-14',14.35],['2020-09-15',14.38],['2020-09-16',14.68],['2020-09-17',14.49],['2020-09-18',14.54],['2020-09-21',14.48],['2020-09-22',14.05],['2020-09-23',13.98],['2020-09-24',13.83],['2020-09-25',13.67],['2020-09-28',13.72],['2020-09-29',13.72],['2020-09-30',13.63]]
    },
    grid:{
      //show:true
      left:10,
      top:20,
      right:10,
      height:'80%',
      width:'85%',
    },
    tooltip:{
      show:true,
      trigger:'axis',//触发器是axis，鼠标停在点上会显示坐标轴上的信息，也就是数据点的信息。
      axisPointer:{
        type:'cross'
      },
      backgroundColor:'rgba(5,5,5,0.8)',
      borderWidth:1,
      borderColor:'#000',
      padding:[5,10],
      textStyle:{
        color:'#fff'
      },
    },
    xAxis:{
      type:'category',
      axisLabel:{
        formatter:function(value){
          let d=value.split('-')
          d=d[1]+'-'+d[2]//只保留月-日
          return d
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
      axisPointer:{
        snap:false,
      }
    },
    series:[{
      type:'line',
      smooth:true,
    }]
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
