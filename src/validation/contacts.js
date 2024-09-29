import Joi from 'joi';
import { contactTypeList } from '../constants/contacts.js';

export const contactsAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...contactTypeList)
    .required(),
});

export const contactsPatchSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...contactTypeList),
});
