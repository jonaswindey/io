const debug = require('debug')
const superstatic = require('superstatic').server
debug.enable('dev')

if (!process.env.APP_PORT_WEB) debug('dev')(`No APP_PORT_WEB specified`)
else {
  const app = superstatic(
    {
      port: process.env.APP_PORT_WEB,
      config: {
        public: './dist',
        rewrites: [
          {'source':'/**','destination':'/index.html'},
          {'source':'/**.js','destination':'/'},
        ]
      },
      cwd: __dirname,
      gzip: true,
      debug: false
    }
  )
  app.listen(function(err) {
    if (err) debug('dev')(err)
    debug('dev')(`Static server started on port ${process.env.APP_PORT_WEB}`)
  })
}
