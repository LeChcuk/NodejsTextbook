const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

/* 
    callbackURL은 카카오로부터 인증 결과를 받을 라우터 주소다.
*/

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: '/auth/kakao/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log('kakao profile', profile);
                try {
                    const exUser = await User.findOne({
                        where: { snsId: profile.id, provider: 'kakao' },
                    });
                    if (exUser) {
                        // 카카오를 통해 이미 회원가입한 유저라면, strategy 종료
                        done(null, exUser);
                    } else {
                        // 카카오를 통한 첫 번째 로그인이라면, 회원가입 후 strategy 종료
                        const newUser = await User.create({
                            email: profile._json && profile._json.kakao_account_email,
                            nick: profile.displayName,
                            snsId: profile.id,
                            provider: 'kakao',
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
