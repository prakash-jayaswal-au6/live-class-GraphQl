import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    onlineClasses: [OnlineClass!]!
    onlineClass(id: String!): OnlineClass
  }

  extend type Mutation {
    saveOnlineClass(
      id: String
      courseName: String!
      scheduleDateTime: String!
      seats: Int
      postedBy: ID!
      pricePerHour: Int!
      users: [ID]
    ): OnlineClass

    deleteOnlineClass(id: ID!): Boolean
  }

  type OnlineClass {
    id: ID!
    courseName: String!
    scheduleDateTime: String!
    seats: Int
    postedBy: ID!
    pricePerHour: Int!
    users: [ID]
  }
`
