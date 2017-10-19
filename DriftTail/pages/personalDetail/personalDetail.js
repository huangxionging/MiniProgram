// pages/personalDetail/personalDetail.js
var datas = [
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '0',
    money: 1
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '1',
    money: 1.5
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '2',
    money: 2
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '3',
    money: 3.0
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '4',
    money: 1
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '5',
    money: 0.23
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '6',
    money: 1
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '7',
    money: 1
  }, 
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '8',
    money: 1
  },
  {
    name: '使用费用',
    date: '2017-09-11',
    uinique: '9',
    money: 1
  }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArray: []
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
    var detailData = [];
    for(var index = 0; index < datas.length; ++index){
      detailData.push(datas[index])
    }
    console.log(detailData)
    this.setData({
      dataArray: detailData
    })
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
  
  }
})