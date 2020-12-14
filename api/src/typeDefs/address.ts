import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    addresses(page: Int, search: String, limit: Int, sort: String): addressRes @auth
    address(id: String): Address @auth
    getLocation(lat: Float, lng: Float): Address
  }

  extend type Mutation {
    deleteAddress(id: ID!): Boolean @auth

    addAddress(
      email: String
      firstName: String
      lastName: String
      address: String
      town: String
      city: String
      district: String
      country: String
      state: String
      coords: Geo
      zip: Int
      phone: String
    ): Address @auth
    saveAddress(
      id: String
      email: String
      firstName: String
      lastName: String
      address: String
      town: String
      district: String
      city: String
      country: String
      state: String
      coords: Geo
      zip: Int
      phone: String
      active: Boolean
    ): Address @auth @demo
    updateAddress(
      id: ID!
      email: String
      firstName: String
      lastName: String
      address: String
      town: String
      district: String
      city: String
      country: String
      state: String
      coords: Geo
      zip: Int
      phone: String
      active: Boolean
    ): Address @auth
  }

  type addressRes {
    data: [Address]
    count: Int
    pageSize: Int
    page: Int
  }

  type Address {
    id: ID!
    email: String
    firstName: String
    lastName: String
    address: String
    town: String
    city: String
    district: String
    country: String
    state: String
    coords: Coords
    zip: Int
    phone: String
    active: Boolean
    createdAt: String!
    updatedAt: String!
  }

  input Geo {
    lat: Float
    lng: Float
  }

  type Coords {
    lat: String
    lng: String
  }
`
