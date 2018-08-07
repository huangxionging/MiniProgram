// components/modalDialog/modalDialog.js
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
    preventTouch: function (e) {
      baseTool.print(e)
    },
    hideModal: function(e) {
      let that = this
      baseTool.print(e)
      that.triggerEvent('hideModal', {}, {})
    }
  }
})
