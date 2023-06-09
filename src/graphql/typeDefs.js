export const typeDefs = `#graphql
    type UserType {
        id: ID
        email: String
        phone: String
    }

    type BankAccountType {
        id: ID
        user_account_name: String
        user_account_number: String
        user_bank_code: String 
        user_bank_id: String
        user: UserType   
    }

    type BankType {
        id: ID
        name: String 
        code: String
        slug: String
        longcode: String
        currency: String
        country: String 
        type: String
        createdAt: String
        updatedAt: String
    }

    type LoginResponseType {
        token: String!
        user: UserType
    }

    type Query {
        getUser(ID: ID!): UserType
        getUsers: [UserType]
        # getUsers(count: Int! page: Int!): [UserType]
        getAccount(user_id: ID!): BankAccountType
        getBanks: [BankType]
    }

    type Mutation {
        addUser(email: String! password: String! phone: String): UserType

        deleteUser(id: ID!): UserType

        addAccount(
            user_account_name: String! 
            user_account_number: String!
            user_bank_code: String!
            user_id: String!
        ): BankAccountType

        loginUser(email: String! password: String!): LoginResponseType
    }
`;
