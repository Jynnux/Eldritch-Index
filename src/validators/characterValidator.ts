import { z } from 'zod';

export const CharacterSchema = z.object({
  name: z.string().min(1).max(255),
  health: z.number().min(0),
  maxHealth: z.number().min(1),
});

export type CharacterSchema = z.infer<typeof CharacterSchema>;
