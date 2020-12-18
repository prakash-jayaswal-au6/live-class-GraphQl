import settingsInput from './migrations/settings'
import { Setting } from './models'

export const seed = async () => {
  // Setting
  try {
    const count = await Setting.countDocuments()
    if (count < 1) {
      const s = new Setting(settingsInput)
      await s.save()
      // await Setting.create(settingsInput)
      const data = await Setting.find()
      data.forEach((data) => {
        data.save()
      })
      console.log('finished populating settings')
    }
  } catch (e) {
    console.log('Error populating settings... ', e)
  }
}
