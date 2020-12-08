import {
    IResolvers,
    UserInputError,
    AuthenticationError,
  } from 'apollo-server-express'
  import {
    Request,
    Response,
    OnlineClassDocument,
  } from '../types'
  import { OnlineClass, User } from '../models'
  
const resolvers: IResolvers = {
    Query: {
 // To get all Users
      onlineClasses: async () => {
        try {
          const result = await OnlineClass.find()
          return result
        } catch (err) {
          throw err
        }
    },
      
//To get one user
      onlineClass: async (
        root,
        args: { id: string },
        ctx,
        info
      ): Promise<OnlineClassDocument | null> => {
        return OnlineClass.findById(args.id)
      },
  },
  

  Mutation: {
//to save or update user
      saveOnlineClass: async (
        root,
        args,
        { req }: { req: Request },
        info
      ): Promise<OnlineClassDocument | null> => {
        try {
            const existingClassTime = await OnlineClass.findOne({ scheduleDateTime: args.scheduleDateTime })
          //If user exist already then we will update it
          if (existingClassTime) {
            const result = await OnlineClass.findByIdAndUpdate(args.id,{$set: {
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
              throw new Error(' User not Exist ')
            }
            if (userExist.role == "author") {
              const onlineClass = new OnlineClass({
                courseName: args.courseName,
                scheduleDateTime: args.scheduleDateTime,
                pricePerHour: args.pricePerHour,
                postedBy: args.postedBy,
                seats:args.seats
            })  
            // console.log(onlineClass)
            const result = await onlineClass.save()
            return result
            } else {
              throw new Error(' only author can create the class ')
            }

            }  
        } catch (err) {
          throw err
        } 
    },

//delete User
      deleteOnlineClass: async (
        root,
        args,
        { req }: { req: Request }
      ): Promise<Boolean> => {
        const result: any = await OnlineClass.findByIdAndDelete(args.id)
        if (result) {
          return true
        } else {
          throw new Error('Class does not exists ')
        }
      },
  
    },
  }
  
  export default resolvers
