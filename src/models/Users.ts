import mongoose, { Schema, Document, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { secret } from '../config'
import { IArticleModel } from './Articles'

interface IUser extends Document {
  username: string
  email: string
  bio: string
  image: string
  favorites: IArticleModel
  following: IUserModel
  hash: string
  salt: string
}

export interface IUserModel extends IUser {
  validPassword(password: string): boolean
  setPassword(password: string): void
  generateJWT(): string
  toAuthJSON(): {
    username: string
    email: string
    token: string
    bio: string
    image: string
  }
  toProfileJSONFor(): {
    username: string
    bio: string
    image: string
    following: boolean
  }
  favorite(id: string): any
  unFavorite(id: string): any
  isFavorite(id: string): boolean
  follow(id: string): any
  unFollow(id: string): any
  isFollowing(id: string): boolean
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true
    },
    bio: String,
    image: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hash: String,
    salt: String
  },
  { timestamps: true }
)

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

userSchema.methods.validPassword = function(password: string) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

userSchema.methods.setPassword = function(password: string) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

userSchema.methods.generateJWT = function() {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: exp.getTime() / 1000
    },
    secret as string
  )
}

userSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  }
}

userSchema.methods.toProfileJSONFor = function(user: IUserModel) {
  return {
    username: this.username,
    bio: this.bio,
    image:
      this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    following: user ? user.isFollowing(this._id) : false
  }
}

userSchema.methods.favorite = function(id: string) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id)
  }

  return this.save()
}

userSchema.methods.unFavorite = function(id: string) {
  this.favorites.remove(id)
  return this.save()
}

userSchema.methods.isFavorite = function(id: string) {
  return this.favorites.some(function(favoriteId: string) {
    return favoriteId.toString() === id.toString()
  })
}

userSchema.methods.follow = function(id: string) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id)
  }

  return this.save()
}

userSchema.methods.unFollow = function(id: string) {
  this.following.remove(id)
  return this.save()
}

userSchema.methods.isFollowing = function(id: string) {
  return this.following.some(function(followId: string) {
    return followId.toString() === id.toString()
  })
}

export const User: Model<IUserModel> = mongoose.model<IUserModel>(
  'User',
  userSchema
)
