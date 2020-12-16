import { Document, Model } from 'mongoose'
import { AddressDocument } from './address'
import { ProductDocument } from './product'

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  matchesPassword: (password: string) => Promise<boolean>
  verificationUrl: () => string
  role: string
  gender: string
  city: string
  dob: string
  info: InfoDocument
  avatar: string
  provider: string
  facebook: any
  twitter: any
  google: any
  github: any
  active: boolean
  address: AddressDocument
  verified: boolean
  verifiedAt: Date
  slug: string
  scope: string
  meta: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  sid: string
  currentBalance: number
  referralCode: string
  otp: string
  parent: UserDocument['_id']
  children: UserDocument['_id']
  referedFrom: UserDocument['_id']
  referedUsers: UserDocument['_id']
  onlineClasses: ProductDocument['_id']
  q: string
}

interface UserModel extends Model<UserDocument> {
  signVerificationUrl: (url: string) => string
  hasValidVerificationUrl: (path: string, query: any) => boolean
}

export interface InfoDocument extends Document {
  popularity: number
  avg_rating: number
  public: boolean
  store: string
  storePhotos: string[]
}
