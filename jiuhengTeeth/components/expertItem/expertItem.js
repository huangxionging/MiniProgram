// components/expertItem/expertItem.js
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
    expertListClick: function() {
      let that = this
      let linkUrl = that.data.data.linkUrl
      if (!linkUrl) {
        return
      }
      that.triggerEvent('expertListClick', {
        link: linkUrl
      })
    }
  }
})