// pages/deviceData/bloodDetail/bloodDetail.js
import * as echarts from '../../../components/ec-canvas/echarts'
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '血压收缩',
      left: 27,
      top: 23,
      textStyle: {
        color: "#ffffff",
        fontSize: 15
      }
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    grid: {
      left: 10,
      bottom: 10,
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
      // show: true
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted'
        }
      },
      axisLine: {
        lineStyle: {
          color: "#999",
          type: "dotted"
        }
      },
      axisTick: {
        lineStyle: {
          type: "dotted"
        }
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dotted'
        }
      },
      // show: false
      axisLine: {
        lineStyle: {
          color: "#999",
          type: "dotted"
        }
      }
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      // data: [18, 36, 65, 30, 78, 40, 33],
      lineStyle: {
        color: "#e22222"
      }
    }]
  };

  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true,
    },
    date: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.date) {
      that.data.date = options.date
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.shrinkComponent = that.selectComponent('#shrink-blood-line-chart')
    // that.diastoleComponent = that.selectComponent("#")
    that.getBloodData()
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getBloodData: function() {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
    let date = that.data.date
    baseNetLinkTool.getRemoteDataFromServer("blood_pressure_get", "获得血压详细数据", {
      date: [date],
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    }) 
  }
})