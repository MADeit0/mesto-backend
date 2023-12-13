import { Joi, celebrate } from 'celebrate';

const userValidatorBody = {
  name: Joi.string().min(2).max(32),
  about: Joi.string().min(2).max(200),
  avatar: Joi.string(),
  email: Joi.string().min(7),
  password: Joi.string().min(7),
};

export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    ...userValidatorBody,
    email: userValidatorBody.email.required(),
    password: userValidatorBody.password.required(),
  }),
});

export const validateUpdateUserData = celebrate({
  body: Joi.object().keys({
    name: userValidatorBody.name,
    about: userValidatorBody.about,
  }),
});

export const validateUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: userValidatorBody.avatar,
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: userValidatorBody.email.required(),
    password: userValidatorBody.password.required(),
  }),
});
