import { Router, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import auth from '../auth'
import { User } from '../../models/Users'

const router = Router()

// Preload user profile on routes with ':username'
router.param('username', function(req: any, res, next, username) {
  User.findOne({ username: username })
    .then(function(user) {
      if (!user) {
        return res.sendStatus(404)
      }

      req.profile = user

      return next()
    })
    .catch(next)
})

router.get('/:username', auth.optional, function(req: any, res, next) {
  if (req.payload) {
    User.findById(req.payload.id).then(function(user) {
      if (!user) {
        return res.json({ profile: req.profile.toProfileJSONFor(false) })
      }

      return res.json({ profile: req.profile.toProfileJSONFor(user) })
    })
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) })
  }
})

router.post('/:username/follow', auth.required, function(req: any, res, next) {
  var profileId = req.profile._id

  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401)
      }

      return user.follow(profileId).then(function() {
        return res.json({ profile: req.profile.toProfileJSONFor(user) })
      })
    })
    .catch(next)
})

router.delete('/:username/follow', auth.required, function(
  req: any,
  res,
  next
) {
  var profileId = req.profile._id

  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401)
      }

      return user.unFollow(profileId).then(function() {
        return res.json({ profile: req.profile.toProfileJSONFor(user) })
      })
    })
    .catch(next)
})

export const ProfileRouter: Router = router
