import { Document } from 'mongoose'
import { UserDocument } from './user'


export interface WalletDocument extends Document {
  remark: string
  direction: string
  amount: number
  userId: UserDocument['_id']
  referedUser: UserDocument['_id']
  balance: number
}

