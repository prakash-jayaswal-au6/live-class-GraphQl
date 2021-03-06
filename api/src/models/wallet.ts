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
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    referedUser: {
      type: ObjectId,
      ref: 'User',
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  schemaOptions
)

export const Wallet = mongoose.model<WalletDocument>('Wallet', walletSchema)
