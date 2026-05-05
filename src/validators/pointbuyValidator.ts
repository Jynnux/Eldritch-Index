import { z } from 'zod';
//  -- GABRIELLE TAUNTON --
// VALIDATES POINT-BUY VALUES
// Adding all base COC stats! This will HAVE to be added on later to the actual
// character branch. 90 is usually the max standard for stats (100 is deemed superhuman)
// and characters can typically improve during a campaign. This allows for a good
// starting process. 15 tends to be the minimum in most games, so, this is used
// as a general rule.
export const Pointschema = z.object({
  numstr: z.number().min(15).max(90),
  numcon: z.number().min(15).max(90),
  numdex: z.number().min(15).max(90),
  numapp: z.number().min(15).max(90),
  numedu: z.number().min(15).max(90),
  numsiz: z.number().min(15).max(90),
  numint: z.number().min(15).max(90),
  numpow: z.number().min(15).max(90),
});

export type Pointschema = z.infer<typeof Pointschema>;
