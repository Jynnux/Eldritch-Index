import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  displayName: z.string().min(8).max(255),
  password: z.string().min(8),
});

export const LogInUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8),
});

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
