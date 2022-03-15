const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

dotenv.config();
const app = express();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const router = express.Router();
app.set('port', process.env.PORT || 3006);

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다');
    fs.mkdirSync('uploads');
}

const upload = multer({
    // (3)
    storage: multer.diskStorage({
        // (1)
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // (2)
});

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
    next();
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.fields([{ name: 'image1' }, { name: 'image2' }]), (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

app.use(
    (req, res, next) => {
        req.data = '데이터 넣기';
        next();
    },
    (req, res, next) => {
        console.log(req.data); // 데이터 받기
        next();
    }
);

router
    .route('/abc')
    .get((req, res) => {
        res.send('GET /abc');
    })
    .post((req, res) => {
        res.send('POST /abc');
    });
