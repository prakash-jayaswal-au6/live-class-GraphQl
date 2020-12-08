import mongoose, { Schema } from 'mongoose'
import { WalletDocument } from '../types'
const { ObjectId } = Schema.Types

var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const walletSchema = new Schema(
{
    userId: {
        type: ObjectId,
        ref: 'User'
   },
    amount: {
        type: Number,
        required: true
      },
    remark: {
      type: String,
      required:true
    },
    referedUser: {
        type: ObjectId,
        ref: 'User'
      }
   },
  schemaOptions
)


export const Wallet = mongoose.model<WalletDocument>( 'Wallet', walletSchema )
