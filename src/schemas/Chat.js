var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatModelSchema = new Schema({
	groupId: String,
	messages: [
		{
			id: String,
			username: String,
			content: String,
			creationDate: String,
		},
	],
});

export const ChatModel = mongoose.model('ChatModel', ChatModelSchema, 'Chats');
