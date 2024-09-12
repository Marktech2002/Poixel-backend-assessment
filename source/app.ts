import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './middleware/error';
import { Application } from 'express';
import adminRouter from './routers/Admin';
import userRouter from './routers/User';

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;
