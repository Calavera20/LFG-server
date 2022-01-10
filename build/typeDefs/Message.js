

export const typeDefs = `

type Message {
    text: String
    creator: String
    creationDate: String
    channelId: String
}

input MessageInput {
    text: String
    creator: String
    creationDate: String
    channelId: String
}
`;