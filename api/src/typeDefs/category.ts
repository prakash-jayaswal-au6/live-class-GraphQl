import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    boards: [Category]
    classes: [Category]
    skills: [Category]
    megamenu(
      id: ID
      search: String
      sort: String
      featured: Boolean
    ): [Category]
    megamenuAll(
      id: ID
      search: String
      sort: String
      featured: Boolean
    ): [Category] @admin
    occupiedSubjects(id: ID, lang: String): [Category]
    categories(
      page: Int
      search: String
      limit: Int
      sort: String
      level: Int
    ): categoryRes
    category(id: String, slug: String): Category
    categorySimple(id: String, slug: String): CategorySimple
  }

  extend type Mutation {
    refreshCategorySlug: Boolean
    saveCategory(
      id: String
      name: String
      parent: ID
      slug: String
      img: String
      level: Int
      metaTitle: String
      metaDescription: String
      metaKeywords: String
      position: Int
      megamenu: Boolean
      featured: Boolean
      active: Boolean
    ): Category @admin
    deleteCategory(id: ID!): Boolean @admin
  }

  type Category {
    _id: ID
    id: ID!
    index: Int
    name: String
    parent: Category
    slug: String
    path: String
    slugPath: String
    namePath: String
    pathA: [Category]
    level: Int
    position: Int
    megamenu: Boolean
    meta: String
    metaTitle: String
    metaDescription: String
    metaKeywords: String
    img: String
    featured: Boolean
    shopbycategory: Boolean
    children: [Category]
    authors: [User]
    user: User
    count: Int
    sizechart: String
    active: Boolean
    createdAt: String
    updatedAt: String
  }
  type CategorySimple {
    _id: ID
    id: ID!
    index: Int
    name: String
    parent: ID
    slug: String
    path: String
    slugPath: String
    namePath: String
    level: Int
    position: Int
    megamenu: Boolean
    meta: String
    metaTitle: String
    metaDescription: String
    metaKeywords: String
    img: String
    featured: Boolean
    shopbycategory: Boolean
    authors: [Scope]
    user: User
    count: Int
    sizechart: String
    active: Boolean
    createdAt: String!
    updatedAt: String!
  }

  type categoryRes {
    data: [Category]
    count: Int
    pageSize: Int
    page: Int
  }
`
