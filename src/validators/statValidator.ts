import { z } from 'zod';
//  -- GABRIELLE TAUNTON --
// LETS USER CHOOSE WHICH METHOD TO PICK FROM
// Meant to be pretty basic. Flow from action list: Character create -> choose stat -> roll | point.
export const StatSchema = z.object({
  method: z.enum(['point-buy', 'rolling']),
});

export type StatSchema = z.infer<typeof StatSchema>;
