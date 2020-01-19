// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  return await db.collection("UserSynData").where({
    openid: wxContext.OPENID
  }).orderBy("synTime", "desc").limit(1).get().then(res => {
    return {
      openid: wxContext.OPENID,
      data: res,
    }
  }).catch(res => {
    return {
      openid: wxContext.OPENID,
      data: res,
    }
  })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}