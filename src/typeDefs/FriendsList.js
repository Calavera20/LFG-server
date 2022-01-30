export const typeDefs = `
    type FriendsList {
        "lista aktualnych znajomych"
        friends: [Friend]
        "lista oczekujących próśb o dołączenie do listy znajomych"
        pending: [Friend]
        "list zaproszonych znajomych"
        invited: [Friend]
    }

    "obiekt przechowywany w liście znajomych"
    type Friend{
        "id użytkownika"
        userId: String!
        "nazwa użytkownika"
        username: String!
        "adres email"
        email: String!
    }

    "patrz typ Friend"
    input InputFriend{
        userId: String!
        username: String!
        email: String!
    }
`;
