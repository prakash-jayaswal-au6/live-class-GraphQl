import { Schema, model } from 'mongoose'
import { hash, compare } from 'bcryptjs'
import { createHash, createHmac, timingSafeEqual } from 'crypto'

import {
  BCRYPT_WORK_FACTOR,
  APP_SECRET,
  EMAIL_VERIFICATION_TIMEOUT,
  APP_ORIGIN,
} from '../config'
import { UserDocument, UserModel } from '../types'
const { ObjectId } = Schema.Types
var schemaOptions = {
  toObject: { getters: true },
  toJSON: { getters: true },
  versionKey: false,
  timestamps: true,
}
const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    email: {
      type: String,
      // validate: [
      //   async (email: string): Promise<boolean> =>
      //     (await User.count({ email })) < 2,
      //   'Email is already taken.'
      // ]
    },
    password: String,
    qualification: { type: String, default: '' },
    experience: { type: String, default: '' },
    subject: { type: String, default: '' },
    exam: { type: String, default: '' },
    lang: { type: String, default: '' },
    facebook_url: { type: String, default: '' },
    twitter_url: { type: String, default: '' },
    gender: {
      type: 'String',
      // enum : ['Male', 'Female']
    },
    city: String,
    district: String,
    dob: Date,
    info: { type: Object, default: {} },
    avatar: String,
    provider: { type: String, default: 'local' },
    facebook: Object,
    twitter: Object,
    google: Object,
    github: Object,
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    scopes: [{ type: ObjectId, ref: 'Scope' }],
    scope: { type: ObjectId, ref: 'Category' },
    address: Object,
    meta: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    ratings: Number,
    reviews: Number,
    avg_rating: Number,
    role: {
      type: String,
      default: 'user',
    },
    referralCode: {
      type: String,
    },
    referedFrom: {
      type: ObjectId,
      ref: 'User',
    },
    referedUsers: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    products: [
      {
        type: ObjectId,
        ref: 'Product',
      },
    ],
    children: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    parent: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    walletId: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    currentBalance: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
    },
  },
  schemaOptions
)

userSchema.pre<UserDocument>('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, BCRYPT_WORK_FACTOR)
  }
})

userSchema.pre('save', async function (this: UserDocument) {})

userSchema.methods.matchesPassword = function (password: string) {
  return compare(password, this.password)
}

userSchema.statics.referalUrl = function (uid: string) {
  return `${APP_ORIGIN}/signup?referer=${uid}`
}

userSchema.methods.verificationUrl = function () {
  const token = createHash('sha1').update(this.email).digest('hex')
  const expires = Date.now() + EMAIL_VERIFICATION_TIMEOUT

  const url = `${APP_ORIGIN}/account/verify?id=${this.id}&token=${token}&expires=${expires}`
  const signature = User.signVerificationUrl(url)

  return `${url}&signature=${signature}`
}

userSchema.statics.signVerificationUrl = (url: string) =>
  createHmac('sha256', APP_SECRET).update(url).digest('hex')

userSchema.statics.hasValidVerificationUrl = (path: string, query: any) => {
  const url = `${APP_ORIGIN}${path}`
  const original = url.slice(0, url.lastIndexOf('&'))
  const signature = User.signVerificationUrl(original)

  return (
    timingSafeEqual(Buffer.from(signature), Buffer.from(query.signature)) &&
    +query.expires > Date.now()
  )
}

userSchema.set('toJSON', {
  transform: (doc, { __v, password, ...rest }, options) => rest,
})
userSchema.index({
  '$**': 'text',
})
export const User = model<UserDocument, UserModel>('User', userSchema)
