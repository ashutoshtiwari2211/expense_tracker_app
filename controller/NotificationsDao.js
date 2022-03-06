const daoHelper = require('../utils/daoHelper');
const collections = require('../models/collections');

module.exports = {
    funGetUserNoti: async function (user_id) {
        const returnList = await daoHelper.getAll(collections.NOTIFICATIONS, { user_id: user_id });
        return daoHelper.sendSuccess('User notifications found', returnList);
    }
}