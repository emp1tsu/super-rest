import { Router, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { Article } from '../../models/Articles'

const router: Router = Router()

// return a list of tags
router.get('/', function(req: any, res, next) {
  Article.find()
    .distinct('tagList')
    .then(function(tags) {
      return res.json({ tags: tags })
    })
    .catch(next)
})

module.exports = router

export const TagRouter: Router = router
