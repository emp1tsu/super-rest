import { Request } from 'express'
import { IUserModel } from '../models/Users'
import { IArticleModel } from '../models/Articles'

// Add jwt payload details to Express Request
export interface JWTRequest extends Request {
  payload: {
    id: string
    username: string
  }
}

// Add profile details to JWT Request
export interface ProfileRequest extends JWTRequest {
  profile: IUserModel
}

// Add article details to ProfileRequest
export interface ArticleRequest extends ProfileRequest {
  article: IArticleModel
}
