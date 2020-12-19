const PORT = process.env.port || 8080

const express = require('express')
const path = require('path').resolve()
const app = express()

app.get('/', (_, res) => res.redirect('/index.html'))
app.use(express.static(path + '/public'))

app.listen(PORT, () => console.log('Server is now on http://localhost:' + PORT))
