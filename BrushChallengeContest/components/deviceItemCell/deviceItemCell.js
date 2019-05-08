// components/deviceItemCell/deviceItemCell.js
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
    data: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    lightDeviceClick: function() {
      let that = this
      let row = that.dataset.row
      baseTool.print(that.dataset)
      that.triggerEvent('lightDeviceClick', {
        row: row,
        section: that.dataset.section,
        deviceId: that.dataset.deviceid,
      })
    }
  }
})
