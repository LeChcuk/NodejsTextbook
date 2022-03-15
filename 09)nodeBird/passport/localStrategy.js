const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

/*
    1) LocalStrategy 생성자 첫 번째 인자로 LocalStrategy 객체 생성. req.body.email과 req.body.password를 전달.
    2) 두 번째 인자로 전달된 콜백함수에서 실제 전략을 수행한다.
        첫 번째 인자로 넣어줬던 email과 password가 콜백함수의 매개변수가 된다.
        done은 passport.authenticate의 콜백 함수다.
    3) db User 모델에서 일치하는 이메일이 있는지를 찾고, 패스워드 대조를 통해 성공 유무를 확인한다.
        이후 done 호출. 로그인에 성공한 경우 done에 exUser를 전달하여 exUser가 .authenticate() user에 할당되는 것.
*/

// passport/localStrategy.js
module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const exUser = await User.findOne({ where: { email } });
                    if (exUser) {
                        const result = await bcrypt.compare(password, exUser.password);
                        if (result) {
                            // login 성공
                            done(null, exUser);
                        } else {
                            // login 실패
                            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                        }
                    } else {
                        // login 실패
                        done(null, false, { message: '가입되지 않은 회원입니다.' });
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
