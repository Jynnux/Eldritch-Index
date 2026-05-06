import { z } from 'zod';

export const ShareCharacterSchema = z.object({
  targetUserDisplayName: z.string().min(1),
});

export type ShareCharacterSchema = z.infer<typeof ShareCharacterSchema>;
