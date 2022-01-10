var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var UserModelSchema = new Schema({
  username: { type: String, index: {unique: true} },
  email: {type: String, index: {unique: true}},
  password: String,
});

export var UserModel = mongoose.model("UserModel", UserModelSchema);
