import { IResolvers } from 'apollo-server-express'
import { Request, Response, UserDocument } from '../types'
import { User, Product, Wallet } from '../models'
import { nanoid } from 'nanoid'

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
        //lets validate the phone number
        if (args.phone.length < 10 || args.phone.length > 10) {
          throw new Error('Please enter valid phone number ')
        }
        const existingUser = await User.findOne({ phone: args.phone })
        //If user exist already then we will update it
        if (existingUser) {
          const result = await User.findByIdAndUpdate(args.id, { $set: { name: args.name, role: args.role, phone: args.phone } }  )
          return result
        } else {
          const code = nanoid(5)
          const user = new User({
            name: args.name,
            role: args.role,
            phone: args.phone,
            referralCode: code,
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

    
    bookProduct: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      try {
        //check class exist or not
        const product = await Product.findById(args.productId)
        if (product == null) throw new Error('Class not exist !')
        // check user exist or not
        const user = await User.findById(args.userId)
        if (user == null) throw new Error('User not exist !')
        const seat = product.seats
        if (seat > 1) {  //@ts-ignore
          if (user.currentBalance < product.pricePerHour)
            throw new Error('User not have sufficient balance !')
          //Adding user in the class
          await Product.findByIdAndUpdate(args.productId, { $addToSet: { users: args.userId } })
          //change the seat avail in the class
          await Product.findByIdAndUpdate(args.productId, { $set: { seats: seat - 1 } })
          const teacher = await User.findById(product.postedBy)
          //Student amount will decrease
          //@ts-ignore
          await User.findByIdAndUpdate(user.id, { $set: { currentBalance: user.currentBalance - product.pricePerHour } })
          //teacher amount will increase
          //@ts-ignore
          await User.findByIdAndUpdate(teacher.id, { $set: { currentBalance: teacher.currentBalance + product.pricePerHour } })
          const result = await User.findByIdAndUpdate(args.userId, { $addToSet: { products: args.productId } })
          return result
        }
        return null
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
        //first find the refel code user
        const userWhoRefered = await User.findOne({ referralCode: args.referralCode, })
        if (userWhoRefered == null) {
          throw new Error('Referel Code incorrect ')
        }
        if (args.phone.length < 10 || args.phone.length > 10) {
          throw new Error('Please enter valid phone number ')
        }
       
        //lets check phone number already exist or not
        const checkUser = await User.findOne({ phone: args.phone })
        if (checkUser) {
          throw new Error(
            'Phone Number already exist in database,please choose another phone Number. '
          )
        }
        //create  new user with phone number  
        const code = nanoid(5)
        const user = new User({
          phone: args.phone,
          referralCode: code,
          referedFrom: userWhoRefered.id,
        })
        const newUser = await user.save()
// lets update the user whose refered
        // @ts-ignore
        await User.findByIdAndUpdate( userWhoRefered.id,{ $addToSet: { referedUsers: newUser.id } })
           const wallet = new Wallet({
            userId: userWhoRefered.id,
            amount: 100,
            direction: "+",
            remark: "referrel bonus",
            referedUser: newUser.id,
            balance: userWhoRefered.currentBalance+args.amount
           })
        const newWallet = await wallet.save()

        await User.findByIdAndUpdate(userWhoRefered.id, { $addToSet: { walletId: newWallet.id } })
        // let currentBalance = userWhoRefered.currentBalance
        await User.findByIdAndUpdate( userWhoRefered.id,{ $set: { currentBalance: userWhoRefered.currentBalance+newWallet.amount } })
        return newUser
      } catch (err) {
        throw err
      }
    },

    requestToChild: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      try {
        // console.log(args.parentId)
        const parent = await User.findOne({ _id: args.parentId, role: 'parent' })
        if (parent === null)
          throw new Error(
            'Parent Does not Exist,Please provide valid parentId '
          )
        // console.log(parent)
        const child = await User.findOne({ _id: args.childId, role: 'user' })
        // console.log('child: ', child)
        if (child === null)
          throw new Error('Child Does not Exist,Please provide valid childId ')
        //To send SMS us e child.phone
        const otp = Math.floor(Math.random() * 100000)
        // console.log("otpIs :", otp)
        const user = await User.findByIdAndUpdate(child.id, { $set: { otp } })
        console.log('OTP sent to the child')
        return user
      } catch (err) {
        throw err
      }
    },

    addChildToParent: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      try {
        const parent = await User.findOne({ _id: args.parentId, role: 'parent' })
        if (parent === null)
          throw new Error(
            'Parent Does not Exist,Please provide valid parentId '
          )
        const child = await User.findOne({ _id: args.childId, role: 'user' })
        if (child === null)
          throw new Error('Child Does not Exist,Please provide valid childId ')
        // @ts-ignore
        if (child.otp == args.otp) {
          //updating child in parent schema
          await User.findByIdAndUpdate(parent.id, {
            $addToSet: { children: child.id },
          })
          //updatig child in parent schema
          const childAfterUpdate = await User.findByIdAndUpdate(child.id, {
            $addToSet: { parent: parent.id },
          })
          //updating OTP as null
          await User.findByIdAndUpdate(child.id, { $set: { otp: null } })
          return childAfterUpdate
        } else {
          throw new Error('Incorrect OTP')
        }
      } catch (err) {
        throw err
      }
    },

    removeChildFromParent: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      try {
        const parent = await User.findOne({
          _id: args.parentId,
          role: 'parent',
        })
        if (parent === null)
          throw new Error(
            'Parent Does not Exist,Please provide valid parentId '
          )
        // console.log("parent",parent)
        const child = await User.findOne({ _id: args.childId, role: 'user' })
        // console.log("child: ", child)
        if (child === null)
          throw new Error('Child Does not Exist,Please provide valid childId ')

        await User.findByIdAndUpdate(parent.id, {
          $pull: { children: args.childId },
        })
        await User.findByIdAndUpdate(child.id, {
          $pull: { parent: args.parentId },
        })

        return parent
      } catch (err) {
        throw err
      }
    },
  },
}

export default resolvers
