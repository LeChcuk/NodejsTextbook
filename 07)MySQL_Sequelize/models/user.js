const Sequelize = require('sequelize');

/*
  모델은 Sequelize.Model을 상속(extends)한 클래스로 선언한다.
  모델은 크게 static init() 메서드와 static associate() 메서드로 나뉜다.
  전자는 테이블에 대한 설정을, 후자는 다른 모델과의 관계를 기재하는 메서드다.
  init() 메서드는 super.init()을 return 함으로써 작동한다.
  super.init()의 첫 번째 인자에는 테이블 컬럼에 대한 설정을, 두 번쨰 인자에는 테이블 자체 설정을 한다.
  컬럼 설정에는 id를 생략할 수 있다. id는 자동으로 기본키로 설정되어 입력된다.

*/
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                age: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                married: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                comment: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }
};
