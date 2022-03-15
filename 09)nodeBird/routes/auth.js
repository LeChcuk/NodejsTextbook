const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

/*
    회원가입 라우터.
    1) 기존에 같은 이메일로 가입한 사용자가 있는지 확인.
    2) bcrypt 모듈을 통해 패스워드 암호화
    3) 회원 생성

*/
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) return res.redirect('/join?error=exist');

        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

/*
    로그인 라우터.
    라우터 미들웨어 안에 passport.authenticate() 미들웨어가 들어가있는 구조.
    1) passport.authenticate() 메소드의 local 전략을 수행.
    2) 전략이 성공하거나 실패하면 콜백함수 실행.
    3) 에러가 발생하면 에러를 처리하러 return
    4) 에러가 없으면 req.login()메서드 호출. Passport 미들웨어가 req에 login/logout을 추가한 것.
    5) req.login()은 passport.serializeUser()를 호출.
    6) req.login()에 인자로 전달하는 user객체가 serializeUser로 넘어감.
*/

// routes/auth.js
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) return res.redirect(`/?loginError=${info.message}`);

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

/*
    로그아웃 라우터.
    1) req.logout() 메소드는 req.user 객체를 제거함
    2) req.session.destroy() 메서드는 req.session 객체의 내용을 제거함.
    3) 이후 메인 페이지로 되돌아가면 로그인이 해제되어 있다.
*/
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
        failureRedirect: '/',
    }),
    (req, res) => {
        res.redirect('/');
    }
);

module.exports = router;
