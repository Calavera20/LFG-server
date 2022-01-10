import Message from "../classes/message";

var mongoose = require("mongoose");

//Define a schema
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

export const ChatModel = mongoose.model("ChatModel", ChatModelSchema, "Chats");
