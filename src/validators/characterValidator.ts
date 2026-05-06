import { z } from 'zod';

export const CharacterSchema = z.object({
  // trackers/input fields
  name: z.string().min(1).max(255),
  occupation: z.string().min(1).max(255),
  maxHealth: z.number().min(1),
  currentHealth: z.number().min(0),
  // core stats
  strength: z.number().min(15).max(90),
  dexterity: z.number().min(15).max(90),
  power: z.number().min(15).max(90),
  constitution: z.number().min(15).max(90),
  appearance: z.number().min(15).max(90),
  education: z.number().min(15).max(90),
  intelligence: z.number().min(15).max(90),
  size: z.number().min(15).max(90),
});

export type CharacterSchema = z.infer<typeof CharacterSchema>;
