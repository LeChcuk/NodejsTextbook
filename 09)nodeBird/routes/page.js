const express = require('express');

const router = express.Router();

/*
    라우터용 미들웨어.
    템플릿 엔진에서 사용할 변수들 지정.
    res.locals로 선언하면 4개 변수를 모든 템플릿 엔진에서 공통으로 사용할 수 있다.
*/
router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/profile', (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', (req, res) => {
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
