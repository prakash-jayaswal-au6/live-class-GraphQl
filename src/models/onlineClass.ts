import mongoose, { Schema } from 'mongoose'
import {OnlineClassDocument } from '../types'
const { ObjectId } = Schema.Types

var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const onlineClassSchema = new Schema(
  {
    courseName:{
        type:String,
        required:true
    },
    scheduleDateTime: {
      type: String,
      required:true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    pricePerHour: {
      type: Number,
      required: true
    },
    users: [{
      type: ObjectId,
      ref: 'User'
    }],
   },
  schemaOptions
)


export const OnlineClass = mongoose.model<OnlineClassDocument>( 'OnlineClass', onlineClassSchema )
