import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUserModel } from './Users'
import { IArticleModel } from './Articles'

interface IComment extends Document {
  body: string
  author: IUserModel
  article: IArticleModel
}

export interface ICommentModel extends IComment {
  toJSONFor(
    user: IUserModel
  ): {
    id: string
    body: string
    createdAt: string
    author: IUserModel
  }
}

const commentSchema = new Schema(
  {
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' }
  },
  { timestamps: true }
)

// Requires population of author
commentSchema.methods.toJSONFor = function(user: IUserModel) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  }
}

export const Comment: Model<ICommentModel> = mongoose.model<ICommentModel>(
  'Comment',
  commentSchema
)
