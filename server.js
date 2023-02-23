import bodyParser from 'body-parser';
import { interviewRouter } from './src/routes/interview/routes.js';
import express from 'express';
import { connectDB } from './src/database/connection.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/interview', interviewRouter);
const PORT = process.env.PORT || 3000;

const init = async () => {
  await connectDB();
  app.listen(PORT, () => console.info(`App listening on port: ${PORT}`));
};

app.use((error, req, res, next) => {
  console.log({ error });
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

init().catch(err => {
  console.log(err);
  process.exit(2);
});
