import { Document } from 'mongoose'
import { UserDocument } from './user'

export interface ProductDocument extends Document {
  courseName: string
  scheduleDateTime: string
  seats: number
  pricePerHour: number
  postedBy: UserDocument['_id']
  users: UserDocument['_id']
}
