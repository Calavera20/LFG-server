


export const typeDefs = `

type Message {
    "zawartość wiadomości"
    text: String
    "twórca wiadomości"
    creator: String
    "data utworzenia wiadomości"
    creationDate: String
    "kanał wiadomości"
    channelId: String
}
"patrz Message"
input MessageInput {
    text: String
    creator: String
    creationDate: String
    channelId: String
}
`;