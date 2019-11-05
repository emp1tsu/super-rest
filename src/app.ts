import http from 'http'
import path from 'path'
import methods from 'methods'
import express, { Response, Request, NextFunction } from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import cors from 'cors'
import passport from 'passport'
import errorhandler from 'errorhandler'
import mongoose from 'mongoose'
import morgan from 'morgan'
import methodOverride from 'method-override'

import routers from './routers'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodOverride())
app.use(express.static(__dirname + '/public'))

app.use(
  session({
    secret: 'conduit',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
)

if (!isProduction) {
  app.use(errorhandler())
}

require('./db/db')
require('./models/Users')
require('./models/Articles')
require('./models/Comments')
require('./config/passport')

app.use(routers)

// catch 404 & forwart to error handler
app.use(function(req, res, next) {
  try {
    throw new Error('Not Found')
  } catch (err) {
    next(err)
  }
})

if (!isProduction) {
  app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err.stack)

    res.status(err.status || 500)

    res.json({
      error: {
        message: err.message,
        error: err
      }
    })
  })
}

app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message,
      error: {}
    }
  })
})

const port = process.env.PORT || 3000

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
})
