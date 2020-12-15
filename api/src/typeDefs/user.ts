import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    me: User
    users(page: Int, search: String, limit: Int, sort: String): userRes
    user(id: String!): User
  }

  extend type Mutation {
    saveUser(
      id: String
      firstName: String
      lastName: String
      email: String
      avatar: String
      banner: String
      gender: String
      qualification: String
      experience: String
      subject: String
      exam: String
      lang: String
      city: String
      dob: String
      gender: String
      state: String
      phone: String!
      zip: Int
      role: String
      verified: Boolean
      active: Boolean
    ): User

    bookProduct(userId: String!, productId: String!): User

    requestToChild(parentId: String!, childId: String!): User
    addChildToParent(parentId: String!, childId: String!, otp: String!): User
    deleteUser(id: ID!): Boolean
    removeChildFromParent(parentId: ID!, childId: ID!): User
    referrelUser(referralCode: String, phone: String): User
    addClassToUser(userId: String!, classId: String!): User
    # bookClass(userId: String!, classId: String!): User
    getOtp(phone: String!): Int
    verifyOtp(phone: String!, otp: String!): User
    sendInvitation(emails: String): Boolean
    resendEmail(email: String): String
    verifyEmail(
      id: ID!
      token: String!
      expires: String!
      signature: String!
    ): Boolean
    emailPassword(email: String): String
    resetPassword(
      id: ID!
      token: String
      password: String
      passwordConfirmation: String
    ): Boolean
    changePassword(
      oldPassword: String!
      password: String!
      passwordConfirmation: String!
    ): Boolean

    register(
      firstName: String
      lastName: String
      phone: String!
      role: String
      email: String
      referralCode: String
    ): User @guest

    updateProfile(
      firstName: String
      lastName: String
      email: String
      role: String
      gender: String
      info: InputInfo
      phone: String
      dob: String
      avatar: String
      provider: String
      active: Boolean
      verified: Boolean
      address: AddressInput
      qualification: String
      experience: String
      subject: String
      exam: String
      lang: String
      scope: ID
      facebook_url: String
      twitter_url: String
      meta: String
      metaTitle: String
      metaDescription: String
      metaKeywords: String
    ): User @auth

    login(email: String!, password: String!): User @guest
    signOut: Boolean @auth
  }

  input AddressInput {
    id: ID
    email: String
    firstName: String
    lastName: String
    address: String
    town: String
    city: String
    country: String
    district: String
    state: String
    coords: Geo
    zip: Int
    phone: String
    active: Boolean
  }

  input InputInfo {
    public: Boolean
    store: String
    storePhotos: [String]
  }

  type Info {
    public: Boolean
    store: String
    storePhotos: [String]
  }

  type userRes {
    data: [User]
    count: Int
    pageSize: Int
    page: Int
  }

  type User {
    id: ID!
    _id: String
    firstName: String
    lastName: String
    name: String
    phone: String
    email: String
    currentBalance: Int
    walletId: [ID]
    referralCode: String
    referedFrom: ID
    referedUsers: [ID]
    products: [ID]
    otp: String
    children: [ID]
    parent: [ID]
    role: String
    gender: String
    dob: String
    info: Info
    avatar: String
    provider: String
    active: Boolean
    verified: Boolean
    address: Address
    ratings: Float
    reviews: Float
    city: String
    qualification: String
    experience: String
    subject: String
    exam: String
    lang: String
    scope: Category
    facebook_url: String
    twitter_url: String
    meta: String
    metaTitle: String
    metaDescription: String
    metaKeywords: String
    createdAt: String!
    updatedAt: String!
    sid: String
    ref: String
  }
`
