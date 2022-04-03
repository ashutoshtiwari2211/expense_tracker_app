
const { PersonalExpenses, SharedExpenses, Users } = require('../models/collections');
const AppError = require('../utils/AppError');
const { ObjectId } = require('mongodb');

async function getOne(collection, condition) {

    const queryResult = await collection.findOne(condition)
        .then(docs => {
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

async function deleteOne(collection, condition) {

    const queryResult = await collection.deleteOne(condition)
        .then(docs => {
            console.log("select result: ", docs);
            return docs;
        })
        .catch(error => { throw error });

    return queryResult;
}

async function getAll(collection, condition) {
    const queryResult = await collection.find(condition)
        .populate('members.member')
        .populate('author_id')

    return queryResult;
}

async function memberValidate(usr, pay) {
    const user = await Users.findOne({ username: usr });
    if (!user)
        throw new AppError(`${usr} is Invalid Username`, 400);
    else if (isNaN(pay))
        throw new AppError(`${pay} is not a valid amount`, 400);
    else
        return { member: user, owe: pay }
}

function createDoc(bill_name, totalAmt, auth, date, category) {
    return {
        bill_name: bill_name,
        totalAmt: totalAmt,
        author_id: auth,
        date: date,
        category: category
    }
}


module.exports = {

    funCreatePersonalExp: async function (body, user) {
        const { bill_name, totalAmt, category } = body;
        const date = new Date(Date.now()).toString().slice(0, 15);
        const res = await insertOne(PersonalExpenses, createDoc(bill_name, totalAmt, user, date, category))
        return res;
    },

    funGetSharedExp: async function (user_id) {
        const returnList = await getAll(SharedExpenses, { $or: [{ "members.member": { $eq: user_id } }, { author_id: user_id }] });
        return returnList;
    },

    funCreateSharedExp: async function (body, author) {
        const auth = await getOne(Users, { username: author.username });

        const { bill_name, totalAmt, members, category } = body;
        const date = new Date(Date.now()).toString().slice(0, 15)
        const mbr = [];
        var sum = 0;
        for (var member in members) {
            const m = await memberValidate(members[member][0], members[member][1]);
            sum += parseInt(members[member][1]);
            mbr.push(m);
        }
        if (sum > totalAmt)
            throw new AppError('Total Sum exceeds', 400);
        const resultList = await insertOne(SharedExpenses, createDoc(bill_name, totalAmt, auth, date, category))
        const res = await insertOne(PersonalExpenses, createDoc(bill_name, totalAmt - sum, auth, date, category))
        mbr.forEach(el => {
            resultList.members.push(el);
        })
        await resultList.save();
        mbr.forEach(async function (el) {
            const res = await insertOne(PersonalExpenses, createDoc(bill_name, el.owe, el.member, date, category))
        })
        return resultList;
    },

    funUpdateSharedExp: async function (bill_id, subdocid) {
        const bill = await getOne(SharedExpenses, { "_id": { $eq: ObjectId(bill_id) } });
        const subdoc = bill.members.id(subdocid);
        bill.members.id(subdocid).remove();
        bill.members.push({ member: subdoc.member, owe: 0 });
        await bill.save();
        return bill;
    },

    funDeleteSharedExp: async function (bill_id) {
        const bill = await deleteOne(SharedExpenses, { "_id": { $eq: ObjectId(bill_id) } });
        console.log(bill);
        return bill;
    }
}