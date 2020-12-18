import mongoose, { Schema } from 'mongoose'
import { CategoryDocument } from '../types'

const { ObjectId } = Schema.Types
var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const categorySchema = new Schema(
  {
    index: Number,
    name: String,
    parent: { type: ObjectId, ref: 'Category' },
    slug: String,
    path: String,
    slugPath: String,
    namePath: String,
    pathA: [{ type: ObjectId, ref: 'Category' }],
    slugPathA: [{ type: String, default: '' }],
    namePathA: [{ type: String, default: '' }],
    level: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    megamenu: { type: Boolean, default: true },
    meta: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    img: String,
    featured: { type: Boolean, default: false },
    shopbycategory: { type: Boolean, default: false },
    children: [{ type: ObjectId, ref: 'Category' }],
    user: { type: ObjectId, ref: 'User' },
    authors: [{ type: ObjectId, ref: 'User' }],
    count: Number,
    sizechart: String,
    active: { type: Boolean, default: true },
    q: String,
  },
  schemaOptions
)

categorySchema.index({
  '$**': 'text',
})
export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
