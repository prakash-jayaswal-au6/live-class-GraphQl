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
    email:{
        type:String
    },
    phone: {
      type: String
    },
    password:{
        type:String
    },
    role: {
        type: String,
        default: 'user'
    },
    onlineClasses: [{
      type: ObjectId,
      ref: 'OnlineClass'
    }],
    referralCode: {
      type: String
    },
    refersTo: [{
      type: ObjectId,
      ref: 'User'
    }],
    refersBy: [{
      type: ObjectId,
      ref: 'User'
    }]
   },
  schemaOptions
)


export const User = mongoose.model<UserDocument>( 'User', userSchema )
