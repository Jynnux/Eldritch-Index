import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.email('Invalid email address'),
  displayName: z.string().min(8, 'Username must be 8 characters'),
  password: z.string().min(8, 'Password must be 8 characters'),
});

export const LogInUserSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Invalid password'),
});

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
export type LogInUserSchema = z.infer<typeof LogInUserSchema>;
