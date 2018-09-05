// components/videoItem/videoItem.js
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
    videoClick: function(e) {
      let that = this 
      that.triggerEvent('videoItemClick', that.data)
    }
  }
})
