// pages/timePicker/timePicker.js
const moment=require('../../utils/moment.min.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    config:Object,//获取来自父组件的配置参数
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPicker:false,
    endDate:true,
    isStartTimeChanged:false,
    isEndTimeChanged:false,
    tempStartDate:'',
    tempEndDate:''
  },
  lifetimes:{
    ready:function(){
      this.getConfig();
      this.initDate();
      this.setData({
        startArray:this.data.startArray,
        endArray:this.data.endArray
      })
    }
  },
  observers:{
    'config':function(config){
      if(this.data.configs&&this.data.configs.column!=config.column){
        this.setData({
          hourColumn:config.column=='hour' || config.column=='minute' || config.column=='second',
          minuteColumn:config.column=='minute' || config.column=='second',
          secondColumn:config.column=='second'
        })
      }
      this.setData({
        configs:config
      });
      console.log('config接收到了频率变化',this.data.configs);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getConfig:function(){//从父元素获取初始设置的时间并设置在this.data里面
      //构造年份数组
      let limitEndTime=moment().format('YYYY-MM-DD hh:mm:ss');
      let limitStartTime=moment(limitEndTime).add(-3,'months').format('YYYY-MM-DD hh:mm:ss');//先暂时这样写，后面config成功传过来1990会覆盖
      console.log(limitEndTime);
      console.log(limitStartTime);

      if(this.data.configs){
        console.log('父组件向子组件传数据成功');
        let conf=this.data.configs;

        //为了兼容性，ios的safari浏览器无法解析yyyy-mm-dd格式的时间，所以需要用正则表达式替换成yyyy/mm/dd格式
        limitStartTime=conf.limitStartTime;
        //limitEndTime=conf.limitEndTime;

        this.setData({
          endDate:conf.endDate || false,//是否需要结束时间picker，如果不需要就只有起始时间picker
          hourColumn:conf.column=='hour' || conf.column=='minute' || conf.column=='second',
          minuteColumn:conf.column=='minute' || conf.column=='second',
          secondColumn:conf.column=='second'
        })
      }
      let limitStartTimeObj=this.formatTime(limitStartTime);
      let limitEndTimeObj=this.formatTime(limitEndTime);

      this.setData({
        limitStartTime,
        limitEndTime,
        limitStartTimeObj,
        limitEndTimeObj,
      })
      
    },
    //初始设置，结束时间是当前时间，开始时间是三个月前，设置初始的数组
    //设置6项每一个的总体数组，范围从limitstarttime到limitendtime
    initDate:function(){
      let initEndTime=moment();
      let initStartTime=moment(initEndTime).add(-3,'months');//需要先用moment包装一下防止原值被修改

      let limitStartMoment=moment(this.data.limitStartTime);
      let limitEndMoment=moment(this.data.limitEndTime);

      let limitStartYear=limitStartMoment.get('year');
      let limitEndYear=limitEndMoment.get('year');

      let yearList=[];
      let monthList=[];
      let dateList=[];
      let hourList=[];
      let minuteList=[];
      let secondList=[];

      for(let i=limitStartYear;i<=limitEndYear;i++){
        yearList.push(i);
      }

      for(let i=1;i<=12;i++){
        monthList.push(this.formatNumber(i));
      }

      for(let i=1;i<31;i++){
        dateList.push(this.formatNumber(i));
      }

      for(let i=0;i<=23;i++){
        hourList.push(this.formatNumber(i));
      }

      for(let i=0;i<=59;i++){
        minuteList.push(this.formatNumber(i));
      }

      for(let i=0;i<=59;i++){
        secondList.push(this.formatNumber(i));
      }

      let startYear=initStartTime.get('year');
      let endYear=initEndTime.get('year');

      let startMonth=initStartTime.get('month')+1;
      let endMonth=initEndTime.get('month')+1;

      let startDate=initStartTime.get('date');
      let endDate=initEndTime.get('date');

      let startHour=initStartTime.get('hour');
      let endHour=initEndTime.get('hour');

      let startMinute=initStartTime.get('minute');
      let endMinute=initEndTime.get('minute');

      let startSecond=initStartTime.get('second');
      let endSecond=initEndTime.get('second');

      this.setData({
        yearList,
        monthList,
        dateList,
        hourList,
        minuteList,
        secondList
      })

      let startArray=this.getIndex(startYear,startMonth,startDate,startHour,startMinute,startSecond);
      let endArray=this.getIndex(endYear,endMonth,endDate,endHour,endMinute,endSecond);

      initStartTime=initStartTime.format('YYYY-MM-DD hh:mm:ss');
      initEndTime=initEndTime.format('YYYY-MM-DD hh:mm:ss');
      this.setData({
        startArray,
        endArray,
        startDateTime:initStartTime,
        endDateTime:initEndTime
      })

      console.log('initDate函数结束');
      console.log(this.data);
      console.log('我是负责占位置的');
      
    },
    //根据给定的日期时间返回它们的下标值数组
    getIndex:function(year,month,date,hour,minute,second){
      month=this.formatNumber(month);
      date=this.formatNumber(date);
      hour=this.formatNumber(hour);
      minute=this.formatNumber(minute);
      second=this.formatNumber(second);

      let yId=this.data.yearList.findIndex(element => element==year);
      let mId=this.data.monthList.findIndex(element => element==month);
      let dId=this.data.dateList.findIndex(element => element==date);
      let hId=this.data.hourList.findIndex(element => element==hour);
      let miId=this.data.minuteList.findIndex(element => element==minute);
      let sId=this.data.secondList.findIndex(element => element==second);

      return [yId,mId,dId,hId,miId,sId];
    },
    //根据下标值数组返回给定的日期时间字符串，格式为："2013-02-08 09:30:26" 
    getDateTime:function(arr){
      let ans;
      ans=[this.data.yearList[arr[0]],this.data.monthList[arr[1]],this.data.dateList[arr[2]]].join('-');
      if(arr.length>3){
        //六列
        ans+=' ';
        ans+=[this.data.hourList[arr[3]],this.data.minuteList[arr[4]],this.data.secondList[arr[5]]].join(':');
      }
      return ans;
    },
    isValid:function(t,flag){
      t=moment(t);
      if(flag=='start'){
        let nowend=moment(this.data.tempEndDate);
        if(t.isBefore(nowend)){
          //是合理的起始时间
          return true;
        }
        else{
          wx.showToast({
            title: '起始日期不合理',
            icon: 'success',
            duration: 2000
          })
          return false;
        }
      }
      else if(flag=='end'){
        let nowstart=moment(this.data.tempStartDate);
        if(t.isAfter(nowstart)) return true;
        else{
          wx.showToast({
            title: '终止日期不合理',
            icon: 'fail',
            duration: 2000
          })
          return false;
        } 
      }
    },
    //如果时间没变，就不需要发请求，用一个变量实现，isStartTimeChanged
    onStartChange:function(e){
      let startdatetime=e.detail.value;//开始数组
      this.data.tempStartArray=startdatetime;
      startdatetime=this.getDateTime(startdatetime);
      this.data.tempStartDate=startdatetime;
      if(!this.data.tempEndDate)
        this.data.tempEndDate=this.data.endDateTime;
      if(this.data.startDateTime.slice(0,10)==startdatetime.slice(0,10)){
        this.data.isStartTimeChanged=false;
      }
      else{
        if(this.isValid(startdatetime,'start')){
          this.setData({
            startDateTime:startdatetime,
            isStartTimeChanged:true
          })
        }
        else this.data.isStartTimeChanged=false;//在改变了但是是无效的时候依然相当于没变，不用发起请求。
      }
    },
    onEndChange:function(e){
      let enddatetime=e.detail.value;//结束数组
      this.data.tempEndArray=enddatetime;
      enddatetime=this.getDateTime(enddatetime);
      this.data.tempEndDate=enddatetime;
      if(!this.data.tempStartDate)
        this.data.tempStartDate=this.data.startDateTime;
      if(this.data.endDateTime.slice(0,10)==enddatetime.slice(0,10)){
        this.data.isEndTimeChanged=false;
      }
      else{
        if(this.isValid(enddatetime,'end')){
          this.setData({
            endDateTime:enddatetime,
            isEndTimeChanged:true,
          })
        }
      }
    },
    onPickStart:function(){
      this.data.isPicking=true
    },
    onPickEnd:function(){
      this.data.isPicking=false
    },
    //获取变化后的日期
    onConfirm:function(){
      //需要获得当前页面的开始时间和结束时间，返回给父元素
      if(this.data.isPicking) return;
      if(this.data.isStartTimeChanged||this.data.isEndTimeChanged){
        let time = {
          startDateTime: this.data.startDateTime,
          endDateTime: this.data.endDateTime
        };
        this.setData({
          startArray:(this.data.isStartTimeChanged?this.data.tempStartArray:this.data.startArray),
          endArray:(this.data.isEndTimeChanged?this.data.tempEndArray:this.data.endArray)
        })
        this.triggerEvent('listenEvent',time);
      }
      else{
        //无效的情况也是用isStart/EndTimeChanged=false表示的，所以需要把array恢复原值
        this.setData({
          startArray:this.data.startArray,
          endArray:this.data.endArray
        })
      }
      this.setData({
        isStartTimeChanged:false,
        isEndTimeChanged:false,
        tempEndDate:'',
        tempStartDate:''
      })
      this.triggerEvent('hidePicker',{});//点击确定之后需要触发收起面板函数
    },
    //点击取消按钮
    hidePicker:function(){
      this.setData({
        isStartTimeChanged:false,
        isEndTimeChanged:false,
        tempEndDate:'',
        tempStartDate:''
      })
      this.triggerEvent('hidePicker',{});
    },

    //下面都是工具函数
    addZero:function(val){
      if(val.length==1){
        val='0'+val;
      }
      return val;
    },
    getDaysByYearMonth:function(year,month){
      let daylist=[31,28,31,30,31,30,31,31,30,31,30,31];
      if(month=='2'){
        let year=parseInt(year);
        if(year%4==0 && year%100!=0 || year%400==0) return 29;
        else return 28;
      }
      else return daylist[parseInt(month)-1];
    },

    //这个函数的目的是得到年，月，日，时，分，秒组成的数组
    formatTime:function(timestring){
      console.log("timepicker-formatTime "+timestring);
      timestring=moment(timestring);

      const year=timestring.get('year');
      const month=timestring.get('month')+1;
      const day=timestring.get('date');
      const hour=timestring.get('hour');
      const minute=timestring.get('minute');
      const second=timestring.get('second');
      return {
        str: [year,month,day].map(this.formatNumber).join('-') + ' '+ [hour,minute,second].map(this.formatNumber).join(':'),
        arr: [year,month,day,hour,minute,second]
      }
    },
    formatNumber:function(num){
      num=num.toString();
      return num.length==1 ? 0+num:num;
    }
  }
})
