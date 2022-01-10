
import { typeDefs as UserDefs } from "./typeDefs/User";
import { typeDefs as QueryDefs } from "./typeDefs/Query";
import { typeDefs as MutationDefs } from "./typeDefs/Mutation";
import { typeDefs as GameCardDefs } from "./typeDefs/GameCard";
import { typeDefs as GroupDefs } from "./typeDefs/Group";
import { typeDefs as DecisionDefs } from "./typeDefs/Decision";
import { typeDefs as PermissionDefs } from "./typeDefs/Permission";
import { typeDefs as FriendsListDefs } from "./typeDefs/FriendsList";
import { typeDefs as MessageDefs } from "./typeDefs/Message";
import { typeDefs as SubscriptionDefs } from "./typeDefs/Subscription";
import { resolvers as Mutation } from "./resolvers/Mutation";
import { resolvers as Query } from "./resolvers/Query";
import { resolvers as Subscription, pubsub } from "./resolvers/Subscription";
import { connectDB, db } from "./dbConnector";
import { isNull } from "lodash";
import cors from 'cors';
import * as jwt from 'jsonwebtoken'
import { rule, shield} from "graphql-shield";
const { GraphQLServer} = require("graphql-yoga");
import {ApolloServer} from "apollo-server"

async function startApolloServer() {
  await connectDB();

  db.on("error", () => {
    console.error("Error while connecting to DB");
  });

  const resolvers = {
    Mutation,
    Query,
    Subscription
  };


  const typeDefs = [
    QueryDefs, MutationDefs,UserDefs,GameCardDefs, GroupDefs, FriendsListDefs 
     , MessageDefs 
    , SubscriptionDefs, PermissionDefs, DecisionDefs
  ];

  function getTokenData(req) {
    let tokenData;
    if(req && req.request && req.request.headers.authorization && req.request.headers.authorization.substring(7) != "null") {
        tokenData = jwt.verify(req.request.headers.authorization.substring(7), "secret");
    } else {
        return null;
    }
    return tokenData;
}

  const isAuthorized = rule()(async (parent, args, ctx, info) => {
    return !isNull(ctx.token)
  })

  const permissions = shield({
    Mutation: {
      createGroup: isAuthorized,
      removeGroup: isAuthorized,
      removeMember: isAuthorized,
      addMember: isAuthorized,
      friendInvite: isAuthorized,
      acceptFriendInvite: isAuthorized,
      emailInvite: isAuthorized,
      addMessage: isAuthorized,
      addDecision: isAuthorized,
      addGroupPermissionChange: isAuthorized
    },
    Query: {
      getGameCards: isAuthorized,
      getGroupsForGameId: isAuthorized,
      getGroupByGroupId: isAuthorized,
      getFriendsList: isAuthorized,
      getUserData: isAuthorized
    }
  })
// const server = new GraphQLServer({ typeDefs, resolvers, context: req => ({
//   ...req,
//   pubsub,
//   token: getTokenData(req)
// })
//  , middlewares: [permissions] 
// });
// server.express.use(cors());

// server.start(({ port }) => {
//   console.log(`Server on http://localhost:${port}/`);
// });
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => ({
      ...req,
      pubsub,
      token: getTokenData(req)
    })
});
const PORT = process.env.PORT || 4000;

return server.listen({ port: PORT });
 
}
 startApolloServer();


