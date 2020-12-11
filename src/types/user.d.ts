import { Document } from 'mongoose'
import { ProductDocument } from './product';


export interface UserDocument extends Document {
  name: string
  role: string
  phone: string
  currentBalance: number
  referralCode: string
  referedFrom: UserDocument['_id']
  referedUsers:UserDocument['_id']
  onlineClasses: ProductDocument['_id']
}

