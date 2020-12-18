import { Document } from 'mongoose'
import { StateDocument } from '.'

export interface CountryDocument extends Document {
  id: string
  name: string
  slug: string
  value: string
  img: string
  flag: string
  language: string
  states: string
  sort: number
  uid: [StateDocument['_id']]
  active: boolean
  q: string
}
