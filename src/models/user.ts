import {
  Schema, model, Model, Document,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail';
import UnauthorizedError from '../errors/UnauthorizedError';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
  Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: 7,
    validate: { validator(v:string) { return isEmail(v); }, message: 'неверный email' },
    select: false,
  },
  password: { type: String, require: true, select: false },
});

userSchema.statics.findUserByCredentials = function (email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

export default model<IUser, UserModel>('user', userSchema);
