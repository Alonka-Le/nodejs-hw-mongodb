import { Router } from 'express';
import {
  addContactController,
  getAllContactsController,
  getContactsByIdController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));
export default contactsRouter;
