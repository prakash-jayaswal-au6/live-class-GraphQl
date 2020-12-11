import { IResolvers } from 'apollo-server-express'
import { Request, CouponDocument } from '../types'
import { Coupon } from '../models'
import { fields } from '../utils'

const resolvers: IResolvers = {
  Query: {
    coupons: async (root, args, { req }: { req: Request }, info) => {
      const data = await Coupon.find()
      return { count: data.length, data }
    },
    coupon: async (
      root,
      args: { id: string },
      ctx,
      info
    ): Promise<CouponDocument | null> => {
      return Coupon.findById(args.id, fields(info))
    },
  },
  Mutation: {
    deleteCoupon: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<Boolean> => {
      const coupon: any = await Coupon.findByIdAndDelete(args.id)
      return true
    },
    saveCoupon: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<CouponDocument | null> => {
      const { userId } = req.session
      args.user = userId
      if (args.id == 'new') return await Coupon.create(args)
      else {
        let coupon = await Coupon.findOneAndUpdate({ _id: args.id }, args, {
          new: true,
          upsert: true,
        })
        await coupon.save() // To fire pre save hoook
        return coupon
      }
    },
  },
}

export default resolvers
