const cron = require('node-cron');
const { Op } = require('sequelize');
const ReleaseRequest = require('./models/request.model');
const Chiqim = require('./models/rasxod.model');
const sequelize = require('./db/db-sequelize');

// console.log('⏰ Cron scheduler initialized');

cron.schedule('*/10 * * * *', async () => {
    // console.log('🔍 Checking for delayed requests...');
    try {
        const now = new Date();


        const requests = await ReleaseRequest.findAll({
            where: {
                status: 'delayed',
                scheduled_approval_date: { [Op.lte]: now }
            }
        });

        console.log(`📝 Found ${requests.length} delayed requests to process`);

        for (const request of requests) {
            try {
                const transaction = await sequelize.transaction();

                await Chiqim.create({
                    investor_id: request.investor_id,
                    zarar_summa: request.amount,
                    datetime: Math.floor(Date.now() / 1000)
                }, { transaction });

                request.status = 'approved';
                await request.save({ transaction });

                await transaction.commit();
                // console.log(`✅ Approved request ID: ${request.id}`);
            } catch (error) {
                console.error(`❌ Failed request ID ${request.id}:`, error);
            }
        }
    } catch (error) {
        console.error('🚨 Cron job error:', error);
    }
});
