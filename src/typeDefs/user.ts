import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [User!]!
    user(id: String!): User
  }

  extend type Mutation {
    saveUser( 
        id: String
        name: String!
        email: String!
        password: String!
        role: String
        onlineClasses: [ID]
        ): User @admin @demo
      
    addClassToUser(
      userId:String!
      classId:String!
    ): User @admin @demo


    deleteUser(id: ID!): Boolean @admin @demo
    
  }


  type User {
    id: ID!
    name: String
    email: String
    role: String
    onlineClasses:[ID]
    createdAt: String!
    updatedAt: String!
  }

`
