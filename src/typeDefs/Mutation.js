

export const typeDefs = `

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    signup(username: String!, email: String!, password: String!): String
    createGroup(description: String!, creator: String!, playerLimit: String!, gameId: String!): String
    removeGroup(groupId: String!): String
    removeMember(groupId: String!, member: String!): String
    addMember(groupId: String!, member: String!): String
    sendMessage(content: String!, creator: String!, creationDate: String!): String
    friendInvite(userData: InputFriend, inviteeData: InputFriend): String
    acceptFriendInvite(userData: InputFriend, inviteeData: InputFriend): String
    emailInvite(userData: InputFriend, inviteeData: InputFriend): String
    addMessage(message: MessageInput): Message
    addDecision(decision: DecisionChangeInput): DecisionChange
    addGroupPermissionChange(change: PermissionChangeInput): PermissionChange
    postMessage(user: String!, content: String!): ID!
  }
`;
