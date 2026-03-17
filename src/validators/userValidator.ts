import { z } from 'zod';

export const userValidator = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});
