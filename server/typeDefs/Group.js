export const typeDefs = `
    type Group {
        id: ID
        description: String
        creator: String
        playerLimit: String
        currentSize: String
        isOpen: Boolean
        gameId: String
        creationDate: String
        members: [String]
        chatId: String
    }
`;