

export const typeDefs = `
  type Query {
    "Zwraca obiekt zawierający listę znajomych użytkownika o podanym ID"
    getFriendsList(userId: String): FriendsList
    "Zwraca listę obiektów zawierających informację o kartach gier"
    getGameCards: [GameCard]
    "Zwraca informację czy użytkownik o podanej nazwie użytkownika istnieje w bazie danych"
    checkIfUsernameExists(username: String): String
    "Zwraca aktualną listę obiektów grup dotyczących gry o podanym ID"
    getGroupsForGameId(gameId: String): [Group]
    "Zwraca aktualną listę obiektów grup dotyczących gry o podanym ID"
    getGroupByGroupId(groupId: String): Group
    "Zwraca dane użytkownika o podanej nazwie użytkownika"
    getUserData(username: String): User
    
    messages: [Message!]
  }
`;
