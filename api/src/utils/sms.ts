import { Setting } from '../models'
import fetch from 'node-fetch'
import twilio from 'twilio'
import { FROM_TWILIO_PHONE_NUMBER, FAST2SMS_TEMPLATE_ID } from '../config'
export const sms = async ({ phone, msg, otp }: any) => {
  try {
    let settings = await Setting.findOne({}).exec()
    if (!settings || !settings.sms.enabled) return
    const { FAST2SMS_KEY, FAST2SMS_SENDER_ID } = process.env
    if (otp) {
      const smsString = `https://www.fast2sms.com/dev/bulk?authorization=${FAST2SMS_KEY}&sender_id=${FAST2SMS_SENDER_ID}&language=english&route=qt&numbers=${phone}&message=${FAST2SMS_TEMPLATE_ID}&variables= {AA}&variables_values=${otp}`
      fetch(smsString)
        .then((res) => console.log)
        .catch((e) => console.error)
      console.log(`${phone} = ${otp}`)
    }
  } catch (error) {
    console.error('sms err...', error.toString())
  }
}
export const smsTwilio = async ({ phone, msg }: any) => {
  try {
    let settings = await Setting.findOne({}).exec()
    if (!settings || !settings.sms.enabled) return
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    const message = await client.messages.create({
      body: msg,
      from: FROM_TWILIO_PHONE_NUMBER,
      to: phone,
    })
    console.log(message.sid)
  } catch (error) {
    console.error('sms err...', error.toString())
  }
}
