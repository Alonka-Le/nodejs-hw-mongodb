import { Router } from 'express';
import {
  addContactController,
  deleteContactController,
  getAllContactsController,
  getContactsByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  contactsAddSchema,
  contactsPatchSchema,
} from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactsAddSchema),
  ctrlWrapper(addContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(contactsPatchSchema),
  upload.single('photo'),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
