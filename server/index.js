import http from 'http'
import path from 'path'
import express from 'express'
import swig from 'swig'
import morgan from 'morgan'
import compression from 'compression'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../tools/webpack.client.dev'
import { compileDev, startDev } from '../tools/dx'

const app  = express();
const Swig = new swig.Swig();

const __PROD__ = process.env.NODE_ENV === 'production'
const __TEST__ = process.env.NODE_ENV === 'test'

if (__PROD__ || __TEST__) {
  app.use(morgan('combined'))
  app.use(compression())
  if (__PROD__) {
    assets = require('../assets.json')
  }
} else {
  app.use(morgan('dev'))
  const compiler = compileDev((webpack(webpackConfig)), 3000)
  app.use(webpackDevMiddleware(compiler, {
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }))
  app.use(webpackHotMiddleware(compiler, { log: console.log }))
}

app.disable('x-powered-by')
app.engine('html', Swig.renderFile)
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.render('index', { 
    vendorjs:  __PROD__ ? assets.vendor.js : '/vendor.js',
    bundlejs: __PROD__ ? assets.main.js : '/main.js'
  });
});

const server = http.createServer(app)

server.listen(3000, (err) => {
  if (__PROD__ || __TEST__) {
    if (err) console.log(err)
    console.log(`server listening on port 3000`)
  } else {
    startDev(3000, err)
  }
})