const StudentModel = require('../models/student.model');
const GroupModel = require('../models/group.model');
const InvestorModel = require('../models/investor.model');
const StaffModel = require('../models/staff.model');
const BaseController = require('./BaseController');
const HttpException = require('../utils/HttpException.utils');

class DashboardController extends BaseController {
    getStats = async (req, res, next) => {
        try {
            const [
                totalStudents,
                totalGroups,
                totalInvestors,
                totalstaff
            ] = await Promise.all([
                StudentModel.count(),
                GroupModel.count(),
                InvestorModel.count(),
                StaffModel.count()
            ]);

            res.send({
                totalStudents,
                totalGroups,
                totalInvestors,
                totalstaff
            });
        } catch (error) {
            next(new HttpException(500, 'Failed to load dashboard statistics'));
        }
    };
}

module.exports = new DashboardController();