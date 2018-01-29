// page/brushInfo/showTimes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId:'',
    d:{},
    top_pic:'/resource/teeth.jpg'
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      recordId: options.recordId
    });
    this.getData();
    that.dPic(0);

  },
  /**
   * 请求数据
   */
  getData:function(){
    var that = this;
    var url = 'https://os.32teeth.cn/api/record/oneCountRecordDetails';
    var tdata = {};
    tdata.recordId = that.data.recordId;
    tdata.viewMemberId = wx.getStorageSync('userInfo').mid;
    tdata.code = '1508303205';
    tdata.token = '2EF918033A1C8385ACE976245EFB07C4';
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: tdata,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data.data;
        console.log(data);
        
        that.setData({
          d: data
        });
        for (var i = 0; i < data.overallScore; i++) {
          (function (i) {
            setTimeout(function () {
              that.dPic(i);
            }, i * 10);
          })(i)
        }
      }
    })
  },
  /**
   * 绘制圆环
   */
  dPic: function (no, color){
    var no = no ||20;
    var color = color || ['#eac221', '#ffe26c'];
    var ctx = wx.createCanvasContext("myCanvas");
    var ctxa = wx.createCanvasContext("myCanvasa");
    
    var x = 60,
        y = 60,
        r = 42,
        w = 8;
    
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
        grd.addColorStop(0, color[0]);
        grd.addColorStop(1, color[1]);
    
    ctx.beginPath();
    ctx.setStrokeStyle("#f3f4f7");
    ctx.setLineWidth(w);
    ctx.setLineCap("round");
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.draw();
 
    ctxa.beginPath();
    ctxa.setStrokeStyle(grd);
    ctxa.setLineCap('round');
    ctxa.setLineWidth(w);
    if (no < 3) no = 3;
    var pash = no / 50 - 0.52;

    ctxa.arc(x, y, r, -0.46 * Math.PI, pash * Math.PI,false);
    ctxa.stroke();
    ctxa.draw();

  },
  /**
   * 改变顶部图
   */
  c_top_pic:function(e){
    var pic = e.currentTarget.dataset.pic;
    this.setData({
      top_pic: pic
    });
  },
  


})