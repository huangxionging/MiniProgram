// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const userDeviceCollection = db.collection("UserDevice")

  let queryDevicePromise = userDeviceCollection.where({
    openid: wxContext.OPENID,
    macAddress: event.macAddress
  }).get()

  let removePromise = queryDevicePromise.then(res => {
    if (res.data.length > 0) {
      let deviceObject = res.data[0]
      return userDeviceCollection.doc(deviceObject._id).remove()
    } else {
      return
    }
  })

  return await removePromise.then(res => {
    console.log(res)
    return
  })

  return await queryDevicePromise.catch(res)

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}