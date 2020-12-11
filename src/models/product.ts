import mongoose, { Schema } from 'mongoose'
import {ProductDocument } from '../types'
const { ObjectId } = Schema.Types

var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const productSchema = new Schema(
  {
    courseName:{
        type:String,
        required:true
    },
    seats: {
      type: Number,
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


export const Product = mongoose.model<ProductDocument>( 'Product', productSchema )
