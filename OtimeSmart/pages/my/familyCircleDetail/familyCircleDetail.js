// pages/my/familyCircleDetail/familyCircleDetail.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const md5Tool = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyName: "",
    rowDataArray: [],
    showManager: false,
    userId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    baseTool.print(options)
    if (options.familyId) {
      that.data.familyId = options.familyId
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.loadData()
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
  loadData: function () {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("group_get_member", "新建家庭圈", {
      id: that.data.familyId
    }).then(res => {
      baseTool.print(res)
      let familyName = res.name
      let managerName = res.creator_name
      let rowDataArray = res.list
      let showManager = false
      let uid = baseNetLinkTool.getUserId()
      if (uid == res.creator_uid) {
        showManager = true
      }
      that.setData({
        familyName: familyName,
        managerName: managerName,
        rowDataArray: rowDataArray,
        showManager: showManager,
        userId: uid
      })
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  actionClick: function (e) {
    baseTool.print(e)
    let that = this
    let action = parseInt(e.currentTarget.dataset.action)
    switch (action) {
      case 0: {
        wx.scanCode({
          onlyFromCamera: false,
          scanType: ["qrCode"],
          success: function (res) {
            baseTool.print(res.result)
            let url = "xx?" + res.result
            let paramter = baseTool.getParameterFromURL(url)
            let code1 = paramter.code1, code2 = paramter.code2, code3 = paramter.code3, code4 = paramter.code4
            let scanValid = true
            if (code1 == undefined || code2 == undefined || code3 == undefined || code4 == undefined) {
              scanValid = false
            } else {
              let check1 = "code1=" + code1 + "&code2=" + code2
              if (md5Tool(check1) != code3) {
                scanValid = false
              } else {
                let check2 = "code1=" + code1 + "&code2=" + code2 + "&code3=" + code3
                if (md5Tool(check2) != code4) {
                  scanValid = false
                }
              }
            }
            if (scanValid == true) {
              that.addFamilyMember(code2)
            } else {
              baseTool.showToast("无法识别!")
            }
          },
          fail: function (res) {
            baseTool.showToast("扫码失败")
          },
          complete: function (res) { },
        })
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        that.disbandFamily()
        break;
      }
    }
  },
  addFamilyMember: function (uid) {
    let that = this
    wx.showLoading({
      title: "添加中...",
      mask: true,
    })
    baseNetLinkTool.getRemoteDataFromServer("group_add_member", "添加成员", {
      id: that.data.familyId,
      uid: uid
    }).then(res => {
      baseTool.print(res)
      that.loadData()
      baseTool.showToast("添加成功")
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  deleteRow: function (e) {
    baseTool.print(e)
    let uid = e.detail.uid
    wx.showLoading({
      title: "移除中...",
      mask: true,
    })
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("group_del_member", "删除成员", {
      id: that.data.familyId,
      uid: uid
    }).then(res => {
      baseTool.print(res)
      that.loadData()
      baseTool.showToast("移除成功")
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  disbandFamily: function () {

    let that = this
    that.setData({
      showModal: true,
      showModalData: {
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        title: "是否接解散家庭圈？",
        backgroundColor: "#171719",
        success: (result) => {
          baseTool.print(result)
          that.setData({
            showModal: false
          })
          if (result.confirm == true) {
            baseTool.print(result)
            wx.showLoading({
              title: "解散中...",
              mask: true,
            })
            let that = this
            baseNetLinkTool.getRemoteDataFromServer("group_cancel", "解散家庭圈", {
              id: that.data.familyId,
            }).then(res => {
              wx.hideLoading()
              baseTool.showToast("解散成功")
              baseMessageHandler.sendMessage("refresh", "刷新")
              wx.navigateBack()
              wx.navigateBack({
                delta: 1,
              })
            }).catch(res => {
              baseTool.print(res)
              wx.hideLoading()
              baseNetLinkTool.showNetWorkingError(res)
            })
          }

        }
      }
    })

    // wx.showModal({
    //   cancelColor: '#666666',
    //   cancelText: '取消',
    //   confirmColor: '#2283E2',
    //   confirmText: '确定',
    //   content: '是否接解散家庭圈？',
    //   showCancel: true,
    //   success: (result) => {
    //     if (result.confirm == true) {
    //       wx.showLoading({
    //         title: "解散中...",
    //         mask: true,
    //       })
    //       let that = this
    //       baseNetLinkTool.getRemoteDataFromServer("group_cancel", "解散家庭圈", {
    //         id: that.data.familyId,
    //       }).then(res => {
    //         wx.hideLoading()
    //         baseTool.showToast("解散成功")
    //         baseMessageHandler.sendMessage("refresh", "刷新")
    //         wx.navigateBack()
    //         wx.navigateBack({
    //           delta: 1,
    //         })
    //       }).catch(res => {
    //         baseTool.print(res)
    //         wx.hideLoading()
    //         baseNetLinkTool.showNetWorkingError(res)
    //       })
    //     }
    //   },
    //   title: '提示:',
    // })

  }
})