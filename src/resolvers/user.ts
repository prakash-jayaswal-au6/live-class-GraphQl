import { IResolvers,UserInputError,AuthenticationError, } from 'apollo-server-express'
import { Request, Response, UserDocument } from '../types'
import { User, OnlineClass, Wallet } from '../models'
import nanoId from 'nano-id'
import { any } from '@hapi/joi'
import { mkdir } from 'fs'
import { result } from 'lodash'

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
          const result = await User.findByIdAndUpdate(
            args.id,
            { name: args.name, role: args.role, phone: args.phone },
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

    addClassToUser: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      try {
        const result = await User.findByIdAndUpdate(
          args.userId,
          //@ts-ignore
          { $addToSet: { onlineClasses: args.classId } },
          (err, docs) => {
            if (err) {
              console.log(err)
            } else {
              console.log('After add class in user  : ', docs)
            }
          }
        )
        await OnlineClass.findByIdAndUpdate(
          args.classId,
          { $set: { users: args.userId } },
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

    bookClass: async (
      root,
      args,
      { req }: { req: Request },
      info
    ): Promise<UserDocument | null> => {
      try {
        //check class exist or not
        const onlineClass = await OnlineClass.findById(args.classId)
        if (onlineClass == null) throw new Error('Class not exist !')
        // check user exist or not
        const user = await User.findById(args.userId)
        if (user == null) throw new Error('User not exist !')
        const seat = onlineClass.seats
        if (seat > 1) {
          //@ts-ignore
          if (user.balance < onlineClass.pricePerHour)
            throw new Error('User not have sufficient balance !')
          //Adding user in the class
          //@ts-ignore
          await OnlineClass.findByIdAndUpdate(args.classId, { $addToSet: { users: args.userId } })
          //change the seat avail in the class
          await OnlineClass.findByIdAndUpdate(args.classId, { $set: { seats: seat - 1 } })
          const teacher = await User.findById(onlineClass.postedBy)
          console.log(teacher)
          //Student amount will decrease
          //@ts-ignore
          await User.findByIdAndUpdate(user.id, { $set: { balance: user.balance - onlineClass.pricePerHour } })
          //teacher amount will increase
          //@ts-ignore
          await User.findByIdAndUpdate(teacher.id, { $set: { balance: teacher.balance + onlineClass.pricePerHour } })
          //@ts-ignore
          const result = await User.findByIdAndUpdate(args.userId, { $addToSet: { onlineClasses: args.classId } })
          return result
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
        //@ts-ignore
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
        // console.log("userWhoRefered: ", userWhoRefered)

        //lets check phone number already exist or not
        const checkUser = await User.findOne({ phone: args.phone })
        if (checkUser) {
          throw new Error(
            'Phone Number already exist in database,please choose another phone Number. '
          )
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
        // console.log('newUser: ', newUser)
// lets update the user whose refered
        // @ts-ignore
        await User.findByIdAndUpdate( userWhoRefered.id,{ $addToSet: { referedUsers: newUser.id } })
        //create awallet
           const wallet = new Wallet({
            userId: userWhoRefered.id,
            amount: 100,
            operation: "+",
            remark: "referrel bonus",
            referedUser: newUser.id
           })
        const newWallet = await wallet.save()

        await User.findByIdAndUpdate(userWhoRefered.id, { $addToSet: { walletId: newWallet.id } })
        // let balance = userWhoRefered.balance
        await User.findByIdAndUpdate( userWhoRefered.id,{ $set: { balance: userWhoRefered.balance+newWallet.amount } })
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
        console.log(args.parentId)
        const parent = await User.findOne({
          _id: args.parentId,
          role: 'parent' || 'teacher',
        })
        if (parent === null)
          throw new Error(
            'Parent Does not Exist,Please provide valid parentId '
          )
        // console.log(parent)
        const child = await User.findOne({ _id: args.childId, role: 'user' })
        console.log('child: ', child)
        if (child === null)
          throw new Error('Child Does not Exist,Please provide valid childId ')
        // @ts-ignore
        //To send SMS use child.phone
        const otp = Math.floor(Math.random() * 100000)
        // console.log("otpIs :", otp)
        const user = await User.findByIdAndUpdate(child.id, {
          $set: { otp: otp },
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
          role: 'parent' || 'teacher',
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
        // console.log('child:', child)
        // @ts-ignore
        if (child.otp == args.otp) {
          //updatig child in parent schema
          const parentAfterUpdate = await User.findByIdAndUpdate(parent.id, {
            $addToSet: { children: child.id },
          })
          console.log(parentAfterUpdate)
          //updatig child in parent schema
          const childAfterUpdate = await User.findByIdAndUpdate(child.id, {
            $addToSet: { parent: parent.id },
          })
          console.log(childAfterUpdate)
          //updating OTP as null
          await User.findByIdAndUpdate(child.id, { $set: { otp: null } })
          // @ts-ignore
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
