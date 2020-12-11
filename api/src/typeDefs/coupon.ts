import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    couponsAdmin(
      page: Int
      search: String
      limit: Int
      sort: String
    ): couponRes @admin
    coupons(page: Int, search: String, limit: Int, sort: String): couponRes
    coupon(id: String!): Coupon
  }

  extend type Mutation {
    saveCoupon(
      id: String
      code: String!
      value: Int!
      type: String
      info: String
      msg: String
      text: String
      terms: String
      color: String
      minimumCartValue: Int
      amount: Int
      maxAmount: Int
      validFromDate: String
      validToDate: String
      active: Boolean
    ): Coupon @admin
    deleteCoupon(id: ID!): Boolean @admin
  }

  type Coupon {
    id: ID!
    code: String
    value: Int
    type: String
    info: String
    msg: String
    text: String
    terms: String
    color: String
    minimumCartValue: Int
    amount: Int
    maxAmount: Int
    validFromDate: String
    validToDate: String
    active: Boolean
    createdAt: String
    updatedAt: String
  }

  type couponRes {
    data: [Coupon]
    count: Int
    pageSize: Int
    page: Int
  }
`
