

export const typeDefs = `
    type AuthPayload {
        token: String
        user: User
    }
  
    type User {
        id: ID!
        username: String!
        friendsList: FriendsList
    }
`;