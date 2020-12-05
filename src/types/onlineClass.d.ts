import { Document } from 'mongoose'
import { UserDocument } from './user';

export interface OnlineClassDocument extends Document {
    courseName: string
    scheduleDateTime:string
    pricePerHour:string
    postedBy: UserDocument['_id']
    users: UserDocument['_id']
}
