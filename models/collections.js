const SharedExpenses = require('./sharedExpenses');
const PersonalExpenses = require('./personalExpenses');
const Friends = require('./friends');
const Users = require('./users');
//module.exports = {
//     USERS: 'users',
//     SHARED_EXPENSES: SharedExpenses,
//     PERSONAL_EXPENSES: 'user_personal_expenses',
//     TAGS: 'tag_thumbnail_images',
//     REMINDERS: 'reminders',
//     NOTIFICATIONS: 'notifications',
//     GROUPS: 'groups',
//     CHATS: 'chats'
// }

module.exports =
{
    SharedExpenses,
    PersonalExpenses,
    Friends,
    Users
}