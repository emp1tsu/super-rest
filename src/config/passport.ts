import passport from 'passport'
import { Strategy } from 'passport-local'
import mongoose from 'mongoose'
import { IUserModel } from '../models/Users'

const User = mongoose.model<IUserModel>('User')

passport.use(
  new Strategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    function(email, password, done) {
      User.findOne({ email: email })
        .then(function(user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              message: 'email or password is invalid'
            })
          }

          return done(null, user)
        })
        .catch(done)
    }
  )
)
