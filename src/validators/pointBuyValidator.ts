import { z } from 'zod';
//  -- GABRIELLE TAUNTON --
// VALIDATES POINT-BUY VALUES
// Adding all base COC stats! This will HAVE to be added on later to the actual
// character branch. 90 is usually the max standard for stats (100 is deemed superhuman)
// and characters can typically improve during a campaign. This allows for a good
// starting process. 15 tends to be the minimum in most games, so, this is used
// as a general rule.

// -- JUSTIN COATS --
// i had issues getting this to work by having a separate validator so i just snatched
// these and threw them in with characterValidator lol. leaving it in bc gabby did her
// tests on this validator.

export const PointSchema = z.object({
  strength: z.number().min(15).max(90),
  dexterity: z.number().min(15).max(90),
  power: z.number().min(15).max(90),
  constitution: z.number().min(15).max(90),
  appearance: z.number().min(15).max(90),
  education: z.number().min(15).max(90),
  intelligence: z.number().min(15).max(90),
  size: z.number().min(15).max(90),
});

export type PointSchema = z.infer<typeof PointSchema>;
