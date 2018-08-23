// components/newsComponent/newsComponent.js
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
    imageClick: function (e) {
      let that = this
      that.data.index = this.id
      this.triggerEvent('activityDelegate', that.data)
    },
    reportClick: function(e){
      let that = this
      that.data.index = this.id
      this.triggerEvent('activityDelegate', that.data)
    }
  }
})
