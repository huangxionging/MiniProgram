// components/showModalView/showModalView.js
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
      title: "提示",
      cancelText: "取消",
      confirmText: "确定",
      backgroundColor: "#171719"
    },
    result: {
      cancel: false,
      confirm: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelClick: function(e) {
      let that = this
      let success = that.data.data.success
      that.data.result.cancel = true
      that.data.result.confirm = false
      success({
        "result": that.data.result
      })
    },
    confirmClick: function() {
      let that = this
      let success = that.data.data.success
      that.data.result.confirm = true
      that.data.result.cancel = false
      success(that.data.result)
    }
  }
})
