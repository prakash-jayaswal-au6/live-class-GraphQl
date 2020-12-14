import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    scopes(
      user: String
      page: Int
      search: String
      limit: Int
      sort: String
      type: String
      active: Boolean
    ): scopeRes @auth
    scope(id: String!): Scope @auth
  }

  extend type Mutation {
    saveScope(
      id: String!
      board: ID
      level: ID
      class: ID
      subject: ID
      lang: String
      active: Boolean
    ): Boolean @auth
    deleteScope(id: ID!): Boolean @admin
  }

  type Scope {
    id: ID!
    board: Category
    level: Category
    class: Category
    subject: Category
    lang: String
    active: Boolean
    user: User
    createdAt: String!
    updatedAt: String!
  }

  type scopeRes {
    data: [Scope]
    count: Int
    pageSize: Int
    page: Int
  }
`
