const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // 로그인 시 실행되어 req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
    // 즉, 사용자 정보 객체(user)를 세션에 아이디(id)로 저장하는 것.
    passport.serializeUser((user, done) => {
        // done()의 첫 번째 인자 -> 에러 발생 시 사용
        //          두 번째 인자 -> 저장하고 싶은 데이터
        done(null, user.id);
    });

    // 매 요청시 실행됨. passport.session() 미들웨어가 이 메서드를 호출한다.
    // passport.serializeUser()의 두 번째 매개변수로 넣었던 (done)이 이 메서드의 매개변수가 된다.
    // 즉, 세션에 저장한 아이디(id)를 통해 사용자 정보 객체를 불러오는 것.
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    local();
    kakao();
};
