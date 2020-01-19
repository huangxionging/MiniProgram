// components/brushContestDetaiCell/brushContestDetaiCell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },
    rank: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {},
    rank: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    brushReportClick: function() {
      let that = this

      if (that.data.data.recordId) {
        wx.navigateTo({
          url: '/pages/my/brushScoreReport/brushScoreReport?name=' + that.data.data.name + '&recordId=' + that.data.data.recordId,
        })
      }
    }
    
  }
})