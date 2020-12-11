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
    products: [{
      type: ObjectId,
      ref: 'Product'
    }],
    children: [{
      type: ObjectId,
      ref: 'User'
    }],
    parent: [{
      type: ObjectId,
      ref: 'User'
    }],
    walletId: [{
      type: ObjectId,
      ref: 'User'
    }],
    currentBalance: {
      type: Number,
      default:0
    },
    otp: {
      type:String
    }
   },
  schemaOptions
)


export const User = mongoose.model<UserDocument>( 'User', userSchema )
