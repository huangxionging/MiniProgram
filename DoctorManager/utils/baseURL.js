
// 测试环境
let baseDomain = 'https://dev-dos.32teeth.cn/'
let baseBrushDomain = 'https://dev-os.32teeth.cn/'
let debug = true
if (!debug) {
  // 正式环境
  baseDomain = 'https://dos.32teeth.cn/'
  baseBrushDomain = 'https://os.32teeth.cn/'
}

module.exports = {
  /**
   * 域名 正式环境和测试环境的域名
   */
  baseDomain: baseDomain,
  /**
   * 刷牙数据上传域名
   */
  baseBrushDomain: baseBrushDomain,
  /**
   * 基本路径
   */
  basePath: 'mini/doctorInfoEdit/',
  /**
   * 现在处于正式环境还是测试状态
   */
  baseState: debug
}
