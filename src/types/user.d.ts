import { Document } from 'mongoose'
import { OnlineClassDocument } from './onlineClass';


export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  role: string
  phone: string
  referralCode: string
  onlineClasses: OnlineClassDocument['_id']
}

