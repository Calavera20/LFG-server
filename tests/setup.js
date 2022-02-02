const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const  { typeDefs: UserDefs } = require('../src/typeDefs/User');
const { typeDefs: QueryDefs } = require('../src/typeDefs/Query');
const { typeDefs: MutationDefs } = require('../src/typeDefs/Mutation');
const { typeDefs: GameCardDefs } = require('../src/typeDefs/GameCard');
const { typeDefs: GroupDefs } = require('../src/typeDefs/Group');
const { typeDefs: DecisionDefs } = require('../src/typeDefs/Decision');
const { typeDefs: PermissionDefs } = require('../src/typeDefs/Permission');
const { typeDefs: FriendsListDefs } = require('../src/typeDefs/FriendsList');
const { typeDefs: MessageDefs } = require('../src/typeDefs/Message');
const { typeDefs: SubscriptionDefs } = require('../src/typeDefs/Subscription');
const { resolvers: Mutation } = require('../src/resolvers/Mutation');
const { resolvers: Query } = require('../src/resolvers/Query');
const { resolvers: Subscription } = require('../src/resolvers/Subscription');

//konfiguracja serwera wykorzystywanego w trakcie testów


const resolvers = {
  Mutation,
  Query,
  Subscription,
};

const typeDefs = [
  QueryDefs,
  MutationDefs,
  UserDefs,
  GameCardDefs,
  GroupDefs,
  FriendsListDefs,
  MessageDefs,
  SubscriptionDefs,
  PermissionDefs,
  DecisionDefs,
];


const connectToDb = async () => {
  await mongoose.connect('mongodb+srv://LFG:aUqBCD4_!_k2vPw@cluster0.f0liw.mongodb.net/LFG_App?retryWrites=true&w=majority', 
    { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => console.error(error));;
}

const closeDbConnection = async () => {
  await mongoose.connection.close().catch(error => console.error(error));;
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
});


module.exports = {
  testClient: createTestClient(server),
  connectToDb,
  closeDbConnection,
  server
}