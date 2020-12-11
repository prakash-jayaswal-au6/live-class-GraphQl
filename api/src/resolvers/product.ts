import {
    IResolvers,
    UserInputError,
    AuthenticationError,
  } from 'apollo-server-express'
  import {
    Request,
    Response,
    ProductDocument,
  } from '../types'
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
            const existingClassTime = await Product.findOne({ scheduleDateTime: args.scheduleDateTime })
          //If user exist already then we will update it
          if (existingClassTime) {
            const result = await Product.findByIdAndUpdate(args.id,{$set: {
              courseName: args.courseName,
              scheduleDateTime: args.scheduleDateTime,
              pricePerHour: args.pricePerHour,
              seats:args.seats
            }}
              )
            return result
          } else {
            const userExist = await User.findById(args.postedBy)
            if (userExist === null) {
              throw new Error(' Author not Exist ')
            }
            if (userExist.role === "author") {
              const product = new Product({
                courseName: args.courseName,
                scheduleDateTime: args.scheduleDateTime,
                pricePerHour: args.pricePerHour,
                postedBy: args.postedBy,
                seats:args.seats
            })  
            const result = await product.save()
            return result
            } else {
              throw new Error(' only author can create the class product ')
            }
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
