import mongoose, { Schema } from 'mongoose'
import { CountryDocument } from '../types'
const { ObjectId } = Schema.Types

const countrySchema = new Schema(
  {
    name: String,
    slug: String,
    value: String,
    code: String,
    img: String,
    flag: String,
    lang: String,
    states: [{ type: ObjectId, ref: 'State' }],
    sort: Number,
    active: { type: Boolean, default: true },
    q: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

countrySchema.index({
  '$**': 'text',
})
export const Country = mongoose.model<CountryDocument>('Country', countrySchema)
