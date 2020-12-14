import { Document } from 'mongoose'

export interface SettingsDocument extends Document {
  websiteName: string
  title: string
  alert: string
  keywords: string
  description: string
  homeMeta1: string
  homeMeta2: string
  homeMeta3: string
  homeMeta4: string
  listingMeta: string
  detailMeta: string
  minimumOrderValue: number
  shipping: {
    delivery_days: number
    charge: number
    free: number
    method: string
  }
  tax: { cgst: number; sgst: number; igst: number }
  shopEmail: string
  shopPhone: string
  shopAddress: string
  country: string
  language: string
  logo: string
  logoDark: string
  logoMobile: string
  logoMobileDark: string
  favicon: string
  CDN_URL: string
  demo: boolean
  pageSize: number
  review: {
    enabled: boolean
    moderate: boolean
  }
  product: { moderate: boolean }
  GOOGLE_MAPS_API: string
  facebook: string
  twitter: string
  google: string
  instagram: string
  enableZips: boolean
  closed: boolean
  closedMessage: string
  zips: [string]
  userRoles: [string]
  // orderStatuses: {
  //   type: [string]
  //   default: [
  //     'Received',
  //     'Order Placed',
  //     'Order Accepted',
  //     'Order Executed',
  //     'Shipped',
  //     'Delivered',
  //     'Not in Stock',
  //     'Cancellation Requested',
  //     'Cancelled'
  //   ]
  // }
  // paymentStatuses: { type: [string]; default: ['Pending', 'Cancelled', 'Paid'] }
  paymentMethods: [string]
  returnReasons: [string]
  sms: {
    enabled: boolean
    provider: string
    TWILIO_API_KEY: string
  }
  email: {
    enabled: boolean
    SENDGRID_API_KEY: string
    from: string
    printers: string
    cc: string
    bcc: string
  }
  login: {
    FACEBOOK_ID: string
    FACEBOOK_SECRET: string
    TWITTER_ID: string
    TWITTER_SECRET: string
    GOOGLE_ID: string
    GOOGLE_SECRET: string
    GITHUB_ID: string
    GITHUB_SECRET: string
    LINKEDIN_ID: string
    LINKEDIN_SECRET: string
  }
  payment: {
    STRIPE_APIKEY: string
    PAYPAL_MODE: string
    PAYPAL_CLIENT_ID: string
    PAYPAL_CLIENT_SECRET: string
    INSTAMOJO_SANDBOX_MODE: boolean
    INSTAMOJO_API_KEY: string
    INSTAMOJO_AUTH_TOKEN: string
  }
  q: string
}
