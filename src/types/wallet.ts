import { Document } from 'mongoose'
import { UserDocument } from './user';

export interface WalletDocument extends Document {
  amount: string
  remark: string
  referedUser: string
  userId: UserDocument['_id']
}
