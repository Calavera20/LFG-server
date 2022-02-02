import { PubSub, withFilter } from 'graphql-subscriptions';
export const pubsub = new PubSub();


//definicja metod obsługujących komunikację websockets
export const resolvers = {
	messageAdded: {
		subscribe: withFilter(
			() => pubsub.asyncIterator('messageAdded'),
			(payload, variables) => {
				return payload.channelId === variables.channelId;
			}
		),
	},

	requestAdded: {
		subscribe: withFilter(
			() => pubsub.asyncIterator('requestAdded'),
			(payload, variables) => {
				return payload.groupId === variables.groupId;
			}
		),
	},
	groupPermissionChanged: {
		subscribe: withFilter(
			() => pubsub.asyncIterator('groupPermissionChanged'),
			(payload, variables) => {
				return payload.groupId === variables.groupId;
			}
		),
	},
};
