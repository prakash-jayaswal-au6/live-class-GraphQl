import { Document } from 'mongoose'

export interface ScopeDocument extends Document {
  active: boolean
  subject: string
  lang: string
  user: string
  q: string
}
