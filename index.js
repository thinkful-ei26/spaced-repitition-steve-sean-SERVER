'use strict'

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const bodyParser = require('body-parser')
const { PORT, CLIENT_ORIGIN } = require('./config')
const { dbConnect } = require('./db-mongoose')
const { router: userRouter } = require('./users')
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')
const { router: wordRouter } = require('./words')

const app = express()

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
)

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)
passport.use(localStrategy)
passport.use(jwtStrategy)

app.use(bodyParser.json())
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/word', wordRouter)

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`)
    })
    .on('error', err => {
      console.error('Express failed to start')
      console.error(err)
    })
}

if (require.main === module) {
  dbConnect()
  runServer()
}

module.exports = { app }
