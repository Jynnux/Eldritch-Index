// src/app.ts
import express, { Express } from 'express';
import { characterController } from './controllers/characterController.js';
import { itemController } from './controllers/itemController.js';
import { noteController } from './controllers/noteController.js';
import { sharingController } from './controllers/sharingController.js';
import { userController } from './controllers/userController.js';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  // #### USER ROUTES #### //
  app.post('/api/users', userController.registerUser);
  app.post('/api/login', userController.logIn);
  app.delete('/api/sessions', userController.logOut);
  app.get('/api/users/me', userController.getUserProfile);
  app.delete('/api/users/me', userController.deleteUser);
  app.put('/api/users/me', userController.changeDisplayName);
  // #### CHARACTER ROUTES #### //
  app.post('/api/characters', characterController.createCharacter);
  app.get('/api/characters/:id', characterController.getCharacter);
  app.get('/api/characters', characterController.getManyCharacters);
  app.delete('/api/characters/:id', characterController.deleteCharacter);
  app.patch('/api/characters/:id', characterController.updateCharacter);
  // #### INVENTORY ROUTES #### //
  app.post('/api/characters/:id/items', itemController.addItem);
  app.get('/api/characters/:id/items', itemController.getInventory);
  app.put('/api/items/:id', itemController.updateItem);
  app.delete('/api/characters/:characterId/items/:itemId', itemController.deleteItem);
  // #### NOTE ROUTES #### //
  app.post('/api/characters/:id/notes', noteController.addNote);
  app.get('/api/characters/:id/notes', noteController.getNotes);
  app.put('/api/notes/:id', noteController.updateNote);
  app.delete('/api/characters/:id/notes/:noteId', noteController.deleteNote);
  // #### SHARING ROUTES #### //
  app.post('/api/characters/:id/share', sharingController.shareCharacterWithUser);
  app.delete('/api/characters/:id/share', sharingController.unshareCharacter);

  return app;
}
