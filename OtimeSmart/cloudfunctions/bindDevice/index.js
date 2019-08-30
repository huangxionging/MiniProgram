// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const userDeviceCollection = db.collection("UserDevice")

  let queryDevicePromise = userDeviceCollection.where({
    openid: wxContext.OPENID
  }).get()

  let addOrUpdatePromise = queryDevicePromise.then(res => {
    if (res.data.length == 0) {
      return userDeviceCollection.add({
        data: {
          macAddress: event.macAddress ? event.macAddress : "",
          deviceName: event.deviceName ? event.deviceName : "",
          iosDeviceId: event.iosDeviceId ? event.iosDeviceId : "0",
          androidDeviceId: event.androidDeviceId ? event.androidDeviceId : "",
          localName: event.localName ? event.localName : "",
          openid: wxContext.OPENID,
          date: new Date()
        }
      })
    } else {
      let object = res.data[0]
      return userDeviceCollection.doc(object._id).update({
        data: {
          macAddress: event.macAddress ? event.macAddress : "",
          deviceName: event.deviceName ? event.deviceName : "",
          iosDeviceId: event.iosDeviceId ? event.iosDeviceId : "0",
          androidDeviceId: event.androidDeviceId ? event.androidDeviceId : "",
          localName: event.localName ? event.localName : "",
          openid: wxContext.OPENID,
          date: new Date()
        }
      })
    }
  })

  let queryNewDevicePromise = addOrUpdatePromise.then(res => {
    return userDeviceCollection.where({
      openid: wxContext.OPENID
    }).get()
  })
  return await queryNewDevicePromise.then(res => {
    console.log(res)
    return {
      data: {
        deviceInfo: res.data.length > 0 ? res.data[0] : undefined
      },
      code: "success"
    }
  })

  return  await queryDevicePromise.catch(res => {
    return {
      code: "fail",
      data: {}
    }
  })
}