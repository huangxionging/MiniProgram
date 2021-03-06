// pages/deviceData/bloodDetail/bloodDetail.js
import * as echarts from '../../../components/ec-canvas/echarts'
import {
  ChartOption
} from '../../../adapter/echartsOptionAdapter'
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasData: false,
    ec: {
      lazyLoad: true
    },
    date: "",
    sectionDataArray: [{
      rowDataArray: []
    }]
  },
  chartOption: undefined,

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

    that.getBloodData()
    // that.getData()
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
  getBloodData: function () {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let date = that.data.date
    baseNetLinkTool.getRemoteDataFromServer("blood_pressure_get", "获得血压详细数据", {
      date: [date],
      id: deviceInfo.macAddress
    }).then(res => {
      if (res.data.length == 0) {
        baseTool.showToast("该日期暂无无血压数据")
        that.setData({
          hasData: true
        })
        return
      }

      let minShrik = 0
      let maxShrik = 0
      let minDiastole = 0
      let maxDiastole = 0
      let shrinkData = res.data[0].data.map((value, index, array) => {
        let time = that.data.date + " " + value.time
        if (index == 0) {
          minShrik = value.shrink
          maxShrik = value.shrink
        } else {
          if (value.shrink > maxShrik) {
            maxShrik = value.shrink
          }
          if (value.shrink < minShrik) {
            minShrik = value.shrink
          }
        }
        return {
          name: time,
          value: [time, value.shrink]
        }
      })
      let diastoleData = res.data[0].data.map((value, index, array) => {
        let time = that.data.date + " " + value.time
        if (index == 0) {
          minDiastole = value.diastole
          maxDiastole = value.diastole
        } else {
          if (value.diastole > maxDiastole) {
            maxDiastole = value.diastole
          }
          if (value.diastole < minDiastole) {
            minDiastole = value.diastole
          }
        }
        return {
          name: time,
          value: [time, value.diastole]
        }
      })
      let dateZeroTime = that.data.date + " 00:00:00"
      let tomorrow = baseTool.getDateOffsetDate(that.data.date, 1)
      let tomorrowTime = tomorrow + " 00:00:00"
      let anchorData = [{
        name: dateZeroTime,
        value: [dateZeroTime, 0]
      }, {
        name: tomorrowTime,
        value: [tomorrowTime, 0]
      }]
      let sectionDataArray = [{
        headerHeight: 0,
        rowDataArray: res.data[0].data
      }]
      that.setData({
        hasData: true,
        sectionDataArray: sectionDataArray,
      })
      that.shrinkComponent = that.selectComponent('#shrink-blood-line-chart');
      that.diastoleComponent = that.selectComponent("#diastole-blood-line-chart")
      that.shrinkComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        baseTool.print([canvas, width, height])
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        canvas.setChart(chart);
        that.chart = chart;
        let chartOption = new ChartOption()
        let option = chartOption.getBloodShrinkOption()
        option.yAxis.min = parseInt(minShrik / 10) * 10 - 10
        option.yAxis.max = parseInt(maxShrik / 10) * 10 + 10
        baseTool.print(shrinkData)
        option.series[0].data = shrinkData
        option.series[1].data = anchorData
        option.series[0].areaStyle.color = "#352223"
        option.series[0].lineStyle.color = "#e22222"
        chart.setOption(option);
        return chart;
      });
      that.diastoleComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        baseTool.print([canvas, width, height])
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        canvas.setChart(chart);
        that.chart = chart;
        let chartOption = new ChartOption()
        let option = chartOption.getBloodShrinkOption()
        option.yAxis.min = parseInt(minDiastole / 10) * 10 - 10
        option.yAxis.max = parseInt(maxDiastole / 10) * 10 + 10
        option.series[0].data = diastoleData
        option.series[1].data = anchorData
        option.series[0].areaStyle.color = "#222c36"
        option.series[0].lineStyle.color = "#2283e2"
        option.series[0].itemStyle.color = "#2283e2"
        option.title.text = "血压舒张"
        chart.setOption(option);
        return chart;
      });
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  getData: function () {
    let that = this
    that.shrinkComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      baseTool.print([canvas, width, height])
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      that.chart = chart;
      let chartOption = new ChartOption()
      let option = chartOption.getBloodShrinkOption()
      chart.setOption(option)
      return chart;
    });
  },
  heartRateCheckClick: function () {
    let that = this
    let connectedDeviceState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedDeviceState.code != 1002) {
      baseTool.showToast("设备未连接, 无法测血压")
      return
    }
    that.setData({
      showHearRate: false
    })
    wx.showLoading({
      title: "血压检测中",
      // mask: true,
    })
    let key = baseDeviceSynTool.commandSynDeviceRealBlood()
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        // baseTool.showToast("未获取到心率数据")
        baseTool.showToast("检测失败")
        wx.hideLoading()
        return
      }
      baseDeviceSynTool.removeCallBackForKey(key)
      let result = baseHexConvertTool.hexStringToValue(res.substr(6, 2))
      baseTool.print(result)
      if (result == 2) {
        that.answerRealBloodData()
      } else {
        baseTool.showToast("检测失败")
        wx.hideLoading()
      }
    }, key)
    that.answerRealBloodData()
  },
  answerRealBloodData: function () {
    let that = this
    let key = baseDeviceSynTool.answerRealBloodKey()
    // 等待回调
    baseDeviceSynTool.wattingCallBackForKey(res => {
      baseDeviceSynTool.removeCallBackForKey(key)
      baseDeviceSynTool.answerRealBlood()
      baseTool.print(res)
      let shrink = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
      let diastole= baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      let sectionDataArray = that.data.sectionDataArray
      baseTool.print([shrink, diastole])
      sectionDataArray[0].rowDataArray.push({
        time: "上次测量结果",
        shrink: shrink,
        diastole: diastole
      })
      that.setData({
        sectionDataArray: sectionDataArray
      })
      wx.hideLoading()

      let token = baseTool.valueForKey("token")
      let shrinkAlarmValueKey = "shrinkAlarmValue" + token
      let shrinkAlarmValue = baseTool.valueForKey(shrinkAlarmValueKey)
      if (baseTool.isValid(shrinkAlarmValue) === false) {
        shrinkAlarmValue = 0
      }
      shrinkAlarmValue = parseInt(shrinkAlarmValue)
      let diastoleAlarmValueKey = "diastoleAlarmValue" + token
      let diastoleAlarmValue = baseTool.valueForKey(diastoleAlarmValueKey)
      if (baseTool.isValid(diastoleAlarmValue) === false) {
        diastoleAlarmValue = 0
      }
      diastoleAlarmValue = parseInt(diastoleAlarmValue)
      let bloodCheckSwitchKey = "bloodCheckSwitch" + token
      let bloodCheckSwitch = baseTool.valueForKey(bloodCheckSwitchKey)
      if (baseTool.isValid(bloodCheckSwitch) === false) {
        bloodCheckSwitch = false
      }
      baseTool.print([bloodCheckSwitch, shrinkAlarmValue, diastoleAlarmValue, shrink, diastole])
      if (bloodCheckSwitch === true) {
        if (shrink >= shrinkAlarmValue || diastole >= diastoleAlarmValue) {
          that.showAlarm()
        }
      }
    }, key)
  },
  showAlarm: function () {
    let that = this
    that.setData({
      showModal: true,
      showModalData: {
        confirmText: "知道了",
        title: "血压超高！",
        backgroundColor: "#171719",
        success: (result) => {
          that.setData({
            showModal: false
          })
        }
      }
    })
  }
})