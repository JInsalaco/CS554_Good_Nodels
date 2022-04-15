const giftRoutes = require('./gifts');
const weddingRoutes = require('./weddings');
const testRoutes = require('./test');

const constructorMethod = (app) => {
    app.use('/test', testRoutes);

    app.use('/gifts', giftRoutes);
    app.use('/weddings', weddingRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;
