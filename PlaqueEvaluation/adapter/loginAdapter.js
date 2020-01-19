const baseTool = require('../utils/baseTool.js')
/**
 * 绑定手机号
 */
function telphoneAdapter(wxUser = {}) {
baseTool.print([wxUser, 'dddd'])
  if (wxUser.telephone) {
    baseTool.setValueForKey(wxUser.telephone, 'telephone')
  }

  if (wxUser.memberId) {
    baseTool.setValueForKey(wxUser.memberId, 'memberId')
  }
}

module.exports = {
  telphoneAdapter: telphoneAdapter,
}