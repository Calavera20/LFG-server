

export const typeDefs = `

  type Mutation {
    "logowanie"
    login(username: String!, password: String!): AuthPayload
    "rejestracja"
    signup(username: String!, email: String!, password: String!): String
    "tworzenie grupy"
    createGroup(description: String!, creator: String!, playerLimit: String!, gameId: String!): String
    "usuwanie grupy"
    removeGroup(groupId: String!): String
    "usuwanie członka grupy"
    removeMember(groupId: String!, member: String!): String
    "dodanie członka do grupy"
    addMember(groupId: String!, member: String!): String
    "wysyłanie wiadomości"
    sendMessage(content: String!, creator: String!, creationDate: String!): String
    "wysłanie zaproszenie do listy znajomych"
    friendInvite(userData: InputFriend, inviteeData: InputFriend): String
    "akceptacja zaproszenia do listy znajomych"
    acceptFriendInvite(userData: InputFriend, inviteeData: InputFriend): String
    "komunikacja z API Gmail w celu nadania wiadomości email"
    emailInvite(userData: InputFriend, inviteeData: InputFriend, message: String): String
    "dodanie wiadomości"
    addMessage(message: MessageInput): Message
    "dodadnie decyzji"
    addDecision(decision: DecisionChangeInput): DecisionChange
    "dodanie zmiany pozwolenia dostępu do grupy"
    addGroupPermissionChange(change: PermissionChangeInput): PermissionChange
  }
`;
