// components/deviceActionItemCell/deviceActionItemCell.js
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
    didSelectRowAtIndexPath: function () {
      let that = this
      baseTool.print(that.dataset)
      that.triggerEvent('didSelectRowAtIndexPath', {
        section: that.dataset.section,
        row: that.dataset.row
      })
    }
  }
})
