// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const userInfoCollection = db.collection("UserInfo")
  return await userInfoCollection.where({
    openid: wxContext.openid
  }).get().then(res => {
    console.log(res)
    console.log("黄雄")
    if (res.data.length == 0) {
      return undefined
    } else {
      return res.data[0]
    }
  }).catch(res => {
    console.log(res, "黄雄1")
  })
}