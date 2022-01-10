
export const typeDefs = `

    type Subscription {
        messageAdded(channelId: String): Message
        requestAdded(groupId: String): DecisionChange
        groupPermissionChanged(groupId: String): PermissionChange
    }`;