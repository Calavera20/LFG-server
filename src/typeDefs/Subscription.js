
export const typeDefs = `

    type Subscription {
        "powiadomienie o dodaniu nowej wiadomości na kanale channelID"
        messageAdded(channelId: String): Message
        "powiadomienie o dodaniu nowej prośby dotyczącej groupy o id groupID"
        requestAdded(groupId: String): DecisionChange
        "powiadomienie od zmianie zezwolenia dostępu dotyczącej groupy o id groupID"
        groupPermissionChanged(groupId: String): PermissionChange
    }`;