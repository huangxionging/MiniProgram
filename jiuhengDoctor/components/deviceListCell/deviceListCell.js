// components/deviceListCell/deviceListCell.js
const baseTool = require('../../utils/baseTool.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {},
    startX: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart: function(e) {
      let that = this
      // baseTool.print(e)
      let startX = baseTool.toRpx(e.touches[0].clientX)
      if (e.touches.length == 1 && (that.data.data.style != "margin-left:-187.5rpx" || (that.data.data.style === "margin-left:-187.5rpx" && startX < 562.5))) {
        that.setData({
          //设置触摸起始点水平方向位置
          startX: startX
        });
        // baseTool.print(that.data)
      }
    },
    touchMove: function(e) {
      // baseTool.print(e)
      let that = this
      let moveX = baseTool.toRpx(e.touches[0].clientX)
      if (e.touches.length == 1 && (that.data.data.style != "margin-left:-187.5rpx" || (that.data.data.style === "margin-left:-187.5rpx" && moveX < 562.5))) {
        // 移动的距离

        let disX = that.data.startX - moveX
        let delButtonWidth = 187.5
        let style = ""
        // 没动或者往右
        if (disX == 0 || disX < 0) {
          style = "margin-left:0rpx"
        } else if (disX > 0) {
          style = "margin-left:-" + disX + "rpx"
          if (disX >= delButtonWidth) {
            style = "margin-left:-" + delButtonWidth + "rpx"
          }
        }
        let data = that.data.data
        data.style = style
        that.setData({
          data: data
        })
        // baseTool.print(that.data)
      }
    },
    touchEnd: function(e) {
      // baseTool.print(e)
      let that = this
      let endX = baseTool.toRpx(e.changedTouches[0].clientX)
      if (e.changedTouches.length == 1 && (that.data.data.style != "margin-left:-187.5rpx" || (that.data.data.style === "margin-left:-187.5rpx" && endX < 562.5))) {

        let disX = that.data.startX - endX
        let delButtonWidth = 187.5
        let style = disX > delButtonWidth / 2 ? "margin-left:-" + delButtonWidth + "rpx" : "margin-left:0rpx";
        let data = that.data.data
        data.style = style
        that.setData({
          data: data
        })
        // baseTool.print(that.data)
      }
    },
    delClick: function(e) {
      let that = this
      baseTool.print(that.dataset.row)
      that.triggerEvent('delClick', {
        section: that.dataset.section,
        row: that.dataset.row,
        deviceId: that.dataset.deviceid
      })
    },
  }
})