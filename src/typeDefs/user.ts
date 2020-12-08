import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [Author!]!
    user(id: String!): Author
  }

  extend type Mutation {
    saveUser( 
        id: String
        name: String
        phone: String!
        role: String
      ): User @admin @demo
      
    addClassToUser(
        userId:String!
        classId:String!
      ): User @admin @demo
    
    bookClass(
        userId:String!
        classId:String!
      ): User @admin @demo

    requestToChild(
        parentId:String!
        childId:String!
      ): Parent @admin @demo

    addChildToParent(
        parentId:String!
        childId:String!
        otp:String!
      ): Parent @admin @demo

    referrelUser(
        referralCode:String!
        phone:String!
      ): User @admin @demo

    deleteUser(id: ID!): Boolean @admin @demo
    
    removeChildFromParent(
      parentId: ID!
      childId: ID!
      ): Author @admin @demo
    
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
    referedUsers:[ID]
    onlineClasses:[ID]
    otp:String
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
    referedUsers:[ID]
    onlineClasses:[ID]
    otp:String
    children:[ID]
    parent:[ID]
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
    parent:[ID]
    referedUsers:[ID]
    children:[ID]
    createdAt: String!
    updatedAt: String!
  }

`
