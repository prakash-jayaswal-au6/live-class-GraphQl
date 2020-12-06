import { Document } from 'mongoose'
import { OnlineClassDocument } from './onlineClass';


export interface UserDocument extends Document {
  name: string
  role: string
  phone: string
  referralCode: string
  referedFrom: UserDocument['_id']
  referedUsers:UserDocument['_id']
  onlineClasses: OnlineClassDocument['_id']
}

