var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var friendSchema = new Schema(
	{ userId: String, username: String, email: String },
	{ noId: true }
);

var FriendsListModelSchema = new Schema({
	userId: { type: String, index: { unique: true } },
	friends: [friendSchema],
	pending: [friendSchema],
	invited: [friendSchema],
});

export var FriendsListModel = mongoose.model(
	'FriendsListModel',
	FriendsListModelSchema
);
