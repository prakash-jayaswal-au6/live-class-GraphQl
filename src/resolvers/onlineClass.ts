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
  import { OnlineClass } from '../models'
  
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
            const result = await OnlineClass.findByIdAndUpdate( args.id, { courseName: args.courseName, scheduleDateTime:args.scheduleDateTime, pricePerHour:args.pricePerHour },
              (err, docs) => {
                if (err) { 
                  throw new Error('Class cant update or create ')
                } else {
                  console.log('Updated Class : ', docs)
                }
              }
              )
            return result
          } else {
            const onlineClass = new OnlineClass({
                courseName: args.courseName,
                scheduleDateTime: args.scheduleDateTime,
                pricePerHour: args.pricePerHour,
                postedBy: args.postedBy
            })  
            console.log(onlineClass)
            const result = await onlineClass.save()
            return result
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
