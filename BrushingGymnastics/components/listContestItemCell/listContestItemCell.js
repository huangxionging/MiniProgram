// components/listContestItemCell/listContestItemCell.js
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
    selectClick:function(e) {    
      let that = this
      that.triggerEvent('didSelect', {
        section: that.dataset.section,
        row: that.dataset.row
      }) 
    }
  }
})
