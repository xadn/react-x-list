express = require 'express'
path = require 'path'

app = express()
app.use express.static path.join __dirname, '..'
app.listen 8000