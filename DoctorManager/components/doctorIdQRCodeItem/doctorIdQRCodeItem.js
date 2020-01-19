// components/doctorIdQRCodeItem/doctorIdQRCodeItem.js
const baseTool = require('../../utils/baseTool.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: String,
      value: ''
    },
    index: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    saveBrushClick: function(e) {
      let that = this
      that.triggerEvent('saveBrushClick', {
        doctorId: that.data.data
      })
    },
    previewBrushClick: function (e) {
      let that = this
      that.triggerEvent('previewBrushClick', {
        doctorId: that.data.data
      })
    },
    saveManagerClick: function (e) {
      let that = this
      that.triggerEvent('saveManagerClick', {
        doctorId: that.data.data
      })
    },
    previewManagerClick: function (e) {
      let that = this
      that.triggerEvent('previewManagerClick', {
        doctorId: that.data.data
      })
    },
  }
})
