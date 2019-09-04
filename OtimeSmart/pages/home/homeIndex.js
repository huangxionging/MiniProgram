// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../utils/baseDeviceSynTool.js')
const baseURL = require('../../utils/baseURL.js')
const baseHexConvertTool = require('../../utils/baseHexConvertTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    deviceInfo: {},
    isSynNow: false,
    currentDate: "",
    currentTime: "00:00",
    currentStep: 0,
    currentCal: 0,
    currentDistance: 0,
    showDeviceToolBar: false,
    deviceConnectObject: {
      stateText: "暂无设备",
      bindTitle: "绑定设备",
      stateColor: "red",
      action: 0
    },
    showSelectDate: false
  },
  temporaryData: {
    pullDown: false,
    synActionIndicator: 0, // 同步操作指令
    needSynDayIndicator: 7, // 需要同步的历史数据天数,
    dataDateObjectList: [],
    detailStepData: [],
    selectDateIndicator: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    // 当前日期
    let currentDate = baseTool.getCurrentDateWithoutTime()
    // 设备信息
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    // 设备连接状态
    let deviceConnectObject = that.data.deviceConnectObject
    that.registerCallBack()
    if (deviceInfo == "") {
      deviceConnectObject.stateText = "暂无设备"
      deviceConnectObject.stateColor = "red"
      deviceConnectObject.bindTitle = "绑定设备"
      that.setData({
        currentDate: currentDate,
        showDeviceToolBar: true,
        deviceConnectObject: deviceConnectObject
      })
    } else {
      that.setData({
        deviceInfo: deviceInfo,
        currentDate: currentDate
      })
      that.connectDevice()
    }


    let percent = that.data.currentStep / 10000
    that.redrawCircle(percent)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // that.registerDeviceSynMessageBlock()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    that.removeCallBack()
  },
  onPageScroll: function(e) {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    if (that.data.isSynNow == true) {
      wx.stopPullDownRefresh()
      baseTool.showToast("设备正在同步中...")
      return
    }
    that.temporaryData.pullDown = true
    let connectedState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedState.code != 1002) {
      that.connectDevice()
    } else {
      that.startSynData()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  registerDeviceSynMessageBlock: function() {
    let that = this
    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {

    }).then(res => {
      baseTool.print(res)
    })
  },
  registerCallBack: function() {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.getHomePage()
    }).then(res => {
      that.getHomePage()
    })
    baseMessageHandler.addMessageHandler("deviceConnectedState", that, that.showDeviceConnectState).then(res => {
      baseTool.print(res)
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("deviceConnectedState", this)
  },
  getHomePage: function() {
    let that = this
    let deviceInfo = that.data.deviceInfo
    let token = baseNetLinkTool.getToken()
    if (deviceInfo == "" && token != "") {
      return
    } else {
      let last6Date = baseTool.getCurrentOffsetDateWithoutTime(-6)
      let last5Date = baseTool.getCurrentOffsetDateWithoutTime(-5)
      let last4Date = baseTool.getCurrentOffsetDateWithoutTime(-4)
      let last3Date = baseTool.getCurrentOffsetDateWithoutTime(-3)
      let last2Date = baseTool.getCurrentOffsetDateWithoutTime(-2)
      let last1Date = baseTool.getCurrentOffsetDateWithoutTime(-1)
      let last0Date = baseTool.getCurrentOffsetDateWithoutTime(0)
       baseNetLinkTool.getRemoteDataFromServer("step_get", "获取计步数据", {
        date: [last0Date, last1Date, last2Date, last3Date, last4Date, last5Date,last6Date],
        id: deviceInfo.macAddress
      }).then(res => {
        baseTool.print(res)
        let dataArray = res.data
        let maxDate = last6Date
        let currentIndex = -1
        let lastUploadStepDate = baseTool.valueForKey("lastUploadStepDate")
        for (let index = 0; index < dataArray.length; ++index){
          let dataObject = dataArray[index]
          // 如果日期大于 maxDate
          if (dataObject.date > maxDate) {
            maxDate = dataObject.date
          }

          if (last0Date == dataObject.date) {
            currentIndex = index
          }
        }

        // 表示今天上传过数据/ 渲染当天数据
        if (currentIndex != -1) {
          let dataObject = dataArray[currentIndex]
          let dataList = dataObject.data
          let totalStep = 0
          let target = parseFloat(dataObject.target)
          let duration = parseFloat(dataObject.duration)
          let currentCal = dataObject.calorie
          let currentTime = baseTool.zeroFormat(duration / 60 + "") + ":" + baseTool.zeroFormat(duration % 60 + "")
          let currentDistance = dataObject.distance
          for(let index = 0; index < dataList.length; ++index) {
            totalStep += dataList[index].step
          }
          that.redrawCircle(totalStep / target)
          that.setData({
            currentStep: totalStep,
            currentCal: currentCal,
            currentTime: currentTime,
            currentDistance: currentDistance
          })
        }
        // 如果上传日期大于上次上传时间
        if (maxDate > lastUploadStepDate || lastUploadStepDate == "") {
          baseTool.setValueForKey(maxDate, "lastUploadStepDate")
        }
        
      }).catch(res => {
        baseTool.print(res)
        baseNetLinkTool.showNetWorkingError(res)
      })
    }

  },
  redrawCircle: function(percent = 0) {
    let that = this
    let degree = that.degreeForPercent(percent)
    let width = baseTool.toPixel(160)
    let ctx = wx.createCanvasContext("circle-percent", that)
    ctx.beginPath()
    ctx.setLineWidth(8)
    ctx.arc(width / 2, width / 2, width / 2 - 4, -0.5 * Math.PI, degree, true)
    ctx.setStrokeStyle('#6B92FB')
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(width / 2, width / 2, width / 2 - 4, -0.5 * Math.PI, degree, false)
    ctx.setStrokeStyle('#D8E2FB')
    ctx.stroke()
    ctx.draw()
  },
  degreeForPercent: function(percent = 0) {
    return Math.PI * (1.5 - 2 * percent)
  },
  connectDevice: function() {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
      baseDeviceSynTool.connectDeviceFlow(deviceInfo)
    }).catch(res => {
      baseTool.print(that.temporaryData.pullDown)
      if (that.temporaryData.pullDown == true) {
        wx.stopPullDownRefresh()
        that.temporaryData.pullDown = false
      }
      let deviceConnectObject = that.data.deviceConnectObject
      deviceConnectObject.stateText = "蓝牙不可用"
      deviceConnectObject.stateColor = "red"
      deviceConnectObject.bindTitle = "重新连接"
      deviceConnectObject.action = 1
      that.setData({
        showDeviceToolBar: true,
        deviceConnectObject: deviceConnectObject
      })
    })
  },
  actionClick: function(e) {
    let that = this
    let action = parseInt(e.detail.action)
    baseTool.print(action)
    switch (action) {
      case 0:
        {
          wx.navigateTo({
            url: '/pages/my/bindDevice/bindDevice'
          })
          break
        }
      case 1:
        {
          that.connectDevice()
          break
        }
      case 2:
        {
          that.startSynData()
          break
        }
    }
  },
  closeToolBarClick: function() {
    let that = this
    that.setData({
      showDeviceToolBar: false
    })
  },
  showDeviceConnectState: function(res) {
    let that = this
    let deviceConnectObject = that.data.deviceConnectObject
    let showDeviceToolBar = true
    baseTool.print(res)
    let code = parseInt(res.connectedState.code)
    switch (code) {
      case 1001:
        {
          deviceConnectObject.stateText = "暂无设备"
          deviceConnectObject.stateColor = "red"
          deviceConnectObject.bindTitle = "绑定设备"
          deviceConnectObject.action = 0
          break;
        }
      case 1002:
        {
          deviceConnectObject.stateText = "设备已连接"
          deviceConnectObject.stateColor = "green"
          deviceConnectObject.bindTitle = "同步数据"
          deviceConnectObject.action = 2
          if (that.temporaryData.pullDown == true) {
            that.startSynData()
          }
          break;
        }
      case 1003:
        {
          deviceConnectObject.stateText = "设备断开连接"
          deviceConnectObject.stateColor = "red"
          deviceConnectObject.bindTitle = "重新连接"
          deviceConnectObject.action = 1
          break;
        }
      case 1004:
        {
          break;
        }
      case 1005:
        {
          break;
        }
      case 1006:
        {
          deviceConnectObject.stateText = "设备连接失败"
          deviceConnectObject.stateColor = "red"
          deviceConnectObject.bindTitle = "重新绑定设备"
          deviceConnectObject.action = 0
          break
        }
    }

    if (that.temporaryData.pullDown == true) {
      wx.stopPullDownRefresh()
      that.temporaryData.pullDown = false
    }
    that.setData({
      showDeviceToolBar: showDeviceToolBar,
      deviceConnectObject: deviceConnectObject
    })
  },
  startSynData: function() {
    let that = this
    switch (that.temporaryData.synActionIndicator) {
      // 同步设备计步
      case 0: {
        that.synDeviceStep()
        that.setData({
          isSynNow: true
        })
        break
      }
    }
  },
  synDeviceStep: function() {
    let that = this
    let lastUploadStepDate = baseTool.valueForKey("lastUploadStepDate")
    let currentDate = baseTool.getCurrentDateWithoutTime()
    let offsetDays = baseTool.getOffsetDays(lastUploadStepDate, currentDate)
    that.temporaryData.needSynDayIndicator = offsetDays
    that.temporaryData.dataDateObjectList.length = 0
    that.synDeviceTotalStep()
  },
  synDeviceTotalStep() {
    let that = this
    if (that.temporaryData.needSynDayIndicator == -1) {
      that.uploadStepData()
      return
    }
    let key = baseDeviceSynTool.commandSynDeviceTotalStepData(that.temporaryData.needSynDayIndicator)
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = that.data.deviceInfo
    deviceInfo.stateText = date + "的计步数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      baseDeviceSynTool.removeCallBackForKey(key)
      let stepString = res.substr(14, 8)
      let step = baseHexConvertTool.hexStringToValue(stepString)
      let year = baseHexConvertTool.hexStringToValue(res.substr(8, 2)) + 2000
      let month = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      let day = baseHexConvertTool.hexStringToValue(res.substr(12, 2))
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      // 改天无数据
      if (step == 0) {
        that.temporaryData.needSynDayIndicator--
        if (that.temporaryData.needSynDayIndicator > 0) {
          let lastUploadStepDate = baseTool.valueForKey("lastUploadStepDate")
          lastUploadStepDate = baseTool.getDateOffsetDate(lastUploadStepDate, 1)
          baseTool.setValueForKey(lastUploadStepDate, "lastUploadStepDate")
        }
        that.synDeviceTotalStep()
      } else if (step) {
        let distanceString = res.substr(22, 8)
        let calorieString = res.substr(30, 8)
        let distance = baseHexConvertTool.hexStringToValue(distanceString)
        let calorie = baseHexConvertTool.hexStringToValue(calorieString)
        let dataDateObject = {}
        that.temporaryData.dataDateObjectList.push(dataDateObject)
        dataDateObject.date = date
        dataDateObject.target = 10000
        dataDateObject.distance = distance
        dataDateObject.calorie = calorie / 1000
        dataDateObject.total = step
        baseTool.print(["本次数据", dataDateObject])
        that.synDeviceDetailStep()
      }
    }, key)
  },
  synDeviceDetailStep: function() {
    let that = this
    let key = baseDeviceSynTool.commandSynDeviceDetailStepData(that.temporaryData.needSynDayIndicator)
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = that.data.deviceInfo
    that.temporaryData.detailStepData = new Array(24)
    for (let index = 0; index < 24; ++index) {
      that.temporaryData.detailStepData[index] = {
        step: 0
      }
    }
    deviceInfo.stateText = date + "的详细数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseDeviceSynTool.registerCallBackForKey(res => {
      // 总条数
      let totlalNumber = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
      // 序号
      let serialNumber = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      // 年
      let year = baseHexConvertTool.hexStringToValue(res.substr(12, 2)) + 2000
      // 月
      let month = baseHexConvertTool.hexStringToValue(res.substr(14, 2))
      // 日
      let day = baseHexConvertTool.hexStringToValue(res.substr(16, 2))
      // 时
      let hour = baseHexConvertTool.hexStringToValue(res.substr(18, 2))
      // 分
      let minute = baseHexConvertTool.hexStringToValue(res.substr(20, 2))

      // 完整的时间
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "") + " " + baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "")
      let step = baseHexConvertTool.hexStringToValue(res.substr(22, 4))
      let distance = baseHexConvertTool.hexStringToValue(res.substr(26, 4))
      let calorie = baseHexConvertTool.hexStringToValue(res.substr(30, 4))
      let text = "总数:" + totlalNumber + " 序号:" + serialNumber + " 时间:" + date + " 步数:" + step + " 距离:" + distance + " 卡路里:" + calorie
      baseTool.print(["一条完整的数据", text])
      let dataObject = that.temporaryData.detailStepData[hour]
      dataObject.step += step
      if (serialNumber == 0) {
        // 开始标志
        let length = that.temporaryData.dataDateObjectList.length
        let dataDateObject = that.temporaryData.dataDateObjectList[length - 1]
        dataDateObject.time = baseTool.zeroFormat(hour + "") + ":00:00"
      } else if (serialNumber == totlalNumber - 1) {
        // 结束标志
        // 删除 key
        let length = that.temporaryData.dataDateObjectList.length
        let dataDateObject = that.temporaryData.dataDateObjectList[length - 1]
        // 当天数据
        dataDateObject.data = that.temporaryData.detailStepData
        let timeArray = that.temporaryData.detailStepData.filter((value, index, array) => {
          return value.step > 0
        })
        dataDateObject.duration = timeArray.length * 60
        baseDeviceSynTool.removeCallBackForKey(key)
        // 继续同步下一个日期
        that.temporaryData.needSynDayIndicator--
        that.synDeviceTotalStep()
      }
    }, key)
  },
  uploadStepData: function() {
    let that = this
    if (that.temporaryData.dataDateObjectList.length == 0) {
      baseTool.showToast("本次同步, 无数据")
      return
    }
    let deviceInfo = that.data.deviceInfo
    deviceInfo.stateText = "上传数据..."
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseNetLinkTool.getRemoteDataFromServer("step_save", "保存计步数据", {
      data: that.temporaryData.dataDateObjectList,
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      deviceInfo.stateText = "上传成功"
      that.setData({
        isSynNow: true,
        deviceInfo: deviceInfo
      })
      setTimeout(() => {
        that.setData({
          isSynNow: false
        })
        that.getHomePage()
      }, 2000)
    }).catch(res => {
      baseTool.print(res)
    })
  },
  selecDateClick:function(e) {
    baseTool.print(e)
    let that = this
    let type = e.currentTarget.dataset.type
    if (type == "0") {
      that.temporaryData.selectDateIndicator--
    } else {
      that.temporaryData.selectDateIndicator++
    }

    let currentDate = baseTool.getCurrentOffsetDateWithoutTime(that.temporaryData.selectDateIndicator)
    let showSelectDate = true
    if (that.temporaryData.selectDateIndicator == 0) {
      showSelectDate = false
    } 
    that.setData({
      currentDate: currentDate,
      showSelectDate: showSelectDate
    })

    that.getDateDetail(currentDate)
  },
  getDateDetail: function(currentDate) {
    let that = this
    let deviceInfo = that.data.deviceInfo
    baseNetLinkTool.getRemoteDataFromServer("step_get", "获取指定日期计步数据", {
      date: [currentDate],
      id: deviceInfo.macAddress
    }).then(res => {
      let dataArray = res.data
      baseTool.print(dataArray)
      
      let dataObject = {
        target: "10000",
        duration: "00:00",
        calorie: 0,
        distance: 0,
        data: []
      }
      // 表示今天上传过数据/ 渲染当天数据
      if (dataArray.length > 0) {
        dataObject = dataArray[0]
        
      } 
      let dataList = dataObject.data
      let totalStep = 0
      let target = parseFloat(dataObject.target)
      let duration = parseFloat(dataObject.duration)
      let currentCal = dataObject.calorie
      let currentTime = baseTool.zeroFormat(duration / 60 + "") + ":" + baseTool.zeroFormat(duration % 60 + "")
      let currentDistance = dataObject.distance
      for (let index = 0; index < dataList.length; ++index) {
        totalStep += dataList[index].step
      }
      that.redrawCircle(totalStep / target)
      that.setData({
        currentStep: totalStep,
        currentCal: currentCal,
        currentTime: currentTime,
        currentDistance: currentDistance
      })
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})