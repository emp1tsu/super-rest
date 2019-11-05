import { Router, Request, Response, NextFunction } from 'express'
import User from './users'
import Profile from './profiles'
import Article from './articles'
import Tag from './tags'

const router: Router = Router()

router.use('/', User)
router.use('/profiles', Profile)
router.use('/articles', Article)
router.use('/tags', Tag)

router.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        // @ts-ignore
        errors[key] = err.errors[key].message

        return errors
      }, {})
    })
  }

  return next(err)
})

export default router
