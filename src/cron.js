// Create a new file called scheduler.js in your backend
const cron = require('node-cron');
const ReleaseRequest = require('./models/request.model');
const Chiqim = require('./models/rasxod.model')
const sequelize = require('./db/db-sequelize');

cron.schedule('*/5 * * * *', async () => { // Runs every 5 minutes
    const transaction = await sequelize.transaction();
    try {
        const requests = await ReleaseRequest.findAll({
            where: {
                status: 'delayed',
                scheduled_approval_date: {
                    [sequelize.Op.lte]: new Date()
                }
            },
            transaction
        });

        for (const request of requests) {
            // Your existing approval logic here
            await Chiqim.create({
                investor_id: request.investor_id,
                zarar_summa: request.amount,
                datetime: Math.floor(Date.now() / 1000)
            }, { transaction });

            request.status = 'approved';
            await request.save({ transaction });
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Cron job error:', error);
    }
});