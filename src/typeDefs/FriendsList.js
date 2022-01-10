export const typeDefs = `
    type FriendsList {
        friends: [Friend]
        pending: [Friend]
        invited: [Friend]
    }

    type Friend{
        userId: String!
        username: String!
        email: String!
    }

    input InputFriend{
        userId: String!
        username: String!
        email: String!
    }
`;