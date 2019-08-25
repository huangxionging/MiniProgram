// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const userInfoCollection = db.collection("UserInfo")
  
  let checkPromise = userInfoCollection.where({
    openid: wxContext.OPENID
  }).get()

  checkPromise.catch(res => {
    console.log(res)
  })

  let addOrUpdatePromise = checkPromise.then(res => {
    if (res.data.length == 0) {
      return userInfoCollection.add({
        data: {
          isLogin: true,
          nickName: event.nickName ? event.nickName : "",
          gender: event.gender ? event.gender : "1",
          city: event.city ? event.city : "",
          province: event.province ? event.province : "",
          avatarUrl: event.avatarUrl ? event.avatarUrl : "",
          openid: wxContext.OPENID,
          date: new Date()
        }
      })
    } else {
      let object = res.data[0]
      return userInfoCollection.doc(object._id).update({
        data: {
          isLogin: event.isLogin,
          nickName: event.nickName ? event.nickName : "",
          gender: event.gender ? event.gender : "1",
          city: event.city ? event.city : "",
          province: event.province ? event.province : "",
          avatarUrl: event.avatarUrl ? event.avatarUrl : "",
          openid: wxContext.OPENID,
          date: new Date(),
        }
      })
    }
  })

  // 所有查询Promise
  let queryAllPromise = addOrUpdatePromise.then(res => {
    let queryUserInfoPromise = userInfoCollection.where({
      openid: wxContext.OPENID
    }).get()
    const userDeviceCollection = db.collection("UserDevice")
    let queryDevicePromise = userDeviceCollection.where({
      openid: wxContext.OPENID
    }).get()
    let queryPromiseList = [queryUserInfoPromise, queryDevicePromise]
    return Promise.all(queryPromiseList)
  })

  return await queryAllPromise.then(res => {
    console.log(res)
    return {
      data: {
        userInfo: res[0].data.length > 0 ? res[0].data[0] : undefined,
        deviceInfo: res[1].data.length > 0 ? res[1].data[0]: undefined
      },
      code: "success"
    }
  }).catch(res => {
    console.log(res)
    return {
      data: res,
      code: "fail"
    }
  })

}