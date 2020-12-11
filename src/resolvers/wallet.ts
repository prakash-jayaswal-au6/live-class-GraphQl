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
  import { Product, User,Wallet } from '../models'
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
      const result = await Wallet.find({ userId: args.userId })
      console.log(result)  
      //@ts-ignore
      return result
    },
    
    transaction: async (
      root,
      args,
      ctx,
      info
    ): Promise<WalletDocument | null> => {
        try {
          const result = await Wallet.findById(args.walletId)
          if (result == null) throw new Error('transaction id is not valid !')
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
        // check user exist or not
          const user = await User.findById(args.userId)
          if (user == null) throw new Error('User not exist !')
          const wallet = new Wallet({
            userId: user.id,
            amount: args.amount,
            direction: "+",
            remark: "add money",
            balance: user.currentBalance+args.amount
           })
        const newWallet = await wallet.save()
        await User.findByIdAndUpdate(user.id, { $addToSet: { walletId: newWallet.id } })
        await User.findByIdAndUpdate( user.id,{ $set: { currentBalance: user.currentBalance+newWallet.amount } })
          return null  
        } catch (err) {
          throw err
        } 
    },
  },
}
  
  export default resolvers
