// components/addDeviceItemCell/addDeviceItemCell.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDeviceClick: function(e) {
      let that = this
      that.triggerEvent('bindDeviceClick', {
        section: that.dataset.section,
        row: that.dataset.row,
        data: that.data.data
      })
    }
  }
})
