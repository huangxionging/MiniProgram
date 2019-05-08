// components/deviceCheckItemCell/deviceCheckItemCell.js
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
    data: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    lightClick: function(e) {
      let that = this
      let deviceId = that.data.data.deviceId
      if (deviceId) {
        that.triggerEvent('lightClick', {
          section: that.dataset.section,
          row: that.dataset.row,
          deviceId: deviceId
        })
      }
    }
  }
})
