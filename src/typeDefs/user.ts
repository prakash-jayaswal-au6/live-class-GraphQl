import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [Author!]!
    user(id: String!): Author
  }

  extend type Mutation {
    saveUser(id: String, name: String, phone: String!, role: String): User

    addClassToUser(userId: String!, classId: String!): User

    bookClass(userId: String!, classId: String!): User

    requestToChild(parentId: String!, childId: String!): Parent

    addChildToParent(parentId: String!, childId: String!, otp: String!): Parent

    referrelUser(referralCode: String!, phone: String!): User

    deleteUser(id: ID!): Boolean

    removeChildFromParent(parentId: ID!, childId: ID!): Author
  }

  type User {
    id: ID!
    name: String
    role: String
    phone: String
    balance: Int
    walletId: [ID]
    referralCode: String
    referedFrom: ID
    referedUsers: [ID]
    onlineClasses: [ID]
    otp: String
    createdAt: String!
    updatedAt: String!
  }

  type Author {
    id: ID!
    name: String
    role: String
    phone: String
    balance: Int
    walletId: [ID]
    referralCode: String
    referedFrom: ID
    referedUsers: [ID]
    onlineClasses: [ID]
    otp: String
    children: [ID]
    parent: [ID]
    createdAt: String!
    updatedAt: String!
  }

  type Parent {
    id: ID!
    name: String
    role: String
    phone: String
    balance: Int
    walletId: [ID]
    referralCode: String
    referedFrom: ID
    parent: [ID]
    referedUsers: [ID]
    children: [ID]
    createdAt: String!
    updatedAt: String!
  }
`
