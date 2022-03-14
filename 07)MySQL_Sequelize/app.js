const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

/* 
    static 미들웨어?
    정적 파일들이 위치한 경로를 설정해두고, 추후 편하게 불러온다.
    public으로 설정해두었기 때문에, public/stylesheets/style.css와 같이 불러올 것을
    http://localhost:3000/stylesheets/style.css와 같이 불러올 수 있게 된다.
*/

/* 
    body-parser는 request body에 있는 데이터를 해석해서 req.body 객체로 만들어준다.
    body-parser를 사용하지 않으면 req.body 출력시 기대한 body 내용이 아닌 undefined가 출력된다.
    이 프로젝트에서는 express 내장 body-parser를 사용 중.
    express.json()을 통해서 request body를 json 형태로 parsing 하겠다는 것.
    express.urlencoded. extended : false 옵션을 주었기 때문에 추가 확장 qs 모듈이 아닌 기본 내장된 querystring 모듈을 사용한다.
*/

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
