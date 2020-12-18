import { Schema, model } from 'mongoose'
import { ScopeDocument } from '../types'

const { ObjectId } = Schema.Types

const scopeSchema = new Schema(
  {
    board: { type: ObjectId, ref: 'Category' },
    level: { type: ObjectId, ref: 'Category' },
    class: { type: ObjectId, ref: 'Category' },
    subject: { type: ObjectId, ref: 'Category' },
    lang: { type: String },
    user: { type: ObjectId, ref: 'User' },
    active: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)
scopeSchema.index({
  '$**': 'text',
})
export const Scope = model<ScopeDocument>('Scope', scopeSchema)
