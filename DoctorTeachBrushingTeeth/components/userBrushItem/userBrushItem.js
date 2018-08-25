// components/userBrushItem/userBrushItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },
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
    reportTapClick: function(e) {
      let that = this
      this.triggerEvent('reportTap', that.data)
    },
    selectDeviceClick: function(e) {
      let that = this
      this.triggerEvent('selectDeviceClick', that.data)
    }
  }
})