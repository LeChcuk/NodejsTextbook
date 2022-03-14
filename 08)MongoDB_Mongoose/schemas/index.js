const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    // db name 속성을 명시하여 admin을 nodejs로 치환.
    mongoose.connect(
        'mongodb://localhost:27017/admin',
        {
            dbName: 'nodejs',
            // useNewwUrlParser: true,
            // useCreateIndex: true,
        },
        (error) => {
            if (error) {
                console.log('몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공');
            }
        }
    );
};

// connection에 이벤트 리스너를 등록하여 에러 발생 시 에러 내용을 기록.
mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});

// 연결 종료 시 재연결을 시도.
mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;
