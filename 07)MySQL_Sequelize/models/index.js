'use strict';

// config에 db 설정 config.json파일을 불러온 후
// new Squelize()를 통해 MySQL 연결 객체 생성.
const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

/*
  db 객체에 User, Comment 모델을 담았기 때문에 앞으로 db 객체를 require하여 각 모델에 접근할 수 있다.
  각각의 모델에 정의해둔 init()과 associate() 메서드를 호출하여 테이블을 정의.
*/
db.User = User;
db.Comment = Comment;

User.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
