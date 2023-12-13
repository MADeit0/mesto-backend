import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/NotFoundError';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';
import { validateCreateUser, validateLogin } from './validators/users';
import 'dotenv/config';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.use(limiter);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
