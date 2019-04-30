/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import Config from './config';

export default {
  async connectDb() {
    const {
      DB_HOST, DB_PORT, DB_NAME, CONNECTION_STRING, DB_OPTIONS,
    } = Config.db;
    const connectionString = CONNECTION_STRING || `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    await mongoose.connect(connectionString, { ...DB_OPTIONS, useNewUrlParser: true });
  },

  disconnectDb() {
    mongoose.connection.close();
  },
};
