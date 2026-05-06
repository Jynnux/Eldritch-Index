import { z } from 'zod';

export const NoteSchema = z.object({
  content: z.string().min(0).max(2048),
});

export type NoteSchema = z.infer<typeof NoteSchema>;
