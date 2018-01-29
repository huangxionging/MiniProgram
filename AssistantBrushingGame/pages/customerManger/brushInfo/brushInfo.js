
// page/brushInfo/brushInfo.js
const baseTool = require('../../../utils/baseTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    now: { y: new Date().getFullYear(), m: (new Date().getMonth()) + 1, d: new Date().getDate()},
    now_day: { y: new Date().getFullYear(), m: (new Date().getMonth()) + 1, d: new Date().getDate()},
    userId: '',
    date_data:[],
    request_data1:{},
    request_data2:[],
    tab1: 'h',
    tab2: '',
    today: { y: new Date().getFullYear(), m: (new Date().getMonth()) + 1, d: new Date().getDate() },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求数据
    var that = this
    that.setData({
      userId: options.userId
    })
    this.request_data();
    this.request_data_day();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  /**
   * 请求数据
   */
  request_data: function () {
    var that = this;
    var url = 'https://os.32teeth.cn/api/memberBrushingRecordDetailsByMonth';
    var mm = that.data.now.m;
    var dd = that.data.now.d;
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    var yearMonth = that.data.now.y + '-' + mm + '-' + mm;
    var viewMemberId = that.data.userId;
    baseTool.print(viewMemberId)
    var code = '1508303205';
    var token = '2EF918033A1C8385ACE976245EFB07C4';
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: {
        yearMonth: yearMonth,
        viewMemberId: viewMemberId,
        code: code,
        token: token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //没有一条数据
        baseTool.print(res)
        if (!res.data.data.recordMonthChildVos) {
          res.data.data.recordMonthChildVos = [];
          for (var i = 0; i < 31; i++) {
            res.data.data.recordMonthChildVos[i] = { soonerOrLaterType: -1, highScore: 0, qualifiedCount: 0 };
          }
        }
        that.setData({
          request_data1: res.data.data
        });
        //渲染日历
        that.make_date();
      }
    })
  },
  /**
   * 生成日历
   */
  make_date:function(){
    var _this = this;
    
    var month = [31, _this.data.now.y % 4 == 0 ? 29 : 28,31,30,31,30,31,31,30,31,30,31] ;
    _this.data.now.s = month[_this.data.now.m-1];
    console.log(_this.data.now.s);
    //一号星期几？
    var no = new Date(_this.data.now.y + '/' + _this.data.now.m + '/01').getDay();
    var day = '';
    var data = [];
    
    for(var i=0;i<42;i++){
      var v = i -no+1;
      var c = 'type1';
      if (i < no){
        var p_m = _this.data.now.m - 1;
        if (p_m == 0) p_m = 11;
        v = month[p_m] - (no - i)+1;
        c = 'type';
        day = '';
      }

      if (i >= _this.data.now.s+no) {
        v = i - _this.data.now.s -no+1;
        c = 'type';
        day = '';
      }
      
      if (i < _this.data.now.s + no && i >= no){
        c = 'type' + _this.data.request_data1.recordMonthChildVos[(v - 1)].soonerOrLaterType;
        if (_this.data.request_data1.recordMonthChildVos[(v - 1)].soonerOrLaterType == -1) {
          c = 'type2';
          day = '';
        }else{
          day = v;
        }        
      }
      

      var d = { v: v, c:c,day:day};
      data.push(d);
    }

    _this.setData({
      date_data: data
    });
    
  },
  /**
   * 上一月
   */
  lastMonth:function(){
    var date = this.data.now;
    var d={};
    d.m = date.m-1;
    d.y = date.y;
    if(d.m<=0){
      d.m=12;
      d.y--;
    }
    var month = [31, d.y % 4 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    d.s = month[d.m-1];
    d.d = 1;
    this.setData({
      now: d
    });
    this.request_data();
  },
  /**
   * 下一月
   */
  nextMonth:function(){
    var date = this.data.now;
    var d = {};
    d.m = date.m + 1;
    d.y = date.y;
    if (d.m > 12) {
      d.m = 1;
      d.y++;
    }
    var month = [31, d.y % 4 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    d.s = month[d.m - 1];
    d.d = 1;
    this.setData({
      now: d
    });
    this.request_data();
  },
  /**
   * tab1点击
   */
  tab1:function(){
    this.setData({
      tab1: 'h',
      tab2: '',
    });
  },
  /**
   * tab2点击
   */
  tab2: function () {
    this.setData({
      tab1: '',
      tab2: 'h',
    });
  },
  /**
   * 获取指定天数据
   */
  getDayData:function(e){
    var _this = this;
    var day = e.currentTarget.dataset.day;
    var now_day = _this.data.now;
    now_day.d = day;
    if(day){
      _this.setData({
        now_day: now_day
      });

      _this.request_data_day();
    }
  },
  /**
   * 请求天的数据
   */
  request_data_day: function () {
    var that = this;
    var url = 'https://os.32teeth.cn//api/oneDaybrushTeethRecordList';
    var tdata ={};
    var mm = that.data.now_day.m;
    var dd = that.data.now_day.d;
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    tdata.date = that.data.now_day.y + '-' + mm + '-' + dd;
    tdata.viewMemberId = that.data.userId;
        tdata.code = '1508303205';
        tdata.token = '2EF918033A1C8385ACE976245EFB07C4';
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: tdata,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data=res.data.data;
        console.log(data);
        if (data) {
          var sname = ['早上', '中午', '晚上'];
          for (var i = 0; i < data.length; i++) {
            data[i].soonerOrLater = sname[data[i].soonerOrLater];
            data[i].date = data[i].date.slice(11, 16);
          }
        }
        that.setData({
          request_data2: data
        });
      }
    })
  }
  

})