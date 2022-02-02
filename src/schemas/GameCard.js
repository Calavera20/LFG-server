var mongoose = require('mongoose');

//definicja schematu dokumentu GameCardModel
var Schema = mongoose.Schema;

var GameCardModelSchema = new Schema({ imageB64: String, title: String });

export const GameCardModel = mongoose.model(
	'GameCardModel',
	GameCardModelSchema,
	'Game Cards'
);
