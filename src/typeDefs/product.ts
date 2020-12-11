import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    products: [Product!]!
    product(id: String!): Product
  }

  extend type Mutation {
    saveProduct(
      id: String
      courseName: String!
      scheduleDateTime: String!
      seats: Int
      postedBy: ID!
      pricePerHour: Int!
      users: [ID]
    ): Product @admin @demo

    deleteProduct(id: ID!): Boolean @admin @demo
  }

  type Product {
    id: ID!
    courseName: String!
    scheduleDateTime: String!
    seats: Int
    postedBy: ID!
    pricePerHour: Int!
    users: [ID]
  }
`
