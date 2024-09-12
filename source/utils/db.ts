import mongoose from 'mongoose';
import logger from './winston';

/**
 * @description Database connection class
 */
class MongoDB {
  public async connectDB() {
    try {
      const mongoURL = process.env.DATABASE_URL;
      const conn = await mongoose.connect(mongoURL);
      logger.info('Connected to MongoDB Successfully');
    } catch (error) {
      logger.error('Error Connecting to MongoDB', error);
      process.exit(1);
    }
  }

  public async disconnectDB() {
    try {
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB Successfully');
    } catch (error) {
      logger.error('Error Disconnecting from MongoDB', error);
    }
  }
}

const mongoDB = new MongoDB();

export { mongoDB, MongoDB };
