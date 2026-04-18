import { z } from 'zod';

export const CharacterSchema = z.object({
  name: z.string().min(1).max(255),
  occupation: z.string().min(1).max(255),
  maxHealth: z.number().min(1),
  currentHealth: z.number().min(0),
});

export type CharacterSchema = z.infer<typeof CharacterSchema>;
