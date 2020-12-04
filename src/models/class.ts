import mongoose, { Schema } from 'mongoose'
import {ClassDocument } from '../types'
const { ObjectId } = Schema.Types

var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const classSchema = new Schema(
  {
    courseName:{
        type:String,
        required:true
    },
    password:{
        type:String, 
        required:true
        },
    createdBy: {
        type: ObjectId,
        ref: "User"
    }
   },
  schemaOptions
)


export const Class = mongoose.model<ClassDocument>( 'Class', classSchema )
