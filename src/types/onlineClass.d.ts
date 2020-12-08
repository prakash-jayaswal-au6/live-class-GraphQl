import { Document } from 'mongoose'
import { UserDocument } from './user'

export interface OnlineClassDocument extends Document {
  courseName: string
  scheduleDateTime: string
  seats: number
  pricePerHour: string
  postedBy: UserDocument['_id']
  users: UserDocument['_id']
}
