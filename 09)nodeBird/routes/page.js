const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

/*
    라우터용 미들웨어.
    템플릿 엔진에서 사용할 변수들 지정.
    res.locals로 선언하면 4개 변수를 모든 템플릿 엔진에서 공통으로 사용할 수 있다.
*/
router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

// 프로필 라우터에는 로그인한 유저만 접근 가능.
// get(path, callback(middleware), callback(middleware)) 의 구조다.
// isLoggedIn 미들웨어는 true여야 next()가 호출되어 다음 미들웨어를 실행하도록 정의해두었다.
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
});

// 회원가입 라우터에는 로그인한 유저만 접근 가능.
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

module.exports = router;
