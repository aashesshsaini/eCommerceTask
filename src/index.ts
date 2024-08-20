import mongoose, { ConnectOptions }  from 'mongoose';
import config from './config/config';
import createAdmin from './utils/bootstrap';
import app from './app';

const mongooseOptions: ConnectOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // Add other options if needed
  };

mongoose.connect(config.mongoose.url, mongooseOptions).then(() => {
  console.log("Connected to MongoDB");
  createAdmin();
  const server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});