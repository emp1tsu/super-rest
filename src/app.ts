import http from 'http'
import path from 'path'
import methods from 'methods'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import cors from 'cors'
import passport from 'passport'
import errorhandler from 'errorhandler'
import mongoose from 'mongoose'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

require('./db/db')
const port = process.env.PORT


app.use(express.json())
// app.use(userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
