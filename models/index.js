const {Sequelize} = require('sequelize')

let configData = {
    dialect:'postgres',
    host:'localhost',
    port:5432,
    database:'youtube_db',
    username:'postgres',
    password:'1234'
}

const sequelize = new Sequelize(configData);

const Op = Sequelize.Op;
const User = require('./user.model')(sequelize);
const Media = require('./media.model')(sequelize);
const History = require('./history.model')(sequelize);
const Like = require('./like.model')(sequelize);
const Comment = require('./comment.model')(sequelize);
const Subscription = require('./subscription.model')(sequelize);
const Notification = require('./notification.model')(sequelize);

Media.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade' });

History.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade' });
History.belongsTo(Media, { foreignKey: 'media_id', onDelete: 'cascade' });

Like.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade' });
Like.belongsTo(Media, { foreignKey: 'media_id', onDelete: 'cascade' });

Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade' });
Comment.belongsTo(Media, { foreignKey: 'media_id', onDelete: 'cascade' });

Subscription.belongsTo(User, { foreignKey: 'content_creator', onDelete: 'cascade' });
Subscription.belongsTo(User, { foreignKey: 'subscriber', onDelete: 'cascade' });

Notification.belongsTo(User, { foreignKey: 'user_id', onDelete: 'cascade' });
Notification.belongsTo(Media, { foreignKey: 'media_id', onDelete: 'cascade' });

module.exports = {
    sequelize,
    User,
    Media,
    History,
    Like,
    Comment,
    Op,
    Subscription,
    Notification
}