const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); // (1)
app.use('/', express.static(path.join(__dirname, 'public'))); // (2)
app.use(express.json()); // (3) body-parser
app.use(express.urlencoded({ extended: false })); // (3)
app.use(cookieParser(process.env.COOKIE_SECRET)); // (4)
app.use(
    // (5)
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'session-cookie',
    })
);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
