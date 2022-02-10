import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel as User } from '../schemas/User';
import { pubsub } from '../resolvers/Subscription';
import { GroupModel as Group } from '../schemas/Group';
import { FriendsListModel as FriendsList } from '../schemas/FriendsList';

const nodemailer = require('nodemailer');

//definicja metod obsługujących zapytania typu Mutation
export const resolvers = {
	signup: async (parent, { username, email, password }) => {
		const hash = await bcrypt.hash(password, 10);
		const alreadyExistsErrCode = 11000;
		let res;
		await new User({ username: username, email: email, password: hash })
			.save()
			.then(
				async (user) => {
					res = username;
					await new FriendsList({ userId: user.id }).save().then(
						() => {},
						(err) => {
							res = err.code;
						}
					);
				},
				(err) => {
					res = err.code;
				}
			);

		if (res == username) {
			return res;
		} else {
			if (res == alreadyExistsErrCode) return res;
		}
	},
	login: async (parent, { username, password }) => {
		let result = { token: {}, user: {} };
		await User.findOne({ username: username }).then(
			async (user) => {
				result.user = user;
				const expirationTime = '1d';
				const match = await bcrypt.compare(password, user.password);
				if (match) {
					const accessToken = jwt.sign(
						{ id: user.id, email: user.email },
						process.env.JWT_SECRET,
						{ expiresIn: expirationTime }
					);

					result.token = accessToken;
				} else {
					result = new UserInputError('password is incorrect');
				}
			},
			(err) => {
				result = new UserInputError(err.code);
			}
		);

		if (result.user) {
			return result;
		} else {
			return new UserInputError('username not found');
		}
	},
	createGroup: async (
		parent,
		{ description, creator, playerLimit, gameId }
	) => {
		let res, err;

		let creationDate = Date.now().toString();
		await new Group({
			description: description,
			creator: creator,
			playerLimit: playerLimit,
			gameId: gameId,
			members: [creator],
			isOpen: true,
			currentSize: 1,
			creationDate: creationDate,
		})
			.save()
			.then(
				async (newGroup) => {
					res = newGroup.id;
				},
				(err) => {
					err = err;

					res = err.code;
				}
			);

		if (err) {
			return new UserInputError(res);
		} else {
			return res;
		}
	},
	removeGroup: async (parent, { groupId }) => {
		await Group.deleteOne({ _id: groupId });
	},
	removeMember: async (parent, { groupId, member }) => {
		await Group.updateOne(
			{ _id: groupId },
			{ $pull: { members: member }, $inc: { currentSize: -1 } }
		);
	},
	addMember: async (parent, { groupId, member }) => {
		await Group.updateOne(
			{ _id: groupId },
			{ $push: { members: member }, $inc: { currentSize: 1 } }
		);
	},
	friendInvite: async (parent, { userData, inviteeData }) => {
		const successRespone = 'success';
		await FriendsList.updateOne(
			{ userId: userData.userId },
			{ $push: { invited: inviteeData } }
		).then(async (e) => {
			await FriendsList.updateOne(
				{ userId: inviteeData.userId },
				{ $push: { pending: userData } }
			).catch((e) => {
				return e;
			});
		});
		return successRespone;
	},
	acceptFriendInvite: async (parent, { userData, inviteeData }) => {
		await FriendsList.updateOne(
			{ userId: userData.userId },
			{ $pull: { pending: { userId: inviteeData.userId } } }
		).then(async (d) => {
			await FriendsList.updateOne(
				{ userId: userData.userId },
				{ $push: { friends: inviteeData } }
			).then(async (d) => {
				await FriendsList.updateOne(
					{ userId: inviteeData.userId },
					{ $pull: { invited: { userId: userData.userId } } }
				).then(async (d) => {
					await FriendsList.updateOne(
						{ userId: inviteeData.userId },
						{ $push: { friends: userData } }
					);
				});
			});
		});
	},
	emailInvite: async (parent, { userData, inviteeData, message }) => {
		//zawartość maila w postaci HTML
		const output = `
    <h1>You have a new invitation from your friend on LFG</h1>
    <h3>Friend Details</h3>
    <ul>  
      Username: ${userData.username}
    </ul>
      <h3>Message</h3>
	  <ul> 
      <p>Hello ${inviteeData.username},<br>
        ${message}
      </p>
    </ul> 
  `;

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				// type: 'OAuth2',
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD,
				// clientId: process.env.OAUTH_CLIENTID,
				// clientSecret: process.env.OAUTH_CLIENT_SECRET,
				// refreshToken: process.env.OAUTH_REFRESH_TOKEN,
			},
		});

		let mailOptions = {
			from: 'jakub.remiszewski1024@gmail.com',
			to: `${inviteeData.email}`,
			subject: 'LFG invitation',
			//alternatywa dla wiadomości w postaci HTML
			text: `Unable to see HTML message? You received invitation from ${userData.username}, please head to LFG get in contact with them.`,
			html: output,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
		});
	},
	addMessage: (root, { message }) => {
		const newMessage = {
			text: message.text,
			creator: message.creator,
			creationDate: message.creationDate,
			channelId: message.channelId,
		};
		pubsub.publish('messageAdded', {
			messageAdded: newMessage,
			channelId: message.channelId,
		});
		return newMessage;
	},

	addDecision: (root, { decision }) => {
		const newDecision = { data: decision.data, groupId: decision.groupId };
		pubsub.publish('requestAdded', {
			requestAdded: newDecision,
			groupId: decision.groupId,
		});
		return newDecision;
	},

	addGroupPermissionChange: (root, { change }) => {
		const newPermission = change;
		pubsub.publish('groupPermissionChanged', {
			groupPermissionChanged: newPermission,
			groupId: change.groupId,
		});
		return newPermission;
	},
};
