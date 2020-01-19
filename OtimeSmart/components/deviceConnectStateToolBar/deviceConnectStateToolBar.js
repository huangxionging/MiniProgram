// components/deviceConnectStateToolBar/deviceConnectStateToolBar.js
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
    data: {
      stateText: "无设备"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionClick: function(e) {
      let action = e.currentTarget.dataset.action
      let that = this
      that.triggerEvent('actionClick', {
        action: action
      })
    },
    closeToolBarClick: function(e){
      let that = this
      that.triggerEvent('closeToolBarClick')
    }
  }
})
