
// 测试环境
let baseDomain = 'https://dev-dos.32teeth.cn/'
let baseBrushDomain = 'https://dev-os.32teeth.cn/'
let socketDomain = 'wss://dev-dos.32teeth.cn/'
let debug = false
if (!debug) {
  // 正式环境
  baseDomain = 'https://dos.32teeth.cn/'
  baseBrushDomain = 'https://os.32teeth.cn/'
  socketDomain = 'wss://dos.32teeth.cn/'
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
   * socket 域名
   */
  socketDomain: socketDomain,
  /**
   * 基本路径
   */
  basePath: 'mini/clinicserveClient/',
  /**
   * socket 路径
   */
  socketPath: 'mini/socket/challengeGame/',
  /**
   * 现在处于正式环境还是测试状态
   */
  baseState: debug,
  /**
   * 诊所 id
   */
  clinicId: '8a9951365a4c137f015a8da47d2c009b',
  /**
   * 小程序标识
   */
  appletCode: 'jiuhengDentalClinicClient',
  /**
   * 版本号
   */
  appVersion: '1.0.3'
}
