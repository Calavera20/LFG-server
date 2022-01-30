

export const typeDefs = `
"typ zawierający informacje o autentykacji"
    type AuthPayload {
        "token JWT nadawany przy logowaniu"
        token: String
        "nazwa użytkownika użyta przy logowaniu"
        user: User
    }
  "dane użytkownika"
    type User {
        "id użytkownika"
        id: ID!
        "nazwa użytkownika"
        username: String!
        "adres email użytkownika"
        email: String!
    }
`;