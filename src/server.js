import { typeDefs as UserDefs } from './typeDefs/User';
import { typeDefs as QueryDefs } from './typeDefs/Query';
import { typeDefs as MutationDefs } from './typeDefs/Mutation';
import { typeDefs as GameCardDefs } from './typeDefs/GameCard';
import { typeDefs as GroupDefs } from './typeDefs/Group';
import { typeDefs as DecisionDefs } from './typeDefs/Decision';
import { typeDefs as PermissionDefs } from './typeDefs/Permission';
import { typeDefs as FriendsListDefs } from './typeDefs/FriendsList';
import { typeDefs as MessageDefs } from './typeDefs/Message';
import { typeDefs as SubscriptionDefs } from './typeDefs/Subscription';
import { resolvers as Mutation } from './resolvers/Mutation';
import { resolvers as Query } from './resolvers/Query';
import { resolvers as Subscription, pubsub } from './resolvers/Subscription';
import { connectDB, db } from './dbConnector';
import { isNull } from 'lodash';
import cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { rule, shield } from 'graphql-shield';
const { GraphQLServer } = require('graphql-yoga');

async function startApolloServer() {
	//łączenie z bazą danych
	await connectDB();
	db.on('error', () => {
		console.error('Error while connecting to DB');
	});

	//konsolidacja funkcji odpowiadającyć za obsługę zapytań
	const resolvers = {
		Mutation,
		Query,
		Subscription,
	};

	//konsolidacja zawartości plików na potrzeby metody tworzącej serwer
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

	//weryfikuje czy w otrzymanym zapytaniu znajduje sie token oraz czy jest poprawny
	function getTokenData(req) {
		let tokenData;
		if (
			req &&
			req.request &&
			req.request.headers.authorization &&
			req.request.headers.authorization.substring(7) != 'null'
		) {
			tokenData = jwt.verify(
				req.request.headers.authorization.substring(7),
				process.env.JWT_SECRET
			);
		} else {
			return null;
		}
		return tokenData;
	}

	//zasada dostępu sprawdzająca czy w kontekscie znajduje sie informacja zawarta w tokenie
	const isAuthorized = rule()(async (parent, args, ctx, info) => {
		return !isNull(ctx.token);
	});

	//ustawienie zasad dostępu dla poszczególnych metod
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
			addGroupPermissionChange: isAuthorized,
		},
		Query: {
			getGameCards: isAuthorized,
			getGroupsForGameId: isAuthorized,
			getGroupByGroupId: isAuthorized,
			getFriendsList: isAuthorized,
			getUserData: isAuthorized,
		},
	});

	//ustawienie portu w zależności czy zmienna środowiskowa jest dostępna - platforma hostingowa - czy też nie - lokalne uruchomienie
	const PORT = process.env.PORT || 4020;
	const opts = {
		port: PORT,
	};

	//ciąg funkcji odpowiadających za utworzenie serwera graphql
	const server = new GraphQLServer({
		typeDefs,
		resolvers,
		context: (req) => ({
			...req,
			pubsub,
			token: getTokenData(req),
		}),
		middlewares: [permissions],
	});
	server.express.use(cors());

	server.start(opts, ({ port }) => {
		console.log(`Server on http://localhost:${port}/`);
	});
}
startApolloServer();
