// pages/trend/trendIndex/trendIndex.js
import * as echarts from '../../../components/ec-canvas/echarts'
import {
  ChartOption
} from '../../../adapter/echartsOptionAdapter'
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    actionSelect: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.initChart("stepComponent", "stepChart", "#step-chart")
    that.initChart("distanceComponent", "distanceChart", "#distance-chart")
    that.initChart("kalComponent", "kalChart", "#kal-chart")
    that.initChart("heartComponent", "heartChart", "#heart-chart")
    that.initChart("sleepComponent", "sleepChart", "#sleep-chart")
    that.initChart("bloodComponent", "bloodChart", "#blood-chart")
    that.getTrendData(that.data.actionSelect)
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
  initChart: function (componentName = "", chartName = "", chartId = "") {
    let that = this
    that[componentName] = that.selectComponent(chartId)
    that[componentName].init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart)
      that[chartName] = chart
      return chart
    });
  },
  actionSlectClick: function (e) {
    let that = this
    let index = parseInt(e.currentTarget.dataset.index)
    that.setData({
      actionSelect: index
    })
    // baseTool.print(e)
    that.getTrendData(index)
  },
  getTrendData: function (type = 1) {
    let that = this
    let date = baseTool.getCurrentDateWithoutTime()
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    baseNetLinkTool.getRemoteDataFromServer("getTrend", "获得趋势数据", {
      type: type,
      date: date,
      id: deviceInfo.macAddress
    }).then(res => {
      // baseTool.print(["趋势数据", res])
      let resultObject = that.getResultDataByType(date, res, type)
      let chartOption = new ChartOption()
      let option = chartOption.getStepOption(type)
      option.xAxis.interval = that.interval(type)
      if (type == 3) {
        option.xAxis.type = "category"
        option.xAxis.boundaryGap = false
        // axisLabel.interval = 0 表示强制显示刻度
        option.xAxis.axisLabel.interval = 0
        option.xAxis.axisLabel.formatter = function (value) {
          let dateArray = baseTool.componentsSeparatedByString(value, "-")
          let time = parseInt(dateArray[1])
          return time + "月"
        }
      } else {
        option.xAxis.scale = false
      }
      // 计步数据
      option.series[0].data = resultObject.stepDataArray
      option.series[0].name = "步数: "
      option.tooltip.formatter = that.stepFormatter
      option.series[0].lineStyle.color = "#008EFF"
      that.stepChart.setOption(option);

      // 距离数据
      option.series[0].data = resultObject.distanceDataArray
      option.series[0].name = "距离: "
      // option.tooltip.formatter = that.stepFormatter
      option.series[0].lineStyle.color = "#008EFF"
      option.yAxis.axisLabel.formatter = function (value) {
        return value / 1000
      }
      that.distanceChart.setOption(option);

      // 热量数据
      option.series[0].data = resultObject.kalDataArray
      option.series[0].name = "热量: "
      // option.tooltip.formatter = that.stepFormatter
      option.series[0].lineStyle.color = "#FF2828"
      option.series[0].itemStyle.color = "#FF2828"
      option.yAxis.axisLabel.formatter = function (value) {
        return value / 1000
      }
      that.kalChart.setOption(option);

      // 心率数据
      option.series[0].data = resultObject.hearDataArray
      option.series[0].name = "心率: "
      option.series[0].lineStyle.color = "#FFC201"
      option.series[0].itemStyle.color = "#FFC201"
      option.yAxis.axisLabel.formatter = function (value) {
        return value
      }
      that.heartChart.setOption(option)

      // 睡眠数据
      option.series[0].data = resultObject.sleepDataArray
      if (type === 1) {
        option.xAxis.interval = 3600 * 24 * 1000
      }
      option.series[0].name = "睡眠总时长: "
      option.series[0].lineStyle.color = "#9013FE"
      option.series[0].itemStyle.color = "#9013FE"
      option.yAxis.axisLabel.formatter = function (value) {
        return value
      }
      that.sleepChart.setOption(option)

      // 血压
      option.series = resultObject.bloodDataArray
      option.xAxis.interval = that.interval(type)
      option.yAxis.axisLabel.formatter = function (value) {
        return value
      }
      that.bloodChart.setOption(option)
    }).catch(res => {
      baseTool.print(res)
    })
  },
  getResultDataByType: function (date = "", res = Object, type = 1) {
    let step = res.step
    let userInfo = baseNetLinkTool.getUserInfo()
    let currentSex = (userInfo.sex == 2) ? 0 : 1
    let currentAge = userInfo.birthday
    let currentHeight = userInfo.height
    let currentWeight = userInfo.weight
    let currentDate = ""
    switch (type) {
      case 2:
      case 3:
      case 4: {
        currentDate = ""
        break
      }
      default: {
        currentDate = date + " "
        break
      }
    }
    let stepDataArray = []
    let distanceDataArray = []
    let kalDataArray = []
    for (let index = 0; index < step.length; ++index) {
      let object = step[index]
      let time = currentDate + ((type == 1) ? baseTool.zeroFormat((parseInt(object.date) - 1) + "") + ":00:00" : object.date)
      let value = object.step
      let distance = baseTool.getDistanceWithStep(value, currentHeight)
      let kal = baseTool.getCalorieWithSteps(value, currentWeight, currentHeight)
      stepDataArray.push({
        name: time,
        value: [time, value, "step"]
      })
      distanceDataArray.push({
        name: time,
        value: [time, distance, "km"]
      })
      kalDataArray.push({
        name: time,
        value: [time, kal, "kal"]
      })
    }
    let heartRateArray = res.heart_rate
    let hearDataArray = []
    for (let index = 0; index < heartRateArray.length; ++index) {
      let object = heartRateArray[index]
      let time = currentDate + object.date
      let heart = object.heart
      if (type == 1) {
        let dateDataArray = baseTool.componentsSeparatedByString(object.date, "-")
        time = currentDate + baseTool.componentsJoinedByString(dateDataArray, ":")
        // baseTool.zeroFormat(parseInt(  dateDataArray[0]) + 2 + "") + ":00:00"
      }
      hearDataArray.push({
        name: time,
        value: [time, heart, "bmp"]
      })
    }
    let sleepArray = res.sleep
    let sleepDataArray = []
    for (let index = 0; index < sleepArray.length; ++index) {
      let object = sleepArray[index]
      let time = object.date
      let sleep = object.total
      sleepDataArray.push({
        name: time,
        value: [time, sleep, "sleep"]
      })
    }
    let bloodArray = res.blood_pressure
    let shrinkDataArray = []
    let diastoleDataArray = []
    for (let index = 0; index < bloodArray.length; ++index) {
      let object = bloodArray[index]
      let time = currentDate + object.date
      let shrink = object.shrink
      let diastole = object.diastole
      if (type == 1) {
        let dateDataArray = baseTool.componentsSeparatedByString(object.date, "-")
        time = currentDate + baseTool.componentsJoinedByString(dateDataArray, ":")
        // baseTool.zeroFormat(parseInt(  dateDataArray[0]) + 2 + "") + ":00:00"
      }
      shrinkDataArray.push({
        name: time,
        value: [time, shrink, "blood"]
      })
      diastoleDataArray.push({
        name: time,
        value: [time, diastole, "blood"]
      })
    }
    let bloodDataArray = [{
      data: shrinkDataArray,
      name: "收缩压: ",
      type: 'line',
      symbol: "circle", // 实心还是空心,
      symbolSize: 6,
      smooth: false,
      lineStyle: {
        width: 3,
        color: "#FF2828"
      },
      itemStyle: {
        color: "#FF2828"
      }
    }, {
      data: diastoleDataArray,
      name: "舒张压: ",
      type: 'line',
      symbol: "circle", // 实心还是空心,
      symbolSize: 6,
      smooth: false,
      lineStyle: {
        width: 3,
        color: "#08A5F6"
      },
      itemStyle: {
        color: "#08A5F6"
      }
    }]

    return {
      stepDataArray: stepDataArray,
      distanceDataArray: distanceDataArray,
      kalDataArray: kalDataArray,
      hearDataArray: hearDataArray,
      sleepDataArray: sleepDataArray,
      bloodDataArray: bloodDataArray
    }
  },
  interval: function (type = 1) {
    // baseTool.print(["类型", type])
    switch (type) {
      case 1: {
        return 3600 * 1 * 1000
        break
      }
      case 2:
      case 4: {
        return 3600 * 24 * 1000
        break
      }
      case 3: {
        return 0
        break
      }
    }
  },
  stepFormatter: function (paramsArray) {
    let that = this
    let type = that.data.actionSelect
    let params = paramsArray[0];
    let object = baseTool.getObjectForDate(params.name)
    let unit = params.value[2]
    let time = ""
    switch (parseInt(type)) {
      case 1: {
        time = baseTool.zeroFormat(object.year) + "年" + baseTool.zeroFormat(object.month + "") + "月" + baseTool.zeroFormat(object.day + "") + "日 \n时间: " + baseTool.zeroFormat(object.hour + "") + ":00~" + baseTool.zeroFormat((object.hour) + "") + ":59"
        if (unit === "bmp" || unit === "blood") {
          time = baseTool.zeroFormat(object.year) + "年" + baseTool.zeroFormat(object.month + "") + "月" + baseTool.zeroFormat(object.day + "") + "日 \n时间: " + baseTool.zeroFormat(object.hour + "") + ":00~" + baseTool.zeroFormat((object.hour + 1) + "") + ":59"
        } else if (unit === "sleep") {
          time = params.name
        }
        break
      }
      case 2: {
        time = baseTool.zeroFormat(object.year) + "年" + baseTool.zeroFormat(object.month + "") + "月" + baseTool.zeroFormat(object.day + "") + "日"
        break
      }
      case 3: {
        let dateArray = baseTool.componentsSeparatedByString(params.name, "-")
        time = dateArray[0] + "年" + dateArray[1] + "月"
        break
      }
      case 4: {
        let weekDayArray = ["日", "-", "二", "三", "四", "五", "六"]
        time = baseTool.zeroFormat(object.year) + "年" + baseTool.zeroFormat(object.month + "") + "月" + baseTool.zeroFormat(object.day + "") + "日" + "周" + weekDayArray[object.weekDay]
        break
      }
    }

    // 根据带的单位显示
    switch (unit) {
      case "step": {
        return "日期: " + time + "\n" + params.seriesName + params.value[1] + " 步"
      }
      case "km": {
        return "日期: " + time + "\n" + params.seriesName + parseFloat(params.value[1] / 1000).toFixed(2) + " 千米"
      }
      case "kal": {
        return "日期: " + time + "\n" + params.seriesName + parseFloat(params.value[1] / 1000).toFixed(1) + " 千卡"
      }
      case "bmp": {
        return "日期: " + time + "\n" + params.seriesName + params.value[1] + " bmp"
      }
      case "blood": {
        let diastoleObject = paramsArray[1]
        return "日期: " + time + "\n" + params.seriesName + params.value[1] + " \n" + diastoleObject.seriesName + diastoleObject.value[1]
      }
      case "sleep": {
        return "日期: " + time + "\n" + params.seriesName + params.value[1] + " 分钟"
      }
    }
  },
})