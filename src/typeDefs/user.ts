import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [User!]!
    user(id: String!): User
  }

  extend type Mutation {
    saveUser( 
        id: String
        name: String
        phone: String!
        role: String
      ): User @admin @demo
      
    
    bookProduct(
        userId:String!
        productId:String!
      ): User @admin @demo

    requestToChild(
        parentId:String!
        childId:String!
      ): User @admin @demo

    addChildToParent(
        parentId:String!
        childId:String!
        otp:String!
      ): User @admin @demo

    referrelUser(
        referralCode:String!
        phone:String!
      ): User @admin @demo

    deleteUser(id: ID!): Boolean @admin @demo
    
    removeChildFromParent(
      parentId: ID!
      childId: ID!
      ): User @admin @demo
    
  }


  type User {
    id: ID!
    name: String
    role: String
    phone: String
    currentBalance: Int
    walletId: [ID]
    referralCode: String
    referedFrom: ID
    referedUsers:[ID]
    products:[ID]
    otp:String
    children:[ID]
    parent:[ID]
    createdAt: String!
    updatedAt: String!
  }
 
`
