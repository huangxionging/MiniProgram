
// 测试环境
var baseURL = 'https://dev-dos.32teeth.cn/mini/doctorOfflinegame/'
var debug = true
if (!debug) {
  // 正式环境
  baseURL = 'https://dos.32teeth.cn/mini/doctorOfflinegame/'
}

module.exports = {
  getBaseURL() {
    return baseURL
  }
}
