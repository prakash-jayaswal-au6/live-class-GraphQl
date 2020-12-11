import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    allTransactions: [Wallet!]!
    userTransaction(userId: String!): [Wallet]
    transaction(walletId: String!): Wallet
  }

  extend type Mutation {
    addMoney( 
        userId:String
        amount: Int     
      ): Wallet @admin @demo   
  }

  type Wallet {
    id: ID!
    direction: String
    remark: String
    amount: Int
    userId: ID
    balance: Int
    referedUser:ID
    createdAt: String!
    updatedAt: String!
  }
`
