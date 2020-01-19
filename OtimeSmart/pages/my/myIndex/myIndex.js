// pages/my/myIndex/myIndex.js
const app = getApp()
const baseTool = require('../../../utils/baseTool.js')
const myAdapter = require('../../../adapter/myAdapter.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../../utils/baseCloundNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loadDone: true,
  },
  currentAction: -1,

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
    baseTool.print(that.data)
    let login = false
    let token = baseNetLinkTool.getToken()
    if (token.length > 0) {
      login = true
    }
    that.setData({
      login: login,
      userInfo: baseNetLinkTool.getUserInfo()
    })
    that.registerCallBack()
    that.connectDevice()
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
    let that = this
    that.removeCallBack()
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
  editUserInfoClick: function() {
    wx.navigateTo({
      url: '/pages/my/editMyInfo/editMyInfo'
    })
  },
  loadData: function () {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let sectionDataArray = myAdapter.myIndexSectionDataArray()
    baseTool.print(deviceInfo)
    if (deviceInfo.deviceName != undefined) {
      sectionDataArray[0].rowDataArray[0].title = deviceInfo.deviceName
    }
    if (baseTool.valueForKey("sedentaryReminder") != undefined){
      sectionDataArray[2].rowDataArray[0].detail = baseTool.valueForKey("sedentaryReminder") + " 分钟"
      sectionDataArray[2].rowDataArray[0].value = baseTool.valueForKey("sedentaryReminder")
    } else {
      that.readSedentaryReminder()
    }

    if (baseTool.valueForKey("synSystemUnit") != undefined) {
      let synSystemUnit = baseTool.valueForKey("synSystemUnit")
      sectionDataArray[3].rowDataArray[0].detail = (synSystemUnit == 1) ? "英制": "公制"
      sectionDataArray[3].rowDataArray[0].value = synSystemUnit
    } else {
      that.readSynSystemUnit()
    }
    that.setData({
      sectionDataArray: sectionDataArray
    })
    
  },
  didSelectRow: function (e) {
    let token = baseNetLinkTool.getToken()
    if (!token) {
      baseTool.showToast("该功能需要登录才能使用相关功能!")
      return
    }
    let that = this
    let row = e.detail.row
    let section = e.detail.section
    let url = that.data.sectionDataArray[section].rowDataArray[row].url
    let tip = that.data.sectionDataArray[section].rowDataArray[row].title
    switch (section) {
      case 0:
      case 1: {
        wx.navigateTo({
          url: url
        })
        break
      }
      case 2: {
        switch (row) {
          case 0: {
            break;
          }
          // case 1: {
          //   // baseDeviceSynTool.commandSettingTime()
          //   break
          // }
          case 1: {
            wx.showLoading({
              title: "查找设备中...",
              mask: true
            })
            let state = baseDeviceSynTool.getDeviceConnectedState()
            if(state.code != 1002) {
              baseTool.showToast("蓝牙打开失败")
            } else {
              let key = baseDeviceSynTool.commandDindDevice()
              baseDeviceSynTool.registerCallBackForKey((res => {
                baseTool.print(["通知信息", res])
                if (res.length < 10) {
                  baseTool.showToast("查找失败")
                  return
                }
                let result = parseInt(res.substr(6, 2))
                baseTool.print(result)
                if (result == 1) {
                  baseTool.showToast("查找成功")
                } else {
                  baseTool.showToast("查找失败")
                }
                
              }), key)
            }
            break
          }
        } 
      }
      case 3: {
        switch (row) {
          case 0: {
            break
          }
          case 1: {
            break
          }
          case 2: {
            
            break
          }
        } 
      }
    }
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.loadData()
    }).then(res => {
      baseTool.print(res)
      that.loadData()
    })
    baseMessageHandler.addMessageHandler("deviceConnectedState", that, res => {
      baseTool.print(res)
    }).then(res => {
      baseTool.print(res)
    })

  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  connectDevice: function() {
    let state = baseDeviceSynTool.getDeviceConnectedState()
    // 未连接
    if (state.code != 1002) {
      baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
        let deviceInfo = baseNetLinkTool.getDeviceInfo()
        if (deviceInfo.macAddress) {
          baseDeviceSynTool.connectDeviceFlow(deviceInfo)
        }
      }).catch(res => {
        baseTool.print(res)
        baseTool.showToast("蓝牙打开失败")
      })
    }
  },
  authClick: function() {
    baseNetLinkTool.gotoAuthorization()
  },
  indexSelectClick: function(e) {
    let that = this
    let section = e.currentTarget.dataset.section
    let row = e.currentTarget.dataset.row
    let value = e.detail.value
    switch(section) {
      case 2: {
        switch(row) {
          case 0: {
            that.setSedentaryReminder(value)
            break
          }
        }
        break
      }
      case 3: {
        switch(row) {
          case 0: {
            that.setSyetemUnit(value)
            break;
          }
        }
        break;
      }
    }
  },
  setSedentaryReminder: function(e) {
    baseTool.print([e, "订单订单"])
    let that = this
    wx.showLoading({
      title: "设置久坐提醒...",
      mask: true
    })
    let index = e
    let state = baseDeviceSynTool.getDeviceConnectedState()
    if(state.code != 1002) {
      baseTool.showToast("蓝牙打开失败")
    } else {
      let key = baseDeviceSynTool.commandSetSedentaryReminder(index)
      baseDeviceSynTool.registerCallBackForKey((res => {
        baseTool.print(["通知信息", res])
        baseDeviceSynTool.removeCallBackForKey(key)
        if (res.length < 10) {                                  
          return
        }
        let type = parseInt(res.substr(6, 2))
        let result = parseInt(res.substr(8, 2))
        baseTool.print(result)
        if (type == 1 && result == 1) {
          baseTool.showToast("设置成功")
          baseTool.setValueForKey(index, "sedentaryReminder")
          if (baseTool.valueForKey("sedentaryReminder") != undefined){
            let sectionDataArray = that.data.sectionDataArray
            sectionDataArray[2].rowDataArray[0].detail = baseTool.valueForKey("sedentaryReminder") + " 分钟"
            sectionDataArray[2].rowDataArray[0].value = baseTool.valueForKey("sedentaryReminder")
            that.setData({
              sectionDataArray: sectionDataArray
            })
          }
        } else {
          baseTool.showToast("设置失败")
        }
        
      }), key)
    }
  },
  readSedentaryReminder: function() {
    let that = this
    let state = baseDeviceSynTool.getDeviceConnectedState()
    if(state.code == 1002) {
      let key = baseDeviceSynTool.commandReadSedentaryReminder()
      baseDeviceSynTool.registerCallBackForKey((res => {
        baseTool.print(["读取久坐提醒数据通知信息", res])
        // 删除通道函数
        baseDeviceSynTool.removeCallBackForKey(key)
        if (res.length < 10) {                                  
          return
        }
        let type = parseInt(res.substr(6, 2))
        let result = parseInt(res.substr(8, 2))
        baseTool.print(result)
        if (type == 0) {
          baseTool.setValueForKey(result, "sedentaryReminder")
          if (baseTool.valueForKey("sedentaryReminder") != undefined){
            let sectionDataArray = that.data.sectionDataArray
            sectionDataArray[2].rowDataArray[0].detail = baseTool.valueForKey("sedentaryReminder") + " 分钟"
            sectionDataArray[2].rowDataArray[0].value = baseTool.valueForKey("sedentaryReminder")
            that.setData({
              sectionDataArray: sectionDataArray
            })
          }
        }
      }), key)
    }
  },
  setSyetemUnit: function(e) {
    baseTool.print(e)
    let that = this
    wx.showLoading({
      title: "设置计量单位...",
      mask: true
    })
    let index = e
    let state = baseDeviceSynTool.getDeviceConnectedState()
    if(state.code != 1002) {
      baseTool.showToast("蓝牙打开失败")
    } else {
      let key = baseDeviceSynTool.commandSynSystemUnit(index)
      baseDeviceSynTool.registerCallBackForKey((res => {
        baseTool.print(["通知信息", res])
        baseDeviceSynTool.removeCallBackForKey(key)
        if (res.length < 10) {                                  
          return
        }
        let type = parseInt(res.substr(6, 2))
        let result = parseInt(res.substr(8, 2))
        baseTool.print(result)
        if (type == 1 && result == 1) {
          baseTool.showToast("设置成功")
          baseTool.setValueForKey(index, "synSystemUnit")
          if (baseTool.valueForKey("synSystemUnit") != undefined){
            let sectionDataArray = that.data.sectionDataArray
            sectionDataArray[3].rowDataArray[0].detail = (index == 1) ? "英制" : "公制" 
            sectionDataArray[3].rowDataArray[0].value = index
            that.setData({
              sectionDataArray: sectionDataArray
            })
          }
        } else {
          baseTool.showToast("设置失败")
        }
        
      }), key)
    }
  },
  readSynSystemUnit: function() {
    let that = this
    let state = baseDeviceSynTool.getDeviceConnectedState()
    if(state.code == 1002) {
      let key = baseDeviceSynTool.commandReadSystemUnit()
      baseTool.print("同步")
      baseDeviceSynTool.registerCallBackForKey((res => {
        baseTool.print(["读取久制式通知信息", res])
        // 删除通道函数
        baseDeviceSynTool.removeCallBackForKey(key)
        if (res.length < 16) {                                  
          return
        }
        // ca08220000000001
        let type = parseInt(res.substr(6, 2))
        let result = parseInt(res.substr(12, 2))
        if (type == 0) {
          baseTool.print(result)
          baseTool.setValueForKey(result, "synSystemUnit")
          if (baseTool.valueForKey("synSystemUnit") != undefined){
            let sectionDataArray = that.data.sectionDataArray
            sectionDataArray[3].rowDataArray[0].detail = (result == 1) ? "英制" : "公制" 
            sectionDataArray[3].rowDataArray[0].value = result
            that.setData({
              sectionDataArray: sectionDataArray
            })
          }
        }
          
      }), key)
    }
  }
})