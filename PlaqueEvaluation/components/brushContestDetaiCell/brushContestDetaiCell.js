// components/brushContestDetaiCell/brushContestDetaiCell.js
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
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
        baseMessageHandler.postMessage("previewReport", res => {
          res({
            url: baseNetLinkTool.getWebDomain() + 'web/plaqueEvaluating/report/index.html?',
            name: that.data.data.name,
            recordId: that.data.data.recordId,
            playerId: that.data.data.playerId
          })
        }).then(res => {
          wx.navigateTo({
            url: '/pages/showScreen/signUp/signUp?',
          })
        }).catch(res => {
          baseTool.print(res)
        })
      }
    }
    
  }
})