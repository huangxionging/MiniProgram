// component/doctorInfo/doctorInfo.js
const baseTool = require('../../utils/baseTool.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatar: {
      type: String,
      value: ""
    },
    name: {
      type: String,
      value: ""
    },
    department: {
      type: String,
      value: ""
    },
    jobTitle: {
      type: String,
      value: ""
    },
    hospital: {
      type: String,
      value: ""
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
    onTapClick: function(e) {
      let that = this
      baseTool.print(e)
      that.triggerEvent('doctorInfoClick', {}, {})
    }
  }
})
