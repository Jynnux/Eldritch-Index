import { z } from 'zod';

export const ItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1024),
});

export type ItemSchema = z.infer<typeof ItemSchema>;
