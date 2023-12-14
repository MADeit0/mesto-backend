import { Joi, celebrate } from 'celebrate';
import regexUrl from '../constants/regexp';

const CardValidator = {
  name: Joi.string().min(2).max(30),
  link: Joi.string().pattern(regexUrl),
};

export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: CardValidator.name.required(),
    link: CardValidator.link.required(),
  }),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
});
