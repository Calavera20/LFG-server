import bcrypt from "bcrypt";
import { GameCardModel as GameCard } from "../schemas/GameCard";
import { GroupModel as Group } from "../schemas/Group";
import { FriendsListModel as FriendsList } from "../schemas/FriendsList";

import { UserModel as User } from "../schemas/User";

export const resolvers = {
  getGameCards: async () => {
    let res;
    await GameCard.find({}).then(
      (data) => {
        res = data;
      },
      (err) => {}
    );
    return res;
  },
  getGroupsForGameId: async (parent, { gameId }) => {
    let res;
    console.log(gameId);
    await Group.find({gameId: gameId}).sort({ creationDate: -1 }).then(
      (data) => {
        res = data;
        
      },
      (err) => {}
    );
    console.log(res);
    return res;
  },
  getGroupByGroupId: async (parent, { groupId }) => {
    let res;
    console.log(groupId);
    await Group.findOne({_id: groupId}).then(
      (data) => {
        res = data;
        
      },
      (err) => {}
    );
    console.log(res);
    return res;
  },
  getFriendsList: async (parent, { userId }) => {
    let res;
    await FriendsList.findOne({userId: userId}).then(
      (data) => {
        res = data;
        console.log(data)
      },
      (err) => {}
    );
    return res;
  },
  getUserData: async (parent, { username }) => {
    let res;
    await User.findOne({username: username}).then(
      (data) => {
        res = data;
        console.log(data)
      },
      (err) => {}
    );
    return res;
  },
  checkIfUsernameExists: async (parent, { username }) => {
    let res;
    await User.findOne({username: username}).then(
      (data) => {
        res = data;
      }
    );
    return res;
  }
};
