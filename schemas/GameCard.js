var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var GameCardModelSchema = new Schema({ imageB64: String, title: String});

export const GameCardModel = mongoose.model("GameCardModel", GameCardModelSchema,"Game Cards");
