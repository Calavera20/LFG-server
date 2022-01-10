

export const typeDefs = `
  type Query {
    hello: String
    getFriendsList(userId: String): FriendsList
    getGameCards: [GameCard]
    getGroupsForGameId(gameId: String): [Group]
    getGroupByGroupId(groupId: String): Group
    getUserData(username: String): User
    messages: [Message!]
  }
`;
