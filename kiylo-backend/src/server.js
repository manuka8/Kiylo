import app from './app.js';
import env from './config/env.js';
import createAllTables from './utils/dbUtils.js';

const PORT = env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize Database
        console.log('⏳ Initializing database...');
        await createAllTables();

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
