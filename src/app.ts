import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import statusCodes from './constants/statusCodes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req: Request, res: Response) => {
  res.status(statusCodes.NOT_FOUND).send({ message: 'Роут не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
