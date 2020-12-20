const knex = require('knex')
const connection = { host: 'localhost', port: 3306, user: 'eodiga', database: 'eodiga' }
const db = knex({ client: 'mysql', connection })

async function clearCooldown (ip) {
  const query = db.delete().from('cooldown')

  if (ip) query.where({ ip })
  await query
}

function isURL (url) {
  const strRegexp =
    "^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
    + "|([0-9a-z_!~*'()-]+\.)*"
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
    + "[a-z]{2,6})(:[0-9]{1,4})?((/?)|"
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"

  const regexp = new RegExp(strRegexp)
  return regexp.test(url)
}

module.exports = { db, clearCooldown, isURL }
