const { GenshinKit } = require('genshin-kit')
const { Session } = require('koishi-core')
const { template, segment } = require('koishi-utils')
const { disableCookie } = require('../modules/database')

module.exports.errorMap = {
  '-10001': '米游社协议异常，请更新 genshin-kit。',
  10001: '登录状态异常，请检查 cookie。',
  10101: '当前账号查询人数达到上限。',
  10102: '被查询者米游社信息未公开。',
}

module.exports.getErrMsg = function(err) {
  return template(
    'genshin.failed',
    errorMap[err.code] || err.message || template('genshin.error_unknown'),
    err.code
  )
}

/**
 * @param {Session} session
 * @param {GenshinKit} genshin
 * @param {*} err
 */
module.exports.handleError = async function(session, genshin, err) {
  if (err.code === 10101) {
    await session.send(template('genshin.donate.current_runout'))
    await disableCookie(session, genshin.cookie)
    return
  }
  return session.send(segment.quote(session.messageId) + getErrMsg(err))
}
