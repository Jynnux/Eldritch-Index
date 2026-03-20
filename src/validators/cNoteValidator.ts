import { z } from 'zod';
/*
 CHARACTERNOTE - > VALIDATOR
 Each file has to include a create & get method
 - LATER, MAKE AN UPDATE/DELETE VER TOO. Create only for basics at the moment, ownerID is 
 just to test for Bruno collection.
*/
export const cNoteValidator = z.object({
  characterId: z.uuid(),
  ownerId: z.string().uuid(),
  title: z.string().optional(),
  content: z.string(),
});
