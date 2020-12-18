import { IResolvers } from 'apollo-server-express'
import { CategoryDocument, Request, ScopeDocument } from '../types'
import { Category, Scope, User } from '../models'
import { fields } from '../utils'

const resolvers: IResolvers = {
  Query: {
    scopes: async (root, args, { req }: { req: Request }, info) => {
      const { userId } = req.session
      const user = await User.findById(userId)
      if (!user) throw 'Please login to continue'
      if (user.role !== 'admin') {
        args.user = userId
      }
      args.populate = {
        path: 'board level class subject user',
        options: { sort: { position: 1 } },
        populate: {
          path: 'pathA',
          options: { sort: { position: 1 } },
        },
      }
      const res = await Scope.find()
      return { data: res, count: res.length }
    },
    scope: async (
      root,
      args: { id: string },
      ctx,
      info
    ): Promise<ScopeDocument | null> => {
      return Scope.findById(args.id, fields(info))
    },
  },
  Mutation: {
    deleteScope: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<Boolean> => {
      const scope: any = await Scope.findByIdAndDelete(args.id)
      if (scope) {
        return true
      } else {
        return false
      }
    },
    saveScope: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<Boolean> => {
      const { userId } = req.session
      const user = await User.findById(userId)
      if (!user) throw 'Please login to continue'
      if (user.role !== 'admin') {
        args.user = userId
      }
      let scope
      if (args.id == 'new') scope = await Scope.create(args)
      else {
        scope = await Scope.findOneAndUpdate({ _id: args.id }, args, {
          new: true,
          upsert: true,
        })
        await scope.save() // To fire pre save hoook
      }
      const c: CategoryDocument = await Category.updateOne(
        { _id: scope.subject },
        { $addToSet: { authors: user.id } }
      )
      return true
    },
  },
}

export default resolvers
