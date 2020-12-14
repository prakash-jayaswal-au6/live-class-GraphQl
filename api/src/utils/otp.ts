import { sms } from '.'
import { Setting } from '../models'

export const generateOTP = () => {
  let otp = Math.floor(1000 + Math.random() * 9000)
  return otp
}
export const requestOTP = async (phone: string, otp: number) => {
  try {
    let settings: any = await Setting.findOne({}).exec()
    if (!settings || !settings.sms.enabled) return
    sms({
      phone,
      msg: `Hi. ${otp} is your OTP to login to ${settings.storeName}`,
      otp,
    })
  } catch (e) {
    throw e
  }
}
