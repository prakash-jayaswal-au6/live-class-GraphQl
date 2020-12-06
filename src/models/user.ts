import mongoose, { Schema } from 'mongoose'
import { UserDocument } from '../types'

const { ObjectId } = Schema.Types
var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const userSchema = new Schema(
  {
    name:{
        type:String,
    },
    phone: {
      type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    referralCode: {
      type: String
    },
    referedFrom: {
      type: ObjectId,
      ref: 'User'
    },
    referedUsers: [{
      type: ObjectId,
      ref: 'User'
    }],
    onlineClasses: [{
      type: ObjectId,
      ref: 'OnlineClass'
    }],
    myChild: [{
      type: ObjectId,
      ref: 'User'
    }]
   },
  schemaOptions
)


export const User = mongoose.model<UserDocument>( 'User', userSchema )
