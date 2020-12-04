import {
    IResolvers,
    UserInputError,
    AuthenticationError,
  } from 'apollo-server-express'
  import {
    Request,
    Response,
    UserDocument,
  } from '../types'
  import { User } from '../models'
  
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
            const existingUser = await User.findOne({ email: args.email })
          //If user exist already then we will update it
          if (existingUser) {
            const result = await User.findByIdAndUpdate( args.id, { name: args.name, email:args.email, role:args.role },
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
            const user = new User({
                name: args.name,
                email: args.email,
                password: args.password,
                role: args.role
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
  
    },
  }
  
  export default resolvers
