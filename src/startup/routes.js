const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser')
const i18n = require('./i18n.config')
const errorMiddleware = require('../middleware/error.middleware');
const userRouter = require('../routes/user.route');
const investorRouter = require('../routes/investor.route')
const prixodRouter = require('../routes/prixod.route')
const rasxodRouter = require('../routes/rasxod.route')
const requestRouter = require('../routes/request.route')
const scheduleRouter = require('../routes/schedule.route')
const groupRouter = require('../routes/group.route')
const studentrouter = require('../routes/student.route')
const paymentrouter = require('../routes/payment.route')
const attendancerouter = require('../routes/attendance.route')
const lessonrouter = require('../routes/lessonRouter')
const staffrouter = require('../routes/staff.route')
const scoringnames = require('../routes/scoring_names.route')
const studentscore = require('../routes/studentScore.routes')
const taskrouter = require('../routes/task.route')
const kassarouter = require('../routes/kassa.route')
const HttpException = require('../utils/HttpException.utils')
module.exports = async function (app) {

    app.use(express.json());

    app.use(cors());

    app.options("*", cors());
    app.use(express.static(path.join(__dirname, '../../dist')));

    app.use(cookieParser());
    app.use(i18n.init)
    app.use('/api/v1/uploads', express.static(path.join(__dirname, '../uploads')));
    app.use(`/api/v1/users`, userRouter);
    app.use('/api/v1/investors', investorRouter)
    app.use('/api/v1/prixod', prixodRouter)
    app.use('/api/v1/rasxod', rasxodRouter)
    app.use('/api/v1/request', requestRouter)
    app.use('/api/v1/schedule', scheduleRouter)
    app.use('/api/v1/group', groupRouter)
    app.use('/api/v1/student', studentrouter)
    app.use('/api/v1/payment', paymentrouter)
    app.use('/api/v1/attendance', attendancerouter)
    app.use('/api/v1/lesson', lessonrouter)
    app.use('/api/v1/staff', staffrouter)
    app.use('/api/v1/score-names', scoringnames)
    app.use('/api/v1/student-scores', studentscore)
    app.use('/api/v1/tasks', taskrouter)
    app.use('/api/v1/kassa', kassarouter)
    app.all('*', (req, res, next) => {
        const err = new HttpException(404, req.mf('Endpoint not found'));
        next(err);
    });

    app.use(errorMiddleware);
}