import app from './app.js';
import { env } from './config/env.config.js';
import { connectDB } from './config/database.js';
import { logger } from './utils/logger.js';
import { ensureBootstrapAdminUser } from './bootstrap/admin.bootstrap.js';

const bootstrap = async () => {
  try {
    await connectDB();
    await ensureBootstrapAdminUser();

    app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap server', { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

bootstrap();
