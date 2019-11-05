import express from 'express'
import users from './users'
import profiles from './profiles'
import articles from './articles'
import tags from './tags'

const router = express.Router()

router.use('/', users)
router.use('/', profiles)
router.use('/', articles)
router.use('/', tags)

router.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
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
