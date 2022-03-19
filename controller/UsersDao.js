
const { Users } = require('../models/collections');
const AppError = require('../utils/AppError');
const { ObjectId } = require('mongodb');

function sendSuccess(message, data = {}) {
    return {
        status: 200,
        msg: { success: true, message, data }
    };
}

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
        .catch(err => { throw new AppError("Something Went Wrong!!!", 401) });

    return result;

}
async function updateOne(collection, filter, updateDocument) {

    const condition = {
        $set: updateDocument
    };

    const result = await collection.updateOne(filter, condition)
        .then(doc => {
            console.log("updateOne: ", doc);
            return doc;
        })
        .catch(err => { throw new AppError("Something Went Wrong!!!", 401) });

    return result;
}

module.exports = {
    funGetUserInfo: async function (user_id) {
        const returnList = await getOne(Users, { "_id": { $eq: ObjectId(user_id) } });
        return sendSuccess('User info found', returnList);
    },

    funUpdateInfo: async function (user_id, body) {
        console.log(body);
        const returnList = await updateOne(Users, { user_id: user_id }, body);
        return sendSuccess('User info updated', returnList);
    },

    funCreateUser: async function (body) {
        const { password } = body;
        let avtar = Math.floor(Math.random() * 6 + 1);
        if (body.gender == "male")
            avtar = "men" + avtar;
        else
            avtar = "girl" + avtar;
        body.avtar = avtar;
        const user = new Users(body);
        const registeredUser = await Users.register(user, password);
        console.log(registeredUser);
        return registeredUser;
    }
}