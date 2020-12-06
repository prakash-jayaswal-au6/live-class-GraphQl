import { IResolvers, UserInputError, AuthenticationError } from 'apollo-server-express'
import { Request, Response, UserDocument } from '../types'
import { User, OnlineClass } from '../models'
import nanoId from 'nano-id'

const resolvers: IResolvers = {
    Query: {
 // To get all Users
      users: async () => {
        try {
          const user = await User.find()
          return user
        } catch (err) {
          throw err
        }
    },
      
//To get one user
      user: async (
        root,
        args: { id: string },
        ctx,
        info
      ): Promise<UserDocument | null> => {
        return User.findById(args.id)
      },
  },
  

  Mutation: {
//to save or update user
      saveUser: async (
        root,
        args,
        { req }: { req: Request },
        info
      ): Promise<UserDocument | null> => {
      try {
        if (args.phone.length < 10 || args.phone.length > 10) {
          throw new Error('Please enter valid phone number ')
        }
        const existingUser = await User.findOne({ phone: args.phone })
          //If user exist already then we will update it
          if (existingUser) {
            const result = await User.findByIdAndUpdate( args.id, { name: args.name, role:args.role, phone:args.phone },
              (err, docs) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log('Updated User : ', docs)
                }
              }
              )
            return result
          } else {
            const code = nanoId(5) 
            const user = new User({
                name: args.name,
                role: args.role,
                phone: args.phone,
                referralCode: code
            })
            const result = await user.save()
            return result
            }  
        } catch (err) {
          throw err
        } 
    },

//delete User
      deleteUser: async (
        root,
        args,
        { req }: { req: Request }
      ): Promise<Boolean> => {
        const user: any = await User.findByIdAndDelete(args.id)
        if (user) {
          return true
        } else {
          throw new Error('User does not exists ')
        }
      },
  
      addClassToUser: async(
        root,
        args,
        { req }: { req: Request },
        info
      ): Promise<UserDocument | null> => {
        try {
          //@ts-ignore
          const result = await User.findByIdAndUpdate( args.userId, {$addToSet:{onlineClasses: args.classId} },
            (err, docs) => {
              if (err) {
                console.log(err)
              } else {
                console.log('After add class in user  : ', docs)
              }
            }
          )
          await OnlineClass.findByIdAndUpdate( args.classId, {$set:{users: args.userId} },
            (err, docs) => {
              if (err) {
                console.log(err)
              } else {
                console.log('After add user in class : ', docs)
              }
            }
          )
          return result
      } catch (err) {
        throw err
      } 
    },
      
    referrelUser: async (
      root,
      args,
      { req }: { req: Request },   
      info
    ): Promise<UserDocument | null> => { 
      try {
        //@ts-ignore
        //first find the refel code user
        const userWhoRefered = await User.findOne({ referralCode: args.referralCode })
        if (userWhoRefered == null ) {
          throw new Error('Referel Code incorrect ')
        }
        if (args.phone.length < 10 || args.phone.length > 10) {
          throw new Error('Please enter valid phone number ')
        }
        // console.log("userWhoRefered: ", userWhoRefered)

        //lets check phone number already exist or not
        const checkUser = await User.findOne({ phone: args.phone })
        if (checkUser) {
          throw new Error('Phone Number already exist in database,please choose another phone Number. ')
        }

        //create  new user with phone number
        const code = nanoId(5) 
        const user = new User({
                phone: args.phone,
                referralCode: code,
                referedFrom: userWhoRefered.id
        })

        //Now save the user to db
        const newUser = await user.save()
        console.log("newUser: ",newUser)
        // lets update the user whose refered
        // @ts-ignore
        const result = await User.findByIdAndUpdate( userWhoRefered.id, {$addToSet:{referedUsers: newUser.id} },
          (err, docs) => {
            if (err) {
              console.log(err)
            } else {
              console.log('After referal  : ', docs)
            }
          }
        )
        console.log(result)
        return newUser
      } catch (err) {
        throw err
      }
    }
    },
  }
  
  export default resolvers




