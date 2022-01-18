import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel as User } from "../schemas/User";
import {pubsub} from "../resolvers/Subscription";
import { GroupModel as Group } from "../schemas/Group";
// import {ChatModel as Chat } from "../schemas/Chat"
// import { UserInputError } from "apollo-server-express";
import AuthPayload from "../classes/authPayload";
import { FriendsListModel as FriendsList } from "../schemas/FriendsList";

const nodemailer = require('nodemailer');

export const resolvers = {
  signup: async (parent, { username, email, password }) => {
    const hash = await bcrypt.hash(password, 10);
    let res;
    await new User({ username: username, email: email, password: hash }).save().then(
      async (user) => {
        console.log(username)
        res = username;
        await new FriendsList({userId: user.id}).save().then(()=>{},
        (err)=>{
          res = err.code;
        })
      },
      (err) => {
        console.log(err)
        res = err.code;
      }
    );

//dodaj sprawdzanie emaila

    if (res == username) {
      return res;
    } else {
      if (res == 11000) return res
      // new UserInputError("username is not available");
    }
  },
  login: async (parent, { username, password }) => {
    let result={token: {}, user: {}};
    await User.findOne({ username: username }).then(
      async (user) => {
        result.user=user;
        const match = await bcrypt.compare(password, user.password);
        if (match) {

          const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            "secret",
            { expiresIn: '1d' }
          )

          result.token=accessToken;
          
          
        } else {
          result = new UserInputError("password is incorrect");
        }
      },
      (err) => {
        result = new UserInputError(err.code);
      }
    );

    if (result.user) {
      return result;
    } else {
      return new UserInputError("username not found");
    }
  },
  createGroup: async (parent, { description, creator, playerLimit, gameId }) => {
    let res, err;


    let creationDate= Date.now().toString();
    await new Group({ description: description, creator: creator, playerLimit: playerLimit, gameId: gameId, members: [creator], isOpen: true, currentSize: 1, creationDate:creationDate}).save().then(
      async (newGroup) => {

        res = newGroup.id;
      },
      (err) => {
        err = err;

        res = err.code;
      }
    );

    if (err) {
      return new UserInputError(res)
    } else {
      return res
    }

  },
  removeGroup: async (parent, { groupId }) => {
    await Group.deleteOne({_id: groupId});
  },
  removeMember: async (parent, { groupId, member}) => {
    await Group.updateOne({_id: groupId}, {$pull: {members: member}, $inc: {currentSize: -1}})
  },
  addMember: async (parent, { groupId, member}) => {
    await Group.updateOne({_id: groupId}, {$push: {members: member}, $inc: {currentSize: 1}})
  },
  friendInvite: async  (parent, { userData, inviteeData}) =>{
    await FriendsList.updateOne({userId: userData.userId}, {$push: {invited: inviteeData}}).then(
      async () => {
        await FriendsList.updateOne({userId: inviteeData.userId}, {$push: {pending: userData}})
      }
    );

  },
  acceptFriendInvite: async  (parent, { userData, inviteeData }) =>{
    await FriendsList.updateOne({userId: userData.userId}, {$pull: {pending: {userId: inviteeData.userId}}}).then( 
      async (d) => {
        await FriendsList.updateOne({userId: userData.userId}, {$push: {friends: inviteeData}}).then(
          async (d) => {
            await FriendsList.updateOne({userId: inviteeData.userId}, {$pull: {invited: {userId: userData.userId}}}).then(
              async (d) => {
                await FriendsList.updateOne({userId: inviteeData.userId}, {$push: {friends: userData}})
      })})}
    );
  },
  emailInvite: async (parent,  { userData, inviteeData, message }) =>{

    const output = `
    <h1>You have a new invitation from your friend on LFG</h1>
    <h3>Contact Details</h3>
    <ul>  
      ${userData.username}
    </ul>
      <h3>Message</h3>
	  <ul> 
      <p>Hello ${inviteeData.username},<br>
        ${message}
      </p>
    </ul> 
  `;

  let transporter = nodemailer.createTransport({
    name: 'spencer.kemmer38@ethereal.email',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'spencer.kemmer38@ethereal.email',
        pass: 'RHjZwje2PGJ62zWXXG'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: '"Nodemailer Contact" <spencer.kemmer38@ethereal.email>',
      to: `${inviteeData.email}`, 
      subject: 'LFG invitation', 
      text: 'Hello world?', 
      html: output 
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          // return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
    
  },
  addMessage: (root, { message }) => {
    console.log(message)
    const newMessage = { text: message.text, creator: message.creator, creationDate: message.creationDate, channelId: message.channelId };
    pubsub.publish('messageAdded', { messageAdded: newMessage, channelId: message.channelId });  
    return newMessage;
  },

  addDecision: (root, {decision}) => {
    console.log(decision)
    const newDecision = {data: decision.data, groupId: decision.groupId};
    pubsub.publish('requestAdded', { requestAdded: newDecision, groupId: decision.groupId});  
    console.log(newDecision)
    return newDecision;
  },
  
  addGroupPermissionChange: (root, {change}) => {
    console.log(change)
    const newPermission = change;
    pubsub.publish('groupPermissionChanged', {  groupPermissionChanged: newPermission , groupId: change.groupId});  
    return newPermission;
  }
};