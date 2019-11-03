import mongoose, { Schema, Document } from 'mongoose'

interface IComment extends Document {
  body: string
  author: mongoose.Schema.Types.ObjectId
  article: mongoose.Schema.Types.ObjectId
}

export interface ICommentModel extends IComment {
  toJSONFor(): {
    id: string
    body: string
    createdAt: string
    author: {
      username: string
      bio: string
      image: string
      following: boolean
    }
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
commentSchema.methods.toJSONFor = function(user) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  }
}

mongoose.model<ICommentModel>('Comment', commentSchema)
