// custom-tab-bar/custom-tab-bar.js
let app=getApp();

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
    selected:0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        "pagePath": "/pages/homepage/homepage",
        "iconPath": "/images/searchTab.png",
        "selectedIconPath": "/images/selectedsearchTab.png",
        "text": "查询",
        "num":0
      },
      {
        "pagePath": "/pages/homepage/help",
        "iconPath": "/images/helpTab.png",
        "selectedIconPath": "/images/selectedHelpTab.png",
        "text": "帮助",
        "num":1
      }
    ],
  },
  /**
   * 组件的方法列表
   */
  attached() {
  },
  methods: {
    switchNav(e){
      if(this.data.selected===e.target.dataset.index){
        return false;
      }
      else {
        this.setData({
          selected:e.target.dataset.index
        })
      }
    },
    // switchTab(e){
    //   const data=e.currentTarget.dataset;
    //   const url=data.path;
    //   wx.switchTab({url});//这里的Url必须在app.json中pages里有定义
    //   this.setData({
    //     selected:data.index
    //   });
    //   console.log(this.data.selected);
    // }
  }
})
