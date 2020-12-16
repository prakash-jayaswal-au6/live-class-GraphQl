import {
  IResolvers,
  UserInputError,
  AuthenticationError,
} from 'apollo-server-express'
import { Request, Response, UserDocument, InfoDocument } from '../types'
import {
  signUp,
  signIn,
  objectId,
  signInOtp,
  gender,
  validate,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  verifyEmailSchema,
  resendEmailSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from '../validation'
import { verifyOtp, signOut, logIn } from '../auth'
import { Product, User, Wallet } from '../models'
import { fields, generateOTP, requestOTP } from '../utils'
import { nanoid } from 'nanoid'

const resolvers: IResolvers = {
  Query: {
    me: (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      return User.findById(req.session.userId, fields(info)).exec()
    },
    users: async (root, args, { req }: { req: Request }, info) => {
      try {
        const user = await User.find()
        return user
      } catch (err) {
        throw err
      }
    },
    user: async (
      root,
      args: { id: string },
      ctx,
      info
    ): Promise<UserDocument | null> => {
      return User.findById(args.id, fields(info))
    },

    getChildOfParent: async (
      root,
      args: { parentId: string },
      ctx,
      info
    ): Promise<UserDocument | null> => {
      try {
        const children = await User.find({
          parent: args.parentId,
          role: 'user',
        })
        //@ts-ignore
        return children
      } catch (err) {
        throw err
      }
    },
  },
  Mutation: {
    //to save or update user
    register: async (
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
        const check = await User.findOne({ phone: args.phone })
        if (check) throw new Error('Phone number already exist, cant register ')
        //first find the refel code user
        const userWhoRefered = await User.findOne({
          referralCode: args.referralCode,
        })
        if (userWhoRefered == null) {
          throw new Error('Referel Code incorrect ')
        }

        //If user not exist already then we will createit
        const code = nanoid(5)
        const user = new User({
          firstName: args.firstName,
          lastName: args.lastName,
          role: args.role,
          phone: args.phone,
          email: args.email,
          referralCode: code,
          referedFrom: userWhoRefered.id,
        })
        await user.save()
        logIn(req, user.id)
        //lets add the new user into userWho refered
        await User.findByIdAndUpdate(userWhoRefered.id, {
          $addToSet: { referedUsers: user.id },
        })
        //make wallet for bonus add
        const wallet = new Wallet({
          userId: userWhoRefered.id,
          amount: 100,
          direction: '+',
          remark: `referrel bonus of ${user.phone}`,
          referedUser: user.id,
          balance: userWhoRefered.currentBalance + 100,
        })
        const newWallet = await wallet.save()
        await User.findByIdAndUpdate(userWhoRefered.id, {
          $addToSet: { walletId: newWallet.id },
        })
        // let currentBalance = userWhoRefered.currentBalance
        await User.findByIdAndUpdate(userWhoRefered.id, {
          $set: {
            currentBalance: userWhoRefered.currentBalance + newWallet.amount,
          },
        })
        return user
      } catch (err) {
        throw err
      }
    },

    getOtp: async (
      root,
      args: { phone: string },
      { req }: { req: Request }
    ): Promise<Number> => {
      try {
        let user = await User.findOne({ phone: args.phone })
        if (!user) {
          throw new Error('Not a valid phone number, Register first')
        }
        const otp = Math.floor(Math.random() * 100000)
        await User.findByIdAndUpdate(user.id, {
          $set: { otp: otp.toString() },
        })
        console.log('OTP sent to the child')
        return otp
      } catch (err) {
        throw err
      }
    },
    verifyOtp: async (
      root,
      args: { phone: string; otp: string },
      { req }: { req: Request }
    ): Promise<UserDocument> => {
      try {
        let result = await User.findOne({ phone: args.phone })
        if (!result) {
          throw new Error('Not a valid phone number, Register first')
        }
        if (result.otp == args.otp) {
          // console.log(result)
          await User.findByIdAndUpdate(result.id, { $set: { otp: '' } })
          logIn(req, result.id)
          return result
        } else {
          throw new Error('Incorrect OTP')
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
        if (seat >= 1) {
          if (user.currentBalance < product.pricePerHour)
            throw new Error('User not have sufficient balance !')
          //Adding user in the class
          await Product.findByIdAndUpdate(args.productId, {
            $addToSet: { users: user.id },
          })
          //change the seat avail in the class
          await Product.findByIdAndUpdate(args.productId, {
            $set: { seats: seat - 1 },
          })
          //making trans of book class
          const wallet = new Wallet({
            userId: user.id,
            amount: product.pricePerHour,
            direction: '-',
            remark: `booked product id ${product.id}`,
            balance: user.currentBalance - product.pricePerHour,
          })
          const newWallet = await wallet.save()
          //add transact id in users database
          await User.findByIdAndUpdate(user.id, {
            $addToSet: { walletId: newWallet.id },
          })
          //get the teacher Data
          const teacher = await User.findById(product.postedBy)
          if (teacher == null) throw new Error('somthing wrong happend')
          //Student amount get deducted
          await User.findByIdAndUpdate(user.id, {
            $set: {
              currentBalance: user.currentBalance - product.pricePerHour,
            },
          })
          //teacher account balance amount get credit
          await User.findByIdAndUpdate(teacher.id, {
            $set: {
              currentBalance: teacher.currentBalance + product.pricePerHour,
            },
          })
          //adding product in the user database
          const result = await User.findByIdAndUpdate(user.id, {
            $addToSet: { products: product.id },
          })
          return user
        } else {
          throw new Error('Seats Full... !')
        }
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
        const userWhoRefered = await User.findOne({
          referralCode: args.referralCode,
        })
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
        await User.findByIdAndUpdate(userWhoRefered.id, {
          $addToSet: { referedUsers: newUser.id },
        })
        const wallet = new Wallet({
          userId: userWhoRefered.id,
          amount: 100,
          direction: '+',
          remark: 'referrel bonus',
          referedUser: newUser.id,
          balance: userWhoRefered.currentBalance + args.amount,
        })
        const newWallet = await wallet.save()

        await User.findByIdAndUpdate(userWhoRefered.id, {
          $addToSet: { walletId: newWallet.id },
        })
        // let currentBalance = userWhoRefered.currentBalance
        await User.findByIdAndUpdate(userWhoRefered.id, {
          $set: {
            currentBalance: userWhoRefered.currentBalance + newWallet.amount,
          },
        })
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
        const parent = await User.findOne({
          _id: args.parentId,
          role: 'parent',
        })
        if (parent === null)
          throw new Error(
            'Parent Does not Exist,Please provide valid parentId '
          )
        // console.log(parent)
        const child = await User.findOne({ phone: args.phone, role: 'user' })
        // console.log('child: ', child)
        if (child === null)
          throw new Error(
            'Child Does not Exist,Please provide valid child PhoneNumber '
          )
        //To send SMS use child.phone
        const otp = Math.floor(Math.random() * 100000).toString()
        const user = await User.findByIdAndUpdate(child.id, {
          $set: { otp },
        })
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
        const parent = await User.findOne({
          _id: args.parentId,
          role: 'parent',
        })
        if (parent === null)
          throw new Error(
            'Parent Does not Exist,Please provide valid parentId '
          )
        const child = await User.findOne({ phone: args.phone, role: 'user' })
        if (child === null)
          throw new Error(
            'Child Does not Exist,Please provide valid phone number '
          )
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
          await User.findByIdAndUpdate(child.id, { $set: { otp: '' } })
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
    updateProfile: async (
      root,
      args: {
        id: string
        firstName: string
        lastName: string
        avatar: string
        qualification: string
        experience: string
        subject: string
        exam: string
        lang: string
        facebook_url: string
        twitter_url: string
        role: string
        verified: boolean
        gender: string
        info: InfoDocument
        scope: string
      },
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      const { userId } = req.session
      // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz',args.gender);
      // await gender.validateAsync(args, { abortEarly: false })
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: args },
        { new: true }
      ).populate('scope')
      return user
    },

    signOut: async (
      root,
      args: { phone: string },
      { req, res }: { req: Request; res: Response }
    ): Promise<Boolean> => {
      return signOut(req, res)
    },
  },
}

export default resolvers
