import {
    IResolvers,
    UserInputError,
    AuthenticationError,
  } from 'apollo-server-express'
  import {
    Request,
    Response,
    WalletDocument,
  } from '../types'
  import { OnlineClass, User,Wallet } from '../models'
import { argsToArgsConfig } from 'graphql/type/definition'
  
const resolvers: IResolvers = {
    Query: {
 // To get all Users
 allTransactions: async () => {
        try {
          const result = await Wallet.find()
          return result
        } catch (err) {
          throw err
        }
        },
        
    userTransaction: async (
        root,
        args,
        ctx,
        info
      ): Promise<WalletDocument | null> => {
        return Wallet.findById({userId:args.userId})
      },
    
    transaction: async () => {
        try {
          const result = await Wallet.find()
          return result
        } catch (err) {
          throw err
        }
    },
      

  },
  

  Mutation: {
//to save or update user
    addMoney: async (
        root,
        args,
        { req }: { req: Request },
        info
      ): Promise<WalletDocument | null> => {
        try {
            return null  
        } catch (err) {
          throw err
        } 
    },

  
    },
  }
  
  export default resolvers
