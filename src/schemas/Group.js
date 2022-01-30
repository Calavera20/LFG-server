var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GroupModelSchema = new Schema({
	description: String,
	creator: String,
	playerLimit: String,
	currentSize: Number,
	members: [String],
	chatId: String,
	isOpen: Boolean,
	gameId: String,
	creationDate: String,
});

export const GroupModel = mongoose.model(
	'GroupModel',
	GroupModelSchema,
	'Groups'
);
