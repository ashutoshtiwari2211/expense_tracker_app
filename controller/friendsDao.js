const { ObjectId } = require('mongodb');
const { Friends, Users } = require('../models/collections');
const AppError = require('../utils/AppError');


async function getOne(collection, condition) {

    const queryResult = await collection.findOne(condition)
        .then(docs => {
            console.log("select result: ", docs);
            return docs;
        });

    return queryResult;
}
async function insertOne(collection, insertDocument) {

    const result = new collection(insertDocument);
    await result.save()
        .then(doc => {
            console.log(`inserted in ${collection}`);
            return doc;
        })
        .catch(err => { throw err });

    return result;

}

async function getAll(collection, condition) {
    const queryResult = await collection.find(condition)
        .populate('friend1')
        .populate('friend2')

    return queryResult;
}

module.exports = {
    funGetAllFriends: async function (user_id) {
        const returnList = await getAll(Friends, { $or: [{ "friend1": { $eq: ObjectId(user_id) } }, { "friend2": { $eq: ObjectId(user_id) } }] });
        return returnList;
    },
    funAddFriend: async function (body, user) {
        const { friend_name } = body;
        const friend = await getOne(Users, { username: friend_name })
        if (!friend) throw new AppError("InValid Friendname", 400);
        const isAlreadyExist = await getOne(Friends, { $or: [{ $and: [{ friend1: friend._id }, { friend2: user._id }] }, { $and: [{ friend2: friend._id }, { friend1: user._id }] }] })
        if (isAlreadyExist)
            return;
        const date = new Date(Date.now()).toString().slice(0, 15);
        const returnList = await insertOne(Friends, { friend1: user._id, friend2: friend._id, updated: date });
        return returnList;
    },

    funGetExchangeDetails: async function (user_id) {
        const returnList = await getAll(Friends, { $or: [{ "friend1": { $eq: ObjectId(user_id) } }, { "friend2": { $eq: ObjectId(user_id) } }] });
        return returnList;
    },

    funPayToFriend: async function (body, user) {
        const { amount, friend_name } = body;
        if (isNaN(amount) || parseInt(amount) < 0) throw new AppError("InValid Amount input", 400);
        const friend = await getOne(Users, { username: friend_name })
        if (!friend) throw new AppError("InValid Friendname", 400);
        const isFriend = await getOne(Friends, { $or: [{ $and: [{ friend1: friend._id }, { friend2: user._id }] }, { $and: [{ friend2: friend._id }, { friend1: user._id }] }] });
        if (!isFriend) throw new AppError("Not Your Friend", 400);

        if ((user._id).toString() == (isFriend.friend1).toString())
            isFriend.frd1ToFrd2 += parseInt(amount);
        else
            isFriend.frd1ToFrd2 -= parseInt(amount);
        const date = new Date(Date.now()).toString().slice(0, 15);
        isFriend.updated = date;
        await isFriend.save();
        return isFriend;
    },
    funExchangeUpdate: async function (friend_id, user_id) {
        const relation = await getOne(Friends, { $or: [{ $and: [{ friend1: friend_id }, { friend2: user_id }] }, { $and: [{ friend2: friend_id }, { friend1: user_id }] }] });
        relation.frd1ToFrd2 = 0;
        await relation.save();
        return relation;
    }

}