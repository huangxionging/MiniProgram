// components/segment/segment.js
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    segmentClick: function(e) {
      let that = this
      baseTool.print(e)
      let indexPath = e.currentTarget.dataset.index

      that.triggerEvent('segmentItemClick', {
        indexPath: indexPath
      })
    }
  }
})
