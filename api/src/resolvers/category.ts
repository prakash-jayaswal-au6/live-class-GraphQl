import { IResolvers, UserInputError } from 'apollo-server-express'
import { Request, CategoryDocument, ScopeDocument } from '../types'
import { objectId } from '../validation'
import { Category, Scope } from '../models'
import { fields } from '../utils'
import { ObjectId } from 'mongodb'
const resolvers: IResolvers = {
  Query: {
    categories: async (root, args, { req }: { req: Request }, info) => {
      delete args.limit
      delete args.page
      args.active = true
      const res = await Category.find(args)
      return { data: res, count: res.length }
    },
    occupiedSubjects: async (root, args, { req }: { req: Request }, info) => {
      let where: any = {}
      if (args.id) where._id = args.id
      if (args.lang) where.lang = args.lang
      const megamenu = await Category.find(
        { _id: '5f2819b1b477c57eea81ff69' },
        fields(info)
      ).populate({
        path: 'children',
        options: { sort: { position: 1 } },
        populate: {
          path: 'children',
          options: { sort: { position: 1 } },
          populate: {
            path: 'children',
            options: { sort: { position: 1 } },
            populate: {
              path: 'authors',
              populate: {
                path: 'user',
                populate: {
                  path: 'scope',
                },
              },
            },
          },
        },
      })
      return megamenu
    },

    category: async (
      root,
      args: { id: string; slug: string },
      ctx,
      info
    ): Promise<CategoryDocument | null> => {
      if (args.id) {
        await objectId.validateAsync(args)
        return Category.findById(args.id, fields(info)).populate(
          'parent children pathA'
        )
      } else {
        return Category.findOne({ slug: args.slug }, fields(info)).populate(
          'parent children'
        )
      }
    },
  },
  Mutation: {
    deleteCategory: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<Boolean> => {
      const category: any = await Category.findById(args.id)
      if (category && category.children && category.children.length > 0)
        throw new UserInputError('Can not delete category with children')
      if (category) {
        await Category.updateOne(
          { _id: category.parent },
          { $pull: { children: category._id } }
        )
        await Category.deleteOne({ _id: category._id })
      }
      return true
    },
    saveCategory: async (
      root,
      args,
      { req }: { req: Request }
    ): Promise<CategoryDocument | null> => {
      const { userId } = req.session
      args.user = userId
      let category: any
      if (args.id == 'new') {
        category = await Category.create(args)
      } else {
        if (!ObjectId.isValid(args.id)) {
          throw new UserInputError('Record not found')
        }
        category = await Category.findOneAndUpdate({ _id: args.id }, args, {
          new: true,
          upsert: true,
        })
      }
      return category
    },
  },
}

export default resolvers
