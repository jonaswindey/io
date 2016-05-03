const debug = require('debug')
const express = require('express')
const path = require('path')
const port = process.env.APP_PORT_WEB || 8080
const app = express()

debug.enable('dev')

app.use(express.static(__dirname + '/dist'))

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.listen(port)
app.listen(function(err) {
  if (err) debug('dev')(err)
  debug('dev')(`Static server started on port ${port}`)
})
