import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { CustomRequest } from './types/customRequestType';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import statusCodes from './constants/statusCodes';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// временное решение
app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '656669b09a1a12d8a8e8905e',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req: CustomRequest, res: Response) => {
  res.status(statusCodes.NOT_FOUND).send({ message: 'Роут не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
