// pages/contest/selectContestUser/selectContestUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingDone: true,
    hasData: true,
    dataList: [
      {
        id: 1,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 2,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 3,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 4,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 5,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 6,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 7,
        name: '滴滴',
        item: {
          isSelect: false
        }
      },
      {
        id: 8,
        name: '滴滴',
        item: {
          isSelect: false
        }
      }, {
        id: 9,
        name: '滴滴',
        item: {
          isSelect: false
        }
      }
    ],
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
  addContestUser: () => {
    wx.navigateTo({
      url: '../addContestUser/addContestUser',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  selectClick: function(e) {
  }
})