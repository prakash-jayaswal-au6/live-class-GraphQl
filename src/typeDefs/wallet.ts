import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    allTransactions: [Wallet!]!
    userTransaction(userId: String!): Wallet
    transaction(transactionId: String!): Wallet
  }

  extend type Mutation {
    addMoney(amount: String): Parent
  }

  type Wallet {
    id: ID!
    operation: String
    remark: String
    amount: Int
    walletId: [ID]
    userId: ID
    referedUser: ID
    createdAt: String!
    updatedAt: String!
  }
`
