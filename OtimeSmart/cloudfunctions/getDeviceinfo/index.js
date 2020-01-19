// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const userDeviceCollection = db.collection("UserDevice")

  return userDeviceCollection.where({
    openid: wxContext.OPENID
  }).get().then(res => {
    if (res.data.length > 0) {
      return {
        data: {
          deviceInfo: res.data.length > 0 ? res.data[0] : undefined
        },
        code: "success"
      }
    }
  }).catch(res => {

  })
}