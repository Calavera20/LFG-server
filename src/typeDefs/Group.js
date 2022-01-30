export const typeDefs = `
    type Group {
        "id grupy"
        id: ID
        "opis grupy"
        description: String
        "twórca grupy"
        creator: String
        "limit graczy - maks 10"
        playerLimit: String
        "aktualny rozmiar grupy"
        currentSize: String
        "czy grupa pozwala na wysłanie próśb o dołączenia"
        isOpen: Boolean
        "id gry której dotyczy grupa"
        gameId: String
        "data utworzenia grupy"
        creationDate: String
        "lista członków grupy"
        members: [String]
        "kanał wiadomości - patrz typ Message"
        chatId: String
    }
`;