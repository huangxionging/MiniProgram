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

/**
 * code: 用户的 code 码, userInfoData, 用户的信息数据
 */
function getLoginUserInfo(code, userInfoData) {
  baseTool.print(code)
  let userInfo = userInfoData.userInfo
  baseTool.print(userInfo)
  let data = {
    'code': code
  }

  // 头像
  if (userInfo.avatarUrl) {
    data.headimgurl = userInfo.avatarUrl
  }
  // 昵称
  if (userInfo.nickName) {
    data.nickname = userInfo.nickName
  }
  // 性别
  if (userInfo.gender) {
    data.sex = userInfo.gender
  }
  // 语言
  if (userInfo.language) {
    data.language = userInfo.language
  }
  // 国家
  if (userInfo.country) {
    data.country = userInfo.country
  }
  // 省份
  if (userInfo.province) {
    data.province = userInfo.province
  }
  // 城市
  if (userInfo.city) {
    data.city = userInfo.city
  }
  if (userInfoData.encryptedData) {
    data.encryptedData = userInfoData.encryptedData
  }

  if (userInfoData.iv) {
    data.iv = encodeURI(userInfoData.iv)
    encodeURI()
    encodeURIComponent()
  }
  return data;
}

module.exports = {
  telphoneAdapter: telphoneAdapter,
  getLoginUserInfo: getLoginUserInfo,
}