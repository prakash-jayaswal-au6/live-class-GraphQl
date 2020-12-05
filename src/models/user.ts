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
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String, 
        required:true
        },
    role: {
        type: String,
        default: 'user'
    },
    onlineClasses: [{
      type: ObjectId,
      ref: 'OnlineClass'
    }]
   },
  schemaOptions
)


export const User = mongoose.model<UserDocument>( 'User', userSchema )
