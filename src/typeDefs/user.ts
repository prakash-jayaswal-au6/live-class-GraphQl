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
      
    addClassToUser(
        userId:String!
        classId:String!
      ): User @admin @demo

    addChildToParent(
        parentId:String!
        childId:String!
      ): Parent @admin @demo

    referrelUser(
        referralCode:String!
        phone:String!
      ): User @admin @demo

    deleteUser(id: ID!): Boolean @admin @demo
    
  }


  type User {
    id: ID!
    name: String
    role: String
    phone: String
    referralCode: String
    referedFrom: ID
    referedUsers:[ID]
    onlineClasses:[ID]
    createdAt: String!
    updatedAt: String!
  }

  type Parent {
    id: ID!
    name: String
    role: String
    phone: String
    referralCode: String
    referedFrom: ID
    referedUsers:[ID]
    myChild:[ID]
    createdAt: String!
    updatedAt: String!
  }

`
