const PORT = process.env.port || 8080

const path = require('path').resolve()
const express = require('express')
const randStr = require('crypto-random-string')
const { db, clearCooldown, isURL } = require('./utils')
const CryptoJS = require('crypto-js')

const app = express()
clearCooldown()

app.get('/', (req, res) => {
  if (req.query.passwd) return res.sendFile(path + '/public/passwd.html')
  res.sendFile(path + '/public/index.html')
})

app.use('/_', express.static(path + '/public'))
app.post('/_', express.urlencoded({ extended: false }))
app.post('/_', async (req, res, next) => {
  if (req.query.type !== 'demo') return next()
  let { url, option, captcha = false, passwd_need = false, passwd } = req.body

  const [exists] = await db.select('*').from('cooldown').where({ ip: req.ip })
  if (exists) return res.redirect('/?alert=cooldown')

  if (!url) return res.redirect('/?alert=url')
  if (!isURL(url)) return res.redirect('/?alert=url')
  if (!option) captcha = passwd_need = false

  if (passwd_need && !passwd) return res.redirect('/?alert=passwd')
  if (passwd_need) url = CryptoJS.AES.encrypt(url, passwd).toString()

  const id = randStr({ length: 10, type: 'url-safe' })
  await db.insert({ id, url, captcha, passwd: !!passwd_need }).into('shorts')
  await db.insert({ ip: req.ip }).into('cooldown')

  res.redirect('/?done=' + id)

  setTimeout(() => clearCooldown(req.ip), 10000)
})
app.use('/_', (_, res) => res.redirect('/'))

app.get('/:id', async (req, res, next) => {
  const [exists] = await db.select('*').from('shorts').where({ id: req.params.id })
  if (!exists) return next()
  if (exists.passwd) return res.redirect('/?passwd=' + encodeURIComponent(exists.url))

  res.redirect(exists.url)
})
app.use((_, res) => res.redirect('/'))

app.listen(PORT, () => console.log('Server is now on http://localhost:' + PORT))
