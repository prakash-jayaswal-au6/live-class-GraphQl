import {
  IResolvers,
  UserInputError,
  AuthenticationError,
} from 'apollo-server-express'
import { Request, Response, ProductDocument } from '../types'
import { Product, User } from '../models'

const resolvers: IResolvers = {
  Query: {
    // To get all Users
    products: async () => {
      try {
        const result = await Product.find()
        return result
      } catch (err) {
        throw err
      }
    },

    //To get one user
    product: async (
      root,
      args: { id: string },
      ctx,
      info
    ): Promise<ProductDocument | null> => {
      return Product.findById(args.id)
    },
  },

  Mutation: {
    //to save or update user
    saveProduct: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<ProductDocument | null> => {
      try {
        //if wants to create new product
        if (args.id == 'new') {
          const author = await User.findOne({
            _id: args.postedBy,
            role: 'author',
          })
          if (author == null) throw new Error(' Author not Exist ')
          const product = new Product({
            courseName: args.courseName,
            scheduleDateTime: args.scheduleDateTime,
            pricePerHour: args.pricePerHour,
            postedBy: args.postedBy,
            seats: args.seats,
          })
          console.log(product)
          await product.save()
          return product
        } else {
          //IF wants to update product
          const result = await Product.findByIdAndUpdate(args.id, {
            $set: {
              courseName: args.courseName,
              scheduleDateTime: args.scheduleDateTime,
              pricePerHour: args.pricePerHour,
              seats: args.seats,
            },
          })
          return result
        }
      } catch (err) {
        throw err
      }
    },

    //delete User
    deleteProduct: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<Boolean> => {
      const result: any = await Product.findByIdAndDelete(args.id)
      if (result) {
        return true
      } else {
        throw new Error('Class does not exists ')
      }
    },
  },
}

export default resolvers
