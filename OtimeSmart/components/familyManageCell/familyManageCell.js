// components/familyManageCell/familyManageCell.js
const baseTool = require('../../utils/baseTool.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },
    showManager: {
      type: Boolean,
      value: false
    },
    managerId: {
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
    deleteRow: function(e) {
      let that = this
      baseTool.print(that.dataset)
      let uid = that.data.data.id
      that.triggerEvent('deleteRow', {
        row: that.dataset.row,
        uid: uid
      })
    }
  }
})
