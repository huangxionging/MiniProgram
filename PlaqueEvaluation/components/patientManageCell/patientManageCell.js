// components/patientManageCell/patientManageCell.js
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
    patientDetailClick: function(e) {
      wx.navigateTo({
        url: "/pages/patientManage/patientDetail/patientDetail?playerId=" + this.data.data.playerId + "&name=" + this.data.data.name,
      })
    }
  }
})
