
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
import { createServer } from 'http';
import { resolvers as Subscription, pubsub } from "./resolvers/Subscription";
import { connectDB, db } from "./dbConnector";
import { isNull } from "lodash";

import { execute, subscribe } from 'graphql';
import express from "express"
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors from 'cors';
import * as jwt from 'jsonwebtoken'
import { rule, shield} from "graphql-shield";
import { makeExecutableSchema } from '@graphql-tools/schema';
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
// // });
// const schema = makeExecutableSchema({ typeDefs, resolvers });
// const app = express();
// const httpServer = createServer(app);
// const subscriptionServer = SubscriptionServer.create({
//   // This is the `schema` we just created.
//   schema,
//   // These are imported from `graphql`.
//   execute,
//   subscribe,
// }, {
//   // This is the `httpServer` we created in a previous step.
//   server: httpServer,
//   // Pass a different path here if your ApolloServer serves at
//   // a different path.
//   path: '/graphql',
// });

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: req => ({
//       req,
//       pubsub,
//       token: getTokenData(req)
//     }),
//     plugins: [{
//       async serverWillStart() {
//         return {
//           async drainServer() {
//             subscriptionServer.close();
//           }
//         };
//       }
//     }],
// });
// const PORT = process.env.PORT || 4000;
// server
// return server.listen({ port: PORT });
const app = express();

const httpServer = createServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const subscriptionServer = SubscriptionServer.create(
  { schema, execute, subscribe },
  { server: httpServer, path: '/graphql' }
);

const server = new ApolloServer({
  schema,
  context: req => ({
          req,
          pubsub,
          token: getTokenData(req)
        }),
  plugins: [{
    async serverWillStart() {
      return {
        async drainServer() {
          subscriptionServer.close();
        }
      };
    }
  }],
});
// // await server.start();
// server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
);
}
 startApolloServer();


