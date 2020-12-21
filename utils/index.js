const knex = require('knex')
const connection = { host: 'localhost', port: 3306, user: 'eodiga', database: 'eodiga' }
const db = knex({ client: 'mysql', connection })

async function clearCooldown (ip) {
  const query = db.delete().from('cooldown')

  if (ip) query.where({ ip })
  await query
}

function isURL (url) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i') // fragment locator
  return !!pattern.test(url)
}

module.exports = { db, clearCooldown, isURL }
