

export const typeDefs = `
  type Query {
    getFriendsList(userId: String): FriendsList
    getGameCards: [GameCard]
    checkIfUsernameExists(username: String): String
    getGroupsForGameId(gameId: String): [Group]
    getGroupByGroupId(groupId: String): Group
    getUserData(username: String): User
    messages: [Message!]
  }
`;
